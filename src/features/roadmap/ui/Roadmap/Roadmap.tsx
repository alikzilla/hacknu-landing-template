// src/features/roadmap/ui/Roadmap.tsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calcPath,
  clamp,
  buildSuggestions,
  NODE_WIDTH,
  computeLevels,
  assignColumns,
  canUnlock,
  H_SPACING,
  V_SPACING,
  NODE_HEIGHT,
  statusFromProgress,
  JourneyType,
} from "../../model";
import { NodeCard } from "..";

type Point = { x: number; y: number };

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.2;
const ZOOM_STEP = 0.1;

export default function Roadmap({ data }: { data?: JourneyType }) {
  // Single source of truth
  const [journey, setJourney] = useState<JourneyType>(() =>
    JSON.parse(JSON.stringify(data))
  );

  const wrapRef = useRef<HTMLDivElement>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoverPath, setHoverPath] = useState<string | null>(null);

  // ----- Layout helpers
  const levels = useMemo(() => computeLevels(journey.nodes), [journey.nodes]);
  const columns = useMemo(
    () => assignColumns(levels, journey.nodes),
    [levels, journey.nodes]
  );
  const idToNode = useMemo(
    () => new Map(journey.nodes.map((n) => [n.id, n] as const)),
    [journey.nodes]
  );

  // ----- Unlock on mount
  useEffect(() => {
    setJourney((prev) => {
      const nodes = prev.nodes.map((n) => ({ ...n }));
      const map = new Map(nodes.map((x) => [x.id, x] as const));
      for (const n of nodes) {
        if ((n.status ?? "locked") === "locked" && canUnlock(n, map)) {
          n.status =
            n.progress?.percent && n.progress.percent > 0
              ? "in_progress"
              : "unlocked";
        }
        if ((n.progress?.percent ?? 0) >= 100) n.status = "completed";
      }
      return { ...prev, nodes };
    });
  }, []);

  const suggestions = useMemo(() => buildSuggestions(journey), [journey]);

  // ----- Auto positions (grid)
  const autoPositions = useMemo(() => {
    const pos = new Map<string, Point>();
    const levelCounts: Record<number, number> = {};
    journey.nodes.forEach((n) => {
      const l = levels.get(n.id) ?? 0;
      levelCounts[l] = (levelCounts[l] || 0) + 1;
    });
    const perLevelIndices: Record<number, number> = {};
    journey.nodes.forEach((n) => {
      const l = levels.get(n.id) ?? 0;
      const idx = perLevelIndices[l] ?? 0;
      perLevelIndices[l] = idx + 1;
      const col = (columns.get(n.id) ?? idx) - (levelCounts[l] - 1) / 2;
      const x = Math.round(col * H_SPACING);
      const y = Math.round(l * V_SPACING);
      pos.set(n.id, { x, y });
    });
    return pos;
  }, [journey.nodes, levels, columns]);

  // ----- Respect manual node.position if present; else use auto
  const nodePositions = useMemo(() => {
    const pos = new Map<string, Point>();
    for (const n of journey.nodes) {
      if (
        n.position &&
        typeof n.position.x === "number" &&
        typeof n.position.y === "number"
      ) {
        pos.set(n.id, { x: n.position.x, y: n.position.y });
      } else {
        pos.set(n.id, autoPositions.get(n.id)!);
      }
    }
    return pos;
  }, [journey.nodes, autoPositions]);

  // ----- Bounds for centering
  const minX = Math.min(
    ...Array.from(nodePositions.values()).map((p) => p.x - NODE_WIDTH / 2)
  );
  const maxX = Math.max(
    ...Array.from(nodePositions.values()).map((p) => p.x + NODE_WIDTH / 2)
  );
  const maxY = Math.max(
    ...Array.from(nodePositions.values()).map((p) => p.y + NODE_HEIGHT)
  );

  const viewW = maxX - minX + 160;
  const viewH = maxY + 240;

  // ---- PAN & ZOOM state
  const fallbackPan: Point = { x: -minX + 80, y: 60 };
  const [pan, setPan] = useState<Point>(fallbackPan);
  const [scale, setScale] = useState<number>(1);

  // ----- Centering helpers
  const hasUserMoved = useRef(false);

  const centerGraph = (wrapEl: HTMLDivElement | null, atScale: number) => {
    if (!wrapEl) return null;
    const rect = wrapEl.getBoundingClientRect();
    // graph midpoints in graph-space
    const midX = (minX + maxX) / 2;
    const midY = maxY / 2;
    return {
      x: rect.width / 2 - midX * atScale,
      y: rect.height / 2 - midY * atScale,
    };
  };

  // Recenter on mount/data/resize until user interacts
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // initial center
    const next = centerGraph(wrap, scale) || fallbackPan;
    setPan(next);

    const ro = new ResizeObserver(() => {
      if (hasUserMoved.current) return;
      const n = centerGraph(wrapRef.current, scale);
      if (n) setPan(n);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [minX, maxX, maxY, scale]);

  // Keep pan sane if data changes wildly (safety)
  useEffect(() => {
    setPan((p) => ({
      x: isFinite(p.x) ? p.x : fallbackPan.x,
      y: isFinite(p.y) ? p.y : fallbackPan.y,
    }));
  }, [fallbackPan.x, fallbackPan.y]);

  // ----- Panning drag state
  const panState = useRef<{ dragging: boolean; start: Point; panStart: Point }>(
    {
      dragging: false,
      start: { x: 0, y: 0 },
      panStart: { x: 0, y: 0 },
    }
  );

  // ----- Node dragging state
  const nodeDrag = useRef<{
    nodeId: string | null;
    startClient: Point;
    nodeStart: Point;
  }>({ nodeId: null, startClient: { x: 0, y: 0 }, nodeStart: { x: 0, y: 0 } });

  // ----- Pinch zoom state (simple, robust approximation)
  const pinch = useRef<{
    active: boolean;
    id1: number | null;
    id2: number | null;
    startScale: number;
    startMidClient: Point;
  }>({
    active: false,
    id1: null,
    id2: null,
    startScale: 1,
    startMidClient: { x: 0, y: 0 },
  });

  const primary = journey.theme?.colors?.primary || "#10B981";
  const accent = journey.theme?.colors?.accent || "#F59E0B";

  // ----- Helpers: interactive element guard
  const isInteractiveTarget = (el: EventTarget | null): boolean => {
    if (!(el instanceof HTMLElement)) return false;
    const tag = el.tagName.toLowerCase();
    if (
      tag === "button" ||
      tag === "a" ||
      tag === "input" ||
      tag === "textarea" ||
      tag === "select"
    )
      return true;
    if (el.getAttribute("role") === "button") return true;
    if (el.closest("[data-interactive]")) return true; // allow opt-in from NodeCard
    return false;
  };

  // ----- Utils
  const isNodeDraggable = (id: string) => {
    const n = idToNode.get(id);
    return !!(
      n &&
      n.position &&
      typeof n.position.x === "number" &&
      typeof n.position.y === "number"
    );
  };
  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  // Zoom keeping pointer focus stable
  const zoomAtClientPoint = (
    clientX: number,
    clientY: number,
    deltaScale: number
  ) => {
    const nextScale = clampScale(scale * deltaScale);
    if (nextScale === scale) return;

    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    // Graph-space point before zoom
    const gx = (px - pan.x) / scale;
    const gy = (py - pan.y) / scale;

    // After zoom, keep same screen focus
    const nextPan = {
      x: px - gx * nextScale,
      y: py - gy * nextScale,
    };

    setScale(nextScale);
    setPan(nextPan);
  };

  // ====== Canvas pan / pinch handlers ======
  const onCanvasPointerDown = (e: React.PointerEvent) => {
    // Do not start pan if the target is interactive
    if (isInteractiveTarget(e.target)) return;

    hasUserMoved.current = true;

    // Only start pan for primary button/touch
    const isPrimaryMouse = e.pointerType === "mouse" ? e.button === 0 : true;

    // second touch => pinch start
    if (
      isPrimaryMouse &&
      pinch.current.id1 !== null &&
      pinch.current.id2 === null &&
      e.pointerType === "touch"
    ) {
      pinch.current.id2 = e.pointerId;
      pinch.current.active = true;
      pinch.current.startScale = scale;
      pinch.current.startMidClient = { x: e.clientX, y: e.clientY };
      // capture only for pinch if needed
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    // first touch or mouse => start pan
    if (
      isPrimaryMouse &&
      (e.pointerType !== "touch" || pinch.current.id1 === null)
    ) {
      panState.current.dragging = true;
      panState.current.start = { x: e.clientX, y: e.clientY };
      panState.current.panStart = { ...pan };
      document.body.style.cursor = "grabbing";
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    // register first touch id
    if (e.pointerType === "touch" && pinch.current.id1 === null) {
      pinch.current.id1 = e.pointerId;
    }
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    // Pinch (approximate by vertical movement factor around start midpoint)
    if (
      pinch.current.active &&
      pinch.current.id1 !== null &&
      pinch.current.id2 !== null
    ) {
      const dy = e.clientY - pinch.current.startMidClient.y;
      const delta = 1 - dy * 0.002; // sensitivity
      const next = clampScale(pinch.current.startScale * delta);
      zoomAtClientPoint(
        pinch.current.startMidClient.x,
        pinch.current.startMidClient.y,
        next / scale
      );
      return;
    }

    // Pan (divide by scale for natural feel)
    if (panState.current.dragging) {
      const dx = (e.clientX - panState.current.start.x) / scale;
      const dy = (e.clientY - panState.current.start.y) / scale;
      setPan({
        x: panState.current.panStart.x + dx,
        y: panState.current.panStart.y + dy,
      });
    }
  };

  const endPanOrPinch = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (panState.current.dragging) {
      panState.current.dragging = false;
      document.body.style.cursor = "";
    }
    if (e.pointerType === "touch") {
      if (pinch.current.id2 === e.pointerId) pinch.current.id2 = null;
      if (pinch.current.id1 === e.pointerId) pinch.current.id1 = null;
      if (pinch.current.id1 === null || pinch.current.id2 === null) {
        pinch.current.active = false;
      }
    }
  };

  // Wheel zoom (ctrl/⌘ + wheel and trackpad pinch)
  const onWheel = (e: React.WheelEvent) => {
    // trackpad pinch usually sets ctrlKey, otherwise ignore to allow page scroll
    if (e.ctrlKey || e.metaKey) {
      hasUserMoved.current = true;
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const factor = 1 - direction * ZOOM_STEP; // scroll up => zoom in
      zoomAtClientPoint(e.clientX, e.clientY, factor);
    }
  };

  // ====== Node drag (respects scale) ======
  const onNodePointerDown = (nodeId: string) => (e: React.PointerEvent) => {
    // allow buttons inside NodeCard to work
    if (isInteractiveTarget(e.target)) return;
    if (!isNodeDraggable(nodeId)) return;
    hasUserMoved.current = true;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const np = nodePositions.get(nodeId)!;
    nodeDrag.current = {
      nodeId,
      startClient: { x: e.clientX, y: e.clientY },
      nodeStart: { x: np.x, y: np.y },
    };
    document.body.style.cursor = "grabbing";
  };

  const onNodePointerMove = (e: React.PointerEvent) => {
    if (!nodeDrag.current.nodeId) return;
    e.stopPropagation();
    const dx = (e.clientX - nodeDrag.current.startClient.x) / scale;
    const dy = (e.clientY - nodeDrag.current.startClient.y) / scale;
    const id = nodeDrag.current.nodeId;
    const nextX = nodeDrag.current.nodeStart.x + dx;
    const nextY = nodeDrag.current.nodeStart.y + dy;

    setJourney((prev) => {
      const nodes = prev.nodes.map((n) =>
        n.id === id
          ? { ...n, position: { x: Math.round(nextX), y: Math.round(nextY) } }
          : n
      );
      return { ...prev, nodes };
    });
  };

  const onNodePointerUp = (e: React.PointerEvent) => {
    if (!nodeDrag.current.nodeId) return;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    nodeDrag.current.nodeId = null;
    document.body.style.cursor = "";
  };

  // ====== Helpers: completion by subnodes (achievements)
  const completeBySubnodesIfNeeded = (node: any) => {
    // If node has NO numeric progress, but has subnodes and all are completed => complete
    if (
      !node.progress &&
      Array.isArray(node.subnodes) &&
      node.subnodes.length
    ) {
      const allDone = node.subnodes.every((s: any) => s.status === "completed");
      if (allDone) {
        node.status = "completed";
      }
    }
  };

  const recalcOverall = (model: JourneyType) => {
    const percents: number[] = [];
    for (const n of model.nodes) {
      if (typeof n?.progress?.percent === "number") {
        percents.push(clamp(n.progress.percent, 0, 100));
      }
    }
    const overall =
      percents.length > 0
        ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
        : 0;
    return {
      ...model,
      progress: { ...(model.progress || {}), overall_percent: overall },
    };
  };

  // ====== Node actions (progress & percent) ======
  const handleAction = (payload: {
    nodeId: string;
    subId?: string;
    amount?: number;
  }) => {
    setJourney((prev) => {
      const next = { ...prev, nodes: prev.nodes.map((n) => ({ ...n })) };
      const node = next.nodes.find((n) => n.id === payload.nodeId);
      if (!node) return prev;
      // mark subnode complete (e.g., "собрать все документы")
      if (payload.subId && node.subnodes)
        node.subnodes = node.subnodes.map((s) =>
          s.id === payload.subId ? { ...s, status: "completed" } : s
        );

      // numeric increment (amount in value terms)
      if (
        node.progress &&
        typeof node.progress.current_value === "number" &&
        typeof node.progress.target_value === "number" &&
        typeof payload.amount === "number"
      ) {
        node.progress.current_value = clamp(
          node.progress.current_value + payload.amount,
          0,
          node.progress.target_value
        );
        node.progress.percent = clamp(
          Math.round(
            (node.progress.current_value / node.progress.target_value) * 100
          ),
          0,
          100
        );
      }

      // if no numeric progress — auto-complete by subnodes
      completeBySubnodesIfNeeded(node);

      node.status = statusFromProgress(node);

      // unlock / complete neighbors
      const map = new Map(next.nodes.map((x) => [x.id, x] as const));
      for (const n of next.nodes) {
        if ((n.status ?? "locked") === "locked" && canUnlock(n, map)) {
          n.status =
            n.progress?.percent && n.progress.percent > 0
              ? "in_progress"
              : "unlocked";
        }
        if ((n.progress?.percent ?? 0) >= 100) n.status = "completed";
        // subnode-based completion fallback
        completeBySubnodesIfNeeded(n);
      }

      return recalcOverall(next);
    });
  };

  const handlePercent = ({
    nodeId,
    nextPercent,
  }: {
    nodeId: string;
    nextPercent: number;
  }) => {
    setJourney((prev) => {
      const next = { ...prev, nodes: prev.nodes.map((n) => ({ ...n })) };
      const node = next.nodes.find((n) => n.id === nodeId);
      if (!node) return prev;
      if (!node.progress)
        node.progress = { target_value: 100, current_value: 0, percent: 0 };
      const tgt = node.progress.target_value || 100;
      node.progress.percent = clamp(Math.round(nextPercent), 0, 100);
      node.progress.current_value = Math.round(
        (node.progress.percent / 100) * tgt
      );

      // if percent reached 100 — completed
      node.status = statusFromProgress(node);

      // also check subnode-based completion for nodes without numeric progress (safety)
      completeBySubnodesIfNeeded(node);

      return recalcOverall(next);
    });
  };

  // ====== Controls
  const zoomIn = () => {
    hasUserMoved.current = true;
    setScale((s) => clampScale(s + ZOOM_STEP));
  };
  const zoomOut = () => {
    hasUserMoved.current = true;
    setScale((s) => clampScale(s - ZOOM_STEP));
  };
  const resetView = () => {
    const wrap = wrapRef.current;
    const nextCenter = centerGraph(wrap, 1) || fallbackPan;
    setScale(1);
    setPan(nextCenter);
    hasUserMoved.current = false;
  };

  return (
    <div
      className="h-full w-full bg-[var(--canvas-bg)]"
      style={{
        background: `radial-gradient( circle at 20% 10%, rgba(16,185,129,0.06), transparent 50%), radial-gradient( circle at 80% 50%, rgba(245,158,11,0.06), transparent 50%), ${
          journey.theme?.colors?.bg || "#F8FAFC"
        }`,
        touchAction: "none", // allow pointer gestures
      }}
    >
      {/* Zoom controls */}
      <div className="pointer-events-auto absolute left-3 bottom-3 z-50 flex gap-2 rounded-xl border bg-white/80 px-2 py-1 text-xs shadow">
        <button
          onClick={zoomOut}
          className="rounded border px-2 py-1 hover:bg-slate-50"
        >
          −
        </button>
        <div className="w-16 px-1 py-1 text-center">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={zoomIn}
          className="rounded border px-2 py-1 hover:bg-slate-50"
        >
          +
        </button>
        <button
          onClick={resetView}
          className="ml-1 rounded border px-2 py-1 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* Canvas (pan/zoom target) */}
      <div
        ref={wrapRef}
        className="relative h-full overflow-hidden"
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onCanvasPointerMove}
        onPointerUp={endPanOrPinch}
        onPointerCancel={endPanOrPinch}
        onWheel={onWheel}
        style={{ cursor: panState.current.dragging ? "grabbing" : "grab" }}
      >
        {/* We apply translate then scale; pan deltas are divided by scale */}
        <div
          className="relative"
          style={{
            width: viewW * scale + 600, // extra room for edges offscreen
            height: viewH * scale + 400,
          }}
        >
          {/* EDGES */}
          <svg
            width={viewW}
            height={viewH}
            className="absolute inset-0 z-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <defs>
              <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g>
              {(journey.connections || []).map((c) => {
                const s = nodePositions.get(c.from);
                const t = nodePositions.get(c.to);
                if (!s || !t) return null;
                const sx = s.x + NODE_WIDTH / 2;
                const sy = s.y + NODE_HEIGHT - 20;
                const tx = t.x + NODE_WIDTH / 2;
                const ty = t.y + 20;
                const d = calcPath(sx, sy, tx, ty);
                const fromNode = idToNode.get(c.from);
                const unlocked = (fromNode?.status ?? "locked") !== "locked";
                const isSelected = selectedPath === c.id;
                const isHover = hoverPath === c.id;
                return (
                  <g
                    key={c.id}
                    onMouseEnter={() => setHoverPath(c.id)}
                    onMouseLeave={() =>
                      setHoverPath((h) => (h === c.id ? null : h))
                    }
                    onClick={() => setSelectedPath(c.id)}
                    className="cursor-pointer"
                  >
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="url(#edgeGrad)"
                      strokeWidth={
                        isSelected ? 6 : isHover ? 5 : unlocked ? 4 : 2
                      }
                      strokeDasharray={unlocked ? "" : "6 6"}
                      filter={isSelected ? "url(#glow)" : undefined}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, ease: "easeInOut" }}
                    />
                    <motion.circle
                      r={isSelected ? 5 : 4}
                      fill={unlocked ? primary : "#94a3b8"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={d}
                      />
                    </motion.circle>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* NODES */}
          <div
            className="absolute inset-0 z-10"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <AnimatePresence>
              {journey.nodes.map((n) => {
                const p = nodePositions.get(n.id)!;
                const highlight = suggestions.chosen_node_id === n.id;
                const draggable = isNodeDraggable(n.id);
                return (
                  <motion.div
                    key={n.id}
                    className={`absolute ${
                      draggable ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                    style={{
                      left: p.x,
                      top: p.y,
                      width: NODE_WIDTH,
                      touchAction: "none",
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    onPointerDown={onNodePointerDown(n.id)}
                    onPointerMove={onNodePointerMove}
                    onPointerUp={onNodePointerUp}
                    onPointerCancel={onNodePointerUp}
                  >
                    {/* Tip: add data-interactive on clickable areas within NodeCard to be extra safe */}
                    <NodeCard
                      node={n}
                      onAction={({ amount, subId }) =>
                        handleAction({ nodeId: n.id, subId, amount })
                      }
                      onPercent={({ nextPercent }) =>
                        handlePercent({ nodeId: n.id, nextPercent })
                      }
                      highlight={highlight}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

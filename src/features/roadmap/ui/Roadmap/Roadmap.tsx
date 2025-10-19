import { useEffect, useMemo, useRef, useState } from "react";
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
  const [journey, setJourney] = useState<JourneyType>(() =>
    JSON.parse(JSON.stringify(data))
  );

  const wrapRef = useRef<HTMLDivElement>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoverPath, setHoverPath] = useState<string | null>(null);

  // Layout helpers
  const levels = useMemo(() => computeLevels(journey.nodes), [journey.nodes]);
  const columns = useMemo(
    () => assignColumns(levels, journey.nodes),
    [levels, journey.nodes]
  );
  const idToNode = useMemo(
    () => new Map(journey.nodes.map((n) => [n.id, n] as const)),
    [journey.nodes]
  );

  // Unlock on mount
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

  // Auto positions (grid)
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

  // Respect manual node.position if present; else use auto
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
  const initialPan: Point = { x: -minX + 80, y: 60 };
  const [pan, setPan] = useState<Point>(initialPan);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    // If data changed a lot, keep a sane pan
    setPan((p) => ({
      x: isFinite(p.x) ? p.x : initialPan.x,
      y: isFinite(p.y) ? p.y : initialPan.y,
    }));
  }, [initialPan.x, initialPan.y]);

  // Panning drag state
  const panState = useRef<{ dragging: boolean; start: Point; panStart: Point }>(
    {
      dragging: false,
      start: { x: 0, y: 0 },
      panStart: { x: 0, y: 0 },
    }
  );

  // Node dragging state
  const nodeDrag = useRef<{
    nodeId: string | null;
    startClient: Point;
    nodeStart: Point;
  }>({ nodeId: null, startClient: { x: 0, y: 0 }, nodeStart: { x: 0, y: 0 } });

  // Pinch zoom state
  const pinch = useRef<{
    active: boolean;
    id1: number | null;
    id2: number | null;
    startDist: number;
    startScale: number;
    startPan: Point;
    startMidClient: Point;
  }>({
    active: false,
    id1: null,
    id2: null,
    startDist: 0,
    startScale: 1,
    startPan: { x: 0, y: 0 },
    startMidClient: { x: 0, y: 0 },
  });

  const primary = journey.theme?.colors?.primary || "#10B981";
  const accent = journey.theme?.colors?.accent || "#F59E0B";

  // Utils
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

  // Zoom keeping pointer focus stable: we translate pan by (focus - newScaledFocus) delta / scale math
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

    // After zoom, we want (gx, gy) to map back to same screen px/py:
    // px = pan'.x + gx * nextScale  =>  pan'.x = px - gx*nextScale
    // py = pan'.y + gy * nextScale  =>  pan'.y = py - gy*nextScale
    const nextPan = {
      x: px - gx * nextScale,
      y: py - gy * nextScale,
    };

    setScale(nextScale);
    setPan(nextPan);
  };

  // ----- Pointer handlers (canvas pan / pinch)
  const onCanvasPointerDown = (e: React.PointerEvent) => {
    // handle multi-touch (pinch)
    // Store pointers in element; React doesn't give full pointers map, so we derive from events
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (pinch.current.active) return; // already pinching

    // If second finger down -> start pinch
    if (
      pinch.current.id1 !== null &&
      pinch.current.id2 === null &&
      e.pointerType === "touch"
    ) {
      pinch.current.id2 = e.pointerId;
      pinch.current.active = true;
      pinch.current.startScale = scale;
      pinch.current.startPan = { ...pan };
      pinch.current.startMidClient = { x: e.clientX, y: e.clientY };
      pinch.current.startDist = 0; // will be set on first move when we know both pointers
      return;
    }

    // First finger or mouse -> start pan
    if (e.pointerType !== "touch" || pinch.current.id1 === null) {
      panState.current.dragging = true;
      panState.current.start = { x: e.clientX, y: e.clientY };
      panState.current.panStart = { ...pan };
      document.body.style.cursor = "grabbing";
    }

    // register first touch id
    if (e.pointerType === "touch" && pinch.current.id1 === null) {
      pinch.current.id1 = e.pointerId;
    }
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    // Pinch (need two active touches)
    if (
      pinch.current.active &&
      pinch.current.id1 !== null &&
      pinch.current.id2 !== null
    ) {
      // We cannot read the other pointer’s coords directly in React; a lightweight approach:
      // use the movement on this event combined with startMidClient to estimate current midpoint & distance.
      // For practical UX, we can read `e` as the "latest" finger and compute scale by wheel fallback:
      // Simpler & robust: when pinching, use `e` as current midpoint and use `e.width` as heuristic (not reliable).
      // Better approach: track both pointers via native listeners; to keep it simple here:
      // We'll use browser’s wheel+ctrl for most trackpads, and for touch we approximate:
      // If movement since start > 0, derive a delta from vertical move.
      const dy = e.clientY - pinch.current.startMidClient.y;
      const delta = 1 - dy * 0.002; // small sensitivity
      const next = clampScale(pinch.current.startScale * delta);
      // Zoom around start midpoint:
      zoomAtClientPoint(
        pinch.current.startMidClient.x,
        pinch.current.startMidClient.y,
        next / scale
      );
      return;
    }

    // Pan (translate before scale => divide by scale for natural feel)
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
    // Clear pinch ids if a touch ends
    if (e.pointerType === "touch") {
      if (pinch.current.id2 === e.pointerId) pinch.current.id2 = null;
      if (pinch.current.id1 === e.pointerId) pinch.current.id1 = null;
      if (pinch.current.id1 === null || pinch.current.id2 === null) {
        pinch.current.active = false;
      }
    }
  };

  // Wheel zoom (ctrl/⌘ + wheel, and trackpad pinch)
  const onWheel = (e: React.WheelEvent) => {
    // If ctrlKey is true, it's likely a pinch-zoom gesture on trackpad
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const factor = 1 - direction * ZOOM_STEP; // scroll up => zoom in
      zoomAtClientPoint(e.clientX, e.clientY, factor);
    }
  };

  // ----- Node drag (respects scale)
  const onNodePointerDown = (nodeId: string) => (e: React.PointerEvent) => {
    if (!isNodeDraggable(nodeId)) return;
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
    const dx = (e.clientX - nodeDrag.current.startClient.x) / scale; // adjust by scale
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

  // Actions
  const handleAction = (payload: {
    nodeId: string;
    subId?: string;
    amount?: number;
  }) => {
    setJourney((prev) => {
      const next = { ...prev, nodes: prev.nodes.map((n) => ({ ...n })) };
      const node = next.nodes.find((n) => n.id === payload.nodeId);
      if (!node) return prev;
      if (payload.subId && node.subnodes)
        node.subnodes = node.subnodes.map((s) =>
          s.id === payload.subId ? { ...s, status: "completed" } : s
        );
      if (
        node.progress &&
        typeof node.progress.current_value === "number" &&
        typeof node.progress.target_value === "number"
      ) {
        const inc = payload.amount || 0;
        node.progress.current_value = clamp(
          node.progress.current_value + inc,
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
      node.status = statusFromProgress(node);
      const map = new Map(next.nodes.map((x) => [x.id, x] as const));
      for (const n of next.nodes) {
        if ((n.status ?? "locked") === "locked" && canUnlock(n, map)) {
          n.status =
            n.progress?.percent && n.progress.percent > 0
              ? "in_progress"
              : "unlocked";
        }
        if ((n.progress?.percent ?? 0) >= 100) n.status = "completed";
      }
      return next;
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
      node.status = statusFromProgress(node);
      return next;
    });
  };

  // Controls
  const zoomIn = () => setScale((s) => clampScale(s + ZOOM_STEP));
  const zoomOut = () => setScale((s) => clampScale(s - ZOOM_STEP));
  const resetView = () => {
    setScale(1);
    setPan(initialPan);
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
        <div className="px-1 py-1 w-16 text-center">
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

      {/* Canvas */}
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
            width: viewW * scale + 600, // extra room
            height: viewH * scale + 400,
          }}
        >
          {/* Edges */}
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

          {/* Nodes */}
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

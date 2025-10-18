import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sampleBranching, sampleLinear } from "@/pages/Roadmap";
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

export default function Roadmap({ data }: { data?: JourneyType }) {
  // ✅ Single source of truth (fix): only one declaration
  const [journey, setJourney] = useState<JourneyType>(() =>
    JSON.parse(JSON.stringify(data))
  );
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoverPath, setHoverPath] = useState<string | null>(null);

  // Layout
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

  // Positions
  const nodePositions = useMemo(() => {
    const pos = new Map<string, { x: number; y: number }>();
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

  const primary = journey.theme?.colors?.primary || "#10B981";
  const accent = journey.theme?.colors?.accent || "#F59E0B";

  return (
    <div
      className="h-[100dvh] bg-[var(--canvas-bg)]"
      style={{
        background: `radial-gradient( circle at 20% 10%, rgba(16,185,129,0.06), transparent 50%), radial-gradient( circle at 80% 50%, rgba(245,158,11,0.06), transparent 50%), ${
          journey.theme?.colors?.bg || "#F8FAFC"
        }`,
      }}
    >
      {/* Canvas */}
      <div className="relative overflow-auto">
        <div className="relative mx-auto max-w-[1100px] px-8 py-10">
          {/* Layered canvas: edges behind (z-0), nodes above (z-10) */}
          <div
            className="relative mx-auto"
            style={{ width: viewW, height: viewH }}
          >
            {/* EDGES (z-0) */}
            <svg width={viewW} height={viewH} className="absolute inset-0 z-0">
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
              <g transform={`translate(${-minX + 80}, 60)`}>
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

            {/* NODES (z-10) */}
            <div
              className="absolute inset-0 z-10"
              style={{
                transform: `translateX(${-minX + 80}px) translateY(60px)`,
              }}
            >
              <AnimatePresence>
                {journey.nodes.map((n) => {
                  const p = nodePositions.get(n.id)!;
                  const highlight = suggestions.chosen_node_id === n.id;
                  return (
                    <motion.div
                      key={n.id}
                      className="absolute"
                      style={{ left: p.x, top: p.y, width: NODE_WIDTH }}
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                      }}
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
    </div>
  );
}

// ----------------------------------- Dev Harness (manual tests) -----------------------------------
export function DevHarness() {
  const [which, setWhich] = useState<"linear" | "branch">("branch");
  const data = which === "branch" ? sampleBranching : sampleLinear;
  return (
    <div className="h-[100dvh]">
      <div className="fixed left-3 top-3 z-50 flex gap-2 rounded-xl border bg-white/80 px-3 py-2 text-xs">
        <button
          onClick={() => setWhich("branch")}
          className={`rounded px-2 py-1 ${
            which === "branch" ? "bg-emerald-100" : "bg-white"
          }`}
        >
          Branching test
        </button>
        <button
          onClick={() => setWhich("linear")}
          className={`rounded px-2 py-1 ${
            which === "linear" ? "bg-emerald-100" : "bg-white"
          }`}
        >
          Linear test
        </button>
      </div>
      <Roadmap data={data} />
    </div>
  );
}

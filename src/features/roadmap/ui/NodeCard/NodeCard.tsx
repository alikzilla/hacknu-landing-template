import { motion } from "framer-motion";
import { Clock, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { formatPercent } from "../../model/helpers/helpers";
import { NODE_WIDTH } from "../../model/utils/utils";
import { ProgressBar, RewardBadges, ProgressSlider, Chip } from "..";
import { NodeType } from "../../model";

const NodeCard: React.FC<{
  node: NodeType;
  onAction?: (payload: {
    nodeId: string;
    subId?: string;
    amount?: number;
  }) => void;
  onPercent?: (payload: { nodeId: string; nextPercent: number }) => void;
  highlight?: boolean;
}> = ({ node, onAction, onPercent, highlight }) => {
  const p = node.progress?.percent ?? 0;
  return (
    <motion.div
      layout
      className={`relative w-[${NODE_WIDTH}px] max-w-[${NODE_WIDTH}px] rounded-2xl border bg-white p-4 shadow-sm ${
        highlight ? "ring-2 ring-emerald-500" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none select-none">
          {node.icon || "🧩"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold truncate">{node.title}</h3>
            <Chip kind={(node.status as any) || "unlocked"} />
          </div>
          {node.summary && (
            <p className="mt-1 text-xs text-slate-600">{node.summary}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">
              ETA: {node.estimates?.eta_days ?? "—"} дн ·{" "}
              {node.estimates?.effort_hours ?? "—"} ч
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar percent={p} />
            <div className="mt-1 text-[11px] text-slate-500">
              {formatPercent(p)}
            </div>
          </div>
          {onPercent &&
            (node.status === "unlocked" || node.status === "in_progress") && (
              <ProgressSlider
                value={p}
                onChange={(next) =>
                  onPercent({ nodeId: node.id, nextPercent: next })
                }
              />
            )}
          {(node.subnodes?.length || 0) > 0 && (
            <div className="mt-3 grid gap-1">
              {node.subnodes!.slice(0, 3).map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    onAction?.({
                      nodeId: node.id,
                      subId: s.id,
                      amount: s.suggested_action?.amount,
                    })
                  }
                  disabled={s.status === "completed"}
                  className={`group inline-flex items-center justify-between rounded-xl border px-2 py-1 text-left text-xs ${
                    s.status === "completed"
                      ? "bg-slate-50 text-slate-400"
                      : "hover:bg-emerald-50"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500" />
                    {s.title}
                  </span>
                  {s.status === "completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          )}
          {!!node.rewards?.length && (
            <div className="mt-3">
              <RewardBadges rewards={node.rewards} />
            </div>
          )}
        </div>
      </div>
      {highlight && (
        <motion.div
          className="pointer-events-none absolute -inset-0.5 rounded-2xl"
          initial={{ boxShadow: "0 0 0 0 rgba(16,185,129,0.0)" }}
          animate={{ boxShadow: "0 0 0 8px rgba(16,185,129,0.15)" }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </motion.div>
  );
};

export default NodeCard;

import { CheckCircle2, Play, Info, Lock } from "lucide-react";

const Chip: React.FC<{
  kind?: "completed" | "in_progress" | "unlocked" | "locked";
}> = ({ kind = "unlocked" }) => {
  const map: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300",
    unlocked: "bg-amber-100 text-amber-800 border-amber-300",
    locked: "bg-slate-100 text-slate-500 border-slate-300",
  };

  const label: Record<string, string> = {
    completed: "Завершено",
    in_progress: "В процессе",
    unlocked: "Доступно",
    locked: "Закрыто",
  };

  const icon =
    kind === "completed" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : kind === "locked" ? (
      <Lock className="h-3.5 w-3.5" />
    ) : kind === "in_progress" ? (
      <Play className="h-3.5 w-3.5" />
    ) : (
      <Info className="h-3.5 w-3.5" />
    );

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${map[kind]}`}
    >
      {icon}
      {label[kind]}
    </span>
  );
};

export default Chip;

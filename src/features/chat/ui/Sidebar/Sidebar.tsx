import { useSelectThread, useStartNewChat, useThreadStore } from "../../model";
import { DotsThree } from "phosphor-react";
import { Link } from "react-router-dom";
import logo from "/public/logo.svg";
import { Plus } from "lucide-react";

export const Sidebar = ({ onAfterSelect }: { onAfterSelect?: () => void }) => {
  const threads = useThreadStore((s) => s.threads);
  const activeId = useThreadStore((s) => s.activeId);
  const onNew = useStartNewChat();
  const onSelect = useSelectThread();

  const handleSelect = (id: string) => {
    onSelect(id);
    onAfterSelect?.();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <Link to={"/"} className="flex items-center gap-3">
            <img src={logo} className="h-14 w-auto" alt="Zamanbank" />
          </Link>
        </div>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
          onClick={() => {
            onNew();
            onAfterSelect?.();
          }}
        >
          <Plus />
        </button>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-2 pb-6">
        {[...threads]
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`group mb-2 w-full rounded-xl px-3 py-3 text-left transition ${
                activeId === t.id
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {t.title.length > 28 ? t.title.slice(0, 28) + "…" : t.title}
                </div>
                <DotsThree
                  size={18}
                  weight="bold"
                  className={
                    activeId === t.id ? "opacity-80" : "text-slate-400"
                  }
                />
              </div>
              {t.lastMessage && (
                <div
                  className={`mt-1 line-clamp-1 text-xs ${
                    activeId === t.id ? "opacity-90" : "text-slate-500"
                  }`}
                >
                  {t.lastMessage}
                </div>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

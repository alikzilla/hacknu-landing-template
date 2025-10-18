import { useClearChat, useThreadStore } from "../../model";
import { List } from "phosphor-react";

export const Header = ({
  onOpenSidebarMobile,
}: {
  onOpenSidebarMobile?: () => void;
}) => {
  const active = useThreadStore((s) =>
    s.threads.find((t) => t.id === s.activeId)
  );
  const clear = useClearChat();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 md:px-4 py-2 md:py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* бургер только на мобилке */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={onOpenSidebarMobile}
          aria-label="Открыть меню"
        >
          <List size={20} />
        </button>
        <div className="min-w-0">
          <div className="text-xs md:text-sm text-slate-500">Диалог</div>
          <div className="truncate text-base md:text-lg font-semibold text-slate-900">
            {active?.title ?? "Чат"}
          </div>
        </div>
      </div>

      <button
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
        onClick={clear}
      >
        Очистить
      </button>
    </div>
  );
};

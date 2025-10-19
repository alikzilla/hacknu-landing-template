import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, Check } from "phosphor-react";
import { useModelStore } from "../../model";

const ModelSelector = () => {
  const activeModel = useModelStore((m) => m.activeModel);
  const onSelect = useModelStore((m) => m.setActiveModel);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xl font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 data-[state=open]:bg-slate-50"
          aria-label="Открыть меню"
        >
          {activeModel === "general"
            ? "Чатбот"
            : activeModel === "cumulative"
            ? "Роудмап"
            : "Аналитика"}
          <CaretDown size={14} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-[240px] rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DropdownMenu.Label className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500">
            Модель
          </DropdownMenu.Label>

          <DropdownMenu.RadioGroup
            value={activeModel}
            onValueChange={(m) =>
              onSelect(m as "general" | "cumulative" | "accounting")
            }
          >
            <DropdownMenu.RadioItem
              value="general"
              className="group relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-slate-100"
            >
              <span className="pointer-events-none absolute left-2 inline-flex h-4 w-4 items-center justify-center">
                {activeModel === "general" && <Check size={14} />}
              </span>
              <span className="pl-5">Чатбот</span>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="cumulative"
              className="group relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-slate-100"
            >
              <span className="pointer-events-none absolute left-2 inline-flex h-4 w-4 items-center justify-center">
                {activeModel === "cumulative" && <Check size={14} />}
              </span>
              <span className="pl-5">Роудмап</span>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="accounting"
              className="group relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-slate-100"
            >
              <span className="pointer-events-none absolute left-2 inline-flex h-4 w-4 items-center justify-center">
                {activeModel === "accounting" && <Check size={14} />}
              </span>
              <span className="pl-5">Аналитика</span>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ModelSelector;

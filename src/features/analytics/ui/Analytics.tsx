// src/features/analytics/AnalyticsLite.tsx
import React, { useMemo } from "react";
import type { JourneyType } from "@/features/roadmap/model";
import { Legend } from "recharts";

type Status = "completed" | "in_progress" | "unlocked" | "locked";

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));
const pct = (n: number) => `${clamp(n).toFixed(0)}%`;

export default function AnalyticsLite({
  journey,
  onOpenNode,
}: {
  journey: JourneyType;
  /** опционально: обработчик клика по шагу */
  onOpenNode?: (nodeId: string) => void;
}) {
  // общий % (падение на среднее по узлам, если не задан)
  const overall = useMemo(() => {
    if (typeof journey.progress?.overall_percent === "number")
      return clamp(journey.progress.overall_percent);
    if (typeof journey.goal?.progress_percent === "number")
      return clamp(journey.goal.progress_percent);
    const list = journey.nodes ?? [];
    if (!list.length) return 0;
    return clamp(
      Math.round(
        list.reduce((s, n) => s + (n.progress?.percent ?? 0), 0) / list.length
      )
    );
  }, [journey]);

  // счётчики статусов
  const statusCounts = useMemo(() => {
    const acc: Record<Status, number> = {
      completed: 0,
      in_progress: 0,
      unlocked: 0,
      locked: 0,
    };
    (journey.nodes ?? []).forEach((n) => {
      const k = (n.status ?? "locked") as Status;
      acc[k] = (acc[k] || 0) + 1;
    });
    return acc;
  }, [journey]);

  const total = Math.max(1, journey.nodes?.length ?? 0);
  const seg = {
    completed: (statusCounts.completed / total) * 100,
    in_progress: (statusCounts.in_progress / total) * 100,
    unlocked: (statusCounts.unlocked / total) * 100,
    locked: (statusCounts.locked / total) * 100,
  };

  // простая выборка “что делать дальше”
  const nextSteps = useMemo(() => {
    const priOrder = { high: 0, medium: 1, low: 2 } as const;
    return (journey.nodes ?? [])
      .filter((n) => n.status === "in_progress" || n.status === "unlocked")
      .sort((a, b) => {
        const pa = priOrder[(a.priority as keyof typeof priOrder) ?? "medium"];
        const pb = priOrder[(b.priority as keyof typeof priOrder) ?? "medium"];
        if (pa !== pb) return pa - pb;
        const ap = a.progress?.percent ?? 0;
        const bp = b.progress?.percent ?? 0;
        return ap - bp;
      })
      .slice(0, 5);
  }, [journey]);

  return (
    <div className="min-h-[100dvh] w-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">
              {journey.title || "Аналитика"}
            </h2>
            {journey.description ? (
              <p className="truncate text-xs text-slate-600">
                {journey.description}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Общий прогресс</div>
            <div className="text-lg font-semibold">{pct(overall)}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1000px] px-4 py-6 space-y-8">
        {/* KPI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Всего шагов" value={total} />
          <KPI label="Выполнено" value={statusCounts.completed} />
          <KPI label="В работе" value={statusCounts.in_progress} />
          <KPI label="Заблокировано" value={statusCounts.locked} />
        </div>

        {/* Простая стек-полоса статусов */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-800">
              Картина по статусам
            </div>
            <div className="text-xs text-slate-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
          <div
            className="h-5 w-full overflow-hidden rounded-full border"
            aria-label="Распределение статусов"
          >
            <StackPart
              w={seg.completed}
              color="bg-emerald-500"
              title="Выполнено"
            />
            <StackPart
              w={seg.in_progress}
              color="bg-blue-500"
              title="В работе"
            />
            <StackPart w={seg.unlocked} color="bg-amber-500" title="Доступно" />
            <StackPart
              w={seg.locked}
              color="bg-slate-300"
              title="Заблокировано"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <Legend color="bg-emerald-500" />
            <Legend color="bg-blue-500" />
            <Legend color="bg-amber-500" />
            <Legend color="bg-slate-300" />
          </div>
        </div>

        {/* Ближайшие действия */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm font-medium text-slate-800">
            Ближайшие шаги
          </div>
          {nextSteps.length === 0 ? (
            <div className="text-sm text-slate-500">
              Сейчас всё выполнено — отличная работа!
            </div>
          ) : (
            <ul className="space-y-2">
              {nextSteps.map((n) => (
                <li
                  key={n.id}
                  className="group flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {n.icon ? <span className="mr-1">{n.icon}</span> : null}
                      {n.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      Статус: {humanStatus(n.status)} · Прогресс:{" "}
                      {pct(n.progress?.percent ?? 0)}
                      {n.priority
                        ? ` · Приоритет: ${humanPriority(n.priority)}`
                        : ""}
                    </div>
                    {!!n.subnodes?.length && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {n.subnodes.slice(0, 2).map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-slate-600"
                          >
                            {s.title}
                          </span>
                        ))}
                        {n.subnodes.length > 2 && (
                          <span className="text-[11px] text-slate-400">
                            +{n.subnodes.length - 2} ещё
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 pl-3">
                    <MiniProgress percent={n.progress?.percent ?? 0} />
                    {onOpenNode && (
                      <button
                        onClick={() => onOpenNode(n.id)}
                        className="invisible rounded-lg border px-2 py-1 text-xs text-slate-700 hover:bg-white group-hover:visible"
                      >
                        Открыть
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Цель — кратко */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-1 text-sm font-medium text-slate-800">Цель</div>
          <div className="text-sm text-slate-800">
            {journey.goal?.title ?? journey.title}
          </div>
          <div className="text-xs text-slate-500">
            Дедлайн: {journey.goal?.deadline ?? "—"} · Текущий:{" "}
            {journey.goal?.current_value ?? "—"} {journey.goal?.unit ?? ""}
            {journey.goal?.target_value
              ? ` из ${journey.goal.target_value} ${journey.goal.unit ?? ""}`
              : ""}
          </div>
          <div className="mt-2 w-full sm:w-80">
            <MiniProgress
              percent={journey.goal?.progress_percent ?? overall}
              large
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Мини-компоненты === */
function KPI({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}
const KPICard = KPI;

function StackPart({
  w,
  color,
  title,
}: {
  w: number;
  color: string;
  title: string;
}) {
  const width = clamp(w);
  if (width <= 0) return null;
  return (
    <div
      className={`${color} h-full`}
      style={{ width: `${width}%`, minWidth: 2 }}
      title={`${title} · ${pct(width)}`}
      aria-label={`${title}: ${pct(width)}`}
    />
  );
}

function MiniProgress({
  percent,
  large = false,
}: {
  percent: number;
  large?: boolean;
}) {
  const p = clamp(percent);
  return (
    <div
      className={`overflow-hidden rounded-full border ${
        large ? "h-3" : "h-2"
      } w-28`}
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-emerald-500 transition-[width]"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

function humanStatus(s?: string) {
  switch (s) {
    case "completed":
      return "выполнено";
    case "in_progress":
      return "в работе";
    case "unlocked":
      return "доступно";
    case "locked":
    default:
      return "заблокировано";
  }
}

function humanPriority(p?: string) {
  switch (p) {
    case "high":
      return "высокий";
    case "low":
      return "низкий";
    case "medium":
    default:
      return "средний";
  }
}

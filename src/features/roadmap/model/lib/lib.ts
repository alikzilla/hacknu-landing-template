import { Journey, Suggestion } from "../types";
import { priorityScore } from "../utils/utils";

export function buildSuggestions(j: Journey): Suggestion {
  const nodes = j.nodes;
  if (!nodes.length)
    return {
      chosen_node_id: null,
      suggested_actions: [],
      messages: ["Нет доступных шагов"],
    };
  const eligible = nodes.filter(
    (n) => (n.status || "locked") === "unlocked" || n.status === "in_progress"
  );
  if (!eligible.length)
    return {
      chosen_node_id: null,
      suggested_actions: [],
      messages: ["Все шаги заблокированы — завершите зависимости"],
    };

  const sorted = [...eligible].sort((a, b) => {
    const ps = priorityScore(a.priority) - priorityScore(b.priority);
    if (ps !== 0) return ps;
    const ap = a.progress?.percent ?? 0;
    const bp = b.progress?.percent ?? 0;
    if (ap !== bp) return ap - bp;
    const ae = a.estimates?.eta_days ?? 9999;
    const be = b.estimates?.eta_days ?? 9999;
    return ae - be;
  });
  const chosen = sorted[0];

  const subs = (chosen.subnodes || []).filter((s) => s.status !== "completed");
  const actions: { id: string; label: string; payload?: any }[] = [];
  if (subs.length) {
    subs
      .slice(0, 3)
      .forEach((s) =>
        actions.push({ id: s.id, label: s.title, payload: s.suggested_action })
      );
  } else if (
    chosen.progress?.target_value != null &&
    chosen.progress.current_value != null
  ) {
    const remain = Math.max(
      0,
      chosen.progress.target_value - chosen.progress.current_value
    );
    const step = Math.max(5, Math.round(remain / 4));
    const percents = [step, step, step, remain - step * 3].filter((x) => x > 0);
    percents.slice(0, 3).forEach((p, i) =>
      actions.push({
        id: `${chosen.id}.auto_${i + 1}`,
        label: `+${p}%`,
        payload: { action: "percent", amount: p },
      })
    );
  }

  const messages: string[] = [];
  const tmpl = j.ai_guides?.advice_templates || {};
  const msg =
    tmpl["save_small"] ||
    "Сделай небольшой шаг — переведи {amount}₸ на {node_title}";
  if (chosen.progress?.target_value) {
    const percent = chosen.progress?.percent ?? 0;
    messages.push(
      msg
        .replace("{amount}", String(5))
        .replace("{node_title}", chosen.title)
        .replace("{percent}", String(Math.min(100, percent + 5)))
    );
  } else {
    messages.push("Сделай небольшой шаг по выбранному уровню");
  }
  return { chosen_node_id: chosen.id, suggested_actions: actions, messages };
}

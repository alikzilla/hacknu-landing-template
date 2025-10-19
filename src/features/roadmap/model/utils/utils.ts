import { NodeType } from "..";

export const NODE_WIDTH = 450;
export const NODE_HEIGHT = 140;
export const H_SPACING = 500;
export const V_SPACING = 280;

export function priorityScore(p?: NodeType["priority"]) {
  switch (p) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 3;
  }
}

export function computeLevels(nodes: NodeType[]): Map<string, number> {
  const map = new Map<string, NodeType>();
  nodes.forEach((n) => map.set(n.id, n));
  const memo = new Map<string, number>();
  const dfs = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    const n = map.get(id);
    if (!n) return 0;
    const deps = n.dependencies?.length ? n.dependencies : [];
    if (!deps.length) {
      memo.set(id, 0);
      return 0;
    }
    const lvl = 1 + Math.max(...deps.map((d) => dfs(d)));
    memo.set(id, lvl);
    return lvl;
  };
  nodes.forEach((n) => dfs(n.id));
  return memo;
}

export function assignColumns(
  levels: Map<string, number>,
  nodes: NodeType[]
): Map<string, number> {
  const byLevel: Record<number, string[]> = {};
  nodes.forEach((n) => {
    const l = levels.get(n.id) ?? 0;
    (byLevel[l] ||= []).push(n.id);
  });
  const columns = new Map<string, number>();
  Object.keys(byLevel).forEach((k) => {
    byLevel[+k].forEach((id, i) => columns.set(id, i));
  });
  return columns;
}

export function statusFromProgress(n: NodeType): NodeType["status"] {
  const p =
    n.progress?.percent ??
    (n.progress && n.progress.target_value
      ? Math.min(
          100,
          Math.round(
            ((n.progress.current_value || 0) / (n.progress.target_value || 1)) *
              100
          )
        )
      : 0);
  if (p >= 100) return "completed";
  return n.status || "unlocked";
}

export function canUnlock(
  n: NodeType,
  idToNode: Map<string, NodeType>
): boolean {
  const deps = n.dependencies || [];
  return deps.every(
    (d) => (idToNode.get(d)?.status ?? "locked") === "completed"
  );
}

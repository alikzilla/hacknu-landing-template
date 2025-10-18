export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function calcPath(sx: number, sy: number, tx: number, ty: number) {
  const dy = ty - sy;
  return `M ${sx},${sy} C ${sx},${sy + dy * 0.35 + 60} ${tx},${
    ty - dy * 0.35 - 60
  } ${tx},${ty}`;
}

export function formatPercent(n?: number) {
  return `${clamp(Math.round(n || 0), 0, 100)}%`;
}

export const gbp = (n: number) => "£" + n.toFixed(2);
export const kmFmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(Math.round(n));
export const mileFmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(Math.round(n));
export const yr = (d: string) => d.slice(0, 4);
export const ym = (d: string) => d.slice(0, 7);

export const COLOR_MAP: Record<string, string> = {
  green: "#22c55e",
  amber: "#f59e0b",
  red:   "#ef4444",
  blue:  "#3b82f6",
};

export function statusColor(pct: number): string {
  if (pct < 0.6) return "green";
  if (pct < 0.85) return "amber";
  return "red";
}

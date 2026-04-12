import type { ServiceEntry } from "@/lib/types";
import { Badge } from "@/components/retroui/Badge";

const SERVICE_PLAN = [
  { name: "Engine oil & filter", intervalKm: 10000, match: (s: ServiceEntry["service_types"]) => s.some(t => /oil change/i.test(t.name)) },
  { name: "Spark plugs",         intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /spark plug/i.test(t.name)) },
  { name: "Air filter",          intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /air filter/i.test(t.name)) },
  { name: "Cabin filter",        intervalKm: 20000, match: (s: ServiceEntry["service_types"]) => s.some(t => /cabin/i.test(t.name)) },
  { name: "Brake fluid",         intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /brake fluid/i.test(t.name)) },
];

interface Props {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
}

export default function StatusBanner({ service, latestOdo }: Props) {
  const issues: { label: string; severity: "red" | "amber" }[] = [];

  for (const item of SERVICE_PLAN) {
    let lastOdo = 0;
    service.forEach(e => {
      if (item.match(e.service_types) && e.odometer > lastOdo) lastOdo = e.odometer;
    });
    const kmSince = lastOdo ? latestOdo - lastOdo : latestOdo;
    const remaining = item.intervalKm - kmSince;
    if (remaining <= 0) issues.push({ label: `${item.name} overdue`, severity: "red" });
    else if (remaining <= 1000) issues.push({ label: `${item.name} due in ~${remaining.toLocaleString()} mi`, severity: "amber" });
  }

  const severity = issues.some(i => i.severity === "red") ? "red"
    : issues.some(i => i.severity === "amber") ? "amber"
    : "green";

  const message = severity === "green"
    ? "All good — no service items due"
    : issues[0].label;

  const variantMap = {
    green: "default" as const,
    amber: "secondary" as const,
    red: "destructive" as const,
  };

  return (
    <div className="flex items-center gap-3 p-4 border-4 border-border bg-card shadow-md mb-6">
      <div className={`w-3 h-3 rounded-full ${
        severity === "green" ? "bg-green-500" :
        severity === "amber" ? "bg-amber-500" :
        "bg-red-500"
      }`} />
      <span className="font-medium flex-1">{message}</span>
      {issues.length > 1 && (
        <Badge variant={variantMap[severity]}>+{issues.length - 1} more</Badge>
      )}
    </div>
  );
}

import type { ServiceEntry } from "@/lib/types";
import { gbp } from "@/lib/format";
import { Card } from "@/components/retroui/Card";

interface Props {
  readonly service: ServiceEntry[];
}

export default function ServiceTimeline({ service }: Props) {
  const recent = [...service]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent work
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="relative pl-5 space-y-4">
          <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-border" />
          {recent.map(e => {
            const cost = e.service_types.reduce((s, t) => s + (t.amount ?? 0), 0);
            const work = e.service_types.map(t => t.name).filter(Boolean).join(", ");
            return (
              <div key={e.service_id} className="relative">
                <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-background" />
                <div className="text-xs text-muted-foreground mb-0.5">
                  {e.date.slice(0, 10)} · {e.location?.name ?? "Unknown"} · {e.odometer.toLocaleString()} mi
                </div>
                <div className="text-sm font-semibold mb-0.5">{work || "Service"}</div>
                {cost > 0 && <div className="text-xs text-amber-500">{gbp(cost)}</div>}
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
}

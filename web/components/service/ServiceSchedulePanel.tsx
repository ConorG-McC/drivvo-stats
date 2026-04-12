import { Badge } from "@/components/retroui/Badge";
import { Card } from "@/components/retroui/Card";
import { COLOR_MAP, mileFmt } from "@/lib/format";
import type { ServiceScheduleItem } from "@/lib/service-stats";

interface Props {
  readonly items: ServiceScheduleItem[];
  readonly limit?: number;
}

function colorForStatus(status: ServiceScheduleItem["status"]) {
  if (status === "overdue") return COLOR_MAP.red;
  if (status === "soon") return COLOR_MAP.amber;
  return COLOR_MAP.green;
}

export default function ServiceSchedulePanel({ items, limit }: Props) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Service Schedule
        </Card.Title>
        <Card.Description>Intervals are tracked in miles from the odometer readings.</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        {visible.map((item) => {
          const color = colorForStatus(item.status);
          return (
            <div key={item.name} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.lastDate ? `Last: ${item.lastDate.slice(0, 10)}` : "No record"} · every {mileFmt(item.intervalMiles)} mi
                  </div>
                </div>
                <Badge variant={item.status === "overdue" ? "destructive" : item.status === "soon" ? "secondary" : "default"} size="sm">
                  {item.status === "overdue" ? "Overdue" : item.status === "soon" ? "Soon" : "OK"}
                </Badge>
              </div>
              <div className="h-3 overflow-hidden rounded-sm border-2 border-border bg-card">
                <div className="h-full" style={{ width: `${Math.max(item.progress * 100, 4)}%`, background: color }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.remainingMiles > 0
                  ? `Due in ~${mileFmt(item.remainingMiles)} mi`
                  : `Overdue by ~${mileFmt(Math.abs(item.remainingMiles))} mi`}
              </div>
            </div>
          );
        })}
      </Card.Content>
    </Card>
  );
}

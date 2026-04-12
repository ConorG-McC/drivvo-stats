import type { ServiceEntry } from "@/lib/types";
import { mileFmt, statusColor, COLOR_MAP } from "@/lib/format";
import { Card } from "@/components/retroui/Card";

const SERVICE_PLAN = [
  { name: "Engine oil & filter",        intervalKm: 10000, match: (s: ServiceEntry["service_types"]) => s.some(t => /oil change/i.test(t.name)) },
  { name: "Spark plugs",                intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /spark plug/i.test(t.name)) },
  { name: "Ignition coils check",       intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /coil/i.test(t.name)) },
  { name: "Air filter",                 intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /air filter/i.test(t.name)) },
  { name: "Cabin / microfilter",        intervalKm: 20000, match: (s: ServiceEntry["service_types"]) => s.some(t => /cabin/i.test(t.name)) },
  { name: "Brake fluid",                intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /brake fluid/i.test(t.name)) },
  { name: "Coolant / water pump check", intervalKm: 40000, match: (s: ServiceEntry["service_types"]) => s.some(t => /water pump|coolant/i.test(t.name)) },
  { name: "Timing chain inspection",    intervalKm: 50000, match: (s: ServiceEntry["service_types"]) => s.some(t => /timing/i.test(t.name)) },
  { name: "Wheel alignment",            intervalKm: 20000, match: (s: ServiceEntry["service_types"]) => s.some(t => /alignment/i.test(t.name)) },
];

interface Props {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
}

export default function ServiceSchedule({ service, latestOdo }: Props) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Service schedule
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        {SERVICE_PLAN.map(item => {
          let lastOdo = 0, lastDate = "";
          service.forEach(e => {
            if (item.match(e.service_types) && e.odometer > lastOdo) {
              lastOdo = e.odometer;
              lastDate = e.date;
            }
          });
          const kmSince = lastOdo ? latestOdo - lastOdo : latestOdo;
          const remaining = item.intervalKm - kmSince;
          const pct = Math.min(kmSince / item.intervalKm, 1);
          const col = COLOR_MAP[statusColor(pct)];
          return (
            <div key={item.name} className="flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: col }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {lastDate ? `Last: ${lastDate.slice(0, 10)}` : "No record"} · every {mileFmt(item.intervalKm)} miles
                </div>
              </div>
              <div className="text-xs text-right flex-shrink-0" style={{ color: col }}>
                {remaining > 0 ? `Due in ~${mileFmt(remaining)} mi` : `Overdue ~${mileFmt(Math.abs(remaining))} mi`}
              </div>
            </div>
          );
        })}
      </Card.Content>
    </Card>
  );
}

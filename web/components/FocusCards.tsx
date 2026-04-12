import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { mileFmt, COLOR_MAP, statusColor } from "@/lib/format";
import { Card } from "@/components/retroui/Card";
import { Badge } from "@/components/retroui/Badge";

const SERVICE_PLAN = [
  { name: "Engine oil & filter", intervalKm: 10000, match: (s: ServiceEntry["service_types"]) => s.some(t => /oil change/i.test(t.name)) },
  { name: "Spark plugs",         intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /spark plug/i.test(t.name)) },
  { name: "Air filter",          intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /air filter/i.test(t.name)) },
  { name: "Cabin filter",        intervalKm: 20000, match: (s: ServiceEntry["service_types"]) => s.some(t => /cabin/i.test(t.name)) },
  { name: "Brake fluid",         intervalKm: 30000, match: (s: ServiceEntry["service_types"]) => s.some(t => /brake fluid/i.test(t.name)) },
  { name: "Wheel alignment",     intervalKm: 20000, match: (s: ServiceEntry["service_types"]) => s.some(t => /alignment/i.test(t.name)) },
];

interface Props {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
}

export default function FocusCards({ fuel, service, latestOdo }: Props) {
  // --- Oil card ---
  const sortedSvc = [...service].sort((a, b) => a.date.localeCompare(b.date));
  const lastOilChange = [...sortedSvc]
    .filter(e => e.service_types.some(t => /oil change/i.test(t.name)))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const kmSinceOil = lastOilChange ? latestOdo - lastOilChange.odometer : latestOdo;
  const oilPct = kmSinceOil / 10000;
  const oilColor = COLOR_MAP[statusColor(oilPct)];
  const topUpsSinceOil = sortedSvc.filter(e =>
    e.service_types.some(t => /oil top up/i.test(t.name)) &&
    (lastOilChange ? e.date > lastOilChange.date : true)
  );
  const oilConsumption = topUpsSinceOil.length > 0 && kmSinceOil > 0
    ? `${(topUpsSinceOil.length / kmSinceOil * 1000).toFixed(2)} L/1000mi`
    : "No top-ups";

  // --- Next due card ---
  let nextDue: { name: string; remaining: number } | null = null;
  for (const item of SERVICE_PLAN) {
    let lastOdo = 0;
    service.forEach(e => { if (item.match(e.service_types) && e.odometer > lastOdo) lastOdo = e.odometer; });
    const remaining = item.intervalKm - (lastOdo ? latestOdo - lastOdo : latestOdo);
    if (!nextDue || remaining < nextDue.remaining) nextDue = { name: item.name, remaining };
  }
  const nextPct = nextDue ? Math.min((1 - nextDue.remaining / 10000), 1) : 0;
  const nextColor = nextDue && nextDue.remaining <= 0 ? COLOR_MAP.red
    : nextDue && nextDue.remaining <= 1000 ? COLOR_MAP.amber
    : COLOR_MAP.green;

  // --- Last activity card ---
  const sortedFuel = [...fuel].sort((a, b) => a.date.localeCompare(b.date));
  const lastFill = sortedFuel[sortedFuel.length - 1];
  const lastSvc = sortedSvc[sortedSvc.length - 1];
  const daysSinceFill = lastFill ? Math.floor((Date.now() - new Date(lastFill.date).getTime()) / 86400000) : null;
  const daysSinceSvc = lastSvc ? Math.floor((Date.now() - new Date(lastSvc.date).getTime()) / 86400000) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Oil */}
      <Card>
        <Card.Header className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Oil</span>
          <Badge variant="outline" style={{ color: oilColor, borderColor: oilColor }}>
            {mileFmt(kmSinceOil)} mi since change
          </Badge>
        </Card.Header>
        <Card.Content>
          <div className="text-2xl font-bold font-head mb-3" style={{ color: oilColor }}>
            {mileFmt(10000 - kmSinceOil > 0 ? 10000 - kmSinceOil : 0)} mi remaining
          </div>
          <div className="h-2 bg-muted rounded-sm overflow-hidden mb-3">
            <div 
              className="h-full rounded-sm transition-all" 
              style={{ 
                width: `${Math.min(oilPct * 100, 100).toFixed(1)}%`, 
                background: oilColor 
              }} 
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {topUpsSinceOil.length} top-up{topUpsSinceOil.length !== 1 ? "s" : ""} since change · {oilConsumption}
          </div>
        </Card.Content>
      </Card>

      {/* Next due */}
      <Card>
        <Card.Header className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next due</span>
          <Badge variant="outline" style={{ color: nextColor, borderColor: nextColor }}>
            {nextDue && nextDue.remaining <= 0 ? "Overdue" : nextDue && nextDue.remaining <= 1000 ? "Soon" : "On track"}
          </Badge>
        </Card.Header>
        <Card.Content>
          <div className="text-2xl font-bold font-head mb-3" style={{ color: nextColor }}>
            {nextDue?.name ?? "—"}
          </div>
          <div className="h-2 bg-muted rounded-sm overflow-hidden mb-3">
            <div 
              className="h-full rounded-sm transition-all" 
              style={{ 
                width: `${Math.min(Math.max(nextPct * 100, 0), 100).toFixed(1)}%`, 
                background: nextColor 
              }} 
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {nextDue && nextDue.remaining > 0
              ? `Due in ~${mileFmt(nextDue.remaining)} mi`
              : nextDue ? `Overdue by ~${mileFmt(Math.abs(nextDue.remaining))} mi` : ""}
          </div>
        </Card.Content>
      </Card>

      {/* Last activity */}
      <Card>
        <Card.Header className="pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last activity</span>
        </Card.Header>
        <Card.Content>
          {lastFill ? (
            <>
              <div className="text-2xl font-bold font-head mb-2">{daysSinceFill}d since fill</div>
              <div className="text-xs text-muted-foreground mb-1">
                Last fill: {lastFill.date.slice(0, 10)} · £{lastFill.total_cost.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold font-head mb-2 text-muted-foreground">No fuel entries</div>
          )}
          {lastSvc ? (
            <div className="text-xs text-muted-foreground">
              Last service: {daysSinceSvc}d ago · {lastSvc.date.slice(0, 10)}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No service entries</div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

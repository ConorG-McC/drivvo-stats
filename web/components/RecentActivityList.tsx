import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { gbp } from "@/lib/format";

interface Props {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
  readonly limit?: number;
}

export default function RecentActivityList({ fuel, service, limit = 8 }: Props) {
  const events = [
    ...fuel.map((entry) => ({
      id: `fuel-${entry.fuel_entry_id}`,
      date: entry.date,
      label: "Fuel",
      detail: entry.fuel_station?.name ?? "Fuel stop",
      odometer: entry.odometer,
      cost: entry.total_cost,
    })),
    ...service.map((entry) => ({
      id: `service-${entry.service_id}`,
      date: entry.date,
      label: entry.service_types.map((type) => type.name).filter(Boolean).join(", ") || "Service",
      detail: entry.location?.name ?? "Workshop",
      odometer: entry.odometer,
      cost: entry.service_types.reduce((sum, type) => sum + (type.amount ?? 0), 0),
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  return (
    <div className="relative pl-5">
      <div className="absolute bottom-1.5 left-1.5 top-1.5 w-px bg-border" />
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full border-2 border-background bg-primary" />
            <div className="text-xs text-muted-foreground">
              {event.date.slice(0, 10)} · {event.odometer.toLocaleString()} mi
            </div>
            <div className="mt-0.5 text-sm font-semibold">{event.label}</div>
            <div className="text-xs text-muted-foreground">
              {event.detail}
              {event.cost > 0 ? ` · ${gbp(event.cost)}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { ServiceEntry } from "@/lib/types";

export interface ServicePlanItem {
  readonly name: string;
  readonly intervalMiles: number;
  readonly match: (types: ServiceEntry["service_types"]) => boolean;
}

export interface ServiceScheduleItem extends ServicePlanItem {
  readonly lastDate: string | null;
  readonly lastOdo: number | null;
  readonly milesSince: number;
  readonly remainingMiles: number;
  readonly progress: number;
  readonly status: "ok" | "soon" | "overdue";
}

export interface ServiceTypeStat {
  readonly name: string;
  readonly count: number;
  readonly spend: number;
  readonly latestDate: string;
}

export interface ServiceLocationStat {
  readonly name: string;
  readonly count: number;
  readonly spend: number;
  readonly latestDate: string;
}

export const SERVICE_PLAN: ServicePlanItem[] = [
  { name: "Engine oil & filter", intervalMiles: 10000, match: (types) => types.some((type) => /oil change/i.test(type.name)) },
  { name: "Spark plugs", intervalMiles: 30000, match: (types) => types.some((type) => /spark plug/i.test(type.name)) },
  { name: "Ignition coils check", intervalMiles: 30000, match: (types) => types.some((type) => /coil/i.test(type.name)) },
  { name: "Air filter", intervalMiles: 30000, match: (types) => types.some((type) => /air filter/i.test(type.name)) },
  { name: "Cabin / microfilter", intervalMiles: 20000, match: (types) => types.some((type) => /cabin/i.test(type.name)) },
  { name: "Brake fluid", intervalMiles: 30000, match: (types) => types.some((type) => /brake fluid/i.test(type.name)) },
  { name: "Coolant / water pump check", intervalMiles: 40000, match: (types) => types.some((type) => /water pump|coolant/i.test(type.name)) },
  { name: "Timing chain inspection", intervalMiles: 50000, match: (types) => types.some((type) => /timing/i.test(type.name)) },
  { name: "Wheel alignment", intervalMiles: 20000, match: (types) => types.some((type) => /alignment/i.test(type.name)) },
];

export function sortServiceByDate(service: ServiceEntry[]) {
  return [...service].sort((a, b) => a.date.localeCompare(b.date));
}

export function getServiceCost(entry: ServiceEntry) {
  return entry.service_types.reduce((sum, type) => sum + (type.amount ?? 0), 0);
}

export function getServiceWork(entry: ServiceEntry) {
  return entry.service_types.map((type) => type.name).filter(Boolean).join(", ") || "Service";
}

export function getLatestServiceOdo(service: ServiceEntry[]) {
  return service.length ? Math.max(...service.map((entry) => entry.odometer)) : 0;
}

export function getServiceSchedule(service: ServiceEntry[], latestOdo: number): ServiceScheduleItem[] {
  return SERVICE_PLAN.map((item) => {
    const latestMatching = [...service]
      .filter((entry) => item.match(entry.service_types))
      .sort((a, b) => b.odometer - a.odometer)[0];
    const lastOdo = latestMatching?.odometer ?? null;
    const milesSince = lastOdo == null ? latestOdo : Math.max(latestOdo - lastOdo, 0);
    const remainingMiles = item.intervalMiles - milesSince;
    const progress = Math.min(milesSince / item.intervalMiles, 1);
    const status: ServiceScheduleItem["status"] =
      remainingMiles <= 0 ? "overdue" : remainingMiles <= 1000 ? "soon" : "ok";

    return {
      ...item,
      lastDate: latestMatching?.date ?? null,
      lastOdo,
      milesSince,
      remainingMiles,
      progress,
      status,
    };
  }).sort((a, b) => a.remainingMiles - b.remainingMiles);
}

export function getServiceTypeStats(service: ServiceEntry[]): ServiceTypeStat[] {
  const stats = new Map<string, ServiceTypeStat>();

  for (const entry of service) {
    for (const type of entry.service_types) {
      const name = type.name || "Service";
      const current = stats.get(name) ?? { name, count: 0, spend: 0, latestDate: entry.date };
      stats.set(name, {
        name,
        count: current.count + 1,
        spend: current.spend + (type.amount ?? 0),
        latestDate: entry.date > current.latestDate ? entry.date : current.latestDate,
      });
    }
  }

  return Array.from(stats.values()).sort((a, b) => b.spend - a.spend);
}

export function getServiceLocationStats(service: ServiceEntry[]): ServiceLocationStat[] {
  const stats = new Map<string, ServiceLocationStat>();

  for (const entry of service) {
    const name = entry.location?.name ?? "Unknown";
    const current = stats.get(name) ?? { name, count: 0, spend: 0, latestDate: entry.date };
    stats.set(name, {
      name,
      count: current.count + 1,
      spend: current.spend + getServiceCost(entry),
      latestDate: entry.date > current.latestDate ? entry.date : current.latestDate,
    });
  }

  return Array.from(stats.values()).sort((a, b) => b.spend - a.spend);
}

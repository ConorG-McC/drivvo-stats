import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { yr, ym } from "@/lib/format";
import { getTotalFuelCost } from "@/lib/fuel-stats";
import { getServiceCost, getServiceWork } from "@/lib/service-stats";

export interface CostSummary {
  readonly fuelSpend: number;
  readonly serviceSpend: number;
  readonly totalSpend: number;
  readonly fuelCount: number;
  readonly serviceCount: number;
}

export interface YearlyCostStat {
  readonly year: string;
  readonly fuelSpend: number;
  readonly serviceSpend: number;
  readonly totalSpend: number;
  readonly fillCount: number;
  readonly serviceCount: number;
  readonly averageFuelPrice: number;
}

export interface MonthlyCostStat {
  readonly month: string;
  readonly fuelSpend: number;
  readonly serviceSpend: number;
  readonly totalSpend: number;
}

export interface CostCategoryStat {
  readonly category: string;
  readonly spend: number;
  readonly count: number;
}

export interface CostEvent {
  readonly id: string;
  readonly date: string;
  readonly kind: "Fuel" | "Service";
  readonly label: string;
  readonly location: string;
  readonly odometer: number;
  readonly cost: number;
}

export function getCostSummary(fuel: FuelEntry[], service: ServiceEntry[]): CostSummary {
  const fuelSpend = fuel.reduce((sum, entry) => sum + getTotalFuelCost(entry), 0);
  const serviceSpend = service.reduce((sum, entry) => sum + getServiceCost(entry), 0);

  return {
    fuelSpend,
    serviceSpend,
    totalSpend: fuelSpend + serviceSpend,
    fuelCount: fuel.length,
    serviceCount: service.length,
  };
}

export function getYearlyCostStats(fuel: FuelEntry[], service: ServiceEntry[]): YearlyCostStat[] {
  const stats = new Map<string, YearlyCostStat>();

  function getYear(year: string) {
    const current = stats.get(year);
    if (current) return current;
    const created = {
      year,
      fuelSpend: 0,
      serviceSpend: 0,
      totalSpend: 0,
      fillCount: 0,
      serviceCount: 0,
      averageFuelPrice: 0,
    };
    stats.set(year, created);
    return created;
  }

  const fuelPriceTotals = new Map<string, number>();

  for (const entry of fuel) {
    const year = yr(entry.date);
    const current = getYear(year);
    const fuelSpend = current.fuelSpend + getTotalFuelCost(entry);
    const fillCount = current.fillCount + 1;
    const priceTotal = (fuelPriceTotals.get(year) ?? 0) + entry.price_per_litre;
    fuelPriceTotals.set(year, priceTotal);
    stats.set(year, {
      ...current,
      fuelSpend,
      fillCount,
      totalSpend: fuelSpend + current.serviceSpend,
      averageFuelPrice: priceTotal / fillCount,
    });
  }

  for (const entry of service) {
    const year = yr(entry.date);
    const current = getYear(year);
    const serviceSpend = current.serviceSpend + getServiceCost(entry);
    stats.set(year, {
      ...current,
      serviceSpend,
      serviceCount: current.serviceCount + 1,
      totalSpend: current.fuelSpend + serviceSpend,
    });
  }

  return Array.from(stats.values()).sort((a, b) => b.year.localeCompare(a.year));
}

export function getMonthlyCostStats(fuel: FuelEntry[], service: ServiceEntry[], monthCount = 12): MonthlyCostStat[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }

  const stats = new Map<string, MonthlyCostStat>(
    months.map((month) => [month, { month, fuelSpend: 0, serviceSpend: 0, totalSpend: 0 }]),
  );

  for (const entry of fuel) {
    const month = ym(entry.date);
    const current = stats.get(month);
    if (!current) continue;
    const fuelSpend = current.fuelSpend + getTotalFuelCost(entry);
    stats.set(month, { ...current, fuelSpend, totalSpend: fuelSpend + current.serviceSpend });
  }

  for (const entry of service) {
    const month = ym(entry.date);
    const current = stats.get(month);
    if (!current) continue;
    const serviceSpend = current.serviceSpend + getServiceCost(entry);
    stats.set(month, { ...current, serviceSpend, totalSpend: current.fuelSpend + serviceSpend });
  }

  return Array.from(stats.values());
}

export function getCostCategoryStats(fuel: FuelEntry[], service: ServiceEntry[]): CostCategoryStat[] {
  const stats = new Map<string, CostCategoryStat>();
  const fuelSpend = fuel.reduce((sum, entry) => sum + getTotalFuelCost(entry), 0);
  stats.set("Fuel", { category: "Fuel", spend: fuelSpend, count: fuel.length });

  for (const entry of service) {
    for (const item of entry.service_types) {
      const category = item.name || "Service";
      const current = stats.get(category) ?? { category, spend: 0, count: 0 };
      stats.set(category, {
        category,
        spend: current.spend + (item.amount ?? 0),
        count: current.count + 1,
      });
    }
  }

  return Array.from(stats.values())
    .filter((entry) => entry.spend > 0)
    .sort((a, b) => b.spend - a.spend);
}

export function getCostEvents(fuel: FuelEntry[], service: ServiceEntry[]): CostEvent[] {
  return [
    ...fuel.map((entry) => ({
      id: `fuel-${entry.fuel_entry_id}`,
      date: entry.date,
      kind: "Fuel" as const,
      label: entry.fuel_name ?? "Fuel",
      location: entry.fuel_station?.name ?? "Fuel stop",
      odometer: entry.odometer,
      cost: getTotalFuelCost(entry),
    })),
    ...service.map((entry) => ({
      id: `service-${entry.service_id}`,
      date: entry.date,
      kind: "Service" as const,
      label: getServiceWork(entry),
      location: entry.location?.name ?? "Workshop",
      odometer: entry.odometer,
      cost: getServiceCost(entry),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

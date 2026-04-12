import type { FuelEntry } from "@/lib/types";
import { ym } from "@/lib/format";

export interface FuelRow {
  readonly entry: FuelEntry;
  readonly litres: number | null;
  readonly intervalMiles: number | null;
  readonly intervalLitres: number | null;
  readonly milesPerGallonUk: number | null;
  readonly costPerMile: number | null;
}

export interface StationStat {
  readonly station: string;
  readonly fills: number;
  readonly spend: number;
  readonly litres: number;
  readonly averagePrice: number;
  readonly latestDate: string;
}

export interface MonthlyFuelStat {
  readonly month: string;
  readonly spend: number;
  readonly fills: number;
  readonly litres: number;
}

export function sortFuelByDate(fuel: FuelEntry[]) {
  return [...fuel].sort((a, b) => a.date.localeCompare(b.date));
}

export function getFuelLitres(entry: FuelEntry) {
  if (typeof entry.litres === "number" && entry.litres > 0) return entry.litres;
  if (typeof entry.volume === "number" && entry.volume > 0) return entry.volume;
  if (entry.total_cost > 0 && entry.price_per_litre > 0) {
    return entry.total_cost / entry.price_per_litre;
  }
  return null;
}

export function getTotalFuelCost(entry: FuelEntry) {
  return entry.total_cost + (entry.total_cost_two ?? 0) + (entry.total_cost_three ?? 0);
}

export function buildFuelRows(fuel: FuelEntry[]): FuelRow[] {
  const sorted = sortFuelByDate(fuel);
  const rows = new Map<number, FuelRow>();
  let lastFullOdo: number | null = null;
  let segmentLitres = 0;
  let segmentCost = 0;
  let segmentInvalid = false;

  for (const entry of sorted) {
    const litres = getFuelLitres(entry);
    let intervalMiles: number | null = null;
    let intervalLitres: number | null = null;
    let milesPerGallonUk: number | null = null;
    let costPerMile: number | null = null;

    const entryLitres = litres ?? 0;
    const entryCost = getTotalFuelCost(entry);

    if (entry.full_tank) {
      const totalIntervalLitres = segmentLitres + entryLitres;
      const totalIntervalCost = segmentCost + entryCost;
      const distanceMiles = lastFullOdo == null ? null : entry.odometer - lastFullOdo;

      if (
        distanceMiles != null &&
        distanceMiles > 0 &&
        totalIntervalLitres > 0 &&
        !segmentInvalid &&
        !entry.missed_previous_fill
      ) {
        intervalMiles = distanceMiles;
        intervalLitres = totalIntervalLitres;
        milesPerGallonUk = distanceMiles / (totalIntervalLitres / 4.54609);
        costPerMile = totalIntervalCost / distanceMiles;
      }

      lastFullOdo = entry.odometer;
      segmentLitres = 0;
      segmentCost = 0;
      segmentInvalid = false;
    } else if (lastFullOdo != null) {
      segmentLitres += entryLitres;
      segmentCost += entryCost;
      segmentInvalid = segmentInvalid || entry.missed_previous_fill;
    }

    rows.set(entry.fuel_entry_id, {
      entry,
      litres,
      intervalMiles,
      intervalLitres,
      milesPerGallonUk,
      costPerMile,
    });
  }

  return sorted.map((entry) => rows.get(entry.fuel_entry_id)).filter((row): row is FuelRow => Boolean(row));
}

export function getMonthlyFuelStats(fuel: FuelEntry[], monthCount = 12): MonthlyFuelStat[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }

  const stats = new Map<string, MonthlyFuelStat>(
    months.map((month) => [month, { month, spend: 0, fills: 0, litres: 0 }]),
  );

  for (const entry of fuel) {
    const month = ym(entry.date);
    const current = stats.get(month);
    const litres = getFuelLitres(entry) ?? 0;
    if (current) {
      stats.set(month, {
        month,
        spend: current.spend + getTotalFuelCost(entry),
        fills: current.fills + 1,
        litres: current.litres + litres,
      });
    }
  }

  return Array.from(stats.values());
}

export function getStationStats(fuel: FuelEntry[]): StationStat[] {
  const stats = new Map<string, StationStat>();

  for (const entry of fuel) {
    const station = entry.fuel_station?.name ?? "Unknown";
    const current = stats.get(station) ?? {
      station,
      fills: 0,
      spend: 0,
      litres: 0,
      averagePrice: 0,
      latestDate: entry.date,
    };
    const litres = getFuelLitres(entry) ?? 0;
    const spend = current.spend + getTotalFuelCost(entry);
    const totalLitres = current.litres + litres;

    stats.set(station, {
      station,
      fills: current.fills + 1,
      spend,
      litres: totalLitres,
      averagePrice: totalLitres > 0 ? spend / totalLitres : 0,
      latestDate: entry.date > current.latestDate ? entry.date : current.latestDate,
    });
  }

  return Array.from(stats.values()).sort((a, b) => b.spend - a.spend);
}

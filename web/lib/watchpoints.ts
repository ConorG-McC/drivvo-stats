import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { buildFuelRows, getTotalFuelCost, sortFuelByDate } from "@/lib/fuel-stats";
import { gbp, mileFmt } from "@/lib/format";
import { getServiceCost, getServiceSchedule, sortServiceByDate } from "@/lib/service-stats";

export interface WatchPoint {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly severity: "info" | "watch" | "urgent";
  readonly scope: "fuel" | "service" | "general";
}

interface WatchPointInput {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
  readonly fuelError?: string | null;
  readonly serviceError?: string | null;
}

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

interface FuelWatchPointInput {
  readonly fuel: FuelEntry[];
  readonly fuelError?: string | null;
}

interface ServiceWatchPointInput {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
  readonly serviceError?: string | null;
}

function hasOdometerDrop(entries: ReadonlyArray<{ readonly date: string; readonly odometer: number }>) {
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  return sortedEntries.some((entry, index) => {
    const previous = sortedEntries[index - 1];
    return previous ? entry.odometer < previous.odometer : false;
  });
}

export function getFuelWatchPoints({ fuel, fuelError }: FuelWatchPointInput): WatchPoint[] {
  const points: WatchPoint[] = [];

  if (fuelError) {
    points.push({
      id: "fuel-unavailable",
      title: "Fuel data unavailable",
      detail: "Fuel economy, price, and fill-up checks are paused until fuel data loads.",
      severity: "watch",
      scope: "fuel",
    });
  }

  const sortedFuel = sortFuelByDate(fuel);
  const latestFuel = sortedFuel.at(-1);

  if (latestFuel) {
    const fillGap = daysSince(latestFuel.date);
    if (fillGap > 45) {
      points.push({
        id: "old-fuel",
        title: "No recent fuel record",
        detail: `Last fill-up was ${fillGap} days ago at ${latestFuel.odometer.toLocaleString()} mi.`,
        severity: "info",
        scope: "fuel",
      });
    }
  } else if (!fuelError) {
    points.push({
      id: "no-fuel",
      title: "No fuel records",
      detail: "Fuel economy and pump price trends need fill-up data.",
      severity: "info",
      scope: "fuel",
    });
  }

  const fuelRows = buildFuelRows(fuel).filter((row) => row.milesPerGallonUk != null);
  if (fuelRows.length >= 6) {
    const recent = fuelRows.slice(-3).map((row) => row.milesPerGallonUk ?? 0);
    const earlier = fuelRows.slice(0, -3).map((row) => row.milesPerGallonUk ?? 0);
    const recentAverage = average(recent);
    const earlierAverage = average(earlier);
    if (earlierAverage && recentAverage < earlierAverage * 0.9) {
      points.push({
        id: "fuel-economy-drop",
        title: "Fuel economy dropped",
        detail: `Recent average is ${recentAverage.toFixed(1)} mpg vs ${earlierAverage.toFixed(1)} mpg before.`,
        severity: "watch",
        scope: "fuel",
      });
    }
  }

  if (fuel.length >= 8 && latestFuel) {
    const averageFuelCost = average(sortedFuel.slice(0, -1).map((entry) => getTotalFuelCost(entry)));
    const latestCost = getTotalFuelCost(latestFuel);
    if (averageFuelCost && latestCost > averageFuelCost * 1.35) {
      points.push({
        id: "large-fill",
        title: "Latest fill-up was high",
        detail: `${gbp(latestCost)} vs an average of ${gbp(averageFuelCost)} for previous fills.`,
        severity: "info",
        scope: "fuel",
      });
    }
  }

  if (hasOdometerDrop(fuel.map((entry) => ({ date: entry.date, odometer: entry.odometer })))) {
    points.push({
      id: "fuel-odometer-drop",
      title: "Fuel odometer data may need review",
      detail: "At least one later fuel record has a lower odometer reading than the previous fuel record.",
      severity: "watch",
      scope: "fuel",
    });
  }

  return points.slice(0, 8);
}

export function getServiceWatchPoints({
  service,
  latestOdo,
  serviceError,
}: ServiceWatchPointInput): WatchPoint[] {
  const points: WatchPoint[] = [];

  if (serviceError) {
    points.push({
      id: "service-unavailable",
      title: "Service data unavailable",
      detail: "Service schedule and maintenance checks are paused until service data loads.",
      severity: "watch",
      scope: "service",
    });
  }

  const sortedService = sortServiceByDate(service);
  const latestService = sortedService.at(-1);

  if (latestService) {
    const serviceGap = daysSince(latestService.date);
    const milesSince = Math.max(latestOdo - latestService.odometer, 0);
    if (serviceGap > 365 || milesSince > 10000) {
      points.push({
        id: "old-service",
        title: "Service record is getting old",
        detail: `Last service was ${serviceGap} days and ${mileFmt(milesSince)} mi ago.`,
        severity: milesSince > 15000 ? "urgent" : "watch",
        scope: "service",
      });
    }
  } else if (!serviceError) {
    points.push({
      id: "no-service",
      title: "No service records",
      detail: "Maintenance schedule checks need service history.",
      severity: "info",
      scope: "service",
    });
  }

  const schedule = serviceError ? [] : getServiceSchedule(service, latestOdo);
  const overdueItems = schedule.filter((item) => item.status === "overdue").slice(0, 3);
  for (const item of overdueItems) {
    points.push({
      id: `overdue-${item.name}`,
      title: `${item.name} overdue`,
      detail: `Overdue by ~${mileFmt(Math.abs(item.remainingMiles))} mi.`,
      severity: "urgent",
      scope: "service",
    });
  }

  const dueSoonItems = schedule.filter((item) => item.status === "soon").slice(0, 2);
  for (const item of dueSoonItems) {
    points.push({
      id: `soon-${item.name}`,
      title: `${item.name} due soon`,
      detail: `Due in ~${mileFmt(item.remainingMiles)} mi.`,
      severity: "watch",
      scope: "service",
    });
  }

  const largestService = [...service].sort((a, b) => getServiceCost(b) - getServiceCost(a))[0];
  if (largestService && getServiceCost(largestService) > 500) {
    points.push({
      id: "large-service",
      title: "Large service cost logged",
      detail: `${gbp(getServiceCost(largestService))} on ${largestService.date.slice(0, 10)}.`,
      severity: "info",
      scope: "service",
    });
  }

  if (hasOdometerDrop(service.map((entry) => ({ date: entry.date, odometer: entry.odometer })))) {
    points.push({
      id: "service-odometer-drop",
      title: "Service odometer data may need review",
      detail: "At least one later service record has a lower odometer reading than the previous service record.",
      severity: "watch",
      scope: "service",
    });
  }

  return points.slice(0, 8);
}

export function getGeneralWatchPoints({
  fuel,
  service,
}: Pick<WatchPointInput, "fuel" | "service">): WatchPoint[] {
  const points: WatchPoint[] = [];
  const odometerEntries = [
    ...fuel.map((entry) => ({ date: entry.date, odometer: entry.odometer })),
    ...service.map((entry) => ({ date: entry.date, odometer: entry.odometer })),
  ];
  if (hasOdometerDrop(odometerEntries)) {
    points.push({
      id: "odometer-drop",
      title: "Odometer data may need review",
      detail: "At least one later record has a lower odometer reading than the previous record.",
      severity: "watch",
      scope: "general",
    });
  }

  return points;
}

export function getWatchPoints(input: WatchPointInput): WatchPoint[] {
  return [
    ...getFuelWatchPoints({ fuel: input.fuel, fuelError: input.fuelError }),
    ...getServiceWatchPoints({
      service: input.service,
      latestOdo: input.latestOdo,
      serviceError: input.serviceError,
    }),
    ...getGeneralWatchPoints({ fuel: input.fuel, service: input.service }),
  ].slice(0, 8);
}

import FuelConsumptionTrend from "@/components/fuel/FuelConsumptionTrend";
import FuelFillupTable from "@/components/fuel/FuelFillupTable";
import FuelInsightCards from "@/components/fuel/FuelInsightCards";
import FuelMethodNote from "@/components/fuel/FuelMethodNote";
import FuelMonthlySpend from "@/components/fuel/FuelMonthlySpend";
import FuelPriceTrend from "@/components/fuel/FuelPriceTrend";
import FuelStationBreakdown from "@/components/fuel/FuelStationBreakdown";
import FuelSummaryCards from "@/components/fuel/FuelSummaryCards";
import WatchPoints from "@/components/WatchPoints";
import type { FuelEntry } from "@/lib/types";
import {
  buildFuelRows,
  getFuelLitres,
  getMonthlyFuelStats,
  getStationStats,
  getTotalFuelCost,
  sortFuelByDate,
} from "@/lib/fuel-stats";
import { getFuelWatchPoints } from "@/lib/watchpoints";

interface Props {
  readonly fuel: FuelEntry[];
  readonly fuelError?: string | null;
}

export default function FuelPageContent({ fuel, fuelError }: Props) {
  const sortedFuel = sortFuelByDate(fuel);
  const fuelRows = buildFuelRows(fuel);
  const economyRows = fuelRows.filter((row) => row.milesPerGallonUk != null);
  const monthlyStats = getMonthlyFuelStats(fuel, 12);
  const stationStats = getStationStats(fuel).slice(0, 6);

  const totalSpend = fuel.reduce((sum, entry) => sum + getTotalFuelCost(entry), 0);
  const totalLitres = fuel.reduce((sum, entry) => sum + (getFuelLitres(entry) ?? 0), 0);
  const totalDistance =
    sortedFuel.length > 1 ? sortedFuel[sortedFuel.length - 1].odometer - sortedFuel[0].odometer : 0;
  const averagePrice = totalLitres > 0 ? totalSpend / totalLitres : 0;
  const averageEconomy = economyRows.length
    ? economyRows.reduce((sum, row) => sum + (row.milesPerGallonUk ?? 0), 0) / economyRows.length
    : 0;
  const averageCostPerMile = economyRows.length
    ? economyRows.reduce((sum, row) => sum + (row.costPerMile ?? 0), 0) / economyRows.length
    : 0;
  const latestRow = fuelRows[fuelRows.length - 1];
  const bestRow = [...economyRows].sort(
    (a, b) => (b.milesPerGallonUk ?? 0) - (a.milesPerGallonUk ?? 0),
  )[0];
  const worstRow = [...economyRows].sort(
    (a, b) =>
      (a.milesPerGallonUk ?? Number.POSITIVE_INFINITY) -
      (b.milesPerGallonUk ?? Number.POSITIVE_INFINITY),
  )[0];
  const watchpoints = getFuelWatchPoints({ fuel, fuelError });

  return (
    <>
      <FuelSummaryCards
        fillCount={fuel.length}
        totalSpend={totalSpend}
        totalLitres={totalLitres}
        totalDistance={totalDistance}
        averagePrice={averagePrice}
        averageEconomy={averageEconomy}
        averageCostPerMile={averageCostPerMile}
        latestRow={latestRow}
      />
      <div className="mb-8">
        <WatchPoints
          watchpoints={watchpoints}
          title="Fuel watchpoints"
          description="Fuel-specific checks from fill-ups, economy, prices, and odometer readings."
          emptyMessage="No fuel watchpoints from the current records."
        />
      </div>
      <FuelInsightCards
        rows={fuelRows}
        economyRows={economyRows}
        monthlyStats={monthlyStats}
        latestFill={latestRow?.entry}
        averageEconomy={averageEconomy}
        averagePrice={averagePrice}
      />
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FuelConsumptionTrend rows={economyRows} />
        </div>
        <FuelMethodNote bestRow={bestRow} worstRow={worstRow} latestRow={latestRow} />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FuelMonthlySpend months={monthlyStats} />
        <FuelPriceTrend rows={fuelRows} />
      </div>
      <div className="mb-8">
        <FuelStationBreakdown stations={stationStats} />
      </div>
      <FuelFillupTable rows={[...fuelRows].reverse().slice(0, 24)} />
    </>
  );
}

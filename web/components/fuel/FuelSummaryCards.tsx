import MetricCard from "@/components/MetricCard";
import type { FuelRow } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";
import { economyFmt, litresFmt, pricePerLitreFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly fillCount: number;
  readonly totalSpend: number;
  readonly totalLitres: number;
  readonly totalDistance: number;
  readonly averagePrice: number;
  readonly averageEconomy: number;
  readonly averageCostPerMile: number;
  readonly latestRow?: FuelRow;
}

export default function FuelSummaryCards({
  fillCount,
  totalSpend,
  totalLitres,
  totalDistance,
  averagePrice,
  averageEconomy,
  averageCostPerMile,
  latestRow,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard label="Fuel spend" value={gbp(totalSpend)} detail={`${fillCount} fill-ups logged`} />
      <MetricCard
        label="Estimated fuel"
        value={litresFmt(totalLitres)}
        detail={`${totalDistance.toLocaleString()} miles covered`}
      />
      <MetricCard label="Average p/l" value={pricePerLitreFmt(averagePrice)} />
      <MetricCard
        label="Average economy"
        value={averageEconomy ? economyFmt(averageEconomy) : "-"}
        detail={averageCostPerMile ? `${gbp(averageCostPerMile)} per mile` : "Full-tank intervals only"}
      />
      <MetricCard
        label="Latest fill"
        value={latestRow ? gbp(latestRow.entry.total_cost) : "-"}
        detail={
          latestRow
            ? `${latestRow.entry.date.slice(0, 10)} · ${latestRow.entry.odometer.toLocaleString()} mi`
            : "No fill-ups"
        }
      />
    </div>
  );
}

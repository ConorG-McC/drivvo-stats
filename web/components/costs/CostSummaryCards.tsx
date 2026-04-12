import MetricCard from "@/components/MetricCard";
import { gbp } from "@/lib/format";
import type { CostSummary } from "@/lib/cost-stats";

interface Props {
  readonly summary: CostSummary;
}

export default function CostSummaryCards({ summary }: Props) {
  const fuelShare = summary.totalSpend ? Math.round((summary.fuelSpend / summary.totalSpend) * 100) : 0;
  const serviceShare = summary.totalSpend ? Math.round((summary.serviceSpend / summary.totalSpend) * 100) : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total logged" value={gbp(summary.totalSpend)} />
      <MetricCard label="Fuel" value={gbp(summary.fuelSpend)} detail={`${summary.fuelCount} fill-ups · ${fuelShare}%`} />
      <MetricCard label="Service" value={gbp(summary.serviceSpend)} detail={`${summary.serviceCount} records · ${serviceShare}%`} />
      <MetricCard
        label="Average event"
        value={summary.fuelCount + summary.serviceCount ? gbp(summary.totalSpend / (summary.fuelCount + summary.serviceCount)) : "-"}
        detail="Fuel and service records"
      />
    </div>
  );
}

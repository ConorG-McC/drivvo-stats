import CostCategoryTable from "@/components/costs/CostCategoryTable";
import CostEventsTable from "@/components/costs/CostEventsTable";
import CostMonthlyTrend from "@/components/costs/CostMonthlyTrend";
import CostSummaryCards from "@/components/costs/CostSummaryCards";
import CostYearlyTable from "@/components/costs/CostYearlyTable";
import type { FuelEntry, ServiceEntry } from "@/lib/types";
import {
  getCostCategoryStats,
  getCostEvents,
  getCostSummary,
  getMonthlyCostStats,
  getYearlyCostStats,
} from "@/lib/cost-stats";

interface Props {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
}

export default function CostPageContent({ fuel, service }: Props) {
  const summary = getCostSummary(fuel, service);
  const months = getMonthlyCostStats(fuel, service);
  const years = getYearlyCostStats(fuel, service);
  const categories = getCostCategoryStats(fuel, service);
  const events = getCostEvents(fuel, service);

  return (
    <>
      <CostSummaryCards summary={summary} />
      <div className="mb-8">
        <CostMonthlyTrend months={months} />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CostYearlyTable years={years} />
        <CostCategoryTable categories={categories} />
      </div>
      <CostEventsTable events={events} />
    </>
  );
}

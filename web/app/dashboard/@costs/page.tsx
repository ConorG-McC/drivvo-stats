import { getDashboardData } from "@/lib/dashboard-data";
import { getCostSummary, getMonthlyCostStats } from "@/lib/cost-stats";
import CostDashboardPanel from "@/components/costs/CostDashboardPanel";
import DataLoadNotice from "@/components/DataLoadNotice";

export default async function DashboardCostsSlot() {
  const { fuel, service, fuelError, serviceError } = await getDashboardData();
  const summary = getCostSummary(fuel, service);
  const months = getMonthlyCostStats(fuel, service, 6);

  return (
    <div className="h-full">
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelError },
          { source: "Service", message: serviceError },
        ]}
        className="mb-4"
      />
      <CostDashboardPanel
        summary={summary}
        months={months}
        fuelError={fuelError}
        serviceError={serviceError}
      />
    </div>
  );
}

import AppNav from "@/components/AppNav";
import CostPageContent from "@/components/costs/CostPageContent";
import DataLoadNotice from "@/components/DataLoadNotice";
import RouteHeader from "@/components/RouteHeader";
import { getFuelData, getServiceData } from "@/lib/dashboard-data";

export default async function CostsPage() {
  const [fuelResult, serviceResult] = await Promise.all([getFuelData(), getServiceData()]);
  const fuel = fuelResult.data;
  const service = serviceResult.data;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <RouteHeader
        eyebrow="Costs"
        title="Ownership Costs"
        description="Fuel, service, and maintenance spend grouped into the totals that matter."
      />
      <AppNav className="mb-8" />
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelResult.error },
          { source: "Service", message: serviceResult.error },
        ]}
      />
      <CostPageContent fuel={fuel} service={service} />
    </main>
  );
}

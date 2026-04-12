import AppNav from "@/components/AppNav";
import DataLoadNotice from "@/components/DataLoadNotice";
import RouteHeader from "@/components/RouteHeader";
import ServicePageContent from "@/components/service/ServicePageContent";
import { getFuelData, getServiceData } from "@/lib/dashboard-data";

export default async function ServicesPage() {
  const [serviceResult, fuelResult] = await Promise.all([getServiceData(), getFuelData()]);
  const latestOdo = Math.max(
    0,
    ...serviceResult.data.map((entry) => entry.odometer),
    ...fuelResult.data.map((entry) => entry.odometer),
  );

  return (
    <main className="mx-auto max-w-7xl p-6">
      <RouteHeader
        eyebrow="Services"
        title="Service Records"
        description="Maintenance history, service intervals, spend by work, and workshop breakdowns."
      />
      <AppNav className="mb-8" />
      <DataLoadNotice
        errors={[
          { source: "Service", message: serviceResult.error },
          { source: "Fuel", message: fuelResult.error },
        ]}
      />
      <ServicePageContent
        service={serviceResult.data}
        latestOdo={latestOdo}
        serviceError={serviceResult.error}
      />
    </main>
  );
}

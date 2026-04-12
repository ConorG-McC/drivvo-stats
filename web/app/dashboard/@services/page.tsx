import DataLoadNotice from "@/components/DataLoadNotice";
import ServiceDashboardPanel from "@/components/service/ServiceDashboardPanel";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardServicesSlot() {
  const { service, latestOdo, serviceError } = await getDashboardData();

  return (
    <div className="h-full">
      <DataLoadNotice errors={[{ source: "Service", message: serviceError }]} className="mb-4" />
      <ServiceDashboardPanel service={service} latestOdo={latestOdo} serviceError={serviceError} />
    </div>
  );
}

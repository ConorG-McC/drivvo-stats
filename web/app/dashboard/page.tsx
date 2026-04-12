import { getDashboardData } from "@/lib/dashboard-data";
import DataLoadNotice from "@/components/DataLoadNotice";
import Header from "@/components/Header";

export default async function DashboardPage() {
  const { vehicle, latestOdo, fuelError, serviceError } = await getDashboardData();

  return (
    <>
      <Header vehicle={vehicle} latestOdo={latestOdo} />
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelError },
          { source: "Service", message: serviceError },
        ]}
      />
    </>
  );
}

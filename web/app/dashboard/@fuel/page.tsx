import FuelDashboardPanel from "@/components/fuel/FuelDashboardPanel";
import DataLoadNotice from "@/components/DataLoadNotice";
import { getFuelData } from "@/lib/dashboard-data";

export default async function DashboardFuelSlot() {
  const fuelResult = await getFuelData();
  return (
    <div className="h-full">
      <DataLoadNotice errors={[{ source: "Fuel", message: fuelResult.error }]} className="mb-4" />
      <FuelDashboardPanel fuel={fuelResult.data} fuelError={fuelResult.error} />
    </div>
  );
}

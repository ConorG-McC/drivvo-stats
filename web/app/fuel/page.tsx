import AppNav from "@/components/AppNav";
import DataLoadNotice from "@/components/DataLoadNotice";
import FuelPageContent from "@/components/fuel/FuelPageContent";
import RouteHeader from "@/components/RouteHeader";
import { getFuelData } from "@/lib/dashboard-data";

export default async function FuelPage() {
  const fuelResult = await getFuelData();

  return (
    <main className="mx-auto max-w-7xl p-6">
      <RouteHeader
        eyebrow="Fuel"
        title="Fuel Log"
        description="Fill-ups, pump prices, estimated litres, and full-tank consumption."
      />
      <AppNav className="mb-8" />
      <DataLoadNotice errors={[{ source: "Fuel", message: fuelResult.error }]} />
      <FuelPageContent fuel={fuelResult.data} fuelError={fuelResult.error} />
    </main>
  );
}

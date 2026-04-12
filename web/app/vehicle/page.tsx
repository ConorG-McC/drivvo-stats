import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getVehicles } from "@/lib/drivvo";
import VehiclePicker from "./VehiclePicker";

export default async function VehiclePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("drivvo_token")?.value;
  if (!token) redirect("/login");

  let vehicles;
  try {
    vehicles = await getVehicles(token);
  } catch {
    redirect("/login");
  }

  // if only one active vehicle, skip the picker
  const active = vehicles.filter(v => v.active);
  if (active.length === 1) {
    // set cookie server-side isn't possible in a server component — let client do it
  }

  return <VehiclePicker vehicles={vehicles} />;
}

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFuelEntries, getServiceEntries, getVehicles } from "@/lib/drivvo";
import type { FuelEntry, ServiceEntry } from "@/lib/types";

interface OptionalData<T> {
  readonly data: T;
  readonly error: string | null;
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Unable to load data";
}

async function optional<T>(promise: Promise<T>, fallback: T): Promise<OptionalData<T>> {
  try {
    return { data: await promise, error: null };
  } catch (err) {
    return { data: fallback, error: errorMessage(err) };
  }
}

export const getVehicleContext = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("drivvo_token")?.value;
  const vehicleId = cookieStore.get("drivvo_vehicle_id")?.value;

  if (!token) redirect("/login");
  if (!vehicleId) redirect("/vehicle");

  try {
    const vehicles = await getVehicles(token);
    const vehicle = vehicles.find((item) => String(item.vehicle_id) === vehicleId);
    if (!vehicle) redirect("/vehicle");
    return { token, vehicleId, vehicle, vehicles };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED") redirect("/login");
    throw err;
  }
});

const getFuelDataForVehicle = cache(
  async (token: string, vehicleId: string): Promise<OptionalData<FuelEntry[]>> => {
    return optional(getFuelEntries(token, vehicleId), []);
  },
);

const getServiceDataForVehicle = cache(
  async (token: string, vehicleId: string): Promise<OptionalData<ServiceEntry[]>> => {
    return optional(getServiceEntries(token, vehicleId), []);
  },
);

export const getFuelData = cache(async (): Promise<OptionalData<FuelEntry[]>> => {
  const { token, vehicleId } = await getVehicleContext();
  return getFuelDataForVehicle(token, vehicleId);
});

export const getServiceData = cache(async (): Promise<OptionalData<ServiceEntry[]>> => {
  const { token, vehicleId } = await getVehicleContext();
  return getServiceDataForVehicle(token, vehicleId);
});

export const getDashboardData = cache(async () => {
  const context = await getVehicleContext();
  const [fuelResult, serviceResult] = await Promise.all([
    getFuelDataForVehicle(context.token, context.vehicleId),
    getServiceDataForVehicle(context.token, context.vehicleId),
  ]);
  const fuel = fuelResult.data;
  const service = serviceResult.data;
  const latestOdo = Math.max(
    0,
    ...fuel.map((entry) => entry.odometer),
    ...service.map((entry) => entry.odometer),
  );

  return {
    ...context,
    fuel,
    service,
    latestOdo,
    fuelError: fuelResult.error,
    serviceError: serviceResult.error,
  };
});

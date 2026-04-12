import { createHash } from "crypto";
import type { FuelEntry, ServiceEntry } from "./types";
import { renameKeysDeep, FUEL_ES_TO_EN, SERVICE_ES_TO_EN } from "./translate";
import { getCached, setCached } from "./cache";

const BASE_URL = "https://api.drivvo.com";

export function md5(str: string) {
  return createHash("md5").update(str, "utf8").digest("hex");
}

export interface Vehicle {
  vehicle_id: number;
  vehicle_name: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  active: boolean;
}

async function drivvoGet(path: string, token: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Token": token },
    cache: "no-store", // we handle caching ourselves
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`Drivvo API error ${res.status}`);
  return res.json();
}

export async function drivvoLogin(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/autenticacao/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: md5(password), idioma: "en" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json() as { token?: string };
  if (!data.token) throw new Error("No token in response");
  return data.token;
}

export async function getVehicles(token: string): Promise<Vehicle[]> {
  const key = `${token}:vehicles`;
  const cached = getCached<Vehicle[]>(key);
  if (cached) return cached;
  const raw = await drivvoGet("/veiculo/web", token);
  // vehicles endpoint returns array directly, keys are already partially english
  // but we map the ones we need
  const vehicles = (raw as Record<string, unknown>[]).map(v => ({
    vehicle_id: v.id_veiculo as number,
    vehicle_name: v.nome as string,
    make: v.marca as string,
    model: v.modelo as string,
    plate: v.placa as string,
    year: v.ano as number,
    active: v.ativo as boolean,
  }));
  setCached(key, vehicles);
  return vehicles;
}

export async function getFuelEntries(token: string, vehicleId: string): Promise<FuelEntry[]> {
  const key = `${token}:${vehicleId}:fuel`;
  const cached = getCached<FuelEntry[]>(key);
  if (cached) return cached;
  const raw = await drivvoGet(`/veiculo/${vehicleId}/abastecimento/web`, token);
  const data = renameKeysDeep(raw, FUEL_ES_TO_EN) as FuelEntry[];
  setCached(key, data);
  return data;
}

export async function getServiceEntries(token: string, vehicleId: string): Promise<ServiceEntry[]> {
  const key = `${token}:${vehicleId}:service`;
  const cached = getCached<ServiceEntry[]>(key);
  if (cached) return cached;
  const raw = await drivvoGet(`/veiculo/${vehicleId}/servico/web`, token);
  const data = renameKeysDeep(raw, SERVICE_ES_TO_EN) as ServiceEntry[];
  setCached(key, data);
  return data;
}

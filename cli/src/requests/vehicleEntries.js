import { config } from "../config/config.js";
import { saveJsonToFile } from "../utilities/util.js";
import { renameKeysDeep } from "../transforms/deepTranslate.js";
import { VEHICLE_ES_TO_EN } from "../transforms/fieldDictionaries.js";

export async function getVehicles(
  token,
  initial = false,
  vehicles = null,
  translate = true,
) {
  const vehicleEndpoint = `${config.baseUrl}${config.vehicleEndpoint}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": token,
    },
    redirect: "follow",
  };

  try {
    let result = vehicles ?? null;
    const files = [];

    if (initial) {
      const response = await fetch(vehicleEndpoint, requestOptions);
      result = await response.json();
    } else {
      const spanishPath = await saveJsonToFile(`spanish/vehicles.es.json`, result);
      files.push(spanishPath);
      if (translate) {
        const translated = renameKeysDeep(result, VEHICLE_ES_TO_EN);
        const englishPath = await saveJsonToFile(
          `english/vehicles.en.json`,
          translated,
        );
        files.push(englishPath);
      }
    }

    return { data: result, files };
  } catch (error) {
    console.error(error);
    return { data: null, files: [] };
  }
}

export function logVehicleSummary(vehicles) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    console.log("No vehicles returned from Drivvo.");
    return;
  }

  console.log("\nAvailable vehicles:");
  const tableData = vehicles.map((vehicle, index) => ({
    "#": index + 1,
    Plate: vehicle.placa,
    Name: vehicle.nome,
    Make: vehicle.marca,
    Model: vehicle.modelo,
    Year: vehicle.ano,
  }));
  console.table(tableData);
}

export function describeVehicle(vehicle) {
  if (!vehicle) {
    console.log("No vehicle selected.");
    return;
  }

  console.log("\n=== Selected Vehicle ===");
  const makeModel = [vehicle.marca, vehicle.modelo].filter(Boolean).join(" ");
  const details = [
    `Plate: ${vehicle.placa ?? "N/A"}`,
    `Name: ${vehicle.nome ?? "N/A"}`,
    `Make/Model: ${makeModel || "N/A"}`,
    `Year: ${vehicle.ano ?? "N/A"}`,
    `Fuel Type ID: ${vehicle.id_tipo_combustivel ?? "N/A"}`,
    `Active: ${vehicle.ativo ? "Yes" : "No"}`,
    `Primary Vehicle: ${vehicle.principal ? "Yes" : "No"}`,
  ];

  for (const line of details) {
    console.log(`  ${line}`);
  }
}

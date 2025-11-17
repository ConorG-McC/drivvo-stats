import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { logVehicleSummary } from "../requests/vehicleEntries.js";

function normalizeAnswer(answer) {
  return answer?.trim().toLowerCase() ?? "";
}

async function confirm(rl, question, defaultValue) {
  const suffix = defaultValue ? "[Y/n]" : "[y/N]";
  const answer = normalizeAnswer(await rl.question(`${question} ${suffix} `));

  if (!answer) {
    return defaultValue;
  }
  if (["y", "yes"].includes(answer)) {
    return true;
  }
  if (["n", "no"].includes(answer)) {
    return false;
  }

  console.warn(
    `Unrecognized response "${answer}", using default (${defaultValue}).`,
  );
  return defaultValue;
}

function selectVehicleFromAnswer(answer, vehicles) {
  const normalized = normalizeAnswer(answer);

  if (!normalized) {
    return vehicles.at(-1);
  }

  const maybeNumber = Number.parseInt(normalized, 10);
  if (!Number.isNaN(maybeNumber)) {
    const index = maybeNumber - 1; // display is 1-based
    if (index >= 0 && index < vehicles.length) {
      return vehicles[index];
    }
    console.warn(`Vehicle number ${maybeNumber} is out of range.`);
    return vehicles.at(-1);
  }

  const byPlate = vehicles.find(
    (vehicle) => vehicle.placa?.toLowerCase() === normalized,
  );
  if (byPlate) {
    return byPlate;
  }

  console.warn(
    `Unable to find vehicle with plate "${answer}", using the latest one.`,
  );
  return vehicles.at(-1);
}

export async function collectInteractiveOptions(vehicles, defaults) {
  const rl = readline.createInterface({ input, output });
  try {

    console.log("\n=== Vehicle List ===");
    logVehicleSummary(vehicles);

    const fetchVehicles = await confirm(
      rl,
      "Save these vehicle entries?",
      defaults.fetchPlan.vehicles,
    );

    const vehicleAnswer = await rl.question(
      "\nSelect a vehicle by number or plate (default: last vehicle): ",
    );
    const vehicle = selectVehicleFromAnswer(vehicleAnswer, vehicles);

    const fetchFuelling = await confirm(
      rl,
      "Fetch fuelling entries?",
      defaults.fetchPlan.fuelling,
    );
    const fetchServicing = await confirm(
      rl,
      "Fetch servicing entries?",
      defaults.fetchPlan.servicing,
    );
    const fetchExpenses = await confirm(
      rl,
      "Fetch expense entries?",
      defaults.fetchPlan.expenses,
    );

    const translate = await confirm(
      rl,
      "Translate JSON responses to English?",
      defaults.translate,
    );

    return {
      vehicle,
      fetchPlan: {
        vehicles: fetchVehicles,
        fuelling: fetchFuelling,
        servicing: fetchServicing,
        expenses: fetchExpenses,
      },
      translate,
    };
  } finally {
    rl.close();
  }
}

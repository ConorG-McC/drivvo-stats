import dotenv from "dotenv";

dotenv.config();

import { login } from "./requests/login.js";
import {
  getVehicles,
  describeVehicle,
} from "./requests/vehicleEntries.js";
import { collectInteractiveOptions } from "./utilities/interactive.js";
import { logFetchPlanSummary, validateEnvironment } from "./utilities/util.js";
import { runRequestsByOptions } from "./requests/requestsByOptions.js";

const DEFAULT_FETCH_PLAN = {
  vehicles: true,
  fuelling: true,
  servicing: true,
  expenses: true,
};

const DEFAULT_PROMPT_SETTINGS = {
  fetchPlan: DEFAULT_FETCH_PLAN,
  translate: true,
};


async function main() {
  if (!validateEnvironment()) {
    process.exitCode = 1;
    return;
  }

  const authToken = await login();

  if (!authToken) {
    console.error("Failed to retrieve auth token, aborting requests.");
    return;
  }

  const vehicleResponse = await getVehicles(authToken, true);
  const vehicles = vehicleResponse?.data;

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    console.error("Drivvo did not return any vehicles for this account.");
    return;
  }

  const userSelectedOptions = await collectInteractiveOptions(
    vehicles,
    DEFAULT_PROMPT_SETTINGS,
  );

  if (!userSelectedOptions.vehicle) {
    console.error("Unable to determine which vehicle to use.");
    return;
  }

  describeVehicle(userSelectedOptions.vehicle);
  logFetchPlanSummary(
    userSelectedOptions.fetchPlan,
    userSelectedOptions.translate,
  );

  if (userSelectedOptions.fetchPlan.vehicles) {
    const saveResult = await getVehicles(
      authToken,
      false,
      vehicles,
      userSelectedOptions.translate,
    );
    if (saveResult?.files?.length) {
      console.log("\nVehicle entries saved to:");
      for (const file of saveResult.files) {
        console.log(`  - ${file}`);
      }
    }
  }

  console.log(`\nProceeding with Vehicle: ${userSelectedOptions.vehicle.placa}`);
  const chosenVehicleId = userSelectedOptions.vehicle.id_veiculo;

  if (chosenVehicleId) {
    await runRequestsByOptions(authToken, chosenVehicleId, userSelectedOptions);
  }
}

await main();

import dotenv from 'dotenv';

dotenv.config();

import { login } from './requests/login.js';
import { getVehicles, filterVehicles } from './requests/vehicleEntries.js';
import { getFuellingEntries } from './requests/fuellingEntries.js';
import { getServicingEntries } from './requests/servicingEntries.js';
import {
  addExpenseEntries,
  deleteExpenseEntries,
} from './requests/expenseEntries.js';
import { args } from './config/config.js';

async function main() {
  const authToken = await login();

  if (!authToken) {
    console.error('Failed to retrieve auth token, aborting requests.');
    return;
  }

  const vehicles = await getVehicles(authToken);
  const chosenVehicleId = filterVehicles(vehicles);

  if (args.custom) {
    console.log('custom functionality has been enabled.');
    // await addExpenseEntries(authToken, chosenVehicleId);
    // await deleteExpenseEntries(authToken, chosenVehicleId);
    return;
  }

  if (chosenVehicleId) {
    await getFuellingEntries(authToken, chosenVehicleId);
    await getServicingEntries(authToken, chosenVehicleId);
    // should results be returned from these functions instead
    // and then saved to a file here?
  }
}

main();

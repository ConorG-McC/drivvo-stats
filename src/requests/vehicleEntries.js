import { args, config } from '../config/config.js';
import { saveJsonToFile } from '../utilities/util.js';

export async function getVehicles(token) {
  const vehicleEndpoint = `${config.baseUrl}${config.vehicleEndpoint}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'X-Token': token,
    },
    redirect: 'follow',
  };

  try {
    const response = await fetch(vehicleEndpoint, requestOptions);
    const result = await response.json();
    if (args.output) {
      await saveJsonToFile('vehicles.json', result);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

export function filterVehicles(vehicles) {
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length <= 0) {
    console.error(
      'No vehicles available or data is not in the expected format.'
    );
    return;
  }

  let vehicleToUse;

  if (args.vehicle === 'all') {
    vehicleToUse = vehicles[vehicles.length - 1]; // Use the last vehicle
  } else {
    vehicleToUse = vehicles.find(
      (vehicle) => vehicle.placa.toLowerCase() === args.vehicle.toLowerCase()
    );
    if (!vehicleToUse) {
      console.error('No vehicle found matching the given plate:', args.vehicle);
      vehicleToUse = vehicles[vehicles.length - 1]; // Fallback to the last vehicle
    }
  }

  return vehicleToUse ? vehicleToUse.id_veiculo : null;
}

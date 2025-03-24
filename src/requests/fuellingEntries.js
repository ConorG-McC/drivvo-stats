import { args, config } from '../config/config.js';
import { saveJsonToFile } from '../utilities/util.js';

export async function getFuellingEntries(token, vehicleId) {
  const fuellingEndpoint = `${config.baseUrl}/veiculo/${vehicleId}${config.fuelingEndpoint}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'X-Token': token,
    },
    redirect: 'follow',
  };

  try {
    const response = await fetch(fuellingEndpoint, requestOptions);
    const result = await response.json();
    if (args.output) {
      await saveJsonToFile('fuellingEntries.json', result);
    }
  } catch (error) {
    console.error(error);
  }
}

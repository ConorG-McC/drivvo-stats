import { args, config } from '../config/config.js';
import { saveJsonToFile } from '../utilities/util.js';

export async function getServicingEntries(token, vehicleId) {
  const servicingEndpoint = `${config.baseUrl}/veiculo/${vehicleId}${config.servicingEndpoint}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'X-Token': token,
    },
    redirect: 'follow',
  };

  try {
    const response = await fetch(servicingEndpoint, requestOptions);
    const result = await response.json();
    if (args.output) {
      await saveJsonToFile('servicingEntries.json', result);
    }
  } catch (error) {
    console.error(error);
  }
}

import { args, config } from '../config/config.js';
import { saveJsonToFile } from '../utilities/util.js';
import { renameKeysDeep } from '../transforms/deepTranslate.js';
import { FUEL_ES_TO_EN } from '../transforms/fieldDictionaries.js';


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
      await saveJsonToFile(`spanish/fuelling_entries.es.${vehicleId}.json`, result);
    }
    if (args.translate) {
      const translated = renameKeysDeep(result, FUEL_ES_TO_EN);
      await saveJsonToFile(`english/fuelling_entries.en.${vehicleId}.json`, translated);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

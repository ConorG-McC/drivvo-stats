import { args, config } from '../config/config.js';
import {  SERVICE_ES_TO_EN } from '../transforms/fieldDictionaries.js';
import { saveJsonToFile } from '../utilities/util.js';
import { renameKeysDeep } from '../transforms/deepTranslate.js';


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
      await saveJsonToFile(`spanish/servicing_entries.es.${vehicleId}.json`, result);
    }
    if (args.translate) {
      const translated = renameKeysDeep(result, SERVICE_ES_TO_EN);
      await saveJsonToFile(`english/servicing_entries.en.${vehicleId}.json`, translated);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

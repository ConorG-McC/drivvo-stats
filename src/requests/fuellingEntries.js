import { config } from "../config/config.js";
import { saveJsonToFile } from "../utilities/util.js";
import { renameKeysDeep } from "../transforms/deepTranslate.js";
import { FUEL_ES_TO_EN } from "../transforms/fieldDictionaries.js";

export async function getFuellingEntries(token, vehicleId, translate = true) {
  const fuellingEndpoint =
    `${config.baseUrl}/veiculo/${vehicleId}${config.fuelingEndpoint}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": token,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(fuellingEndpoint, requestOptions);
    const result = await response.json();
    const files = [];
    const spanishPath = await saveJsonToFile(
      `spanish/fuelling_entries.es.${vehicleId}.json`,
      result,
    );
    files.push(spanishPath);
    if (translate) {
      const translated = renameKeysDeep(result, FUEL_ES_TO_EN);
      const englishPath = await saveJsonToFile(
        `english/fuelling_entries.en.${vehicleId}.json`,
        translated,
      );
      files.push(englishPath);
    }

    return { data: result, files };
  } catch (error) {
    console.error(error);
    return { data: null, files: [] };
  }
}

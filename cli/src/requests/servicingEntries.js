import { config } from "../config/config.js";
import { SERVICE_ES_TO_EN } from "../transforms/fieldDictionaries.js";
import { saveJsonToFile } from "../utilities/util.js";
import { renameKeysDeep } from "../transforms/deepTranslate.js";

export async function getServicingEntries(token, vehicleId, translate = true) {
  const servicingEndpoint =
    `${config.baseUrl}/veiculo/${vehicleId}${config.servicingEndpoint}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": token,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(servicingEndpoint, requestOptions);
    const result = await response.json();
    const files = [];
    const spanishPath = await saveJsonToFile(
      `spanish/servicing_entries.es.${vehicleId}.json`,
      result,
    );
    files.push(spanishPath);
    if (translate) {
      const translated = renameKeysDeep(result, SERVICE_ES_TO_EN);
      const englishPath = await saveJsonToFile(
        `english/servicing_entries.en.${vehicleId}.json`,
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

import crypto from "node:crypto";
import { config } from "../config/config.js";
import { renameKeysDeep } from "../transforms/deepTranslate.js";
import { EXPENSE_ES_TO_EN } from "../transforms/fieldDictionaries.js";
import { saveJsonToFile } from "../utilities/util.js";

export async function getExpenseEntries(token, vehicleId, translate = true) {
  const expenseEndpoint = `${config.baseUrl}/veiculo/${vehicleId}/despesa`;

  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": token,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(expenseEndpoint, requestOptions);
    const result = await response.json();
    const files = [];
    const spanishPath = await saveJsonToFile(
      `spanish/expense_entries.es.${vehicleId}.json`,
      result,
    );
    files.push(spanishPath);
    if (translate) {
      const translated = renameKeysDeep(result, EXPENSE_ES_TO_EN);
      const englishPath = await saveJsonToFile(
        `english/expense_entries.en.${vehicleId}.json`,
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

export async function deleteExpenseEntries(token, vehicleId) {
  const expenseDeleteEndpoint = `${config.baseUrl}/despesa`;

  const { data: expenseEntries } = await getExpenseEntries(token, vehicleId);

  console.log("entries", expenseEntries);
  if (
    !expenseEntries ||
    !Array.isArray(expenseEntries) ||
    expenseEntries.length <= 0
  ) {
    console.error(
      "No expense entries available or data is not in the expected format.",
    );
    return;
  }

  console.log(`Deleting ${expenseEntries.length} expense entries...`);
  let successCount = 0;
  let failCount = 0;
  const requestOptions = {
    method: "DELETE",
    headers: {
      "X-Token": token,
    },
    redirect: "follow",
  };

  for (let i = 0; i < expenseEntries.length; i++) {
    let currentId = expenseEntries[i]["id_despesa"];
    const progress = Math.round(((i + 1) / expenseEntries.length) * 100);

    try {
      console.log(`[${progress}%] Processing entry for ${currentId}...`);
      const response = await fetch(
        `${expenseDeleteEndpoint}/${currentId}`,
        requestOptions,
      );
      console.log(`✅ Entry deleted for ${currentId}`);
      console.log(response);
      successCount++;
      // Add delay between requests
      if (i < expenseEntries.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to delete entry for ${currentId}:`, error);
      failCount++;

      // Decide whether to continue or abort
      if (failCount >= 3) {
        console.error("Too many consecutive failures, aborting process");
        break;
      }
    }
  }
  console.log(
    `Operation complete: ${successCount} entries deleted, ${failCount} failed`,
  );

  return { successCount, failCount };
}

export async function addExpenseEntries(token, vehicleId, options = {}) {
  // Configurable parameters with defaults
  const {
    startDate = new Date("2022-01-01T09:00:00"),
    endDate = new Date("2025-03-01T09:00:00"),
    expenseAmount = 187.74,
    delayMs = 1000,
    expenseTypeId = 24025950,
    locationId = 3020988,
    dryRun = false,
  } = options;

  const servicingEndpoint = `${config.baseUrl}/despesa`;
  console.log(
    `Adding financing entries from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
  );

  // Generate all entries first
  const entries = generateMonthlyEntries({
    startDate,
    endDate,
    vehicleId,
    expenseAmount,
    expenseTypeId,
    locationId,
  });

  console.log(`Generated ${entries.length} monthly entries to process`);

  if (dryRun) {
    console.log("Dry run - no entries will be submitted");
    return entries;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const progress = Math.round(((i + 1) / entries.length) * 100);

    try {
      console.log(
        `[${progress}%] Processing entry for ${entry.displayDate}...`,
      );

      const requestOptions = {
        method: "POST",
        headers: {
          "X-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry.data),
        redirect: "follow",
      };

      if (!dryRun) {
        const response = await fetch(servicingEndpoint, requestOptions);
        const result = await response.json();
        console.log(`✅ Entry added for ${entry.displayDate}`);
        console.log(result);
        successCount++;

        // Add delay between requests
        if (i < entries.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    } catch (error) {
      console.error(`❌ Failed to add entry for ${entry.displayDate}:`, error);
      failCount++;

      // Decide whether to continue or abort
      if (failCount >= 3) {
        console.error("Too many consecutive failures, aborting process");
        break;
      }
    }
  }

  console.log(
    `Operation complete: ${successCount} entries added, ${failCount} failed`,
  );
  return { successCount, failCount };
}

function generateMonthlyEntries({
  startDate,
  endDate,
  vehicleId,
  expenseAmount,
  expenseTypeId,
  locationId,
}) {
  const entries = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const entryId = crypto.randomUUID();
    const expenseId = crypto.randomUUID();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const displayDate = currentDate.toLocaleDateString();

    const entryData = {
      id_unico: entryId,
      id_veiculo: vehicleId,
      tipos_despesa: [
        {
          id_tipo_despesa: expenseTypeId,
          id_unico: expenseId,
          valor: expenseAmount,
        },
      ],
      id_local: locationId,
      id_arquivo: null,
      id_tipo_motivo: null,
      odometro: 0, // 0 stops conflicting odometer values on application
      data: formattedDate,
      observacao: "Monthly car finance payment",
      id_forma_pagamento: null,
      id_motorista: null,
    };

    entries.push({
      data: entryData,
      displayDate,
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return entries;
}

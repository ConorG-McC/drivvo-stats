import { getFuellingEntries } from "./fuellingEntries.js";
import { getServicingEntries } from "./servicingEntries.js";
import { getExpenseEntries } from "./expenseEntries.js";


export async function runRequestsByOptions(token, vehicleId, options) {
  const tasks = [
    {
      label: "Fuelling entries",
      enabled: options.fetchPlan.fuelling,
      runner: () => getFuellingEntries(token, vehicleId, options.translate),
    },
    {
      label: "Servicing entries",
      enabled: options.fetchPlan.servicing,
      runner: () => getServicingEntries(token, vehicleId, options.translate),
    },
    {
      label: "Expense entries",
      enabled: options.fetchPlan.expenses,
      runner: () => getExpenseEntries(token, vehicleId, options.translate),
    },
  ];

  const summary = [];

  for (const task of tasks) {
    if (!task.enabled) {
      console.log(`\nSkipping ${task.label} (not requested).`);
      continue;
    }

    console.log(`\n→ Fetching ${task.label}...`);
    const { data, files } = await task.runner();
    const count = data.length;

    if (files.length) {
      console.log("   Saved files:");
      for (const file of files) {
        console.log(`     - ${file}`);
      }
    }

    summary.push({
      Dataset: task.label,
      Entries: count ?? "unknown",
      "Files Saved": files.length,
    });
  }

  if (summary.length) {
    console.log("\n=== Download Summary ===");
    console.table(summary);
  } else {
    console.log("\nNo download actions were performed.");
  }
}

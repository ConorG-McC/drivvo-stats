import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Default to the root directory and create 'outputs' directory
const OUTPUT_ROOT = path.join(process.cwd(), 'outputs');

export async function saveJsonToFile(relativePath, data) {
  const filePath = path.join(OUTPUT_ROOT, relativePath);
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return filePath;
  } catch (error) {
    // log and rethrow so callers can decide what to do
    console.error(`Failed to save ${relativePath}:`, error);
    throw error;
  }
}

export function md5(password) {
  return crypto.createHash('md5').update(password, 'utf8').digest('hex');
}

export function validateEnvironment() {
  const required = ["DRIVVO_EMAIL", "DRIVVO_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(
      `Missing environment variables: ${missing.join(", ")}`,
    );
    console.error(
      "Create a .env file (or copy template.env) and provide your Drivvo credentials.",
    );
    return false;
  }

  return true;
}

export function logFetchPlanSummary(fetchPlan, translate) {
  console.log("\n=== Download Plan ===");
  console.table([
    { Dataset: "Vehicles", Fetch: fetchPlan.vehicles ? "Yes" : "No" },
    { Dataset: "Fuelling", Fetch: fetchPlan.fuelling ? "Yes" : "No" },
    { Dataset: "Servicing", Fetch: fetchPlan.servicing ? "Yes" : "No" },
    { Dataset: "Expenses", Fetch: fetchPlan.expenses ? "Yes" : "No" },
  ]);
  console.log(`Translate responses: ${translate ? "Yes" : "No"}`);
}
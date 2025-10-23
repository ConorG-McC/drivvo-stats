import { promises as fs } from 'node:fs';
import path from 'path';

// Default to the root directory and create 'outputs' directory
const OUTPUT_ROOT = path.join(process.cwd(), 'outputs');

export async function saveJsonToFile(relativePath, data) {
  const filePath = path.join(OUTPUT_ROOT, relativePath);
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`${relativePath} saved → ${filePath}`);
    return filePath;
  } catch (error) {
    // log and rethrow so callers can decide what to do
    console.error(`Failed to save ${relativePath}:`, error);
    throw error;
  }
}

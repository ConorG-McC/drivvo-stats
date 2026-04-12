/**
 * Recursively renames object keys using a dictionary.
 * - Works for arrays, plain objects, and primitives.
 * - Only renames keys; values and nesting remain unchanged.
 * - Unknown keys are preserved as-is.
 *
 * @param {any} value - Any JSON-compatible value (object|array|primitive).
 * @param {Record<string,string>} dictionary - Map from originalKey -> newKey.
 * @returns {any} The value with keys renamed wherever they appear.
 */
export function renameKeysDeep(value, dictionary) {
  if (Array.isArray(value)) {
    return value.map((item) => renameKeysDeep(item, dictionary));
  }
  if (value && typeof value === "object" && value.constructor === Object) {
    const output = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = dictionary[key] ?? key;
      output[newKey] = renameKeysDeep(val, dictionary);
    }
    return output;
  }
  // primitives (string, number, boolean, null)
  return value;
}
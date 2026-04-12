interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const TTL_MS = 1000 * 60 * 60; // 1 hour

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) {
    console.log(`Cache miss for key ${key}`);
    return null;
  }
  console.log(`Cache hit for key ${key}`);
  if (Date.now() - entry.fetchedAt > TTL_MS) {
    store.delete(key);
    console.log(`Cache expired for key ${key}`);
    return null;
  }
  return entry.data;
}

export function setCached<T>(key: string, data: T): void {
  console.log(`Setting cache for key ${key}`);
  store.set(key, { data, fetchedAt: Date.now() });
}

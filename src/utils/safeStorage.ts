const memoryStorage = new Map<string, string>();
let storageAvailabilityCache: boolean | null = null;

const testKey = "__startup_zero_storage_test__";

function canUseLocalStorage(): boolean {
  if (storageAvailabilityCache !== null) {
    return storageAvailabilityCache;
  }

  try {
    if (typeof window === "undefined") {
      storageAvailabilityCache = false;
      return false;
    }

    const storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    storageAvailabilityCache = true;
    return true;
  } catch {
    storageAvailabilityCache = false;
    return false;
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (canUseLocalStorage()) {
        return window.localStorage.getItem(key);
      }
    } catch {
      storageAvailabilityCache = false;
    }

    return memoryStorage.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      storageAvailabilityCache = false;
    }

    memoryStorage.set(key, value);
  },

  removeItem(key: string): void {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      storageAvailabilityCache = false;
    }

    memoryStorage.delete(key);
  },

  clear(): void {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.clear();
        return;
      }
    } catch {
      storageAvailabilityCache = false;
    }

    memoryStorage.clear();
  },

  isPersistentAvailable(): boolean {
    return canUseLocalStorage();
  },
};

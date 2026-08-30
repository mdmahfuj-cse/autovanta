/**
 * localStorage wrapper that never throws.
 * Falls back to in-memory storage when localStorage is unavailable
 * (private mode, quota errors, non-browser environments).
 */
const memoryFallback = new Map();

export const safeStorage = {
  getItem(name) {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return memoryFallback.get(name) ?? null;
    }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      memoryFallback.set(name, value);
    }
  },
  removeItem(name) {
    try {
      window.localStorage.removeItem(name);
    } catch {
      memoryFallback.delete(name);
    }
  },
};

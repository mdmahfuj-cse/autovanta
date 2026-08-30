import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/storage.js';

export const MAX_COMPARE = 4;

/**
 * Compare garage — max 4 vehicles, persisted as `av-compare-v1`.
 * `toggle` returns a result object so callers can surface toasts:
 *   { ok: true, added: boolean } | { ok: false, reason: 'max' }
 */
export const useCompareStore = create(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return { ok: true, added: false };
        }
        if (ids.length >= MAX_COMPARE) {
          return { ok: false, reason: 'max' };
        }
        set({ ids: [...ids, id] });
        return { ok: true, added: true };
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'av-compare-v1',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

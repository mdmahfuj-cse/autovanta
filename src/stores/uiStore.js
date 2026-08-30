import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/storage.js';

/**
 * Ephemeral UI state. Only `carsViewMode` is persisted — drawers and
 * overlays must never reopen on a fresh page load.
 */
export const useUiStore = create(
  persist(
    (set) => ({
      quickNavOpen: false,
      searchOpen: false,
      carsViewMode: 'grid', // 'grid' | 'list'
      setQuickNavOpen: (open) => set({ quickNavOpen: Boolean(open) }),
      toggleQuickNav: () => set((s) => ({ quickNavOpen: !s.quickNavOpen })),
      setSearchOpen: (open) => set({ searchOpen: Boolean(open) }),
      setCarsViewMode: (mode) => set({ carsViewMode: mode === 'list' ? 'list' : 'grid' }),
    }),
    {
      name: 'av-ui-v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ carsViewMode: s.carsViewMode }),
    }
  )
);

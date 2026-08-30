import { create } from 'zustand';

let nextId = 1;

/** Transient toast queue — not persisted. */
export const useToastStore = create((set) => ({
  toasts: [],
  push: (toastData) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, variant: 'info', ...toastData }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Imperative helper so any store/component can fire a toast. */
export const toast = (toastData) => useToastStore.getState().push(toastData);

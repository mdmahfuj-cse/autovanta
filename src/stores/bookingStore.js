import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/storage.js';

/**
 * Test-drive bookings — persisted as `av-bookings-v1`.
 * Newest first. `add` returns { id, ref } for the confirmation card.
 */
export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      nextRef: 1042,
      add: (data) => {
        const id = `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const ref = `AV-${get().nextRef}`;
        set((s) => ({
          bookings: [{ id, ref, createdAt: new Date().toISOString(), status: 'confirmed', ...data }, ...s.bookings],
          nextRef: s.nextRef + 1,
        }));
        return { id, ref };
      },
      cancel: (id) => set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),
    }),
    {
      name: 'av-bookings-v1',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

/** All slots; Friday shows only the post-15:00 ones (showroom hours). */
export const TIME_SLOTS = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];

export const slotsForDate = (isoDate) => {
  if (!isoDate) return TIME_SLOTS;
  const day = new Date(`${isoDate}T00:00:00`).getDay();
  return day === 5 ? TIME_SLOTS.filter((t) => t >= '15:00') : TIME_SLOTS;
};

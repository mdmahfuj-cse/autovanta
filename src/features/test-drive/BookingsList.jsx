import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, MapPin, Trash2 } from 'lucide-react';
import { useBookingStore } from '../../stores/bookingStore.js';
import { toast } from '../../stores/toastStore.js';
import { formatDate } from '../../utils/format.js';
import { EASE_OUT_EXPO } from '../../components/shared/motionTokens.js';
import { cn } from '../../utils/cn.js';

const isoToday = () => new Date().toISOString().slice(0, 10);

/** Locally saved test-drive bookings with per-item cancel. */
export default function BookingsList() {
  const bookings = useBookingStore((s) => s.bookings);
  const cancel = useBookingStore((s) => s.cancel);
  const [confirmingId, setConfirmingId] = useState(null);

  const sorted = [...bookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const onCancel = (booking) => {
    if (confirmingId !== booking.id) {
      setConfirmingId(booking.id);
      setTimeout(() => setConfirmingId((id) => (id === booking.id ? null : id)), 3000);
      return;
    }
    cancel(booking.id);
    setConfirmingId(null);
    toast({ title: 'Booking cancelled', description: `${booking.ref} removed.`, variant: 'info' });
  };

  return (
    <section aria-label="Your bookings" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold tracking-tight">Your bookings</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {bookings.length} saved on this device
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/12 px-6 py-10 text-center text-sm text-muted">
          No bookings yet — confirm a test drive above and it will appear here with its reference.
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {sorted.map((booking) => {
              const upcoming = booking.date >= isoToday();
              return (
                <motion.li
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  className="rounded-xl border border-white/8 bg-base-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs text-muted">{booking.ref}</p>
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
                        upcoming ? 'border-success/30 bg-success/10 text-success' : 'border-white/15 bg-white/5 text-muted'
                      )}
                    >
                      {upcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold tracking-tight">{booking.carLabel}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {formatDate(booking.date)} · {booking.time}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {booking.showroomLabel}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                    <p className="text-xs text-muted">{booking.name} · {booking.contact}</p>
                    <button
                      type="button"
                      onClick={() => onCancel(booking)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                        confirmingId === booking.id
                          ? 'border-error/50 bg-error/10 text-error-text'
                          : 'border-white/12 text-muted hover:border-primary/40 hover:text-base-content'
                      )}
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      {confirmingId === booking.id ? 'Sure?' : 'Cancel'}
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

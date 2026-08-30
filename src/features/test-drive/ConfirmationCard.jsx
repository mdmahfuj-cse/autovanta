import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarCheck, CircleCheck, KeyRound } from 'lucide-react';
import { PATHS } from '../../routes/paths.js';
import { formatDate } from '../../utils/format.js';

/** Booking confirmation — reference, summary and next steps. */
export default function ConfirmationCard({ booking, onBookAnother }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-success/25 bg-base-200 p-6 md:p-8"
      role="status"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-success/30 bg-success/10">
          <CircleCheck className="h-6 w-6 text-success" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">You&apos;re booked in.</h2>
          <p className="mt-0.5 text-sm text-muted">
            Reference <span className="font-mono font-semibold text-base-content">{booking.ref}</span> — saved on this device.
          </p>
        </div>
      </div>

      <dl className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
        {[
          ['Vehicle', booking.carLabel],
          ['Showroom', booking.showroomLabel],
          ['Date', `${formatDate(booking.date)} · ${booking.time}`],
          ['Contact', booking.contact],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/8 bg-base-100/60 px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Bring your driving license. The car will be fueled, warmed and waiting — a specialist walks
        the route with you first.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBookAnother}
          className="btn btn-md rounded-md border-white/15 bg-white/5 px-5 font-display tracking-wide transition-colors hover:border-primary/50 hover:bg-white/10"
        >
          <CalendarCheck className="h-4 w-4 text-muted" aria-hidden="true" /> Book another drive
        </button>
        <Link to={PATHS.cars} className="btn btn-primary btn-md rounded-md px-5 font-display tracking-wide">
          Keep browsing <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

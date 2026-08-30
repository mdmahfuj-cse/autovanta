import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Scale, X } from 'lucide-react';
import { useCompareStore } from '../../stores/compareStore.js';
import { getCarsByIds, BRANDS_BY_ID } from '../../data/index.js';
import { PATHS } from '../../routes/paths.js';

/**
 * Site-wide compare tray — slides up once anything is in the garage.
 * Hidden on /compare itself. Spring entrance, layout-animated chips.
 */
export default function CompareTray() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { pathname } = useLocation();

  const cars = getCarsByIds(ids);
  const visible = cars.length > 0 && pathname !== PATHS.compare;
  const ready = cars.length >= 2;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-3 bottom-4 z-40 mx-auto max-w-xl sm:inset-x-4"
          role="region"
          aria-label="Compare garage tray"
        >
          <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-base-200/95 p-3 shadow-2xl backdrop-blur-xl">
            <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] sm:flex">
              <Scale className="h-4.5 w-4.5 text-muted" aria-hidden="true" />
            </span>

            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto no-scrollbar">
              <AnimatePresence initial={false} mode="popLayout">
                {cars.map((car) => (
                  <motion.span
                    key={car.id}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className="group relative flex shrink-0 items-center"
                  >
                    <span className="flex h-9 items-center gap-2 rounded-lg border border-white/12 bg-base-100 pl-2.5 pr-7">
                      <span className="font-display text-[11px] font-bold tracking-[0.1em] text-base-content/85">
                        {BRANDS_BY_ID[car.brandId]?.code}
                      </span>
                      <span className="max-w-16 truncate text-[11px] text-muted">{car.model}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(car.id)}
                      aria-label={`Remove ${car.model} from compare`}
                      className="absolute right-0.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors hover:text-primary-text"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {!ready && (
                <span className="shrink-0 pl-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  add {2 - cars.length} more
                </span>
              )}

              <button
                type="button"
                onClick={clear}
                className="shrink-0 px-2 text-[11px] text-muted transition-colors hover:text-base-content"
              >
                Clear
              </button>
            </div>

            <Link
              to={PATHS.compare}
              aria-disabled={!ready}
              onClick={(e) => {
                if (!ready) e.preventDefault();
              }}
              className={
                ready
                  ? 'btn btn-primary btn-sm shrink-0 rounded-md px-4 font-display tracking-wide'
                  : 'btn btn-sm shrink-0 cursor-not-allowed rounded-md border-white/10 bg-white/[0.03] px-4 font-display tracking-wide text-muted'
              }
            >
              Compare {cars.length}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

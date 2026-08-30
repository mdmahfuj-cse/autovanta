import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { COMPARE_GROUPS, COMPARE_ROWS, computeRowMeta } from '../../utils/compareMetrics.js';
import { useCompareStore } from '../../stores/compareStore.js';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';
import { formatBDT } from '../../utils/format.js';

/**
 * The comparison table — sticky metric column, per-group banding,
 * best-value dots and identical-value dimming. Scrolls horizontally on
 * mobile with the metric column pinned.
 */
export default function CompareTable({ cars }) {
  const remove = useCompareStore((s) => s.remove);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `10.5rem repeat(${cars.length}, minmax(11.5rem, 1fr))`,
  };

  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:hidden">
        Swipe sideways to see all columns →
      </p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-x-auto rounded-xl border border-white/10 bg-base-200"
      >
        <div style={gridStyle}>
          {/* Header row */}
          <div className="sticky left-0 z-10 flex items-end bg-base-200 p-4">
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
              Comparing
              <br />
              {cars.length} of 4
            </p>
          </div>
          {cars.map((car) => (
            <div key={car.id} className="relative border-l border-white/8 p-4">
              <button
                type="button"
                onClick={() => remove(car.id)}
                aria-label={`Remove ${car.model} from compare`}
                className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-base-100/80 text-muted backdrop-blur transition-colors hover:border-primary/40 hover:text-primary-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <Link to={PATHS.carDetails(car.slug)} className="block">
                <span className="relative block aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                  <img src={car.images[0].src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </span>
                <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {car.condition === 'New' ? 'Brand new' : 'Certified'} · {car.year}
                </span>
                <span className="mt-0.5 block font-display text-sm font-bold leading-tight tracking-tight">
                  {car.model} <span className="font-medium text-muted">{car.trim}</span>
                </span>
                <span className="mt-1 block font-mono text-sm text-secondary">{formatBDT(car.price)}</span>
              </Link>
            </div>
          ))}

          {/* Metric rows, grouped */}
          {COMPARE_GROUPS.map((group) => (
            <div key={group} style={{ gridColumn: '1 / -1', display: 'contents' }}>
              <div
                className="sticky left-0 bg-base-100/95 px-4 py-2.5"
                style={{ gridColumn: '1 / -1' }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{group}</p>
              </div>
              {COMPARE_ROWS.filter((r) => r.group === group).map((row) => {
                const meta = computeRowMeta(row, cars);
                return (
                  <div key={row.label} style={{ display: 'contents' }}>
                    <div className="sticky left-0 z-10 flex items-center border-t border-white/8 bg-base-200 px-4 py-3">
                      <p className={cn('text-[13px]', meta?.allEqual ? 'text-muted' : 'text-muted')}>{row.label}</p>
                    </div>
                    {cars.map((car) => {
                      const isWinner = meta?.winners?.has(car.id);
                      return (
                        <div
                          key={car.id}
                          className={cn(
                            'flex items-center gap-2 border-l border-t border-white/8 px-4 py-3 font-mono text-[13px]',
                            meta?.allEqual && 'text-muted',
                            !meta && 'text-base-content/85',
                            isWinner && 'font-semibold text-base-content'
                          )}
                        >
                          {isWinner && (
                            <>
                              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-text" />
                              <span className="sr-only">(best)</span>
                            </>
                          )}
                          {row.value(car)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" /> best in row
        </span>
        <span>grey values are identical across all compared vehicles</span>
      </p>
    </div>
  );
}

/** Per-car feature breakdown under the table (real lists, not just counts). */
export function FeaturesBreakdown({ cars }) {
  const groups = [
    ['comfort', 'Comfort'],
    ['technology', 'Technology'],
    ['driverAssist', 'Driver assistance'],
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-white/8 bg-base-200 p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-bold tracking-tight">
              {car.model} <span className="font-medium text-muted">{car.trim}</span>
            </h3>
            <Link
              to={PATHS.carDetails(car.slug)}
              aria-label={`View ${car.model} details`}
              className="text-muted transition-colors hover:text-primary-text"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {groups.map(([key, label]) => (
            <div key={key} className="mt-4 border-t border-white/6 pt-3.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {car.features[key].map((f) => (
                  <span key={f} className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] text-base-content/75">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

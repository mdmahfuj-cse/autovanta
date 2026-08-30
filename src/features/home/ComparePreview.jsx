import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import { COMPARE_SAMPLE } from '../../data/index.js';
import { BRANDS_BY_ID } from '../../data/index.js';
import { formatBDT } from '../../utils/format.js';
import { PATHS_EXPORTS } from './homeLinks.js';
import { cn } from '../../utils/cn.js';

const ROWS = [
  {
    label: 'Asking price',
    value: (c) => formatBDT(c.price),
    best: (cars) => Math.min(...cars.map((c) => c.price)),
    isBest: (c, best) => c.price === best,
  },
  {
    label: 'Power',
    value: (c) => `${c.engine.powerHp} hp`,
    best: (cars) => Math.max(...cars.map((c) => c.engine.powerHp)),
    isBest: (c, best) => c.engine.powerHp === best,
  },
  {
    label: '0–100 km/h',
    value: (c) => `${c.performance.zeroTo100} s`,
    best: (cars) => Math.min(...cars.map((c) => c.performance.zeroTo100)),
    isBest: (c, best) => c.performance.zeroTo100 === best,
  },
];

/**
 * Homepage §7 — Compare preview: a taste of the garage table.
 * Differences (best value per row) glow crimson; full tooling in Phase 4.
 */
export default function ComparePreview() {
  const cars = COMPARE_SAMPLE;

  return (
    <section className="border-y border-white/8 bg-base-200/40 py-24 lg:py-28" aria-labelledby="compare-heading">
      <div className="container-x">
        <SectionHeading
          eyebrow="Decide smarter"
          title="Spec sheets, face to face"
          description="Pick any 2–4 vehicles from the garage and AutoVanta lines up ten metrics — with meaningful differences highlighted so you never hunt for them."
          action={{ to: PATHS_EXPORTS.compare, label: 'Open compare garage' }}
        />

        <Stagger className="mt-12 overflow-hidden rounded-xl border border-white/10" step={0.08}>
          {/* Mobile: the preview scrolls like the real table; desktop: full grid. */}
          <div className="overflow-x-auto">
            <div className="min-w-[38rem]">
          {/* Header row */}
          <div className="grid grid-cols-4 bg-base-100">
            <div className="flex items-center gap-3 p-5">
              <Scale className="h-5 w-5 text-muted" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Live sample
              </p>
            </div>
            {cars.map((car) => (
              <StaggerItem key={car.id} y={12}>
                <div className="flex h-full items-center gap-3 border-l border-white/8 bg-base-200 p-5">
                  <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/[0.03] font-display text-xs font-bold tracking-[0.12em]">
                    {BRANDS_BY_ID[car.brandId].code}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold tracking-tight">{car.model}</p>
                    <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {BRANDS_BY_ID[car.brandId].name}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>

          {/* Metric rows */}
          {ROWS.map((row, rowIndex) => {
            const best = row.best(cars);
            return (
              <StaggerItem key={row.label} y={10}>
                <div
                  className={cn(
                    'grid grid-cols-4 border-t border-white/8',
                    rowIndex % 2 === 1 && 'bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-center p-5">
                    <p className="text-sm font-medium text-muted">{row.label}</p>
                  </div>
                  {cars.map((car) => {
                    const isBest = row.isBest(car, best);
                    return (
                      <div
                        key={car.id}
                        className={cn(
                          'flex items-center border-l border-white/8 p-5 font-mono text-sm',
                          isBest ? 'font-semibold text-base-content' : 'text-base-content/70'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {isBest && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-text" />}
                          {row.value(car)}
                          {isBest && <span className="sr-only"> (best value)</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </StaggerItem>
            );
          })}
            </div>
          </div>
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-text" /> highlighted cells
            </span>
            mark the best value in each row. The full table compares engines, torque, economy, dimensions, safety and features.
            <Link
              to={PATHS_EXPORTS.compare}
              className="ml-auto inline-flex items-center gap-2 font-medium text-primary-text transition-opacity hover:opacity-80"
            >
              Try it with your shortlist <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

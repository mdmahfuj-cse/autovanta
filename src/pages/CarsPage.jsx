import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Funnel, RotateCcw, Search, X } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import CarFilters from '../features/cars/CarFilters.jsx';
import CarGrid from '../features/cars/CarGrid.jsx';
import SortBar from '../features/cars/SortBar.jsx';
import { useQueryFilters } from '../hooks/useQueryFilters.js';
import { useUiStore } from '../stores/uiStore.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { CARS, BRANDS_BY_ID, CATEGORIES_BY_ID } from '../data/index.js';
import { applyFilters, sortCars } from '../utils/carFilters.js';
import { formatBDT } from '../utils/format.js';
import { cn } from '../utils/cn.js';
import { EASE_OUT_EXPO } from '../components/shared/motionTokens.js';

const FLAG_LABELS = {
  featured: 'Featured',
  newArrival: 'New arrivals',
  performance: 'Performance',
};

function ActiveFilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-3.5 pr-2.5 text-[13px] text-base-content/85 transition-colors hover:border-primary/40"
    >
      {label}
      <X className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-primary-text" aria-hidden="true" />
    </button>
  );
}

export default function CarsPage() {
  useDocumentTitle('The Garage');
  const { params, setParam, clearAll, activeCount } = useQueryFilters();
  const viewMode = useUiStore((s) => s.carsViewMode);
  const setViewMode = useUiStore((s) => s.setCarsViewMode);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qInput, setQInput] = useState(params.q);
  const qTimer = useRef(null);

  // Debounced typing → URL, straight from the input handler (no effect syncing).
  const onSearchChange = (e) => {
    const value = e.target.value;
    setQInput(value);
    clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => setParam('q', value.trim() || undefined), 300);
  };

  const filtered = sortCars(applyFilters(CARS, params), params.sort);

  const clearSearch = () => {
    setQInput('');
    setParam('q', undefined);
  };

  const resetEverything = () => {
    setQInput('');
    clearAll();
  };

  const chips = [
    params.q && { key: 'q', label: `“${params.q}”`, remove: clearSearch },
    params.flag && { key: 'flag', label: FLAG_LABELS[params.flag] ?? params.flag, remove: () => setParam('flag', undefined) },
    params.brand && { key: 'brand', label: BRANDS_BY_ID[params.brand]?.name ?? params.brand, remove: () => setParam('brand', undefined) },
    params.category && { key: 'category', label: CATEGORIES_BY_ID[params.category]?.label ?? params.category, remove: () => setParam('category', undefined) },
    params.fuel && { key: 'fuel', label: params.fuel === 'EV' ? 'Electric' : params.fuel, remove: () => setParam('fuel', undefined) },
    params.transmission && { key: 'transmission', label: params.transmission, remove: () => setParam('transmission', undefined) },
    params.maxPrice && { key: 'maxPrice', label: `Up to ${formatBDT(params.maxPrice)}`, remove: () => setParam('maxPrice', undefined) },
  ].filter(Boolean);

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            The garage · {CARS.length} vehicles
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Find your <span className="text-secondary">next machine</span>.
          </h1>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="flex h-12 items-center gap-3 rounded-xl border border-white/12 bg-base-100 px-4 transition-colors focus-within:border-primary/50"
            >
              <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={qInput}
                onChange={onSearchChange}
                placeholder="Search by model, brand, trim — try “Civic” or “electric”"
                aria-label="Search vehicles"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
              />
              {qInput && (
                <button type="button" onClick={clearSearch} aria-label="Clear search" className="text-muted transition-colors hover:text-base-content">
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[17rem_1fr] lg:py-12">
        {/* Desktop filter rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-6">
            <CarFilters params={params} setParam={setParam} clearAll={clearAll} activeCount={activeCount} />
          </div>
        </aside>

        <section aria-label="Vehicle results">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile filters trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn btn-md rounded-md border-white/15 bg-base-200 font-display text-sm tracking-wide lg:hidden"
              aria-controls="filter-drawer"
            >
              <Funnel className="h-4 w-4 text-muted" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="ml-auto w-full sm:ml-0 sm:w-auto">
              <SortBar
                count={filtered.length}
                total={CARS.length}
                sort={params.sort}
                onSort={(v) => setParam('sort', v === 'featured' ? undefined : v)}
                viewMode={viewMode}
                onViewMode={setViewMode}
              />
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <ActiveFilterChip key={chip.key} label={chip.label} onRemove={chip.remove} />
              ))}
              <button
                type="button"
                onClick={resetEverything}
                className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-primary-text"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" /> Reset all
              </button>
            </div>
          )}

          {/* Results */}
          <div className="mt-7">
            {filtered.length > 0 ? (
              <CarGrid cars={filtered} viewMode={viewMode} />
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/12 px-8 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-base-200">
                  <Search className="h-6 w-6 text-muted" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold tracking-tight">No vehicles match</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Nothing on the floor fits that combination. Loosen a filter or reset the search —
                  the right car might be one click away.
                </p>
                <button type="button" onClick={resetEverything} className="btn btn-primary btn-md mt-7 rounded-md px-6 font-display tracking-wide">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="filter-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filter vehicles"
              className="fixed inset-x-0 bottom-0 z-[80] max-h-[82dvh] overflow-hidden rounded-t-2xl border-t border-white/12 bg-base-200 shadow-2xl lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <p className="font-display text-base font-bold">Refine the garage</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="btn btn-ghost btn-square btn-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[52dvh] overflow-y-auto px-5 py-6">
                <CarFilters params={params} setParam={setParam} clearAll={clearAll} activeCount={activeCount} />
              </div>

              <div className="border-t border-white/10 p-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className={cn('btn btn-primary btn-md w-full rounded-md font-display tracking-wide')}
                >
                  Show {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

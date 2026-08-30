import { RotateCcw } from 'lucide-react';
import { BRANDS, BRAND_COUNTS, CATEGORIES, CATEGORY_COUNTS } from '../../data/index.js';
import { formatBDT } from '../../utils/format.js';
import { cn } from '../../utils/cn.js';

const PRICE_MIN = 3_000_000;
const PRICE_MAX = 45_000_000;
const PRICE_STEP = 500_000;

const FLAGS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'New arrivals', value: 'newArrival' },
  { id: 'performance', label: 'Performance' },
];

function Chip({ active, children, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'rounded-md border px-3 py-1.5 text-[13px] transition-colors',
        active
          ? 'border-primary/60 bg-primary/15 text-primary-text'
          : 'border-white/12 bg-white/[0.03] text-muted hover:border-white/25 hover:text-base-content'
      )}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children, onClear, clearLabel }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{children}</h3>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="text-[11px] text-muted transition-colors hover:text-base-content"
        >
          Clear
        </button>
      )}
    </div>
  );
}

/**
 * Catalogue filter panel contents — rendered in the desktop sticky rail and
 * inside the mobile filter drawer alike. All state lives in the URL.
 */
export default function CarFilters({ params, setParam, clearAll, activeCount }) {
  const flagValue = FLAGS.find((f) => f.value === params.flag)?.id ?? '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold uppercase tracking-[0.14em]">Refine</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-primary-text"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> Reset all ({activeCount})
          </button>
        )}
      </div>

      {/* Collections */}
      <div>
        <SectionTitle>Collections</SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <Chip
              key={f.id}
              active={flagValue === f.id}
              onClick={() => setParam('flag', flagValue === f.id ? undefined : f.value)}
              label={`Filter: ${f.label}`}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <SectionTitle onClear={params.brand ? () => setParam('brand', undefined) : undefined} clearLabel="Clear brand filter">
          Brand
        </SectionTitle>
        <div className="mt-3 space-y-1">
          {BRANDS.map((brand) => {
            const active = params.brand === brand.id;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => setParam('brand', active ? undefined : brand.id)}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                  active ? 'bg-primary/10 text-primary-text' : 'text-base-content/75 hover:bg-white/5 hover:text-base-content'
                )}
              >
                <span>{brand.name}</span>
                <span className={cn('font-mono text-[11px]', active ? 'text-primary-text' : 'text-muted')}>
                  {String(BRAND_COUNTS[brand.id] ?? 0).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <SectionTitle onClear={params.category ? () => setParam('category', undefined) : undefined} clearLabel="Clear category filter">
          Category
        </SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              active={params.category === cat.id}
              onClick={() => setParam('category', params.category === cat.id ? undefined : cat.id)}
              label={`Filter: ${cat.label}`}
            >
              {cat.label}
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{CATEGORY_COUNTS[cat.id] ?? 0}</span>
            </Chip>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <SectionTitle onClear={params.maxPrice ? () => setParam('maxPrice', undefined) : undefined} clearLabel="Clear price filter">
          Budget
        </SectionTitle>
        <p className="mt-3 font-mono text-sm text-secondary">
          {params.maxPrice ? `Up to ${formatBDT(params.maxPrice)}` : 'Any budget'}
        </p>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={params.maxPrice ?? PRICE_MAX}
          onChange={(e) => {
            const v = Number(e.target.value);
            setParam('maxPrice', v >= PRICE_MAX ? undefined : v);
          }}
          className="range range-xs mt-3 w-full [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
          aria-label="Maximum budget"
          aria-valuetext={params.maxPrice ? formatBDT(params.maxPrice) : 'Any budget'}
        />
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted">
          <span>{formatBDT(PRICE_MIN)}</span>
          <span>{formatBDT(PRICE_MAX)}+</span>
        </div>
      </div>

      {/* Fuel */}
      <div>
        <SectionTitle onClear={params.fuel ? () => setParam('fuel', undefined) : undefined} clearLabel="Clear fuel filter">
          Fuel
        </SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Petrol', 'Diesel', 'Hybrid', 'EV'].map((f) => (
            <Chip
              key={f}
              active={params.fuel === f}
              onClick={() => setParam('fuel', params.fuel === f ? undefined : f)}
              label={`Filter: ${f}`}
            >
              {f === 'EV' ? 'Electric' : f}
            </Chip>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <SectionTitle
          onClear={params.transmission ? () => setParam('transmission', undefined) : undefined}
          clearLabel="Clear transmission filter"
        >
          Transmission
        </SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Automatic', 'DCT', 'CVT', 'Manual'].map((t) => (
            <Chip
              key={t}
              active={params.transmission === t}
              onClick={() => setParam('transmission', params.transmission === t ? undefined : t)}
              label={`Filter: ${t}`}
            >
              {t}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

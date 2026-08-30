import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Banknote, Info } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import PaymentBreakdownChart from '../features/finance/PaymentBreakdownChart.jsx';
import BalanceChart from '../features/finance/BalanceChart.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { CARS, BRANDS_BY_ID } from '../data/index.js';
import { calculateLoan, amortizationSchedule } from '../utils/finance.js';
import { formatBDT } from '../utils/format.js';
import { cn } from '../utils/cn.js';

const PRICE_MIN = 1_000_000;
const PRICE_MAX = 45_000_000;
const TENURES = [24, 36, 48, 60, 72, 84];
const DOWN_STEPS = [20, 30, 40, 50];

export default function FinancePage() {
  useDocumentTitle('Finance Calculator');
  const [searchParams] = useSearchParams();

  // Deep-link prefill: ?car=slug or ?price=123
  const [carId, setCarId] = useState(() => searchParams.get('car') ?? 'custom');
  const [price, setPrice] = useState(() => {
    const fromUrl = Number(searchParams.get('price'));
    if (Number.isFinite(fromUrl) && fromUrl >= PRICE_MIN) return fromUrl;
    const fromCar = CARS.find((c) => c.id === searchParams.get('car'));
    return fromCar?.price ?? 8_500_000;
  });
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(9.8);

  const downPayment = Math.round((price * downPct) / 100);
  const result = useMemo(
    () => calculateLoan({ price, downPayment, months, annualRatePercent: rate }),
    [price, downPayment, months, rate]
  );
  const schedule = useMemo(
    () => amortizationSchedule({ price, downPayment, months, annualRatePercent: rate }),
    [price, downPayment, months, rate]
  );
  const firstMonth = schedule[0];

  const onCarChange = (value) => {
    setCarId(value);
    const car = CARS.find((c) => c.id === value);
    if (car) setPrice(car.price);
  };

  const chip = (active) =>
    cn(
      'min-w-12 rounded-md border px-3 py-2 font-mono text-sm transition-colors',
      active
        ? 'border-primary/60 bg-primary/15 text-primary-text'
        : 'border-white/12 bg-white/[0.03] text-muted hover:border-white/25 hover:text-base-content'
    );

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Finance desk · real amortization math
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Real numbers, <span className="text-secondary">instantly</span>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Tune the deal the way our finance desk would — every figure below is computed live,
            never estimated.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Controls */}
        <Reveal>
          <div className="space-y-8 rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8">
            {/* Vehicle */}
            <div>
              <label htmlFor="fin-vehicle" className="text-sm font-medium">Vehicle</label>
              <select
                id="fin-vehicle"
                value={carId}
                onChange={(e) => onCarChange(e.target.value)}
                className="mt-2.5 h-11 w-full appearance-none rounded-lg border border-white/12 bg-base-100 px-3.5 text-sm outline-none transition-colors focus-visible:border-primary/50"
              >
                <option value="custom">Custom amount</option>
                {CARS.map((car) => (
                  <option key={car.id} value={car.id}>
                    {BRANDS_BY_ID[car.brandId]?.name} {car.model} {car.trim} — {formatBDT(car.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="fin-price" className="text-sm font-medium">Vehicle price</label>
                <span className="font-mono text-sm text-secondary">{formatBDT(price, { compact: false })}</span>
              </div>
              <input
                id="fin-price"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={100_000}
                value={price}
                onChange={(e) => {
                  setPrice(Number(e.target.value));
                  setCarId('custom');
                }}
                className="range range-xs mt-3 w-full [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
                aria-valuetext={formatBDT(price)}
              />
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted">
                <span>{formatBDT(PRICE_MIN)}</span>
                <span>{formatBDT(PRICE_MAX)}</span>
              </div>
            </div>

            {/* Down payment */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="fin-down" className="text-sm font-medium">Down payment</label>
                <span className="font-mono text-sm text-secondary">
                  {downPct}% · {formatBDT(downPayment, { compact: false })}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Down payment shortcuts">
                {DOWN_STEPS.map((step) => (
                  <button key={step} type="button" onClick={() => setDownPct(step)} aria-pressed={downPct === step} className={chip(downPct === step)}>
                    {step}%
                  </button>
                ))}
              </div>
              <input
                id="fin-down"
                type="range"
                min={0}
                max={70}
                step={5}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="range range-xs mt-3 w-full [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
                aria-valuetext={`${downPct} percent`}
              />
            </div>

            {/* Rate */}
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="fin-rate" className="text-sm font-medium">Interest rate</label>
                <span className="font-mono text-sm text-secondary">{rate.toFixed(1)}% p.a.</span>
              </div>
              <input
                id="fin-rate"
                type="range"
                min={6}
                max={16}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="range range-xs mt-3 w-full [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
                aria-valuetext={`${rate.toFixed(1)} percent per annum`}
              />
            </div>

            {/* Tenure */}
            <div>
              <p className="text-sm font-medium">Loan tenure</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Loan tenure in months">
                {TENURES.map((m) => (
                  <button key={m} type="button" onClick={() => setMonths(m)} aria-pressed={months === m} className={chip(months === m)}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Results */}
        <Reveal delay={0.08}>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
                Monthly installment
              </p>
              <p aria-live="polite" className="mt-1.5 font-display text-5xl font-bold tracking-tight">
                {formatBDT(result.monthly)}
              </p>
              <p className="mt-2 text-sm text-muted">
                for {months} months at {rate.toFixed(1)}% p.a.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Financed amount', formatBDT(result.financed, { compact: false })],
                  ['Down payment', formatBDT(downPayment, { compact: false })],
                  ['Total interest', formatBDT(result.totalInterest, { compact: false })],
                  ['Total payable', formatBDT(result.totalPaid, { compact: false })],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/8 bg-base-100/60 px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</dt>
                    <dd className="mt-1 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Where the money goes</p>
              <div className="mt-4">
                <PaymentBreakdownChart financed={result.financed} totalInterest={result.totalInterest} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Amortization */}
      <div className="container-x pb-20">
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Outstanding balance over time</p>
              {firstMonth && (
                <p className="font-mono text-xs text-muted">
                  First EMI split · principal ৳{Math.round(firstMonth.principal).toLocaleString('en-IN')} + interest ৳
                  {Math.round(firstMonth.interest).toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <div className="mt-5">
              <BalanceChart schedule={schedule} />
            </div>
            <p className="mt-5 flex items-start gap-2 border-t border-white/8 pt-4 text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Estimates use a standard reducing-balance loan. Actual bank terms may include processing fees and
              insurance premiums — the finance desk will walk you through the exact offer.
            </p>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}

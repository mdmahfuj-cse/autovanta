import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Banknote, CalendarClock } from 'lucide-react';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import { calculateLoan } from '../../utils/finance.js';
import { formatBDT } from '../../utils/format.js';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';

const TENURES = [24, 36, 48, 60, 72];

/**
 * Homepage §9 — Finance preview: a genuinely working mini calculator
 * (real amortization math via utils/finance.js), teasing the full desk.
 */
export default function FinancePreview() {
  const [price, setPrice] = useState(8500000);
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(9.8);

  const downPayment = useMemo(() => Math.round((price * downPct) / 100), [price, downPct]);
  const result = useMemo(
    () => calculateLoan({ price, downPayment, months, annualRatePercent: rate }),
    [price, downPayment, months, rate]
  );

  return (
    <section className="container-x py-24 lg:py-28" aria-labelledby="finance-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Finance desk"
            title="What will it cost monthly?"
            description="Move the sliders — this preview runs the same amortization engine as our full finance desk. No estimation tricks, no pre-baked numbers."
          />
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3.5">
              {[
                { icon: BadgeCheck, text: 'Up to 70% financing on approved profiles' },
                { icon: CalendarClock, text: 'Tenures from 24 to 84 months' },
                { icon: Banknote, text: 'Rates from 8.5% — we broker across 6 banks' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-base-content/85">
                  <item.icon className="h-4.5 w-4.5 shrink-0 text-muted" aria-hidden="true" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link to={PATHS.finance} className="btn btn-primary btn-md mt-8 rounded-md px-6 font-display tracking-wide">
              Open the full calculator <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={30}>
          <div className="rounded-2xl border border-white/10 bg-base-200 p-6 shadow-2xl md:p-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="fin-price" className="text-sm font-medium">Vehicle price</label>
                  <span className="font-mono text-sm text-secondary">{formatBDT(price)}</span>
                </div>
                <input
                  id="fin-price"
                  type="range"
                  min={2000000}
                  max={45000000}
                  step={100000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="range range-xs mt-3 w-full [--range-bg:#26262e] [--range-fill:0] [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
                  aria-valuetext={formatBDT(price)}
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="fin-down" className="text-sm font-medium">Down payment</label>
                  <span className="font-mono text-sm text-secondary">
                    {downPct}% · {formatBDT(downPayment)}
                  </span>
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

              <div>
                <p className="text-sm font-medium">Loan tenure</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Loan tenure in months">
                  {TENURES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      aria-pressed={months === m}
                      className={cn(
                        'min-w-14 rounded-md border px-3 py-2 font-mono text-sm transition-colors',
                        months === m
                          ? 'border-primary bg-primary/15 text-primary-text'
                          : 'border-white/12 bg-white/[0.03] text-muted hover:border-white/25 hover:text-base-content'
                      )}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Monthly installment</p>
              <p className="mt-1 font-display text-4xl font-bold tracking-tight text-base-content md:text-5xl">
                {formatBDT(result.monthly)}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-white/8 bg-base-100/60 px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Financed</dt>
                  <dd className="mt-1 font-semibold">{formatBDT(result.financed)}</dd>
                </div>
                <div className="rounded-lg border border-white/8 bg-base-100/60 px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Total interest</dt>
                  <dd className="mt-1 font-semibold">{formatBDT(result.totalInterest)}</dd>
                </div>
                <div className="col-span-2 rounded-lg border border-white/8 bg-base-100/60 px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Total payable (incl. down)</dt>
                  <dd className="mt-1 font-semibold">{formatBDT(result.totalPaid)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

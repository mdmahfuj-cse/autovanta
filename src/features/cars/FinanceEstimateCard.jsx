import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';
import { calculateLoan } from '../../utils/finance.js';
import { formatBDT } from '../../utils/format.js';
import { PATHS } from '../../routes/paths.js';

const TENURES = [24, 36, 48, 60, 72, 84];
const DEFAULT_RATE = 9.8;

/**
 * Finance estimate on the vehicle page — real amortization math with a
 * down-payment slider and tenure chips; deep-links to the full calculator.
 */
export default function FinanceEstimateCard({ price }) {
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);

  const result = useMemo(
    () =>
      calculateLoan({
        price,
        downPayment: Math.round((price * downPct) / 100),
        months,
        annualRatePercent: DEFAULT_RATE,
      }),
    [price, downPct, months]
  );

  return (
    <div className="rounded-xl border border-white/8 bg-base-200 p-6">
      <div className="flex items-center gap-3">
        <Calculator className="h-5 w-5 text-muted" aria-hidden="true" />
        <h3 className="font-display text-base font-bold tracking-tight">Finance estimate</h3>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{DEFAULT_RATE}% p.a.</span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="detail-down" className="text-sm text-muted">Down payment</label>
          <span className="font-mono text-sm text-secondary">
            {downPct}% · {formatBDT(Math.round((price * downPct) / 100))}
          </span>
        </div>
        <input
          id="detail-down"
          type="range"
          min={0}
          max={70}
          step={5}
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          className="range range-xs mt-3 w-full [--range-thumb:#F4F4F5] [--range-progress:#B31217]"
          aria-valuetext={`${downPct} percent down`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Loan tenure">
        {TENURES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMonths(m)}
            aria-pressed={months === m}
            className={
              months === m
                ? 'min-w-12 rounded-md border border-primary/60 bg-primary/15 px-2.5 py-1.5 font-mono text-[13px] text-primary-text'
                : 'min-w-12 rounded-md border border-white/12 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[13px] text-muted transition-colors hover:border-white/25 hover:text-base-content'
            }
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Monthly installment</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-tight">{formatBDT(result.monthly)}</p>
        <p className="mt-2 text-xs text-muted">
          Total interest {formatBDT(result.totalInterest)} · Financed {formatBDT(result.financed)}
        </p>
      </div>

      <Link
        to={`${PATHS.finance}?price=${price}`}
        className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80"
      >
        Open the full calculator
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

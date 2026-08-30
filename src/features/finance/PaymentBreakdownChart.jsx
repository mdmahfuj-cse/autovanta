import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatBDT } from '../../utils/format.js';

const COLORS = { Principal: '#F4F4F5', Interest: '#B31217' };

function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-lg border border-white/12 bg-base-100/95 px-3.5 py-2.5 shadow-xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{entry.name}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold">{formatBDT(entry.value)}</p>
    </div>
  );
}

/** Donut — principal vs total interest over the whole loan. */
export default function PaymentBreakdownChart({ financed, totalInterest }) {
  const data = [
    { name: 'Principal', value: Math.round(financed) },
    { name: 'Interest', value: Math.round(totalInterest) },
  ];
  const interestPct = financed + totalInterest > 0 ? (totalInterest / (financed + totalInterest)) * 100 : 0;

  return (
    <div className="relative h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
            animationDuration={900}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<DarkTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Interest share</p>
        <p className="font-display text-2xl font-bold tracking-tight">{interestPct.toFixed(1)}%</p>
      </div>

      <div className="mt-1 flex items-center justify-center gap-5" role="list" aria-label="Payment breakdown legend">
        {data.map((entry) => (
          <span key={entry.name} role="listitem" className="inline-flex items-center gap-2 text-xs text-muted">
            <span aria-hidden="true" className="h-2 w-2 rounded-sm" style={{ backgroundColor: COLORS[entry.name] }} />
            {entry.name} · {formatBDT(entry.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

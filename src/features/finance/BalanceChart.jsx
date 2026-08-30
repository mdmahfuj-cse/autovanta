import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { compactNumber } from '../../utils/format.js';

function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/12 bg-base-100/95 px-3.5 py-2.5 shadow-xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Month {p.month}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold">৳{p.balance.toLocaleString('en-IN')} left</p>
    </div>
  );
}

/** Outstanding balance across the loan, from the real amortization schedule. */
export default function BalanceChart({ schedule }) {
  const data = schedule.map((row) => ({ month: row.month, balance: Math.round(row.balance) }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4F4F5" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#F4F4F5" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#9C9CA6', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(m) => (m % 12 === 0 ? `${m / 12}y` : '')}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9C9CA6', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => compactNumber(v)}
          />
          <Tooltip content={<DarkTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#F4F4F5"
            strokeWidth={2}
            fill="url(#balanceFill)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

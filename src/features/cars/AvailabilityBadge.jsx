import { cn } from '../../utils/cn.js';

const STYLES = {
  'In Stock': 'bg-success/15 text-success border-success/30',
  Reserved: 'bg-warning/15 text-warning border-warning/30',
  'Coming Soon': 'bg-info/15 text-info border-info/30',
  'Pre-Order': 'bg-white/10 text-secondary border-white/20',
};

export default function AvailabilityBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur',
        STYLES[status] ?? STYLES['Pre-Order'],
        className
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

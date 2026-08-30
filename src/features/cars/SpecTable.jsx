/**
 * Specification group table — icon + title header, divide-y rows.
 */
export default function SpecTable({ icon: Icon, title, rows }) {
  return (
    <div className="rounded-xl border border-white/8 bg-base-200 p-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted" aria-hidden="true" />}
        <h3 className="font-display text-base font-bold tracking-tight">{title}</h3>
      </div>
      <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-6 border-b border-white/6 py-2.5">
            <dt className="shrink-0 text-sm text-muted">{label}</dt>
            <dd className="text-right font-mono text-sm text-base-content">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

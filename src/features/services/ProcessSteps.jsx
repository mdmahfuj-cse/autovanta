import Reveal from '../../components/shared/Reveal.jsx';

/** Numbered process timeline — used on service detail pages. */
export default function ProcessSteps({ steps }) {
  return (
    <ol className="relative space-y-0 border-l border-white/10">
      {steps.map((step, i) => (
        <li key={step}>
          <Reveal delay={i * 0.06}>
            <div className="relative flex items-start gap-4 pb-6 pl-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[7px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-primary/60 bg-base-100"
              >
                <span className="h-1 w-1 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm leading-relaxed text-base-content/85">{step}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

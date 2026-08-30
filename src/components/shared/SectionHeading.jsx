import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { cn } from '../../utils/cn.js';

/**
 * Standard homepage section header — eyebrow, display title, optional
 * description and an "Explore" action aligned right (desktop).
 */
export default function SectionHeading({ eyebrow, title, description, action, align = 'left', className }) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn(centered ? 'max-w-2xl' : 'max-w-xl')}>
        <Reveal>
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-3.5 font-display text-3xl font-bold leading-[1.08] tracking-tight md:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-4 leading-relaxed text-muted">{description}</p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.18} className={cn(centered && 'mt-2')}>
          <Link
            to={action.to}
            className="group inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-5 py-2.5 font-display text-sm font-medium tracking-wide transition-colors hover:border-primary/50 hover:text-primary-text"
          >
            {action.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

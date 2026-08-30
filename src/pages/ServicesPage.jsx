import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { SERVICES, FLAGSHIP_SHOWROOM } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { formatBDT } from '../utils/format.js';
import { cn } from '../utils/cn.js';

/** All 8 services as alternating editorial sections. */
export default function ServicesPage() {
  useDocumentTitle('Services');

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            The workshop · {SERVICES.length} services
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Care beyond <span className="text-secondary">the sale</span>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            The same technicians who prep our cars keep them perfect — inspection, maintenance,
            protection and customization, all under our own roof.
          </p>
        </div>
      </section>

      {/* Service index */}
      <div className="container-x divide-y divide-white/8 py-6">
        {SERVICES.map((service, i) => (
          <Reveal key={service.slug}>
            <Link
              to={PATHS.serviceDetails(service.slug)}
              className={cn(
                'group grid items-start gap-6 py-10 transition-colors lg:grid-cols-[5rem_1.1fr_1fr_auto] lg:gap-10',
                i % 2 === 1 && 'lg:[&>*:first-child]:order-4'
              )}
            >
              {/* Index + icon */}
              <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/12 bg-white/[0.03]">
                  <service.icon className="h-5.5 w-5.5 text-base-content/80" aria-hidden="true" />
                </span>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-primary-text md:text-[1.7rem]">
                  {service.title}
                </h2>
                <p className="mt-1.5 font-display text-sm text-secondary">{service.tagline}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{service.description}</p>
              </div>

              <div className="text-sm">
                <ul className="space-y-2">
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-base-content/80">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
                {service.includes.length > 3 && (
                  <p className="mt-2.5 text-xs text-muted">+ {service.includes.length - 3} more inclusions</p>
                )}
              </div>

              {/* Meta + CTA */}
              <div className="flex flex-row items-center justify-between gap-6 border-t border-white/8 pt-4 lg:flex-col lg:items-end lg:justify-start lg:border-0 lg:pt-0">
                <div className="lg:text-right">
                  <p className="font-display text-lg font-bold tracking-tight">
                    {service.priceFrom > 0 ? `from ${formatBDT(service.priceFrom)}` : 'Complimentary'}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted lg:justify-end">
                    <Clock className="h-3 w-3" aria-hidden="true" /> {service.duration}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 text-muted transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary-text"
                >
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="container-x pb-20">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-base-200 p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">Not sure what your car needs?</h2>
              <p className="mt-1 text-sm text-muted">
                Book an inspection — {FLAGSHIP_SHOWROOM.phone} or walk into {FLAGSHIP_SHOWROOM.city}.
              </p>
            </div>
            <Link to={PATHS.contact} className="btn btn-primary btn-md shrink-0 rounded-md px-6 font-display tracking-wide">
              Talk to the workshop <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}

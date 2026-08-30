import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import { SERVICES } from '../../data/index.js';
import { formatBDT } from '../../utils/format.js';
import { PATHS_EXPORTS } from './homeLinks.js';

const PREVIEW_SLUGS = ['pre-purchase-inspection', 'scheduled-maintenance', 'studio-detailing', 'ceramic-coating'];

/**
 * Homepage §8 — Services as a numbered editorial index (not cards),
 * previewing 4 of the 8 workshop services.
 */
export default function ServicesPreview() {
  const picks = PREVIEW_SLUGS.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);

  return (
    <section className="container-x py-24 lg:py-28" aria-labelledby="services-heading">
      <SectionHeading
        eyebrow="After-sales care"
        title="Care beyond the sale"
        description="Eight workshop-grade services under our own roof — the same technicians who prep our cars keep them perfect."
        action={{ to: PATHS_EXPORTS.services, label: 'All 8 services' }}
      />

      <div className="mt-12 border-t border-white/10">
        {picks.map((service, i) => (
          <Reveal key={service.slug} delay={i * 0.06}>
            <Link
              to={PATHS_EXPORTS.services}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03] sm:grid-cols-[3.5rem_1fr_auto_2rem] sm:gap-8"
            >
              <span className="font-mono text-sm text-muted">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="flex min-w-0 items-center gap-4">
                <service.icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-semibold tracking-tight md:text-lg">
                    {service.title}
                  </span>
                  <span className="mt-0.5 hidden truncate text-sm text-muted md:block">{service.tagline}</span>
                </span>
              </span>
              <span className="hidden font-mono text-sm text-muted sm:block">
                {service.priceFrom > 0 ? `from ${formatBDT(service.priceFrom)}` : 'Complimentary'}
              </span>
              <ArrowRight
                className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-primary-text"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

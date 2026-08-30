import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock, Phone, Wrench } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import ProcessSteps from '../features/services/ProcessSteps.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { SERVICES, SERVICES_BY_SLUG, FLAGSHIP_SHOWROOM } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { formatBDT } from '../utils/format.js';

function ServiceNotFound() {
  return (
    <PageTransition className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200">
        <CircleAlert className="h-7 w-7 text-muted" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Unknown service.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        That bay doesn&apos;t exist in our workshop. See the full service menu instead.
      </p>
      <Link to={PATHS.services} className="btn btn-primary btn-md mt-8 rounded-md px-7 font-display tracking-wide">
        All services <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </PageTransition>
  );
}

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const service = SERVICES_BY_SLUG[slug];

  useDocumentTitle(service ? `${service.title} — Service` : 'Service not found');

  if (!service) return <ServiceNotFound />;

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <PageTransition>
      <div className="container-x pb-24 pt-28 lg:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
          <Link to={PATHS.home} className="transition-colors hover:text-base-content">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={PATHS.services} className="transition-colors hover:text-base-content">Services</Link>
          <span aria-hidden="true">/</span>
          <span className="text-base-content/80">{service.title}</span>
        </nav>

        {/* Header */}
        <div className="mt-8 flex flex-wrap items-start gap-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.03]">
            <service.icon className="h-7 w-7 text-base-content/85" aria-hidden="true" />
          </span>
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">{service.title}</h1>
            <p className="mt-3 font-display text-lg text-secondary">{service.tagline}</p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted">{service.description}</p>

        {/* Meta cards */}
        <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-3">
          <div className="bg-base-200 px-6 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Pricing</p>
            <p className="mt-1.5 font-display text-xl font-bold tracking-tight">
              {service.priceFrom > 0 ? `from ${formatBDT(service.priceFrom)}` : 'Complimentary'}
            </p>
          </div>
          <div className="bg-base-200 px-6 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Typical duration</p>
            <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{service.duration}</p>
          </div>
          <div className="bg-base-200 px-6 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Inclusions</p>
            <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{service.includes.length} items, itemized</p>
          </div>
        </div>

        {/* Includes + process */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight">What&apos;s included</h2>
            <ul className="mt-6 space-y-3.5">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-white/8 bg-base-200 px-4 py-3 text-sm text-base-content/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-bold tracking-tight">How it works</h2>
            <div className="mt-6">
              <ProcessSteps steps={service.process} />
            </div>
          </Reveal>
        </div>

        {/* Booking band */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-base-200 p-8 sm:flex-row">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.03] sm:flex">
                <Wrench className="h-5.5 w-5.5 text-base-content/80" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">Book this service</h2>
                <p className="mt-1 text-sm text-muted">
                  Call the workshop, or send a message and we&apos;ll confirm a slot within the hour.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <a
                href={`tel:${FLAGSHIP_SHOWROOM.phone.replace(/\s/g, '')}`}
                className="btn btn-md rounded-md border-white/15 bg-white/5 px-5 font-mono tracking-wide transition-colors hover:border-primary/50 hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                {FLAGSHIP_SHOWROOM.phone}
              </a>
              <Link to={PATHS.contact} className="btn btn-primary btn-md rounded-md px-6 font-display tracking-wide">
                Send a message
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Other services */}
        <div className="mt-16 border-t border-white/8 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold tracking-tight">Other services</h2>
            <Link to={PATHS.services} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-base-content">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Full menu
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={PATHS.serviceDetails(s.slug)}
                className="group flex items-center gap-4 rounded-xl border border-white/8 bg-base-200 px-5 py-4 transition-colors hover:border-white/20"
              >
                <s.icon className="h-5 w-5 shrink-0 text-base-content/75" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold tracking-tight">{s.title}</span>
                  <span className="block truncate text-xs text-muted">{s.duration}</span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-text"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

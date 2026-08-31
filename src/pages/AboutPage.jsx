import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import CountUp from '../components/shared/CountUp.jsx';
import TeamCard from '../features/about/TeamCard.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { STORY_STATS, VALUES, TEAM, SHOWROOMS, CARS, BRANDS, SERVICES } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { compactNumber } from '../utils/format.js';

export default function AboutPage() {
  useDocumentTitle('About Us');

  return (
    <PageTransition>
      {/* Story hero */}
      <section className="relative overflow-hidden border-b border-white/8 bg-base-200/40 pb-12 pt-32 lg:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(70%_70%_at_30%_20%,black,transparent)]"
        />
        <div className="container-x relative">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Our story
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            A showroom built by people who <span className="text-secondary">read spec sheets for fun</span>.
          </h1>
          <div className="mt-8 max-w-3xl space-y-5 leading-relaxed text-muted">
            <p>

            </p>
            <p>
              Six years later we operate three showrooms, a 12-bay workshop and a detail studio,
              representing {BRANDS.length} marques with {CARS.length} vehicles on the floor and{' '}
              {SERVICES.length} in-house services. The idea hasn&apos;t changed — the garage just got bigger.
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-white/8" aria-label="Company statistics">
        <div className="container-x grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {STORY_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                <CountUp
                  to={stat.value}
                  format={(v) =>
                    stat.format === 'compact' ? compactNumber(Math.round(v)) : Math.round(v).toLocaleString('en-US')
                  }
                />
                <span className="text-muted">{stat.suffix}</span>
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-x py-20" aria-labelledby="values-heading">
        <Reveal>
          <h2 id="values-heading" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            What we hold the line on
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.07}>
              <div className="h-full rounded-xl border border-white/8 bg-base-200 p-6">
                <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/8 bg-base-200/40 py-20" aria-labelledby="team-heading">
        <div className="container-x">
          <Reveal>
            <p className="text-eyebrow text-muted">The floor team</p>
            <h2 id="team-heading" className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
              The people who pick up the keys with you
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Showrooms strip */}
      <section className="container-x py-20" aria-labelledby="showrooms-heading">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow text-muted">The network</p>
              <h2 id="showrooms-heading" className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
                Three showrooms, one standard
              </h2>
            </div>
            <Link to={PATHS.contact} className="group inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80">
              Plan a visit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SHOWROOMS.map((showroom, i) => (
            <Reveal key={showroom.id} delay={i * 0.06}>
              <div className="h-full rounded-xl border border-white/8 bg-base-200 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-base font-bold tracking-tight">{showroom.name}</h3>
                  {showroom.flagship && (
                    <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {showroom.address}
                </p>
                <p className="mt-2.5 font-mono text-xs text-muted">
                  Sat–Thu {showroom.hours.satToThu} · Fri {showroom.hours.friday}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="container-x pb-24">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-base-200 p-8 sm:flex-row">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">Come argue about torque with us.</h2>
              <p className="mt-1 text-sm text-muted">The floor is open seven days a week — coffee included.</p>
            </div>
            <Link to={PATHS.testDrive} className="btn btn-primary btn-md shrink-0 rounded-md px-6 font-display tracking-wide">
              Book a test drive <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}

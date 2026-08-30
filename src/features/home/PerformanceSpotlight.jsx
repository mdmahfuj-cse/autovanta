import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import Parallax from '../../components/shared/Parallax.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import CountUp from '../../components/shared/CountUp.jsx';
import { SPOTLIGHT_CAR } from '../../data/index.js';
import { PATHS } from '../../routes/paths.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/**
 * Homepage §5 — Performance Spotlight (Tesla Model S Plaid).
 * Split composition: narrative + animated spec counters left,
 * parallax campaign shot right, on a carbon-black well.
 */
export default function PerformanceSpotlight() {
  const car = SPOTLIGHT_CAR;

  const stats = [
    { value: car.engine.powerHp, suffix: ' hp', label: 'Tri-motor output', decimals: 0 },
    { value: car.performance.zeroTo100, suffix: ' s', label: '0–100 km/h', decimals: 1 },
    { value: car.performance.topSpeedKmh, suffix: ' km/h', label: 'Top speed', decimals: 0 },
  ];

  return (
    <section className="relative overflow-hidden bg-carbon py-24 lg:py-32" aria-labelledby="performance-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(70%_70%_at_30%_40%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[140px]"
      />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="text-eyebrow flex items-center gap-2.5 text-muted">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              Performance spotlight
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 id="performance-heading" className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              1,020 horsepower.
              <br />
              <span className="text-muted">Zero apologies.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              {car.description} Launch control engages, the road blurs, and physics files a complaint.
              This is the flagship of our performance wing — and it is street legal.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-3 gap-6 border-y border-white/10 py-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 + i * 0.08}>
                <p className="font-display text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                  <CountUp
                    to={stat.value}
                    duration={1.8}
                    format={(v) => (stat.decimals ? v.toFixed(1) : Math.round(v).toLocaleString('en-US'))}
                  />
                  <span className="text-muted">{stat.suffix}</span>
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={PATHS_EXPORTS.performance} className="btn btn-primary rounded-md px-6 font-display tracking-wide">
                Explore performance cars <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to={PATHS.carDetails(car.slug)}
                className="btn rounded-md border-white/15 bg-white/5 px-6 font-display tracking-wide transition-colors hover:border-primary/50 hover:bg-white/10"
              >
                View this machine
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={34}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-2xl border border-white/12"
              style={{ transform: 'translate(14px, 14px)' }}
            />
            <Parallax distance={26} className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={car.images[1].src}
                alt={`${car.model} ${car.trim} — exterior`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                  {car.year} · {car.model} {car.trim}
                </p>
              </div>
            </Parallax>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

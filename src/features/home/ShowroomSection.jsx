import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import Parallax from '../../components/shared/Parallax.jsx';
import { SHOWROOMS } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/**
 * Homepage §12 — Showroom network: flagship imagery + the three locations.
 */
export default function ShowroomSection() {
  const [flagship, ...others] = SHOWROOMS;

  return (
    <section className="border-t border-white/8 bg-base-200/40 py-24 lg:py-28" aria-labelledby="showroom-heading">
      <div className="container-x">
        <SectionHeading
          eyebrow="Visit us"
          title="Three showrooms. One standard."
          description="Walk the floor, sit in the cars, argue with us about torque. The coffee machine is always on."
          action={{ to: PATHS_EXPORTS.contact, label: 'Plan a visit' }}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Flagship image */}
          <Reveal y={30}>
            <div className="relative h-full min-h-80 overflow-hidden rounded-2xl border border-white/10">
              <Parallax distance={24} className="absolute inset-0">
                <img
                  src={flagship.image}
                  alt={`AutoVanta ${flagship.city} flagship showroom at dusk`}
                  loading="lazy"
                  className="h-[116%] w-full object-cover"
                />
              </Parallax>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Flagship
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
                  AutoVanta {flagship.city}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/70">{flagship.address}</p>
              </div>
            </div>
          </Reveal>

          {/* Location list */}
          <div className="flex flex-col justify-between gap-6">
            {[flagship, ...others].map((showroom, i) => (
              <Reveal key={showroom.id} delay={i * 0.08}>
                <div className="rounded-xl border border-white/10 bg-base-100 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold tracking-tight">{showroom.name}</h3>
                    {showroom.flagship && (
                      <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
                        Flagship
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted">
                    <li className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      {showroom.address}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <a href={`tel:${showroom.phone.replace(/\s/g, '')}`} className="font-mono transition-colors hover:text-base-content">
                        {showroom.phone}
                      </a>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <span>
                        Sat–Thu {showroom.hours.satToThu} · Fri {showroom.hours.friday}
                      </span>
                    </li>
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <Link
                to={PATHS_EXPORTS.about}
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80"
              >
                Our story, team and standards
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarClock, Phone } from 'lucide-react';
import Reveal from '../../components/shared/Reveal.jsx';
import Parallax from '../../components/shared/Parallax.jsx';
import { FLAGSHIP_SHOWROOM } from '../../data/index.js';
import { PATHS } from '../../routes/paths.js';

/**
 * Homepage §10 — full-bleed test-drive band over the flagship showroom,
 * with parallax backdrop and a direct phone line.
 */
export default function TestDriveCta() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="testdrive-heading">
      <Parallax distance={44} className="absolute inset-0">
        <img
          src={FLAGSHIP_SHOWROOM.image}
          alt=""
          loading="lazy"
          className="h-[120%] w-full -translate-y-[6%] object-cover"
        />
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-100/80 to-base-100/92" />

      <div className="container-x relative py-28 text-center lg:py-36">
        <Reveal>
          <p className="text-eyebrow text-muted">The only review that matters is yours</p>
        </Reveal>
        <Reveal delay={0.07}>
          <h2 id="testdrive-heading" className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Read the specs.
            <br />
            <span className="text-muted">Then come ignore them.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            Ten minutes behind the wheel tells you more than a month of research. Pick a machine, a
            time and a showroom — we&apos;ll have it fueled, warmed and waiting.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to={PATHS.testDrive} className="btn btn-primary btn-lg rounded-md px-8 font-display tracking-wide">
              <CalendarClock className="h-4.5 w-4.5" aria-hidden="true" />
              Book a test drive
            </Link>
            <motion.a
              href={`tel:${FLAGSHIP_SHOWROOM.phone.replace(/\s/g, '')}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-lg rounded-md border-white/15 bg-white/5 font-mono tracking-wide backdrop-blur transition-colors hover:border-primary/50 hover:bg-white/10"
            >
              <Phone className="h-4.5 w-4.5 text-muted" aria-hidden="true" />
              {FLAGSHIP_SHOWROOM.phone}
            </motion.a>
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Free · 30 minutes · {FLAGSHIP_SHOWROOM.city} flagship + 2 more showrooms
          </p>
        </Reveal>
      </div>
    </section>
  );
}

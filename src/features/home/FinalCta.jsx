import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarClock } from 'lucide-react';
import Reveal from '../../components/shared/Reveal.jsx';
import { PATHS } from '../../routes/paths.js';

/**
 * Homepage §13 — closing statement: oversized display type, ambient glow,
 * two exits into the catalogue.
 */
export default function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-28 lg:py-40" aria-labelledby="final-heading">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[24rem] w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[130px]"
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-x relative text-center">
        <Reveal>
          <p className="text-eyebrow text-muted">AutoVanta · est. for enthusiasts</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id="final-heading"
            className="mx-auto mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
          >
            Your next machine
            <br />
            is <span className="text-secondary">waiting.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted">
            Walk in, or book it online — the floor is open seven days a week and the keys are closer
            than you think.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={PATHS.cars} className="btn btn-primary btn-lg rounded-md px-8 font-display tracking-wide">
              Explore the garage <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
            <Link
              to={PATHS.testDrive}
              className="btn btn-lg rounded-md border-white/15 bg-white/5 px-8 font-display tracking-wide backdrop-blur transition-colors hover:border-primary/50 hover:bg-white/10"
            >
              <CalendarClock className="h-4.5 w-4.5 text-muted" aria-hidden="true" />
              Book a test drive
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

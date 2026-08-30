import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, CalendarClock, ChevronDown } from 'lucide-react';
import { HERO_SLIDES, getCarBySlug } from '../../data/index.js';
import { PATHS } from '../../routes/paths.js';
import { EASE_OUT_EXPO } from '../../components/shared/motionTokens.js';
import { formatBDT } from '../../utils/format.js';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 56;

/**
 * Cinematic hero carousel (Phase 10) — rotates the HERO_SLIDES headliners.
 * Kept deliberately simple/stable per the project brief:
 *  - backdrop = stacked imgs crossfading via CSS opacity (no unmount churn)
 *  - content = AnimatePresence mode="wait" keyed by slide (exactly one h1)
 *  - autoplay pauses on hover/focus and disables under prefers-reduced-motion
 *  - swipe gestures with a generous threshold; dots are plain buttons
 */
export default function Hero() {
  const total = HERO_SLIDES.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const swipeStart = useRef(null);
  const reduce = useReducedMotion();

  const slide = HERO_SLIDES[index];
  const car = getCarBySlug(slide.carId);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

  const go = (next) => setIndex(((next % total) + total) % total);

  // Autoplay — hover/focus pause, no autoplay for reduced motion
  useEffect(() => {
    if (paused || reduce || total < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduce, total]);

  // Swipe (horizontal intent only — never blocks taps/scroll)
  const onPointerDown = (e) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  // Entrance choreography (replays per slide via keyed remount)
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
  };
  const line = {
    hidden: reduce ? { opacity: 0 } : { y: '112%' },
    show: { opacity: 1, y: '0%', transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
  };

  const specChips = [
    { label: 'Power', value: `${car.engine.powerHp} hp` },
    { label: '0–100 km/h', value: `${car.performance.zeroTo100} s` },
    { label: 'Top speed', value: `${car.performance.topSpeedKmh} km/h` },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Backdrop images — stacked, active crossfades in */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.id}
            src={s.image}
            alt={i === index ? s.alt : ''}
            aria-hidden={i !== index}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
              s.imagePosition ?? 'object-center'
            } ${i === index ? 'opacity-100' : 'opacity-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        ))}
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/78 to-base-100/10 md:via-base-100/55" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-base-100 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(65%_55%_at_28%_45%,black,transparent)]" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-primary/8 blur-[130px]"
        animate={reduce ? undefined : { x: [0, 34, 0], y: [0, -22, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content — keyed per slide so each entrance replays; mode="wait"
          guarantees exactly one h1 in the document at any moment */}
      <motion.div
        className="container-x relative flex flex-1 items-center pb-20 pt-32 lg:pt-36"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}`}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -18, transition: { duration: 0.25, ease: 'easeIn' } }}
            className="w-full"
          >
            <div className="max-w-2xl lg:max-w-3xl">
              <motion.p variants={fadeUp} className="text-eyebrow flex items-center gap-3 text-muted">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {slide.eyebrow}
              </motion.p>

              <h1 className="mt-6 font-display text-[2.9rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                {slide.titleLines.map((l, i) => (
                  <span key={l} className="block overflow-hidden pb-1">
                    <motion.span className="block" variants={line}>
                      {i === slide.titleLines.length - 1 ? (
                        <span className="text-secondary">{l}</span>
                      ) : (
                        l
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                {slide.subtitle}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
                <Link to={PATHS.cars} className="btn btn-primary btn-lg rounded-md px-7 font-display tracking-wide">
                  Explore Cars <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
                </Link>
                <Link
                  to={PATHS.testDrive}
                  className="btn btn-lg rounded-md border-white/15 bg-white/5 px-7 font-display tracking-wide backdrop-blur transition-colors hover:border-primary/50 hover:bg-white/10"
                >
                  <CalendarClock className="h-4.5 w-4.5 text-muted" aria-hidden="true" />
                  Book Test Drive
                </Link>
              </motion.div>

              {/* Spec chips (mobile / tablet) */}
              <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-3 lg:hidden">
                {specChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-lg border border-white/12 bg-base-200/60 px-4 py-2.5 backdrop-blur"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{chip.label}</p>
                    <p className="mt-0.5 font-display text-base font-bold">{chip.value}</p>
                  </div>
                ))}
                <Link
                  to={PATHS.carDetails(car.slug)}
                  className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary-text backdrop-blur transition-colors hover:bg-primary/20"
                >
                  View this machine <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>

            {/* Floating spec plates over the car (desktop) */}
            <div className="pointer-events-none absolute inset-y-0 right-8 hidden w-[26rem] items-center lg:flex xl:right-16">
              {specChips.map((chip, i) => (
                <motion.div
                  key={chip.label}
                  className={`absolute ${i === 0 ? 'right-64 top-[24%]' : i === 1 ? 'right-8 top-[44%]' : 'right-48 top-[64%]'}`}
                  initial={{ opacity: 0, scale: 0.7, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.9 + i * 0.16 }}
                >
                  <motion.div
                    animate={reduce ? undefined : { y: [0, -7, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-xl border border-white/12 bg-base-200/55 px-5 py-3.5 shadow-2xl backdrop-blur-md"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{chip.label}</p>
                    <p className="mt-1 font-display text-2xl font-bold tracking-tight">{chip.value}</p>
                  </motion.div>
                </motion.div>
              ))}
              <motion.div
                className="absolute bottom-[14%] right-16"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <Link
                  to={PATHS.carDetails(car.slug)}
                  className="pointer-events-auto group flex items-center gap-2.5 rounded-full border border-white/15 bg-base-200/60 py-2 pl-2 pr-5 text-sm font-medium backdrop-blur-md transition-colors hover:border-primary/50"
                >
                  <span className="rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                    {formatBDT(car.price)}
                  </span>
                  View this machine
                  <ArrowRight className="h-4 w-4 text-primary-text transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Carousel controls + scroll hint */}
      <div className="container-x absolute inset-x-0 bottom-6 z-10 flex items-center justify-between">
        <div role="group" aria-label="Choose featured vehicle">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1} of ${total}`}
              aria-current={i === index ? 'true' : undefined}
              className={`mr-2 inline-block h-2.5 rounded-full align-middle transition-all duration-300 ${
                i === index ? 'w-7 bg-primary' : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          className="hidden text-muted md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          style={{ opacity: contentOpacity }}
        >
          <motion.div animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

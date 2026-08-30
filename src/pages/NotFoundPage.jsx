import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import { EASE_OUT_EXPO } from '../components/shared/motionTokens.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { PATHS } from '../routes/paths.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  const fadeUp = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.07 * i },
  });

  return (
    <PageTransition className="relative flex min-h-[85vh] items-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-[38rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container-x relative py-32 text-center">
        <motion.p {...fadeUp(0)} className="text-eyebrow text-muted">
          Error 404
        </motion.p>
        <motion.h1
          {...fadeUp(1)}
          className="mx-auto mt-4 font-display text-6xl font-bold tracking-tight md:text-8xl"
        >
          Dead end<span className="text-secondary">.</span>
        </motion.h1>
        <motion.p {...fadeUp(2)} className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          This road doesn&apos;t exist — it may have been decommissioned, or the address was
          mistyped.
        </motion.p>
        <motion.div {...fadeUp(3)} className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to={PATHS.home} className="btn btn-primary rounded-md px-6 font-display tracking-wide">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            to={PATHS.cars}
            className="btn rounded-md border-white/15 bg-white/5 px-6 font-display tracking-wide hover:border-primary/50 hover:bg-white/10"
          >
            Browse the Garage <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.p {...fadeUp(4)} className="mt-10 font-mono text-xs text-muted">
          404 · ROUTE NOT FOUND
        </motion.p>
      </div>
    </PageTransition>
  );
}

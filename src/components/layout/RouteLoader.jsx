import { motion } from 'motion/react';
import { LogoMark } from '../ui/Logo.jsx';

export default function RouteLoader() {
  return (
    <div
      className="flex min-h-[65vh] flex-col items-center justify-center gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <motion.div
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LogoMark className="h-12 w-12" />
      </motion.div>
      <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full w-1/3 rounded-full bg-primary"
          animate={{ x: ['-110%', '340%'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-eyebrow text-muted">Loading</p>
    </div>
  );
}

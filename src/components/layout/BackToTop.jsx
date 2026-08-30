import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useScrolled } from '../../hooks/useScrollPosition.js';

export default function BackToTop() {
  const visible = useScrolled(700);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="btn btn-circle fixed bottom-5 right-5 z-40 border-white/10 bg-base-200/90 text-base-content shadow-xl backdrop-blur transition-colors hover:border-primary/50 hover:text-primary-text"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

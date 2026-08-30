import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_EXPO } from './motionTokens.js';

/**
 * Standard page transition — fade + subtle rise.
 * Honors prefers-reduced-motion by degrading to opacity only.
 * Must be the root element of every page so exit animations work.
 */
export default function PageTransition({ children, className }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

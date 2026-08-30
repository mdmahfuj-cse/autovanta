import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_EXPO } from './motionTokens.js';

/**
 * Scroll-into-view reveal — fades/rises children once when ~30% visible.
 * Honors prefers-reduced-motion by degrading to opacity only.
 */
export default function Reveal({ children, delay = 0, y = 22, amount = 0.3, className }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.65, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

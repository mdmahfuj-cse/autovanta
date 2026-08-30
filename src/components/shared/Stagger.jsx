import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_EXPO } from './motionTokens.js';

/** Staggered container — children (motion elements) animate in sequence. */
export function Stagger({ children, delay = 0, step = 0.09, className }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

/** Child of <Stagger> — fades and rises. */
export function StaggerItem({ children, y = 24, className }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

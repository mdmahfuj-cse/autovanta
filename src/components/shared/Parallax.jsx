import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Subtle scroll parallax — translates children by ±distance px while the
 * wrapper crosses the viewport. Disabled under prefers-reduced-motion.
 */
export default function Parallax({ children, distance = 40, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      {reduce ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}

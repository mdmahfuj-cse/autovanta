import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

/**
 * Animated number counter — springs from 0 to `to` when scrolled into view.
 * `format` receives the live value; render the text content directly.
 */
export default function CountUp({ to, format = (v) => Math.round(v).toLocaleString('en-US'), duration = 1.6, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const value = useMotionValue(0);
  const spring = useSpring(value, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, value, to]);

  useEffect(() => spring.on('change', (v) => {
    if (ref.current) ref.current.textContent = format(v);
  }), [spring, format]);

  return <span ref={ref} className={className}>{format(0)}</span>;
}

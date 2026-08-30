import { AnimatePresence, motion } from 'motion/react';
import CarCard from './CarCard.jsx';
import CarListItem from './CarListItem.jsx';
import { EASE_OUT_EXPO } from '../../components/shared/motionTokens.js';

/**
 * Animated catalogue results — grid/list morph with layout animations and
 * popLayout exits when filters change.
 */
export default function CarGrid({ cars, viewMode }) {
  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      layout
      className={isGrid ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}
    >
      <AnimatePresence mode="popLayout">
        {cars.map((car) => (
          <motion.div
            key={car.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
          >
            {isGrid ? <CarCard car={car} className="h-full" /> : <CarListItem car={car} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

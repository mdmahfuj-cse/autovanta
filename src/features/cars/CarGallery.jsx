import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { EASE_OUT_EXPO } from '../../components/shared/motionTokens.js';
import { cn } from '../../utils/cn.js';

/**
 * Vehicle gallery — main stage with directional crossfade, thumbnail rail
 * with a layoutId active indicator, keyboard-accessible controls.
 */
export default function CarGallery({ car }) {
  const [index, setIndex] = useState(0);
  const images = car.images;
  const current = images[index];

  const go = (dir) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-base-200">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={index}
            src={current.src}
            alt={current.alt}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute left-4 top-4 z-10">
          <AvailabilityBadge status={car.availability} />
        </div>
        <p className="absolute bottom-3 right-4 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-white/80 backdrop-blur">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} · {current.kind.toUpperCase()}
        </p>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/90 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary-text"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/90 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary-text"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3.5 grid grid-cols-4 gap-3" role="group" aria-label="Gallery thumbnails">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${img.kind} image`}
            aria-current={i === index}
            className={cn(
              'relative aspect-[16/10] overflow-hidden rounded-lg border transition-colors',
              i === index ? 'border-primary/70' : 'border-white/10 hover:border-white/30'
            )}
          >
            {i === index && (
              <motion.span
                layoutId="gallery-thumb-active"
                className="absolute inset-0 rounded-lg ring-1 ring-primary/70"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <img src={img.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

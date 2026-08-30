import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Cog, Fuel, Gauge, Heart, Scale } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';
import { formatBDT, formatKm } from '../../utils/format.js';
import { useWishlistStore } from '../../stores/wishlistStore.js';
import { useCompareStore } from '../../stores/compareStore.js';
import { toast } from '../../stores/toastStore.js';
import { BRANDS_BY_ID } from '../../data/index.js';

/**
 * Premium vehicle card — image, availability, spec strip, price and actions.
 * Used in car grids and horizontal scrollers; wishlist/compare actions are
 * wired to the global stores with toast feedback.
 */
export default function CarCard({ car, className }) {
  const wishlisted = useWishlistStore((s) => s.ids.includes(car.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => s.ids.includes(car.id));
  const toggleCompare = useCompareStore((s) => s.toggle);

  const brand = BRANDS_BY_ID[car.brandId];
  const isEv = car.fuel === 'EV';

  const onToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(car.id);
    toast(
      wishlisted
        ? { title: 'Removed from wishlist', description: `${brand?.name ?? ''} ${car.model} ${car.trim}`.trim(), variant: 'info' }
        : { title: 'Saved to wishlist', description: `${brand?.name ?? ''} ${car.model} ${car.trim}`.trim(), variant: 'success' }
    );
  };

  const onToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(car.id);
    if (!result.ok) {
      toast({
        title: 'Compare garage is full',
        description: 'You can compare up to 4 vehicles — remove one first.',
        variant: 'error',
      });
      return;
    }
    toast(
      result.added
        ? { title: 'Added to compare garage', description: `${car.model} ${car.trim}`, variant: 'success' }
        : { title: 'Removed from compare garage', description: `${car.model} ${car.trim}`, variant: 'info' }
    );
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-white/8 bg-base-200 transition-colors duration-300 hover:border-white/20',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={car.images[0].src}
          alt={car.images[0].alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent opacity-70" />
        <div className="absolute left-3 top-3 z-10">
          <AvailabilityBadge status={car.availability} />
        </div>
        <div className="absolute right-3 top-3 z-10 flex gap-1.5">
          <motion.button
            type="button"
            whileTap={{ scale: 1.35 }}
            onClick={onToggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={wishlisted}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur transition-colors',
              wishlisted
                ? 'border-primary/60 bg-primary/20 text-primary-text'
                : 'border-white/15 bg-black/40 text-white/80 hover:text-primary-text'
            )}
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 1.35 }}
            onClick={onToggleCompare}
            aria-label={compared ? 'Remove from compare' : 'Add to compare'}
            aria-pressed={compared}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur transition-colors',
              compared
                ? 'border-primary/60 bg-primary/20 text-primary-text'
                : 'border-white/15 bg-black/40 text-white/80 hover:text-primary-text'
            )}
          >
            <Scale className="h-4 w-4" />
          </motion.button>
        </div>
        <p className="absolute bottom-2.5 left-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
          {brand?.code} · {car.condition === 'New' ? 'Brand New' : 'Certified Pre-Owned'}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {brand?.name} · {car.year}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight">
          <Link
            to={PATHS.carDetails(car.slug)}
            className="absolute inset-0 z-[5]"
            aria-label={`View ${brand?.name} ${car.model} ${car.trim}`}
          />
          {car.model} <span className="font-medium text-muted">{car.trim}</span>
        </h3>
        <p className="mt-1 text-sm text-muted">
          {car.engine.displacementL ? `${car.engine.displacementL}L ` : ''}
          {car.engine.layout}
          {car.engine.layout === 'Single e-motor' || car.engine.layout === 'Dual e-motors' || car.engine.layout === 'Tri e-motors' ? '' : ` · ${car.engine.powerHp} hp`}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/8 pt-4 text-[13px] text-base-content/75">
          <span className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {isEv ? 'Electric' : car.fuel}
          </span>
          <span className="flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {formatKm(car.mileageKm)}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Asking</p>
            <p className="mt-0.5 font-display text-xl font-bold tracking-tight text-base-content">
              {formatBDT(car.price)}
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary-text opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-1">
            Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}

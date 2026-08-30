import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, Scale, Trash2 } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import CarCard from '../features/cars/CarCard.jsx';
import { useWishlistStore } from '../stores/wishlistStore.js';
import { useCompareStore } from '../stores/compareStore.js';
import { toast } from '../stores/toastStore.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getCarsByIds, FEATURED_PICKS } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { cn } from '../utils/cn.js';
import { EASE_OUT_EXPO } from '../components/shared/motionTokens.js';

function EmptyWishlist() {
  const suggestions = FEATURED_PICKS.slice(0, 3);

  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200">
        <Heart className="h-7 w-7 text-muted" aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">Nothing saved yet.</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Tap the heart on any vehicle while you browse — your shortlist lives in this browser and
        survives reloads. No account needed.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to={PATHS.cars} className="btn btn-primary btn-md rounded-md px-6 font-display tracking-wide">
          Browse the garage <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to={PATHS.brands}
          className="btn btn-md rounded-md border-white/15 bg-white/5 px-6 font-display tracking-wide transition-colors hover:border-primary/50 hover:bg-white/10"
        >
          Explore brands
        </Link>
      </div>

      <div className="mt-16 w-full">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Or start with these</p>
        <div className="mt-6 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  useDocumentTitle('Wishlist');
  const ids = useWishlistStore((s) => s.ids);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const cars = getCarsByIds(ids);

  const [confirmingClear, setConfirmingClear] = useState(false);

  /** Bulk-add saved cars to the compare garage (respecting the 4-slot cap). */
  const compareAllSaved = () => {
    const store = useCompareStore.getState();
    let added = 0;
    let skipped = 0;

    for (const car of cars) {
      if (store.has(car.id)) continue;
      const result = store.toggle(car.id);
      if (result.ok) added += 1;
      else skipped += 1;
    }

    if (added > 0) {
      toast({
        title: `${added} ${added === 1 ? 'vehicle' : 'vehicles'} added to compare`,
        description: skipped > 0 ? `${skipped} skipped — the garage holds 4 max.` : 'The table is ready.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Compare garage is full',
        description: 'Remove a vehicle from the tray first, then try again.',
        variant: 'error',
      });
    }
  };

  const onClear = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000);
      return;
    }
    clearWishlist();
    setConfirmingClear(false);
    toast({ title: 'Wishlist cleared', description: 'Saved vehicles removed.', variant: 'info' });
  };

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Saved vehicles · {cars.length} {cars.length === 1 ? 'car' : 'cars'}
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              Your <span className="text-secondary">wishlist</span>.
            </h1>

            {cars.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={compareAllSaved}
                  className="btn btn-sm rounded-md border-white/12 bg-base-100 px-4 font-display tracking-wide transition-colors hover:border-primary/40"
                >
                  <Scale className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  Compare all
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className={cn(
                    'btn btn-sm rounded-md px-4 font-display tracking-wide transition-colors',
                    confirmingClear
                      ? 'border-error/50 bg-error/10 text-error-text'
                      : 'border-white/12 bg-base-100 text-muted hover:border-primary/40 hover:text-base-content'
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {confirmingClear ? 'Sure? Click again' : 'Clear all'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-x py-12">
        {cars.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cars.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                >
                  <CarCard car={car} className="h-full" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {cars.length > 0 && (
          <p className="mt-10 text-sm text-muted" aria-live="polite">
            Saved locally in this browser — remove cars with the heart icon, or{' '}
            <Link to={PATHS.cars} className="font-medium text-base-content underline-offset-4 hover:text-primary-text hover:underline">
              keep browsing
            </Link>
            .
          </p>
        )}
      </div>
    </PageTransition>
  );
}

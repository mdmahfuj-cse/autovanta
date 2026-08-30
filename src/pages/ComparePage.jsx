import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scale, Sparkles } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../components/shared/Stagger.jsx';
import CarCard from '../features/cars/CarCard.jsx';
import CompareTable, { FeaturesBreakdown } from '../features/compare/CompareTable.jsx';
import { useCompareStore } from '../stores/compareStore.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getCarsByIds, FEATURED_PICKS } from '../data/index.js';
import { PATHS } from '../routes/paths.js';

function CompareEmptyState({ cars }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200">
        <Scale className="h-7 w-7 text-muted" aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold tracking-tight">
        {cars.length === 0 ? 'The garage is empty.' : 'One car is a monologue.'}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        {cars.length === 0
          ? 'Tap the scale icon on any vehicle to park it here. Add 2–4 cars and AutoVanta lines up 23 metrics with the differences highlighted.'
          : 'Good start — add at least one more car and the comparison table builds itself.'}
      </p>
    </div>
  );
}

export default function ComparePage() {
  useDocumentTitle('Compare Garage');
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const cars = getCarsByIds(ids);
  const ready = cars.length >= 2;

  const suggestions = FEATURED_PICKS.filter((c) => !ids.includes(c.id)).slice(0, 3);

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Compare garage · {cars.length} of 4 slots
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              Spec sheets, <span className="text-secondary">face to face</span>.
            </h1>
            {cars.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="btn btn-sm rounded-md border-white/12 bg-base-100 px-4 font-display tracking-wide text-muted transition-colors hover:border-primary/40 hover:text-base-content"
              >
                Clear garage
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container-x py-12">
        {ready ? (
          <>
            <CompareTable cars={cars} />
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold tracking-tight">Feature breakdown</h2>
              <p className="mt-2 text-sm text-muted">Every convenience, screen and sensor — car by car.</p>
              <div className="mt-6">
                <FeaturesBreakdown cars={cars} />
              </div>
            </div>
          </>
        ) : (
          <>
            <CompareEmptyState cars={cars} />
            {cars.length === 1 && (
              <div className="mx-auto max-w-sm">
                <CarCard car={cars[0]} />
              </div>
            )}
          </>
        )}

        {/* Add more */}
        {suggestions.length > 0 && (
          <div className="mt-20">
            <SectionHeading
              eyebrow="Fill the remaining slots"
              title={ready ? 'Swap the line-up' : cars.length === 0 ? 'Start with a featured machine' : 'Add a rival'}
              description="Tap the scale icon on any card to add it to the garage."
            />
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((car) => (
                <StaggerItem key={car.id} className="h-full">
                  <CarCard car={car} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}

        {/* Cross-link to wishlist */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-2 text-sm text-muted"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Built a shortlist first?
          <Link to={PATHS.wishlist} className="font-medium text-base-content underline-offset-4 transition-colors hover:text-primary-text hover:underline">
            Compare your saved wishlist
          </Link>
        </motion.p>
      </div>
    </PageTransition>
  );
}

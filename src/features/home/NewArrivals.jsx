import CarCard from '../cars/CarCard.jsx';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import { NEW_ARRIVAL_PICKS } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/**
 * Homepage §6 — New arrivals as a horizontal snap scroller
 * (deliberately different composition from the Featured grid).
 */
export default function NewArrivals() {
  return (
    <section className="py-24 lg:py-28" aria-labelledby="arrivals-heading">
      <div className="container-x">
        <SectionHeading
          eyebrow="Just landed"
          title="New on the floor"
          description="Freshly unloaded, fully detailed and photographed the same day. What you see is what the truck delivered."
          action={{ to: PATHS_EXPORTS.newArrivals, label: 'All new arrivals' }}
        />
      </div>

      <Stagger className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 no-scrollbar sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {NEW_ARRIVAL_PICKS.map((car) => (
          <StaggerItem key={car.id} className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
            <CarCard car={car} className="h-full" />
          </StaggerItem>
        ))}

        {/* End card */}
        <StaggerItem className="w-[70vw] shrink-0 snap-start sm:w-56">
          <a
            href={PATHS_EXPORTS.newArrivals}
            className="group flex h-full min-h-72 flex-col items-start justify-between rounded-xl border border-dashed border-white/15 bg-transparent p-6 transition-colors hover:border-primary/50"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Weekly drops</span>
            <span>
              <span className="block font-display text-2xl font-bold leading-tight tracking-tight">
                See what's
                <br />
                coming next
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-base-content">
                Open the garage
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </span>
          </a>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

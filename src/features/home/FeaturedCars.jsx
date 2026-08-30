import CarCard from '../cars/CarCard.jsx';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import { FEATURED_PICKS } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/** Homepage §2 — Featured machines (3 curated units) → /cars?flag=featured */
export default function FeaturedCars() {
  return (
    <section className="container-x py-24 lg:py-28" aria-labelledby="featured-heading">
      <SectionHeading
        eyebrow="Curated stock"
        title="Featured machines"
        description="Hand-picked from this month's floor — inspected, detailed and ready for the road. Three statements, three different philosophies of speed."
        action={{ to: PATHS_EXPORTS.featuredCars, label: 'View all featured' }}
      />

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
        {FEATURED_PICKS.map((car) => (
          <StaggerItem key={car.id} className="h-full">
            <CarCard car={car} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import { CATEGORIES, CATEGORY_COUNTS, CARS } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';
import { cn } from '../../utils/cn.js';

/**
 * Homepage §4 — category tiles in an asymmetric editorial mosaic
 * (SUV anchors the grid; "All categories" tile closes the layout).
 */
export default function CategoryMosaic() {
  const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const small = ['sedan', 'sports', 'coupe', 'luxury', 'electric', 'hybrid'];

  return (
    <section className="container-x py-24 lg:py-28" aria-labelledby="categories-heading">
      <SectionHeading
        eyebrow="Find your shape"
        title="Shop by category"
        description="From boardroom sedans to weekend weapons — start with the silhouette that fits your life."
      />

      <Stagger className="mt-12 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4" step={0.07}>
        {/* SUV — hero tile spanning 2×2 */}
        <StaggerItem className="col-span-2 row-span-2 h-full">
          <CategoryTile category={byId.suv} large />
        </StaggerItem>

        {/* Sedan — wide tile */}
        <StaggerItem className="col-span-2 h-full">
          <CategoryTile category={byId.sedan} wide />
        </StaggerItem>

        {small.slice(0, 2).map((id) => (
          <StaggerItem key={id} className="h-full">
            <CategoryTile category={byId[id]} />
          </StaggerItem>
        ))}
        {small.slice(2, 4).map((id) => (
          <StaggerItem key={id} className="h-full">
            <CategoryTile category={byId[id]} />
          </StaggerItem>
        ))}
        {small.slice(4, 6).map((id) => (
          <StaggerItem key={id} className="h-full">
            <CategoryTile category={byId[id]} />
          </StaggerItem>
        ))}

        {/* All categories — typographic tile */}
        <StaggerItem className="h-full">
          <Link
            to="/cars"
            className="group flex h-full min-h-40 flex-col justify-between rounded-xl border border-white/15 bg-gradient-to-br from-primary/10 via-base-200 to-base-200 p-5 transition-colors duration-300 hover:border-white/30"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{CARS.length.toString().padStart(2, '0')} vehicles</span>
            <span>
              <span className="block font-display text-lg font-bold leading-tight tracking-tight">
                The full
                <br />
                garage
              </span>
              <ArrowRight
                className="mt-3 h-5 w-5 text-muted transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

function CategoryTile({ category, large = false, wide = false }) {
  return (
    <Link
      to={PATHS_EXPORTS.category(category.id)}
      className="group relative block h-full min-h-40 overflow-hidden rounded-xl border border-white/10"
    >
      <img
        src={category.image}
        alt=""
        loading="lazy"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]',
          large ? 'object-[70%_center]' : 'object-[62%_center]'
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
            {(CATEGORY_COUNTS[category.id] ?? 0).toString().padStart(2, '0')} vehicles
          </p>
          <h3
            className={cn(
              'mt-1 font-display font-bold tracking-tight text-white',
              large ? 'text-3xl md:text-4xl' : wide ? 'text-2xl' : 'text-lg'
            )}
          >
            {category.label}
          </h3>
          {!large && !wide && (
            <p className="mt-1 hidden max-w-36 text-xs leading-relaxed text-white/60 md:block">{category.tagline}</p>
          )}
          {large && <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">{category.tagline}</p>}
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

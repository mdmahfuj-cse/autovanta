import { Link } from 'react-router-dom';
import BrandMark from '../brands/BrandMark.jsx';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import { BRANDS, BRAND_COUNTS } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/**
 * Homepage §3 — the twelve marques as a hairline-grid "racing plate" wall.
 * Tapping any plate opens the brand directory (brand pages land in Phase 5).
 */
export default function BrandStrip() {
  return (
    <section className="border-y border-white/8 bg-base-200/40 py-24 lg:py-28" aria-labelledby="brands-heading">
      <div className="container-x">
        <SectionHeading
          eyebrow="The marques"
          title="Browse by brand"
          description="Twelve world-class manufacturers under one roof — each with its own stage in the showroom."
          action={{ to: PATHS_EXPORTS.brands, label: 'Brand directory' }}
        />

        <Stagger className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-3 lg:grid-cols-6">
          {BRANDS.map((brand) => (
            <StaggerItem key={brand.id} y={14}>
              <Link
                to={PATHS_EXPORTS.brands}
                className="group relative flex h-full flex-col items-center gap-3 bg-base-100 px-4 py-7 text-center transition-colors duration-300 hover:bg-base-200"
                aria-label={`${brand.name} — ${BRAND_COUNTS[brand.id] ?? 0} vehicles in stock`}
              >
                <BrandMark brand={brand} size="md" className="transition-colors duration-300 group-hover:border-primary/50" />
                <span>
                  <span className="block font-display text-sm font-semibold tracking-tight">{brand.name}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {(BRAND_COUNTS[brand.id] ?? 0).toString().padStart(2, '0')} vehicles
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

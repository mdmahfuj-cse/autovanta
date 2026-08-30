import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import BrandMark from '../features/brands/BrandMark.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { BRANDS, BRAND_COUNTS, getCarById, CARS } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { formatBDT } from '../utils/format.js';

/** Homepage §3's dedicated page — the premium brand directory. */
export default function BrandsPage() {
  useDocumentTitle('Brands');

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            The marques · {BRANDS.length} partners · {CARS.length} vehicles
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Twelve marques, <span className="text-secondary">one address</span>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            From Toyota&apos;s bulletproof hybrids to Porsche&apos;s inevitability — every brand on
            our floor earns its place. Pick a monogram to open its showroom.
          </p>
        </div>
      </section>

      {/* Directory */}
      <div className="container-x grid gap-5 py-12 md:grid-cols-2">
        {BRANDS.map((brand, i) => {
          const featured = getCarById(brand.featuredModelId);
          return (
            <Reveal key={brand.id} delay={(i % 2) * 0.06}>
              <Link
                to={PATHS.brandDetails(brand.id)}
                className="group relative flex h-full items-start gap-5 overflow-hidden rounded-xl border border-white/8 bg-base-200 p-6 transition-colors duration-300 hover:border-white/20"
              >
                <BrandMark brand={brand} size="lg" className="shrink-0 transition-colors duration-300 group-hover:border-primary/50" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-display text-xl font-bold tracking-tight">{brand.name}</h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {brand.country} · est. {brand.founded}
                    </p>
                  </div>
                  <p className="mt-1.5 font-display text-sm text-muted">{brand.tagline}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/8 pt-4 text-[13px]">
                    <span>
                      <span className="font-display text-lg font-bold">{String(BRAND_COUNTS[brand.id] ?? 0).padStart(2, '0')}</span>
                      <span className="ml-1.5 text-muted">in stock</span>
                    </span>
                    {featured && (
                      <span className="min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Featured </span>
                        <span className="text-base-content/85">{featured.model} {featured.trim}</span>
                        <span className="ml-2 font-mono text-xs text-muted">{formatBDT(featured.price)}</span>
                      </span>
                    )}
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-muted transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary-text"
                >
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </PageTransition>
  );
}

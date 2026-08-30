import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CarFront, Globe, Landmark } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import BrandMark from '../features/brands/BrandMark.jsx';
import CarCard from '../features/cars/CarCard.jsx';
import AvailabilityBadge from '../features/cars/AvailabilityBadge.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { BRANDS, getCarById, getCarsByBrand, BRANDS_BY_ID } from '../data/index.js';
import { SORT_OPTIONS, sortCars } from '../utils/carFilters.js';
import { PATHS } from '../routes/paths.js';
import { formatBDT } from '../utils/format.js';

function BrandNotFound() {
  return (
    <PageTransition className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200 font-display text-lg font-bold tracking-[0.14em] text-muted">
        ???
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Unknown marque.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        That brand isn&apos;t part of our showroom — yet. Browse the full directory instead.
      </p>
      <Link to={PATHS.brands} className="btn btn-primary btn-md mt-8 rounded-md px-7 font-display tracking-wide">
        All brands <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </PageTransition>
  );
}

export default function BrandDetailsPage() {
  const { slug } = useParams();
  const brand = BRANDS_BY_ID[slug];
  const cars = brand ? getCarsByBrand(brand.id) : [];
  const [sort, setSort] = useState('featured');

  useDocumentTitle(brand ? `${brand.name} — showroom` : 'Brand not found');

  if (!brand) return <BrandNotFound />;

  const featured = getCarById(brand.featuredModelId);
  const sorted = sortCars(cars, sort);
  const priceRange = {
    min: Math.min(...cars.map((c) => c.price)),
    max: Math.max(...cars.map((c) => c.price)),
  };
  const others = BRANDS.filter((b) => b.id !== brand.id).slice(0, 6);

  return (
    <PageTransition>
      {/* Brand hero */}
      <section className="relative overflow-hidden border-b border-white/8 bg-base-200/40 pb-12 pt-32 lg:pt-36">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[16rem] font-bold leading-none text-white/[0.03] lg:block"
        >
          {brand.code}
        </span>
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
            <Link to={PATHS.home} className="transition-colors hover:text-base-content">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to={PATHS.brands} className="transition-colors hover:text-base-content">Brands</Link>
            <span aria-hidden="true">/</span>
            <span className="text-base-content/80">{brand.name}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-start gap-6">
            <BrandMark brand={brand} size="lg" className="mt-1 h-24 w-28 text-3xl" />
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">{brand.name}</h1>
              <p className="mt-3 font-display text-lg text-secondary">{brand.tagline}</p>
              <p className="mt-3 leading-relaxed text-muted">{brand.blurb}</p>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-4">
            {[
              { icon: Globe, label: 'Origin', value: brand.country },
              { icon: Landmark, label: 'Founded', value: String(brand.founded) },
              { icon: CarFront, label: 'Vehicles in stock', value: String(cars.length).padStart(2, '0') },
              { icon: ArrowRight, label: 'Price range', value: `${formatBDT(priceRange.min)} – ${formatBDT(priceRange.max)}` },
            ].map((item) => (
              <div key={item.label} className="bg-base-200 px-5 py-4">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-sm font-semibold tracking-tight md:text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x py-12">
        {/* Featured model spotlight */}
        {featured && (
          <Reveal>
            <div className="grid items-center gap-8 rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8 lg:grid-cols-[1.15fr_1fr]">
              <Link
                to={PATHS.carDetails(featured.slug)}
                className="group relative block aspect-[16/9] overflow-hidden rounded-xl border border-white/10"
                aria-label={`View ${featured.model} ${featured.trim}`}
              >
                <img
                  src={featured.images[0].src}
                  alt={`${featured.model} ${featured.trim}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute left-3 top-3 z-10">
                  <AvailabilityBadge status={featured.availability} />
                </div>
              </Link>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Featured machine</p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {featured.model} <span className="font-medium text-muted">{featured.trim}</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{featured.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <p className="font-display text-2xl font-bold tracking-tight">{formatBDT(featured.price)}</p>
                  <Link
                    to={PATHS.carDetails(featured.slug)}
                    className="btn btn-primary btn-sm rounded-md px-5 font-display tracking-wide"
                  >
                    View details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Line-up */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">The {brand.name} line-up</h2>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label={`Sort ${brand.name} vehicles`}
                className="h-10 appearance-none rounded-md border border-white/12 bg-base-200 pl-3.5 pr-9 text-sm outline-none transition-colors hover:border-white/25 focus-visible:border-primary/50"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted">
                ▼
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((car) => (
              <CarCard key={car.id} car={car} className="h-full" />
            ))}
          </div>
        </div>

        {/* Other marques */}
        <div className="mt-16 border-t border-white/8 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold tracking-tight">Other marques on the floor</h2>
            <Link
              to={PATHS.brands}
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80"
            >
              Full directory
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {others.map((b) => (
              <Link
                key={b.id}
                to={PATHS.brandDetails(b.id)}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/8 bg-base-200 px-3 py-5 text-center transition-colors hover:border-white/20"
              >
                <BrandMark brand={b} size="sm" className="transition-colors group-hover:border-primary/50" />
                <span className="text-xs font-medium text-muted transition-colors group-hover:text-base-content">{b.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <Reveal className="mt-12">
          <Link to={PATHS.cars} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-base-content">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the full garage
          </Link>
        </Reveal>
      </div>
    </PageTransition>
  );
}

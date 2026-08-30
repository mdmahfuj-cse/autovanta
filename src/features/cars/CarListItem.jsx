import { Link } from 'react-router-dom';
import { ArrowRight, Cog, Fuel, Gauge } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { PATHS } from '../../routes/paths.js';
import { formatBDT, formatKm } from '../../utils/format.js';
import { BRANDS_BY_ID } from '../../data/index.js';

/** Catalogue list-view row — compact horizontal composition. */
export default function CarListItem({ car }) {
  const brand = BRANDS_BY_ID[car.brandId];
  const isEv = car.fuel === 'EV';

  return (
    <article className="group relative flex overflow-hidden rounded-xl border border-white/8 bg-base-200 transition-colors duration-300 hover:border-white/20">
      <div className="relative hidden w-52 shrink-0 overflow-hidden sm:block md:w-64">
        <img
          src={car.images[0].src}
          alt={car.images[0].alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute left-2.5 top-2.5 z-10">
          <AvailabilityBadge status={car.availability} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {brand?.name} · {car.year} · {car.condition === 'New' ? 'Brand New' : 'Certified Pre-Owned'}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
          {car.model} <span className="font-medium text-muted">{car.trim}</span>
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-base-content/75">
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
          <span className="hidden md:inline">
            {car.engine.displacementL ? `${car.engine.displacementL}L ` : ''}
            {car.engine.layout} · {car.engine.powerHp} hp
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <p className="font-display text-xl font-bold tracking-tight">{formatBDT(car.price)}</p>
          <Link
            to={PATHS.carDetails(car.slug)}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary-text"
          >
            View details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Availability badge for mobile (image hidden) */}
      <div className="absolute right-3 top-3 sm:hidden">
        <AvailabilityBadge status={car.availability} />
      </div>
      <Link to={PATHS.carDetails(car.slug)} className="absolute inset-0 z-[5] sm:hidden" aria-label={`View ${car.model} ${car.trim}`} />
    </article>
  );
}

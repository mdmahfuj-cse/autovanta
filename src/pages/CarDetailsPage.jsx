import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CarFront,
  Check,
  Cog,
  Fuel,
  Gauge,
  Heart,
  KeyRound,
  Scale,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import CarGallery from '../features/cars/CarGallery.jsx';
import CarCard from '../features/cars/CarCard.jsx';
import SpecTable from '../features/cars/SpecTable.jsx';
import FinanceEstimateCard from '../features/cars/FinanceEstimateCard.jsx';
import { Stagger, StaggerItem } from '../components/shared/Stagger.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { PATHS } from '../routes/paths.js';
import { cn } from '../utils/cn.js';
import { formatBDT, formatKm } from '../utils/format.js';
import { buildEngineRows, buildPerformanceRows, buildDimensionRows, buildComfortFeatures, buildTechFeatures, buildSafetyFeatures } from '../utils/specSheet.js';
import { CARS, getCarBySlug, BRANDS_BY_ID } from '../data/index.js';
import { calculateLoan } from '../utils/finance.js';
import { useWishlistStore } from '../stores/wishlistStore.js';
import { useCompareStore } from '../stores/compareStore.js';
import { toast } from '../stores/toastStore.js';

function Breadcrumbs({ car }) {
  const brand = BRANDS_BY_ID[car.brandId];
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
      <Link to={PATHS.home} className="transition-colors hover:text-base-content">Home</Link>
      <span aria-hidden="true">/</span>
      <Link to={PATHS.cars} className="transition-colors hover:text-base-content">Cars</Link>
      <span aria-hidden="true">/</span>
      <span className="text-base-content/80">{brand?.name} {car.model} {car.trim}</span>
    </nav>
  );
}

function CarNotFound() {
  return (
    <PageTransition className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200">
        <CarFront className="h-7 w-7 text-muted" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">This vehicle left the floor.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The car you&apos;re looking for may have been sold or the address mistyped. The garage
        still has plenty to show you.
      </p>
      <Link to={PATHS.cars} className="btn btn-primary btn-md mt-8 rounded-md px-7 font-display tracking-wide">
        Browse the garage <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </PageTransition>
  );
}

export default function CarDetailsPage() {
  const { slug } = useParams();
  const car = getCarBySlug(slug);

  useDocumentTitle(car ? `${car.model} ${car.trim} — ${BRANDS_BY_ID[car.brandId]?.name}` : 'Vehicle not found');

  const wishlisted = useWishlistStore((s) => (car ? s.ids.includes(car.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => (car ? s.ids.includes(car.id) : false));
  const toggleCompare = useCompareStore((s) => s.toggle);

  if (!car) return <CarNotFound />;

  const brand = BRANDS_BY_ID[car.brandId];
  const isEv = car.fuel === 'EV';
  const fullName = `${car.model} ${car.trim}`;

  const emi = calculateLoan({ price: car.price, downPayment: car.price * 0.3, months: 60, annualRatePercent: 9.8 });

  const onToggleWishlist = () => {
    toggleWishlist(car.id);
    toast(
      wishlisted
        ? { title: 'Removed from wishlist', description: `${brand?.name} ${fullName}`, variant: 'info' }
        : { title: 'Saved to wishlist', description: `${brand?.name} ${fullName}`, variant: 'success' }
    );
  };

  const onToggleCompare = () => {
    const result = toggleCompare(car.id);
    if (!result.ok) {
      toast({ title: 'Compare garage is full', description: 'You can compare up to 4 vehicles — remove one first.', variant: 'error' });
      return;
    }
    toast(
      result.added
        ? { title: 'Added to compare garage', description: fullName, variant: 'success' }
        : { title: 'Removed from compare garage', description: fullName, variant: 'info' }
    );
  };

  const keySpecs = [
    { label: 'Power', value: `${car.engine.powerHp} hp` },
    { label: 'Torque', value: `${car.engine.torqueNm} Nm` },
    { label: '0–100 km/h', value: `${car.performance.zeroTo100} s` },
    { label: 'Top speed', value: `${car.performance.topSpeedKmh} km/h` },
    isEv
      ? { label: 'Range', value: `${car.efficiency.rangeKm} km` }
      : { label: 'Economy', value: `${car.efficiency.combinedKmpl} km/l` },
    { label: 'Seats', value: String(car.seats) },
  ];

  const similar = CARS.filter(
    (c) => c.id !== car.id && (c.primaryCategory === car.primaryCategory || c.brandId === car.brandId)
  ).slice(0, 3);

  return (
    <PageTransition>
      <div className="container-x pb-24 pt-28 lg:pt-32">
        <Reveal y={10}>
          <Breadcrumbs car={car} />
        </Reveal>

        {/* Header: gallery + purchase panel */}
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <Reveal y={16}>
            <CarGallery car={car} />
          </Reveal>

          <Reveal y={16} delay={0.08}>
            <div className="flex flex-col">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {brand?.name} · {car.bodyType} · {car.year}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                {car.model}{' '}
                <span className="font-medium text-muted">{car.trim}</span>
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-muted" aria-hidden="true" />
                  {car.condition}
                </span>
                <span className="flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-muted" aria-hidden="true" />
                  {formatKm(car.mileageKm)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Fuel className="h-4 w-4 text-muted" aria-hidden="true" />
                  {isEv ? 'Electric' : car.fuel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Cog className="h-4 w-4 text-muted" aria-hidden="true" />
                  {car.transmission}
                </span>
              </div>

              {/* Price + EMI */}
              <div className="mt-7 border-y border-white/10 py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Asking price</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="font-display text-4xl font-bold tracking-tight">{formatBDT(car.price, { compact: false })}</p>
                  <p className="font-mono text-sm text-muted">{formatBDT(car.price)}</p>
                </div>
                <p className="mt-2.5 text-sm text-muted">
                  or from <span className="font-semibold text-base-content">{formatBDT(emi.monthly)}</span>/mo · 30% down · 60 months · 9.8% p.a.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`${PATHS.testDrive}?car=${car.slug}`}
                  className="btn btn-primary btn-md rounded-md px-6 font-display tracking-wide"
                >
                  <KeyRound className="h-4.5 w-4.5" aria-hidden="true" /> Book a test drive
                </Link>
                <motion.button
                  type="button"
                  whileTap={{ scale: 1.15 }}
                  onClick={onToggleWishlist}
                  aria-pressed={wishlisted}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={cn(
                    'btn btn-square btn-md rounded-md border transition-colors',
                    wishlisted
                      ? 'border-primary/60 bg-primary/15 text-primary-text'
                      : 'border-white/15 bg-white/[0.03] text-base-content/80 hover:border-primary/40 hover:text-primary-text'
                  )}
                >
                  <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 1.15 }}
                  onClick={onToggleCompare}
                  aria-pressed={compared}
                  aria-label={compared ? 'Remove from compare' : 'Add to compare'}
                  className={cn(
                    'btn btn-square btn-md rounded-md border transition-colors',
                    compared
                      ? 'border-primary/60 bg-primary/15 text-primary-text'
                      : 'border-white/15 bg-white/[0.03] text-base-content/80 hover:border-primary/40 hover:text-primary-text'
                  )}
                >
                  <Scale className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Highlights */}
              <ul className="mt-7 space-y-2.5">
                {car.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-base-content/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Finance estimate */}
              <div className="mt-8">
                <FinanceEstimateCard price={car.price} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Key spec strip */}
        <Reveal className="mt-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-3 lg:grid-cols-6">
            {keySpecs.map((spec) => (
              <div key={spec.label} className="bg-base-200 px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{spec.label}</p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight">{spec.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Description */}
        <Reveal className="mt-16">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight">The car</h2>
            <p className="mt-4 leading-relaxed text-muted">{car.description}</p>
            <p className="mt-4 text-sm text-muted">
              Every AutoVanta vehicle — new or certified — is delivered inspected, detailed and
              with transparent paperwork. Warranty: {car.warranty}.
            </p>
          </div>
        </Reveal>

        {/* Specifications */}
        <Reveal className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">Specifications</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <SpecTable
              icon={CarFront}
              title="Engine & drivetrain"
              rows={buildEngineRows(car)}
            />
            <SpecTable
              icon={Timer}
              title="Performance & efficiency"
              rows={buildPerformanceRows(car)}
            />
            <SpecTable
              icon={Gauge}
              title="Dimensions & chassis"
              rows={buildDimensionRows(car)}
            />
          </div>
        </Reveal>

        {/* Features */}
        <Reveal className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">Equipment</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { title: 'Comfort', items: buildComfortFeatures(car) },
              { title: 'Technology', items: buildTechFeatures(car) },
              { title: 'Driver assistance', items: buildSafetyFeatures(car) },
            ].map((group) => (
              <div key={group.title} className="rounded-xl border border-white/8 bg-base-200 p-6">
                <h3 className="font-display text-base font-bold tracking-tight">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-base-content/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Colors + Safety */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight">Available colors</h2>
            <ColorPicker car={car} />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-bold tracking-tight">Safety</h2>
            <div className="mt-5 rounded-xl border border-white/8 bg-base-200 p-6">
              <p className="flex items-center gap-2.5 font-display text-base font-semibold">
                <ShieldCheck className="h-5 w-5 text-muted" aria-hidden="true" />
                {car.safety.rating}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {car.safety.features.map((f) => (
                  <span key={f} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-base-content/80">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Similar vehicles */}
        {similar.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <div className="flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold tracking-tight">Similar on the floor</h2>
                <Link
                  to={`${PATHS.cars}?brand=${car.brandId}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80"
                >
                  More {brand?.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <Stagger className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <StaggerItem key={c.id} className="h-full">
                  <CarCard car={c} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}

        {/* Test drive footer band */}
        <Reveal className="mt-20">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-base-200 p-8 sm:flex-row">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">Serious about the {car.model}?</h2>
              <p className="mt-1 text-sm text-muted">Thirty minutes behind the wheel beats thirty tabs of research.</p>
            </div>
            <Link to={`${PATHS.testDrive}?car=${car.slug}`} className="btn btn-primary btn-md shrink-0 rounded-md px-6 font-display tracking-wide">
              <CalendarClock className="h-4.5 w-4.5" aria-hidden="true" /> Book a test drive
            </Link>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}

function ColorPicker({ car }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-5 rounded-xl border border-white/8 bg-base-200 p-6">
      <div className="flex flex-wrap items-center gap-5">
        {car.colors.map((color, i) => (
          <motion.button
            key={color.key}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(i)}
            aria-label={`Color: ${color.name}`}
            aria-pressed={selected === i}
            className="relative h-10 w-10 rounded-full border border-white/20"
            style={{ backgroundColor: color.hex }}
          >
            {selected === i && (
              <motion.span
                layoutId="color-active-ring"
                className="absolute -inset-1.5 rounded-full border border-primary/70"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <p className="mt-4 border-t border-white/8 pt-3 text-sm text-muted">
        Shown finish: <span className="font-medium text-base-content">{car.colors[selected]?.name}</span>
      </p>
    </div>
  );
}

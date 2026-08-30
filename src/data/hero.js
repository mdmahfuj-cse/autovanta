import heroImage from '../assets/hero/hero-gt.jpg';
import imgBmwM5 from '../assets/cars/bmw-m5-competition-2025.jpg';
import imgTeslaModelS from '../assets/cars/tesla-model-s-plaid-2023.jpg';

/**
 * Hero slides — the rotating homepage headliners (Phase 10 carousel).
 * `carId` resolves through CARS_BY_SLUG and is validated by the data barrel's
 * integrity check; chips/price/CTAs derive from that car, so copy and specs
 * can never drift apart. `imagePosition` tunes the focal point of the
 * backdrop crop per photograph.
 */
export const HERO_SLIDES = [
  {
    id: 'gt-flagship-2026',
    carId: 'porsche-911-carrera-2024',
    eyebrow: 'Flagship of the season',
    titleLines: ['Engineered for the', 'extraordinary.'],
    subtitle:
      'The 2026 collection is on our floor — 64 curated machines across 12 marques, from hybrid dailies to four-figure horsepower statements.',
    image: heroImage,
    alt: 'Graphite Porsche 911 coupe under crimson studio light',
    imagePosition: 'object-[68%_center] md:object-[72%_center] lg:object-[75%_center]',
  },
  {
    id: 'm5-hybrid-2025',
    carId: 'bmw-m5-competition-2025',
    eyebrow: '727 hp in business attire',
    titleLines: ['The executive', 'super sedan.'],
    subtitle:
      'The M5 Competition threads a hybrid V8 through M-division menace — four-door civility right up until the throttle opens.',
    image: imgBmwM5,
    alt: 'Frozen grey BMW M5 Competition sedan under studio spotlight',
    imagePosition: 'object-[62%_center] md:object-[66%_center]',
  },
  {
    id: 'plaid-2023',
    carId: 'tesla-model-s-plaid-2023',
    eyebrow: 'Zero petrol, full violence',
    titleLines: ['Silence, at', 'plaid speed.'],
    subtitle:
      '1,020 hp, a 2.1-second launch and a charging network that crosses continents — the benchmark electric grand tourer.',
    image: imgTeslaModelS,
    alt: 'Pearl white Tesla Model S Plaid in a dark studio',
    imagePosition: 'object-[58%_center] md:object-[62%_center]',
  },
];

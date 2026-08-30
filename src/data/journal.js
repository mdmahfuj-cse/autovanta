import { ARTICLE_CONTENT } from './articleContent.js';
import catSports from '../assets/cars/cat-sports.jpg';
import catEv from '../assets/cars/cat-ev.jpg';
import catLuxury from '../assets/cars/cat-luxury.jpg';
import intDark from '../assets/cars/int-dark.jpg';
import catCoupe from '../assets/cars/cat-coupe.jpg';
import showroom from '../assets/showroom/showroom-gec.jpg';
import catHybrid from '../assets/cars/cat-hybrid.jpg';
import catSuvDark from '../assets/cars/cat-suv-dark.jpg';
import perfFlagship from '../assets/cars/perf-flagship.jpg';
import detailWheel from '../assets/cars/detail-wheel.jpg';
import intTan from '../assets/cars/int-tan.jpg';
import catSedan from '../assets/cars/cat-sedan.jpg';

export const JOURNAL_CATEGORIES = [
  'Car Reviews',
  'News',
  'Buying Guides',
  'Technology',
  'Performance',
  'EV',
];

/**
 * The Automotive Journal — 12 articles.
 * `content` blocks are authored in Phase 7; homepage & listing cards need
 * only the metadata below.
 */
export const ARTICLES = [
  {
    slug: 'porsche-911-carrera-the-default-answer',
    title: 'Porsche 911 Carrera: The Default Answer',
    category: 'Car Reviews',
    excerpt:
      'Sixty years of evolution and the 911 still wins arguments without raising its voice. We spent a week with the 992.2 onBangladeshi tarmac.',
    author: 'Tanvir Ahmed',
    role: 'Editor-in-Chief',
    date: '2026-08-18',
    readTime: 9,
    cover: catSports,
    tags: ['porsche', '911', 'review', 'sports cars'],
    featured: true,
    content: [],
  },
  {
    slug: 'living-with-an-ev-in-dhaka-range-diary',
    title: 'Living With an EV in Dhaka: A Realistic Range Diary',
    category: 'EV',
    excerpt:
      'One month, one Model 3, zero petrol stations. What EV ownership actually costs and feels like when your commute includes Gulshan traffic.',
    author: 'Nusrat Jahan',
    role: 'Senior Reviewer',
    date: '2026-08-05',
    readTime: 7,
    cover: catEv,
    tags: ['ev', 'tesla', 'charging', 'dhaka'],
    content: [],
  },
  {
    slug: 'first-luxury-car-read-before-you-sign',
    title: 'First Luxury Car? Read This Before You Sign',
    category: 'Buying Guides',
    excerpt:
      'Depreciation curves, warranty fine print and the three questions every first-time premium buyer should ask our sales floor.',
    author: 'Sadia Rahman',
    role: 'Buying Guide Editor',
    date: '2026-07-28',
    readTime: 6,
    cover: catLuxury,
    tags: ['buying', 'luxury', 'finance'],
    content: [],
  },
  {
    slug: 'adas-explained-sensors-that-watch-blind-spots',
    title: 'ADAS Explained: The Sensors That Watch Your Blind Spots',
    category: 'Technology',
    excerpt:
      'Radar, cameras and ultrasonics — how modern driver assistance actually sees the road, and where it still gets confused.',
    author: 'Arif Chowdhury',
    role: 'Technology Columnist',
    date: '2026-07-15',
    readTime: 8,
    cover: intDark,
    tags: ['adas', 'safety', 'technology'],
    content: [],
  },
  {
    slug: 'twin-turbo-v6s-eating-v8-lunch',
    title: 'Twin-Turbo V6s Are Eating the V8\'s Lunch',
    category: 'Performance',
    excerpt:
      'Downsizing was supposed to be a compromise. The numbers from our test track say the six-cylinder era is the fastest yet.',
    author: 'Tanvir Ahmed',
    role: 'Editor-in-Chief',
    date: '2026-07-02',
    readTime: 5,
    cover: catCoupe,
    tags: ['engines', 'performance', 'turbo'],
    content: [],
  },
  {
    slug: 'autovanta-gec-flagship-opens-doors',
    title: 'AutoVanta GEC Flagship Opens Its Doors',
    category: 'News',
    excerpt:
      'Twelve marques, a 12-bay workshop and the country\'s first in-showroom configurator lounge — inside our new Chattogram home.',
    author: 'Nusrat Jahan',
    role: 'Senior Reviewer',
    date: '2026-06-20',
    readTime: 4,
    cover: showroom,
    tags: ['autovanta', 'showroom', 'chattogram'],
    content: [],
  },
  {
    slug: 'camry-hev-the-quiet-flex',
    title: 'Camry HEV: The Quiet Flex',
    category: 'Car Reviews',
    excerpt:
      'No fake exhaust notes, no attitude — just 20 km/l, a library-quiet cabin and the last laugh at every fuel stop.',
    author: 'Nusrat Jahan',
    role: 'Senior Reviewer',
    date: '2026-06-08',
    readTime: 6,
    cover: catHybrid,
    tags: ['toyota', 'hybrid', 'review'],
    content: [],
  },
  {
    slug: 'certified-pre-owned-212-point-check',
    title: 'Certified Pre-Owned: What Our 212-Point Check Actually Covers',
    category: 'Buying Guides',
    excerpt:
      'Paint depth gauges, borescopes and fault-history readouts — a transparent look at the inspection behind every AutoVanta CPO badge.',
    author: 'Sadia Rahman',
    role: 'Buying Guide Editor',
    date: '2026-05-27',
    readTime: 7,
    cover: catSuvDark,
    tags: ['buying', 'cpo', 'inspection'],
    content: [],
  },
  {
    slug: 'home-charging-101-costs-load-safety',
    title: 'Home Charging 101: Costs, Load and Safety',
    category: 'EV',
    excerpt:
      'Can your building\'s wiring handle an 11 kW wallbox? A practical guide to load calculations, installer choices and real electricity bills.',
    author: 'Arif Chowdhury',
    role: 'Technology Columnist',
    date: '2026-05-14',
    readTime: 6,
    cover: perfFlagship,
    tags: ['ev', 'charging', 'home'],
    content: [],
  },
  {
    slug: 'brake-tech-why-your-next-car-stops-shorter',
    title: 'Brake Tech: Why Your Next Car Stops Shorter',
    category: 'Performance',
    excerpt:
      'From cast-iron discs to carbon-ceramics and brake-by-wire blending — the quiet arms race happening inside your wheels.',
    author: 'Tanvir Ahmed',
    role: 'Editor-in-Chief',
    date: '2026-04-30',
    readTime: 5,
    cover: detailWheel,
    tags: ['brakes', 'performance', 'technology'],
    content: [],
  },
  {
    slug: 'infotainment-wars-screens-vs-buttons',
    title: 'Infotainment Wars: Screens vs Buttons',
    category: 'Technology',
    excerpt:
      'Haptic everything sounds futuristic until you adjust the AC at 100 km/h. Where the industry is redrawing the line.',
    author: 'Arif Chowdhury',
    role: 'Technology Columnist',
    date: '2026-04-16',
    readTime: 5,
    cover: intTan,
    tags: ['infotainment', 'ux', 'technology'],
    content: [],
  },
  {
    slug: '2026-lineups-whats-landing-in-bangladesh',
    title: '2026 Lineups: What\'s Landing in Bangladesh This Year',
    category: 'News',
    excerpt:
      'Refreshed hybrids, two new EV crossovers and a long-awaited return to the performance coupe segment — our import-desk forecast.',
    author: 'Sadia Rahman',
    role: 'Buying Guide Editor',
    date: '2026-04-02',
    readTime: 4,
    cover: catSedan,
    tags: ['news', '2026', 'market'],
    content: [],
  },
];

// Attach full block content from articleContent.js by slug.
ARTICLES.forEach((article) => {
  article.content = ARTICLE_CONTENT[article.slug] ?? [];
});

export const ARTICLES_BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

import { BRANDS, BRANDS_BY_ID } from './brands.js';
import { CATEGORIES, CATEGORIES_BY_ID } from './categories.js';
import {
  CARS,
  getCarById,
  getCarBySlug,
  getCarsByIds,
  getCarsByBrand,
  getCarsByCategory,
  getCarsByFlag,
  FEATURED_PICKS,
  NEW_ARRIVAL_PICKS,
  SPOTLIGHT_CAR,
  HERO_CAR,
  COMPARE_SAMPLE,
} from './cars.js';
import { SERVICES, SERVICES_BY_SLUG } from './services.js';
import { ARTICLES, ARTICLES_BY_SLUG, JOURNAL_CATEGORIES } from './journal.js';
import { SHOWROOMS, FLAGSHIP_SHOWROOM } from './showrooms.js';
import { STORY_STATS, VALUES, TEAM } from './team.js';
import { HERO_SLIDES } from './hero.js';

/* --- derived counts ------------------------------------------------------ */
export const CATEGORY_COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, CARS.filter((car) => car.categories.includes(c.id)).length])
);
export const BRAND_COUNTS = Object.fromEntries(
  BRANDS.map((b) => [b.id, CARS.filter((car) => car.brandId === b.id).length])
);

/* --- dev-only integrity self-check --------------------------------------- */
if (import.meta.env.DEV) {
  const issues = [];
  const brandIds = new Set(BRANDS.map((b) => b.id));
  const catIds = new Set(CATEGORIES.map((c) => c.id));
  const slugs = new Set();

  for (const car of CARS) {
    if (!brandIds.has(car.brandId)) issues.push(`car ${car.slug}: unknown brandId '${car.brandId}'`);
    if (!slugs.has(car.slug)) slugs.add(car.slug);
    else issues.push(`car ${car.slug}: duplicate slug`);
    for (const cat of car.categories) {
      if (!catIds.has(cat)) issues.push(`car ${car.slug}: unknown category '${cat}'`);
    }
    if (!car.images?.length) issues.push(`car ${car.slug}: no images`);
  }
  for (const brand of BRANDS) {
    if (brand.featuredModelId && !getCarById(brand.featuredModelId)) {
      issues.push(`brand ${brand.id}: featuredModelId '${brand.featuredModelId}' does not resolve`);
    }
  }
  for (const slide of HERO_SLIDES) {
    if (slide.carId && !getCarById(slide.carId)) {
      issues.push(`hero slide '${slide.id}': carId '${slide.carId}' does not resolve`);
    }
  }
  for (const article of ARTICLES) {
    if (!article.content?.length) issues.push(`article ${article.slug}: no content blocks`);
  }
  for (const flag of ['featured', 'newArrival', 'performance']) {
    const count = CARS.filter((c) => c.flags.includes(flag)).length;
    if (count < 3) issues.push(`flag '${flag}': only ${count} car(s) — homepage sections expect ≥ 3`);
  }

  if (issues.length) {
    console.warn(`[AutoVanta] data integrity issues (${issues.length}):\n - ${issues.join('\n - ')}`);
  } else {
    console.info(
      `[AutoVanta] data OK — ${CARS.length} cars · ${BRANDS.length} brands · ${CATEGORIES.length} categories · ${SERVICES.length} services · ${ARTICLES.length} articles · ${SHOWROOMS.length} showrooms`
    );
  }
}

export {
  BRANDS,
  BRANDS_BY_ID,
  CATEGORIES,
  CATEGORIES_BY_ID,
  CARS,
  getCarById,
  getCarBySlug,
  getCarsByIds,
  getCarsByBrand,
  getCarsByCategory,
  getCarsByFlag,
  FEATURED_PICKS,
  NEW_ARRIVAL_PICKS,
  SPOTLIGHT_CAR,
  HERO_CAR,
  COMPARE_SAMPLE,
  SERVICES,
  SERVICES_BY_SLUG,
  ARTICLES,
  ARTICLES_BY_SLUG,
  JOURNAL_CATEGORIES,
  SHOWROOMS,
  FLAGSHIP_SHOWROOM,
  STORY_STATS,
  VALUES,
  TEAM,
  HERO_SLIDES,
};

import { BRANDS_BY_ID } from '../data/brands.js';
import { carHaystack, searchCars } from './search.js';

/**
 * Catalogue filtering + sorting — pure functions over the car data.
 * The CarsPage owns URL state; these do the actual work.
 */

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured first' },
  { id: 'price-desc', label: 'Price · high to low' },
  { id: 'price-asc', label: 'Price · low to high' },
  { id: 'year-desc', label: 'Newest model year' },
  { id: 'power-desc', label: 'Most powerful' },
  { id: 'accel-asc', label: 'Fastest 0–100' },
];

/** Filter cars by the (string-typed) URL param object. */
export function applyFilters(cars, { q = '', brand = '', category = '', fuel = '', transmission = '', maxPrice = null, flag = '' } = {}) {
  const bySearch = searchCars(cars, q, (car) => carHaystack(car, BRANDS_BY_ID[car.brandId]?.name));

  return bySearch.filter((car) => {
    if (brand && car.brandId !== brand) return false;
    if (category && !car.categories.includes(category)) return false;
    if (fuel && car.fuel !== fuel) return false;
    if (transmission && car.transmission !== transmission) return false;
    if (flag && !car.flags.includes(flag)) return false;
    if (maxPrice && car.price > maxPrice) return false;
    return true;
  });
}

const flagScore = (car) =>
  (car.flags.includes('featured') ? 2 : 0) +
  (car.flags.includes('newArrival') ? 1 : 0) +
  (car.flags.includes('performance') ? 1 : 0);

/** Sort cars by a SORT_OPTIONS id. Non-mutating. */
export function sortCars(cars, sortId = 'featured') {
  const list = [...cars];
  const by = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'year-desc': (a, b) => b.year - a.year || b.price - a.price,
    'power-desc': (a, b) => b.engine.powerHp - a.engine.powerHp,
    'accel-asc': (a, b) => a.performance.zeroTo100 - b.performance.zeroTo100,
    featured: (a, b) => flagScore(b) - flagScore(a) || b.price - a.price,
  }[sortId] ?? (() => 0);

  return list.sort(by);
}

/** Unique sorted values of a car field (for fuel/transmission facets). */
export function uniqueValues(cars, key) {
  return [...new Set(cars.map((c) => c[key]))].sort();
}

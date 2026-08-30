/**
 * Catalogue search — predictable multi-field substring matching.
 * Every whitespace-separated token must match somewhere in the haystack.
 */

const normalize = (s) => String(s ?? '').toLowerCase();

export function carHaystack(car, brandName = '') {
  return normalize(
    [
      brandName,
      car.model,
      car.trim,
      car.year,
      car.bodyType,
      car.fuel,
      car.transmission,
      car.condition,
      car.availability,
      ...car.categories,
    ].join(' ')
  );
}

/**
 * searchCars(cars, 'bmw suv') → cars whose haystack contains BOTH tokens.
 * Uses precomputed haystacks when provided (SearchOverlay hot path).
 */
export function searchCars(cars, query, haystackOf = (c) => carHaystack(c)) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return cars;

  return cars.filter((car) => {
    const hay = haystackOf(car);
    return tokens.every((t) => hay.includes(t));
  });
}

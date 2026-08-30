import { formatBDT, formatKm } from './format.js';

const mm = (v) => `${v.toLocaleString('en-US')} mm`;

/**
 * Comparison row definitions — pure data + selectors.
 * Rows with `num` + `pick` get best-value highlighting; others render plain.
 */
export const COMPARE_ROWS = [
  // Overview
  { group: 'Overview', label: 'Asking price', value: (c) => formatBDT(c.price), num: (c) => c.price, pick: 'min' },
  { group: 'Overview', label: 'Condition', value: (c) => c.condition },
  { group: 'Overview', label: 'Availability', value: (c) => c.availability },
  { group: 'Overview', label: 'Odometer', value: (c) => formatKm(c.mileageKm) },

  // Engine & performance
  {
    group: 'Engine & performance',
    label: 'Engine',
    value: (c) =>
      c.engine.displacementL ? `${c.engine.layout} · ${c.engine.displacementL}L ${c.engine.aspiration}` : c.engine.layout,
  },
  { group: 'Engine & performance', label: 'Power', value: (c) => `${c.engine.powerHp} hp`, num: (c) => c.engine.powerHp, pick: 'max' },
  { group: 'Engine & performance', label: 'Torque', value: (c) => `${c.engine.torqueNm} Nm`, num: (c) => c.engine.torqueNm, pick: 'max' },
  { group: 'Engine & performance', label: '0–100 km/h', value: (c) => `${c.performance.zeroTo100} s`, num: (c) => c.performance.zeroTo100, pick: 'min' },
  { group: 'Engine & performance', label: 'Top speed', value: (c) => `${c.performance.topSpeedKmh} km/h`, num: (c) => c.performance.topSpeedKmh, pick: 'max' },
  { group: 'Engine & performance', label: 'Braking 100–0', value: (c) => `${c.performance.braking100to0m} m`, num: (c) => c.performance.braking100to0m, pick: 'min' },
  {
    group: 'Engine & performance',
    label: 'Efficiency',
    value: (c) =>
      c.efficiency.combinedKmpl
        ? `${c.efficiency.combinedKmpl} km/l`
        : `${c.efficiency.combinedKmPerKwh} km/kWh · ${c.efficiency.rangeKm} km`,
  },
  { group: 'Engine & performance', label: 'Transmission', value: (c) => c.transmission },
  { group: 'Engine & performance', label: 'Drivetrain', value: (c) => c.drivetrain },

  // Dimensions & practicality
  { group: 'Dimensions & practicality', label: 'Length', value: (c) => mm(c.dimensions.lengthMm) },
  { group: 'Dimensions & practicality', label: 'Width', value: (c) => mm(c.dimensions.widthMm) },
  { group: 'Dimensions & practicality', label: 'Height', value: (c) => mm(c.dimensions.heightMm) },
  { group: 'Dimensions & practicality', label: 'Wheelbase', value: (c) => mm(c.dimensions.wheelbaseMm) },
  { group: 'Dimensions & practicality', label: 'Boot capacity', value: (c) => `${c.dimensions.bootLitres} L`, num: (c) => c.dimensions.bootLitres, pick: 'max' },
  { group: 'Dimensions & practicality', label: 'Seats', value: (c) => String(c.seats) },

  // Ownership
  { group: 'Ownership', label: 'Warranty', value: (c) => c.warranty },
  { group: 'Ownership', label: 'Safety rating', value: (c) => c.safety.rating },
  { group: 'Ownership', label: 'Safety features', value: (c) => `${c.safety.features.length} items` },
  { group: 'Ownership', label: 'Comfort features', value: (c) => `${c.features.comfort.length} items` },
  { group: 'Ownership', label: 'Tech features', value: (c) => `${c.features.technology.length} items` },
];

/** Group labels in display order. */
export const COMPARE_GROUPS = [...new Set(COMPARE_ROWS.map((r) => r.group))];

/**
 * Highlight metadata for one row across the compared cars.
 *  - null                      → row has no better/worse direction
 *  - { allEqual: true }        → every value identical (dim the row)
 *  - { allEqual: false, winners: Set<carId> } → highlight these cells
 */
export function computeRowMeta(row, cars) {
  if (!row.num || cars.length < 2) return null;
  const values = cars.map(row.num);
  const spread = Math.max(...values) - Math.min(...values);
  if (spread < 1e-9) return { allEqual: true };
  const target = row.pick === 'min' ? Math.min(...values) : Math.max(...values);
  const winners = new Set(cars.filter((c, i) => values[i] === target).map((c) => c.id));
  return { allEqual: false, winners };
}

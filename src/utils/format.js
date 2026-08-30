/**
 * BDT formatting helpers — Bangladeshi market convention (Lakh / Crore).
 * All math stays on raw BDT integers; these only format for display.
 */

const trimZeros = (n) => {
  const rounded = n >= 100 ? Math.round(n) : Number(n.toFixed(2));
  return String(rounded);
};

/**
 * formatBDT(28500000) → '৳2.85 Cr'
 * formatBDT(850000)   → '৳8.5 Lakh'
 * formatBDT(450000)   → '৳4.5 Lakh'
 * formatBDT(95000)    → '৳95,000'
 * formatBDT(28500000, { compact: false }) → '৳2,85,00,000'
 */
export function formatBDT(amount, { compact = true } = {}) {
  if (!Number.isFinite(amount)) return '—';
  if (compact) {
    if (amount >= 1_00_00_000) return `৳${trimZeros(amount / 1_00_00_000)} Cr`;
    if (amount >= 1_00_000) return `৳${trimZeros(amount / 1_00_000)} Lakh`;
  }
  return `৳${amount.toLocaleString('en-IN')}`;
}

/** formatKm(12500) → '12,500 km' */
export function formatKm(km) {
  if (!Number.isFinite(km)) return '—';
  return `${km.toLocaleString('en-US')} km`;
}

/** Compact number for stats: 12500 → '12.5K' */
export function compactNumber(n) {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/** formatDate('2026-08-18') → 'Aug 18, 2026' */
export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

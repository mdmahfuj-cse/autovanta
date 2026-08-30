/**
 * WCAG 2.1 contrast verification for the AutoVanta token set.
 * Run: node scripts/contrast-audit.mjs   (exits 1 on any AA failure)
 */

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg, bg) => {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/** Alpha-blend fg over bg (both hex), returns blended hex. */
const blend = (fgHex, alpha, bgHex) => {
  const f = hexToRgb(fgHex).map((c) => c * 255);
  const b = hexToRgb(bgHex).map((c) => c * 255);
  return (
    '#' +
    f
      .map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
};

// Tokens
const BASE100 = '#0a0a0c';
const BASE200 = '#101014';
const NEUTRAL = '#050506';
const CONTENT = '#f4f4f5';
const MUTED = '#9c9ca6';
const PRIMARY = '#b31217';
const PRIMARY_TEXT = '#e86862';
const ERROR = '#ff4d4d';
const ERROR_TEXT = '#ff7a7a';
const SUCCESS = '#2fd06f';
const WARNING = '#f5b301';
const INFO = '#4fa3ff';
const SECONDARY = '#c7c9d1';
const NEUTRAL_CONTENT = '#a1a1aa';
const WHITE = '#ffffff';

const checks = [
  // [label, fg, bg, minimum]
  ['body text on base-100', CONTENT, BASE100, 4.5],
  ['muted text on base-100', MUTED, BASE100, 4.5],
  ['muted text on base-200', MUTED, BASE200, 4.5],
  // (muted/60 and /70 were removed in Phase 8 — they failed AA; all muted text is now full-strength)
  ['secondary on base-200', SECONDARY, BASE200, 4.5],
  ['primary-text on base-100', PRIMARY_TEXT, BASE100, 4.5],
  ['primary-text on base-200', PRIMARY_TEXT, BASE200, 4.5],
  ['primary-text on primary/10 chip', PRIMARY_TEXT, blend(PRIMARY, 0.1, BASE200), 4.5],
  ['primary-text on primary/15 chip', PRIMARY_TEXT, blend(PRIMARY, 0.15, BASE100), 4.5],
  ['white on primary (buttons)', WHITE, PRIMARY, 4.5],
  ['error-text on error/10 tint', ERROR_TEXT, blend(ERROR, 0.1, BASE200), 4.5],
  ['error on base-200 (form errors)', ERROR, BASE200, 4.5],
  ['success on success/10 tint', SUCCESS, blend(SUCCESS, 0.1, BASE200), 4.5],
  ['warning on warning/10 tint', WARNING, blend(WARNING, 0.1, BASE200), 4.5],
  ['info on info/10 tint', INFO, blend(INFO, 0.1, BASE200), 4.5],
  // (neutral-content/60 and /70 were removed in Phase 8 — all footer text is /80+ now)
  ['footer text/80 on neutral', blend(NEUTRAL_CONTENT, 0.8, NEUTRAL), NEUTRAL, 4.5],
  ['focus ring on base-100 (3:1 non-text)', PRIMARY_TEXT, BASE100, 3.0],
  ['indicator dots on base-200 (3:1 graphics)', PRIMARY_TEXT, BASE200, 3.0],
];

let failures = 0;
for (const [label, fg, bg, min] of checks) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failures += 1;
  console.log(
    `${ok ? '  OK ' : 'FAIL'}  ${label.padEnd(42)} ${ratio.toFixed(2)}:1 (min ${min}:1)`
  );
}

console.log(
  failures === 0
    ? '\nCONTRAST AUDIT PASSED — all pairs meet WCAG AA (or 3:1 non-text).'
    : `\nCONTRAST AUDIT FAILED — ${failures} pair(s) below minimum.`
);
process.exit(failures === 0 ? 0 : 1);

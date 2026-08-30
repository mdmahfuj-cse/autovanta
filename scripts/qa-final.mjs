#!/usr/bin/env node
/**
 * PHASE 9 — Final QA suite.
 * Parts:
 *   A. Deep SSR sweep — 16 base routes + 17 parameterized hand-off URLs,
 *      with console.error/warn capture (any React warning fails the run).
 *   B. Link audit — every internal href found in rendered HTML of every
 *      route must resolve to a real route pattern (no dead CTAs).
 *   C. Data + math integrity — referential integrity across the data layer,
 *      per-car image uniqueness (no shared bodies), asset existence on disk,
 *      finance EMI hand-checks, BDT formatting, store persistence keys.
 *   D. Bundle budgets — gzip sizes from dist/ against Phase 9 budgets.
 * Run: npm run build && node scripts/qa-final.mjs
 */
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

/** Fleet target for Phase 12 expansion (36 → 64). */
const EXPECTED_FLEET = Number(process.env.EXPECTED_FLEET || 64);

const root = fileURLToPath(new URL('../', import.meta.url));
let failures = 0;
const section = (t) => console.log(`\n── ${t} ${'─'.repeat(Math.max(1, 58 - t.length))}`);
const ok = (msg) => console.log(`  OK   ${msg}`);
const origErr = console.error;
const bad = (msg) => { failures += 1; origErr(`  FAIL ${msg}`); };
const assert = (cond, msg) => (cond ? ok(msg) : bad(msg));

/* ── console capture: any warning during SSR fails the run ─────────────── */
const consoleIssues = [];
const origError = console.error.bind(console);
const origWarn = console.warn.bind(console);
console.error = (...a) => { consoleIssues.push(a.map(String).join(' ')); origError(...a); };
console.warn = (...a) => { consoleIssues.push(a.map(String).join(' ')); origWarn(...a); };

const vite = await createServer({
  root,
  server: { middlewareMode: true, allowedHosts: true },
  appType: 'custom',
  logLevel: 'error',
});

const pages = {};
for (const name of ['HomePage', 'CarsPage', 'CarDetailsPage', 'BrandsPage', 'BrandDetailsPage', 'ComparePage', 'WishlistPage', 'ServicesPage', 'ServiceDetailsPage', 'FinancePage', 'TestDrivePage', 'JournalPage', 'ArticlePage', 'AboutPage', 'ContactPage', 'NotFoundPage']) {
  pages[name] = (await vite.ssrLoadModule(`/src/pages/${name}.jsx`)).default;
}
const RootLayout = (await vite.ssrLoadModule('/src/layouts/RootLayout.jsx')).default;

/** Path pattern per page shape — detail routes need :slug so useParams resolves. */
function patternFor(route, pageName) {
  if (pageName === 'CarDetailsPage') return '/cars/:slug';
  if (pageName === 'BrandDetailsPage') return '/brands/:slug';
  if (pageName === 'ServiceDetailsPage') return '/services/:slug';
  if (pageName === 'ArticlePage') return '/journal/:slug';
  return route.split('?')[0]; // path patterns never contain query strings
}

/** Render the bare page under its real route pattern (marker assertions). */
function renderRoute(route, pageName) {
  return renderToString(
    React.createElement(MemoryRouter, { initialEntries: [route] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: patternFor(route, pageName), element: React.createElement(pages[pageName]) })))
  );
}

/** Render page wrapped in the real layout shell (link audit: nav/footer hrefs). */
function renderWithShell(route, pageName) {
  return renderToString(
    React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(RootLayout, null, React.createElement(pages[pageName])))
  );
}

/* ── Part A: deep SSR sweep ─────────────────────────────────────────────── */
section('Part A · deep SSR sweep (33 routes)');
const SWEEP = [
  ['/', 'HomePage', ['Browse by brand']],
  ['/cars', 'CarsPage', ['vehicles']],
  ['/cars/bmw-m5-competition-2025', 'CarDetailsPage', ['M5']],
  ['/brands', 'BrandsPage', ['Toyota']],
  ['/brands/porsche', 'BrandDetailsPage', ['911']],
  ['/compare', 'ComparePage', ['garage']],
  ['/wishlist', 'WishlistPage', ['wishlist']],
  ['/services', 'ServicesPage', []],
  ['/services/ceramic-coating', 'ServiceDetailsPage', []],
  ['/finance', 'FinancePage', ['৳']],
  ['/test-drive', 'TestDrivePage', ['Booking details']],
  ['/journal', 'JournalPage', []],
  ['/journal/ev-guide', 'ArticlePage', []],
  ['/about', 'AboutPage', []],
  ['/contact', 'ContactPage', []],
  ['/definitely-not-a-route', 'NotFoundPage', []],
  // parameterized hand-offs (regression contracts)
  ['/cars?q=supra', 'CarsPage', ['GR Supra'], ['Mustang']],
  ['/cars?brand=porsche', 'CarsPage', ['Taycan'], ['Mustang']],
  ['/cars?category=electric', 'CarsPage', ['Model 3'], ['Fortuner']],
  ['/cars?fuel=Diesel', 'CarsPage', ['Fortuner'], ['Type R']],
  ['/cars?transmission=Automatic', 'CarsPage', ['vehicles']],
  ['/cars?flag=featured', 'CarsPage', ['Carrera'], ['MX-5']],
  ['/cars?flag=newArrival', 'CarsPage', ['IONIQ 5'], ['M5 Competition']],
  ['/cars?flag=performance', 'CarsPage', ['Carrera'], ['Camry']],
  ['/cars?maxPrice=8000000', 'CarsPage', ['vehicles'], ['Fortuner']],
  ['/cars?sort=price-asc', 'CarsPage', ['vehicles']],
  ['/finance?car=bmw-m5-competition-2025', 'FinancePage', ['M5', '৳']],
  ['/finance?price=8500000', 'FinancePage', ['85 Lakh']],
  ['/test-drive?car=audi-rs5-sportback-2023', 'TestDrivePage', ['RS 5']],
  ['/journal?q=zzqqxx', 'JournalPage', ['No stories found']],
  ['/journal?q=EV', 'JournalPage', null, ['No stories found']],
  ['/journal?category=EV', 'JournalPage', null, ['No stories found']],
  ['/cars/unknown-car-slug', 'CarDetailsPage', null, ['M5 Competition']], // unknown slug must NOT leak another car
];
const rendered = [];
for (const [route, page, mustHave, mustNotHave] of SWEEP) {
  const have = mustHave ?? [];
  const miss = mustNotHave ?? [];
  try {
    const html = renderRoute(route, page);
    if (!html || html.length < 200) { bad(`${route}: output too small (${html?.length ?? 0})`); continue; }
    for (const m of have) if (!html.includes(m)) bad(`${route}: expected marker "${m}" missing`);
    for (const m of miss) if (html.includes(m)) bad(`${route}: forbidden marker "${m}" present`);
    // cars-list routes: the rendered result count must equal applyFilters() for those exact params
    if (route.startsWith('/cars?')) {
      const { CARS } = await vite.ssrLoadModule('/src/data/cars.js');
      const { applyFilters } = await vite.ssrLoadModule('/src/utils/carFilters.js');
      const sp = new URL(route, 'http://x').searchParams;
      const expected = applyFilters(CARS, {
        q: sp.get('q') ?? '', brand: sp.get('brand') ?? '', category: sp.get('category') ?? '',
        fuel: sp.get('fuel') ?? '', transmission: sp.get('transmission') ?? '',
        maxPrice: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : null, flag: sp.get('flag') ?? '',
      }).length;
      const shown = new Set([...html.matchAll(/href="(\/cars\/[^"?]+)"/g)].map((m) => m[1])).size;
      if (!shown) bad(`${route}: no result-card links found`);
      else if (shown !== expected) bad(`${route}: renders ${shown} result cards, applyFilters says ${expected}`);
      else ok(`${route}: result count ${shown} matches applyFilters`);
    }
    rendered.push([route, html]);
    ok(`${route} (${html.length} chars)`);
  } catch (err) {
    bad(`${route}: ${err.message.split('\n')[0]}`);
  }
}

/* ── Part B: link audit ─────────────────────────────────────────────────── */
section('Part B · internal link audit (dead CTA check)');
{
  const { CARS } = await vite.ssrLoadModule('/src/data/cars.js');
  const { BRANDS } = await vite.ssrLoadModule('/src/data/brands.js');
  const { SERVICES } = await vite.ssrLoadModule('/src/data/services.js');
  const { ARTICLES } = await vite.ssrLoadModule('/src/data/journal.js');
  const carSlugs = new Set(CARS.map((c) => c.slug));
  const brandIds = new Set(BRANDS.map((b) => b.id));
  const serviceSlugs = new Set(SERVICES.map((s) => s.slug));
  const articleSlugs = new Set(ARTICLES.map((a) => a.slug));
  const statics = new Set(['/', '/cars', '/brands', '/compare', '/wishlist', '/services', '/finance', '/test-drive', '/journal', '/about', '/contact']);

  const resolves = (href) => {
    const path = href.split('?')[0].split('#')[0];
    if (statics.has(path) && href.split('?')[0] === path) return true;
    if (path === '/cars') return true; // any query combination is valid state
    if (path.startsWith('/cars/')) return carSlugs.has(path.slice(6));
    if (path === '/brands') return true;
    if (path.startsWith('/brands/')) return brandIds.has(path.slice(8));
    if (path === '/services') return true;
    if (path.startsWith('/services/')) return serviceSlugs.has(path.slice(10));
    if (path === '/journal') return true;
    if (path.startsWith('/journal/')) return articleSlugs.has(path.slice(9));
    return false;
  };

  const hrefs = new Set();
  const SHELL_ROUTES = [
    ['/', 'HomePage'], ['/cars', 'CarsPage'], ['/brands', 'BrandsPage'], ['/compare', 'ComparePage'],
    ['/wishlist', 'WishlistPage'], ['/services', 'ServicesPage'], ['/finance', 'FinancePage'],
    ['/test-drive', 'TestDrivePage'], ['/journal', 'JournalPage'], ['/about', 'AboutPage'], ['/contact', 'ContactPage'],
  ];
  const sources = [...rendered, ...SHELL_ROUTES.map(([r, p]) => [`${r} (shell)`, renderWithShell(r, p)])];
  for (const [route, html] of sources) {
    for (const m of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) hrefs.add([m[1], route]);
  }
  let dead = 0;
  for (const [href, route] of hrefs) {
    if (!resolves(href)) { dead += 1; bad(`dead link "${href}" found on ${route}`); }
  }
  if (dead === 0) ok(`all ${hrefs.size} unique internal hrefs resolve to real routes`);
}

/* ── Part C: data + math integrity ──────────────────────────────────────── */
section('Part C · data + math integrity');
{
  const { CARS } = await vite.ssrLoadModule('/src/data/cars.js');
  const { BRANDS, BRANDS_BY_ID } = await vite.ssrLoadModule('/src/data/brands.js');
  const { CATEGORIES } = await vite.ssrLoadModule('/src/data/categories.js');
  const { SERVICES } = await vite.ssrLoadModule('/src/data/services.js');
  const { ARTICLES, ARTICLES_BY_SLUG } = await vite.ssrLoadModule('/src/data/journal.js');
  const { SHOWROOMS } = await vite.ssrLoadModule('/src/data/showrooms.js');
  const { TEAM } = await vite.ssrLoadModule('/src/data/team.js');
  const catIds = new Set(CATEGORIES.map((c) => c.id));

  assert(CARS.length === EXPECTED_FLEET, `catalog: ${CARS.length}/${EXPECTED_FLEET} cars`);
  assert(new Set(CARS.map((c) => c.id)).size === CARS.length, 'all car ids unique');
  assert(new Set(CARS.map((c) => c.slug)).size === CARS.length, 'all car slugs unique');
  assert(CARS.every((c) => BRANDS_BY_ID[c.brandId]), 'every car.brandId resolves to a brand');
  assert(CARS.every((c) => c.categories.every((x) => catIds.has(x))), 'every car category id resolves');
  assert(BRANDS.every((b) => CARS.some((c) => c.id === b.featuredModelId)), 'every brand.featuredModelId resolves');
  assert(CARS.every((c) => Array.isArray(c.images) && c.images.length >= 3 && c.images[0]?.src), 'every car has a full gallery');
  assert(BRANDS.length === 12 && CATEGORIES.length === 7 && SERVICES.length === 8 && ARTICLES.length === 12 && SHOWROOMS.length === 3 && TEAM.length >= 3, 'collection counts (12/7/8/12/3)');

  const primarySrcs = new Set(CARS.map((c) => c.images[0].src));
  assert(primarySrcs.size === CARS.length, `no two cars share a primary image (${primarySrcs.size}/${CARS.length} unique) — wrong-body class eliminated`);

  // asset existence on disk
  let missing = 0;
  for (const car of CARS) {
    for (const img of car.images) {
      let p = img.src;
      if (p.startsWith('data:')) continue;
      if (p.startsWith('/src/')) p = root + p.slice(1);
      else if (!p.startsWith('/')) p = new URL(`.${p.startsWith('/') ? '' : '/'}${p}`, `file://${root}`).pathname;
      if (!existsSync(p)) { missing += 1; bad(`${car.slug}: missing asset ${img.src}`); }
    }
  }
  if (missing === 0) ok(`every gallery asset exists on disk for all ${CARS.length} cars`);

  // journal integrity
  assert(new Set(ARTICLES.map((a) => a.slug)).size === 12, 'article slugs unique');
  assert(Object.keys(ARTICLES_BY_SLUG).length === 12, 'ARTICLES_BY_SLUG complete (12)');
  assert(ARTICLES.every((a) => Array.isArray(a.content) && a.content.length >= 4), 'every article has content blocks');

  // finance math — Phase 2/6 hand-checks
  const finance = await vite.ssrLoadModule('/src/utils/finance.js');
  const loan = finance.calculateLoan({ price: 28500000, downPayment: 28500000 * 0.4, months: 84, annualRatePercent: 8.5 });
  assert(Math.round(loan.monthly) === 270804, `EMI hand-check ৳2.85Cr/84m/8.5%/40% down → ৳${Math.round(loan.monthly).toLocaleString('en-US')} (expect 270,804)`);
  const zero = finance.calculateLoan({ price: 1000000, downPayment: 1000000, months: 60, annualRatePercent: 9 });
  assert(zero.monthly === 0 && zero.totalInterest === 0, 'zero-financed edge case → EMI 0, interest 0');
  const zeroRate = finance.calculateLoan({ price: 1200000, downPayment: 200000, months: 12, annualRatePercent: 0 });
  assert(zeroRate.monthly === 1000000 / 12, 'zero-rate edge case → straight-line EMI');
  const sched = finance.amortizationSchedule({ price: 28500000, downPayment: 28500000 * 0.4, months: 84, annualRatePercent: 8.5 });
  assert(sched.length === 84 && Math.round(sched.at(-1).balance) === 0, `amortization: 84 rows, final balance ৳0 (got ${sched.length} rows, ${Math.round(sched.at(-1).balance)})`);

  // formatting
  const fmt = await vite.ssrLoadModule('/src/utils/format.js');
  assert(fmt.formatBDT(28500000) === '৳2.85 Cr' && fmt.formatBDT(850000) === '৳8.5 Lakh' && fmt.formatBDT(450000) === '৳4.5 Lakh', 'formatBDT lakh/crore cases');
  assert(fmt.formatBDT(28500000, { compact: false }) === '৳2,85,00,000', 'formatBDT en-IN grouping');

  // filter/sort/search contracts
  const filters = await vite.ssrLoadModule('/src/utils/carFilters.js');
  const porscheEVs = filters.applyFilters(CARS, { brand: 'porsche', category: 'electric' });
  assert(porscheEVs.length === 1 && porscheEVs[0].id === 'porsche-taycan-4s-2024', 'combined filter brand+category works');
  const asc = filters.sortCars(CARS, 'price-asc');
  assert(asc.every((c, i) => i === 0 || asc[i - 1].price <= c.price), 'price-asc sort is monotonic');
  const search = await vite.ssrLoadModule('/src/utils/search.js');
  assert(search.searchCars(CARS, 'supra').some((c) => c.id === 'toyota-gr-supra-2023'), 'search("supra") finds GR Supra');

  // deep spec sheets — at least 30 details in every section, every car
  const ss = await vite.ssrLoadModule('/src/utils/specSheet.js');
  const groups = {
    engine: ss.buildEngineRows,
    performance: ss.buildPerformanceRows,
    dimensions: ss.buildDimensionRows,
    comfort: ss.buildComfortFeatures,
    technology: ss.buildTechFeatures,
    safety: ss.buildSafetyFeatures,
  };
  const mins = Object.fromEntries(Object.keys(groups).map((g) => [g, 999]));
  for (const car of CARS) {
    for (const [g, fn] of Object.entries(groups)) {
      const n = fn(car).length;
      if (n < mins[g]) mins[g] = n;
    }
  }
  const thin = Object.entries(mins).filter(([, n]) => n < 30);
  assert(thin.length === 0, `deep spec sheets: min per section across ${CARS.length} cars = ${JSON.stringify(mins)} (all >= 30)`);
  assert(Object.values(mins).every((n) => n >= 30), 'every car exposes >= 30 details in every section');

  // persistence keys are the canonical versioned names
  const keyChecks = [
    ['src/stores/wishlistStore.js', 'av-wishlist-v1'],
    ['src/stores/bookingStore.js', 'av-bookings-v1'],
    ['src/stores/compareStore.js', 'av-compare-v1'],
    ['src/stores/uiStore.js', 'av-ui-v1'],
  ];
  let keyOk = true;
  for (const [file, key] of keyChecks) {
    const src = readFileSync(root + file, 'utf8');
    const used = [...src.matchAll(/name: '([^']+)'/g)].map((m) => m[1]);
    if (!used.includes(key) || used.some((k) => k !== key && k.startsWith('av-'))) { keyOk = false; bad(`${file}: unexpected persist keys ${JSON.stringify(used)}`); }
  }
  if (keyOk) ok('persistence keys canonical (av-*-v1), no stale keys');
}

/* ── console cleanliness ────────────────────────────────────────────────── */
section('Console cleanliness (SSR warnings)');
{
  const unique = [...new Set(consoleIssues)].filter((m) => !m.includes('Download the React DevTools') && !m.startsWith('FAIL'));
  if (unique.length === 0) ok('zero console.error / console.warn during 33-route sweep');
  else unique.slice(0, 10).forEach((m) => bad(m.split('\n')[0]));
}

await vite.close();

/* ── Part D: bundle budgets (needs a fresh build) ───────────────────────── */
section('Part D · bundle budgets (dist/)');
{
  const distAssets = `${root}dist/assets`;
  if (!existsSync(distAssets)) {
    bad('dist/ not found — run `npm run build` before qa-final');
  } else {
    const files = readdirSync(distAssets).filter((f) => !f.endsWith('.jpg'));
    const gz = (f) => gzipSync(readFileSync(`${distAssets}/${f}`)).length;
    const jpgs = readdirSync(distAssets).filter((f) => f.endsWith('.jpg'));

    const main = files.find((f) => /^index-.*\.js$/.test(f));
    const mainGz = gz(main);
    assert(mainGz <= 90 * 1024, `main bundle ${main} → ${(mainGz / 1024).toFixed(2)} kB gzip (budget 90)`);

    const routeChunks = files.filter((f) => /^(Home|Cars|CarDetails|Brands|BrandDetails|Compare|Wishlist|Services|ServiceDetails|Finance|TestDrive|Journal|Article|About|Contact|NotFound)Page-.*\.js$/.test(f));
    assert(routeChunks.length === 16, `16 route chunks code-split (${routeChunks.length}/16)`);

    const largest = files.filter((f) => f.endsWith('.js')).map((f) => [f, gz(f)]).sort((a, b) => b[1] - a[1])[0];
    assert(largest[1] <= 120 * 1024, `largest chunk ${largest[0]} → ${(largest[1] / 1024).toFixed(2)} kB gzip (budget 120, lazy-loaded)`);

    const heaviestJpg = jpgs.map((f) => [f, statSync(`${distAssets}/${f}`).size]).sort((a, b) => b[1] - a[1])[0];
    assert(!heaviestJpg || heaviestJpg[1] <= 420 * 1024, `heaviest image ${(heaviestJpg?.[1] ?? 0) / 1024 | 0} kB (budget 420)`);

    const totalJs = files.filter((f) => f.endsWith('.js')).reduce((s, f) => s + gz(f), 0);
    console.log(`       total JS across chunks: ${(totalJs / 1024).toFixed(0)} kB gzip · images: ${(jpgs.reduce((s, f) => s + statSync(`${distAssets}/${f}`).size, 0) / 1048576).toFixed(2)} MB (lazy)`);
  }
}

console.log('\n──────────────────────────────────────────────────────────');
if (failures === 0) console.log('FINAL QA PASSED — all checks green.');
else { console.error(`FINAL QA FAILED — ${failures} issue(s).`); process.exit(1); }

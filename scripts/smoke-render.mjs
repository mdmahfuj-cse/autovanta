/**
 * SSR smoke test — renders every page + the layout shell with react-dom/server
 * via Vite's module loader. Catches runtime render errors that the build
 * cannot (bad hook usage, missing context, undefined data, etc.).
 * Run: node scripts/smoke-render.mjs
 */
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const vite = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const PAGES = [
  ['/', 'HomePage', '/src/pages/HomePage.jsx'],
  ['/cars', 'CarsPage', '/src/pages/CarsPage.jsx'],
  ['/cars/bmw-m5', 'CarDetailsPage', '/src/pages/CarDetailsPage.jsx'],
  ['/brands', 'BrandsPage', '/src/pages/BrandsPage.jsx'],
  ['/brands/bmw', 'BrandDetailsPage', '/src/pages/BrandDetailsPage.jsx'],
  ['/compare', 'ComparePage', '/src/pages/ComparePage.jsx'],
  ['/wishlist', 'WishlistPage', '/src/pages/WishlistPage.jsx'],
  ['/services', 'ServicesPage', '/src/pages/ServicesPage.jsx'],
  ['/services/ceramic-coating', 'ServiceDetailsPage', '/src/pages/ServiceDetailsPage.jsx'],
  ['/finance', 'FinancePage', '/src/pages/FinancePage.jsx'],
  ['/test-drive', 'TestDrivePage', '/src/pages/TestDrivePage.jsx'],
  ['/journal', 'JournalPage', '/src/pages/JournalPage.jsx'],
  ['/journal/ev-guide', 'ArticlePage', '/src/pages/ArticlePage.jsx'],
  ['/about', 'AboutPage', '/src/pages/AboutPage.jsx'],
  ['/contact', 'ContactPage', '/src/pages/ContactPage.jsx'],
  ['/definitely-not-a-route', 'NotFoundPage', '/src/pages/NotFoundPage.jsx'],
];

let failures = 0;

for (const [route, name, mod] of PAGES) {
  try {
    const { default: Page } = await vite.ssrLoadModule(mod);
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(Page))
    );
    if (!html || html.length < 200) throw new Error(`suspiciously small output (${html?.length ?? 0} chars)`);
    console.log(`  OK  ${name.padEnd(20)} ${route} (${html.length} chars)`);
  } catch (err) {
    failures += 1;
    console.error(`FAIL  ${name} (${route}): ${err.message}`);
  }
}

// Layout shell (navbar, footer, overlays, toasts, etc.)
try {
  const { default: RootLayout } = await vite.ssrLoadModule('/src/layouts/RootLayout.jsx');
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(RootLayout, null, React.createElement('div'))
    )
  );
  if (!html || html.length < 1000) throw new Error('shell output suspiciously small');
  console.log(`  OK  RootLayout (${html.length} chars)`);
} catch (err) {
  failures += 1;
  console.error(`FAIL  RootLayout: ${err.message}`);
}

await vite.close();

if (failures) {
  console.error(`\nSmoke render FAILED — ${failures} component(s) threw.`);
  process.exit(1);
}
console.log('\nSmoke render passed: all pages + shell render without runtime errors.');

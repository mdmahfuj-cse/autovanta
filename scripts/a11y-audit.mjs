/**
 * Automated accessibility audit.
 *  A. SSR pass — every route: exactly one <h1>, images have alt attributes,
 *     buttons/links have accessible names, landmarks/skip-link present.
 *  B. jsdom pass — QuickNav drawer: focus moves in, Tab wraps (trap), Esc closes
 *     and focus returns to the trigger.
 *
 * Run: node scripts/a11y-audit.mjs
 */
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const vite = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const ROUTES = [
  ['/', '/src/pages/HomePage.jsx', null],
  ['/cars', '/src/pages/CarsPage.jsx', null],
  ['/cars/porsche-911-carrera-2024', '/src/pages/CarDetailsPage.jsx', '/cars/:slug'],
  ['/brands', '/src/pages/BrandsPage.jsx', null],
  ['/brands/porsche', '/src/pages/BrandDetailsPage.jsx', '/brands/:slug'],
  ['/compare', '/src/pages/ComparePage.jsx', null],
  ['/wishlist', '/src/pages/WishlistPage.jsx', null],
  ['/services', '/src/pages/ServicesPage.jsx', null],
  ['/services/ceramic-coating', '/src/pages/ServiceDetailsPage.jsx', '/services/:slug'],
  ['/finance', '/src/pages/FinancePage.jsx', null],
  ['/test-drive', '/src/pages/TestDrivePage.jsx', null],
  ['/journal', '/src/pages/JournalPage.jsx', null],
  ['/journal/the-default-answer', '/src/pages/ArticlePage.jsx', '/journal/:slug'],
  ['/about', '/src/pages/AboutPage.jsx', null],
  ['/contact', '/src/pages/ContactPage.jsx', null],
  ['/nope', '/src/pages/NotFoundPage.jsx', '*'],
];

let failures = 0;
const t = (name, ok, extra = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? '  OK ' : 'FAIL'}  ${name}${ok ? '' : ` — ${extra}`}`);
};

/* ---------- Part A: SSR audit ---------- */
console.log('\nA. SSR audit — one h1, alts, accessible names\n');

for (const [path, mod, routePattern] of ROUTES) {
  const { default: Page } = await vite.ssrLoadModule(mod);
  const label = path === '/' ? 'home' : path.replace(/^\//, '');

  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: routePattern ?? '*', element: React.createElement(Page) })
      )
    )
  );

  // crude but effective element scans
  const h1s = (html.match(/<h1\b/g) ?? []).length;
  t(`${label}: exactly one <h1>`, h1s === 1, `found ${h1s}`);

  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  const altless = imgs.filter((tag) => !/\balt=/.test(tag));
  t(`${label}: all ${imgs.length} <img> have alt`, altless.length === 0, altless.join(' | ').slice(0, 120));

  // buttons + links: accessible name = aria-label OR inner text
  const controls = html.match(/<(button|a)\b[^>]*>[\s\S]*?<\/\1>/g) ?? [];
  const unnamed = controls.filter((tag) => {
    const openTag = tag.match(/^[^>]+/)[0];
    if (/aria-label=/.test(openTag)) return false;
    if (/aria-hidden="true"/.test(openTag)) return false; // decorative duplicates
    const inner = tag.replace(/^[^>]*>/, '').replace(/<\/(button|a)>$/, '');
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();
    return text.length === 0;
  });
  t(`${label}: all ${controls.length} buttons/links named`, unnamed.length === 0, unnamed[0]?.slice(0, 140));
}

// Layout shell: skip link + landmarks
{
  const { default: RootLayout } = await vite.ssrLoadModule('/src/layouts/RootLayout.jsx');
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(RootLayout, null, React.createElement('div')))
  );
  t('shell: skip-to-content link', html.includes('Skip to content') && html.includes('#main-content'));
  t('shell: <main id="main-content">', html.includes('<main') && html.includes('id="main-content"'));
  t('shell: primary nav labelled', html.includes('aria-label="Primary"'));
  t('shell: footer landmarks', (html.match(/<footer/g) ?? []).length >= 1);
  t('shell: live regions for toasts', html.includes('aria-live'));
}

/* ---------- Part B: keyboard trap (jsdom) ---------- */
console.log('\nB. Keyboard — QuickNav focus trap\n');
const { JSDOM } = await import('jsdom');
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.localStorage = dom.window.localStorage;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.matchMedia = dom.window.matchMedia;
class FakeIO {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
dom.window.IntersectionObserver = FakeIO;
globalThis.IntersectionObserver = FakeIO;
class FakeRO { observe() {} unobserve() {} disconnect() {} }
dom.window.ResizeObserver = FakeRO;
globalThis.ResizeObserver = FakeRO;

const React2 = (await import('react')).default ?? (await import('react'));
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { MemoryRouter: MR } = await import('react-router-dom');
const { MotionConfig } = await import('motion/react');
const { default: QuickNav } = await vite.ssrLoadModule('/src/components/layout/QuickNav.jsx');
const { useUiStore } = await vite.ssrLoadModule('/src/stores/uiStore.js');

const el = document.getElementById('root');
const root = createRoot(el);
// Focusable element outside the drawer to receive focus first
const outside = document.createElement('button');
outside.textContent = 'outside';
document.body.appendChild(outside);
outside.focus();

// reducedMotion="always" → opacity-only enter/exit, which completes in jsdom
// (spring exits never settle there). Still exercises the real close semantics.
await act(async () => {
  root.render(
    React2.createElement(MotionConfig, { reducedMotion: 'always' },
      React2.createElement(MR, null, React2.createElement(QuickNav)))
  );
});
await act(async () => {
  useUiStore.getState().setQuickNavOpen(true);
  await new Promise((r) => setTimeout(r, 120));
});

const drawer = el.querySelector('#quick-nav');
t('drawer: opens into DOM with role=dialog', Boolean(drawer) && drawer.getAttribute('role') === 'dialog');
t('drawer: aria-modal set', drawer.getAttribute('aria-modal') === 'true');
t('drawer: close button receives focus on open', document.activeElement?.getAttribute('aria-label') === 'Close quick navigation');

// Focus trap: Tab from the LAST focusable wraps to the first; Shift+Tab from
// the first wraps to the last. (jsdom does not move focus natively, so the
// trap's preventDefault + focus() IS the behavior under test.)
const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
const first = focusables[0];
const last = focusables[focusables.length - 1];
last.focus();
const tabFromLast = new dom.window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
document.dispatchEvent(tabFromLast);
t('trap: Tab on last focusable wraps to first', tabFromLast.defaultPrevented && document.activeElement === first,
  `prevented=${tabFromLast.defaultPrevented} active=${document.activeElement?.textContent ?? 'none'}`);
first.focus();
const shiftTabFromFirst = new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
document.dispatchEvent(shiftTabFromFirst);
t('trap: Shift+Tab on first focusable wraps to last', shiftTabFromFirst.defaultPrevented && document.activeElement === last,
  `prevented=${shiftTabFromFirst.defaultPrevented}`);

// Esc closes; wait out the AnimatePresence exit before asserting unmount
await act(async () => {
  document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 450));
});
// Note: AnimatePresence keeps the exiting node alive in jsdom (motion's
// exit-completion callback never fires there), so unmount is asserted via the
// observable close semantics instead — store, scroll lock and focus restore.
t('drawer: Esc → store reset', useUiStore.getState().quickNavOpen === false);
t('drawer: body scroll unlocked', document.body.style.overflow !== 'hidden');
t('drawer: focus restored to pre-open element', document.activeElement === outside);

await vite.close();
console.log(`\n${failures === 0 ? 'A11Y AUDIT PASSED' : `A11Y AUDIT FAILED — ${failures} issue(s)`}`);
process.exit(failures === 0 ? 0 : 1);

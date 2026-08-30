/**
 * Client-behavior regression test for Compare + Wishlist (Phase 4).
 * Renders real components with createRoot in jsdom, mutates the Zustand
 * stores the way users do, and asserts on the DOM — including real
 * localStorage persistence.
 *
 * Run: node scripts/compare-wishlist.client-test.mjs
 */
import { JSDOM } from 'jsdom';

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

// jsdom lacks matchMedia — provide a stub.
dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
globalThis.matchMedia = dom.window.matchMedia;

// jsdom lacks IntersectionObserver/ResizeObserver — stub so motion's
// whileInView resolves immediately (content renders as visible).
class FakeIntersectionObserver {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
dom.window.IntersectionObserver = FakeIntersectionObserver;
globalThis.IntersectionObserver = FakeIntersectionObserver;
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
dom.window.ResizeObserver = FakeResizeObserver;
globalThis.ResizeObserver = FakeResizeObserver;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const vite = await createServer({ root: new URL('..', import.meta.url).pathname, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

const { default: ComparePage } = await vite.ssrLoadModule('/src/pages/ComparePage.jsx');
const { default: WishlistPage } = await vite.ssrLoadModule('/src/pages/WishlistPage.jsx');
const { default: CompareTray } = await vite.ssrLoadModule('/src/features/compare/CompareTray.jsx');
const { useCompareStore } = await vite.ssrLoadModule('/src/stores/compareStore.js');
const { useWishlistStore } = await vite.ssrLoadModule('/src/stores/wishlistStore.js');

const containerStack = [];
let rootCounter = 0;

/**
 * Each scenario mounts on a FRESH root (the real app mounts once per page
 * load; re-rendering different trees into one root triggers a jsdom-only
 * React 19 artifact).
 */
const mount = async (ui) => {
  const previous = containerStack[containerStack.length - 1];
  if (previous) {
    await act(async () => {
      previous.root.unmount();
    });
    previous.el.remove();
  }
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  containerStack.push({ root, el });

  await act(async () => {
    root.render(ui);
  });
  // Let motion's first animation frame commit before assertions.
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
  return el;
};

const text = () => containerStack[containerStack.length - 1].el.textContent.replace(/\s+/g, ' ');

let pass = 0;
let fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(ok ? '  OK ' : 'FAIL', name, ok ? '' : extra);
};

/* ---- Compare page: seeded with 3 cars ---- */
useCompareStore.setState({ ids: ['porsche-911-carrera-2024', 'ford-mustang-gt-2024', 'tesla-model-3-long-range-2025'] });
await mount(React.createElement(MemoryRouter, { initialEntries: ['/compare'] }, React.createElement(ComparePage)));
t('compare: table renders 3 cars', text().includes('Comparing') && text().includes('3 of 4') && text().includes('Mustang') && text().includes('Model 3'));
t('compare: metric groups present', ['Overview', 'Engine & performance', 'Dimensions & practicality', 'Ownership'].every((g) => text().includes(g)));
t('compare: highlight legend', text().includes('best in row') && text().includes('identical across'));
t('compare: feature breakdown', text().includes('Feature breakdown') && text().includes('Driver assistance'));
t('compare: swap suggestions', text().includes('Swap the line-up'));

/* ---- Compare page: remove via store → falls to nudge state ---- */
await act(async () => {
  useCompareStore.setState({ ids: ['bmw-m5-competition-2025'] });
});
await mount(React.createElement(MemoryRouter, { initialEntries: ['/compare'] }, React.createElement(ComparePage)));
t('compare: 1 car → nudge + single card', text().includes('One car is a monologue') && text().includes('M5 Competition'));

/* ---- Tray behavior (client) ---- */
useCompareStore.setState({ ids: ['porsche-911-carrera-2024', 'ford-mustang-gt-2024'] });
await mount(React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(CompareTray)));
t('tray: visible with 2 cars + CTA', text().includes('POR') && text().includes('FRD') && text().includes('Compare 2'));

await act(async () => {
  useCompareStore.setState({ ids: ['porsche-911-carrera-2024'] });
});
await mount(React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(CompareTray)));
t('tray: 1 car shows add-more hint', text().includes('add 1 more') && text().includes('Compare 1'));

await act(async () => {
  useCompareStore.getState().remove('porsche-911-carrera-2024');
});
await mount(React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(CompareTray)));
t('tray: removed last → tray gone', !text().includes('Compare'));

/* ---- Wishlist page: seeded ---- */
useWishlistStore.setState({ ids: ['porsche-911-carrera-2024', 'mazda-mx5-rf-2023', 'tesla-model-3-long-range-2025'] });
const wl = await mount(React.createElement(MemoryRouter, { initialEntries: ['/wishlist'] }, React.createElement(WishlistPage)));
t('wishlist: renders 3 saved cars', text().includes('Saved vehicles · 3 cars') && text().includes('Compare all') && text().includes('MX-5'));

/* ---- Wishlist bulk compare-all (capacity-aware) ---- */
await act(async () => {
  // compare garage currently empty → all 3 should fit
});
await act(async () => {
  const store = useCompareStore.getState();
  let added = 0;
  for (const id of useWishlistStore.getState().ids) {
    const r = store.toggle(id);
    if (r.ok) added += 1;
  }
  wl.dataset.added = String(added);
});
t('wishlist: bulk compare adds 3', wl.dataset.added === '3');
t('wishlist: compare persisted to localStorage', (JSON.parse(window.localStorage.getItem('av-compare-v1')).state.ids).length === 3);

/* ---- Wishlist persistence round-trip ---- */
await act(async () => {
  useWishlistStore.getState().toggle('bmw-m5-competition-2025');
});
t('wishlist: toggle persists', JSON.parse(window.localStorage.getItem('av-wishlist-v1')).state.ids.includes('bmw-m5-competition-2025'));

await act(async () => {
  useWishlistStore.getState().clear();
});
t('wishlist: clear persists', JSON.parse(window.localStorage.getItem('av-wishlist-v1')).state.ids.length === 0);

/* ---- Compare max-4 guard via real toggles ---- */
await act(async () => {
  useCompareStore.setState({ ids: [] });
  for (const id of ['porsche-911-carrera-2024', 'ford-mustang-gt-2024', 'tesla-model-3-long-range-2025', 'bmw-m5-competition-2025']) {
    useCompareStore.getState().toggle(id);
  }
});
const overflow = useCompareStore.getState().toggle('audi-rs5-sportback-2023');
t('compare: 5th toggle rejected', overflow.ok === false && overflow.reason === 'max');
t('compare: garage holds exactly 4', useCompareStore.getState().ids.length === 4);

await vite.close();
console.log(`\n${fail === 0 ? 'PASSED' : 'FAILED'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

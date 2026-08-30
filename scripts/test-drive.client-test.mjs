/**
 * Client-behavior regression test for the Test-Drive booking flow (Phase 6).
 * Renders the real form with React Hook Form in jsdom, drives it like a user,
 * and asserts Zod validation, store persistence and the confirmation state.
 *
 * Run: node scripts/test-drive.client-test.mjs
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
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
// React 19 feature-detects input events via `'oninput' in document`, which is
// false in jsdom → it falls back to the IE propertychange polyfill that jsdom
// cannot drive. Defining oninput on Document.prototype forces the modern path.
Object.defineProperty(dom.window.Document.prototype, 'oninput', {
  value: null,
  writable: true,
  configurable: true,
  enumerable: true,
});
// Old-IE polyfill API referenced on focusin — keep a no-op stub for safety.
dom.window.HTMLElement.prototype.attachEvent = function attachEvent() {};

/* React modules are dynamically imported AFTER the jsdom environment is
   prepared — static imports would hoist above the stubs and react-dom would
   evaluate its input-event feature detection too early. */

const React = await import('react').then((m) => m.default ?? m);
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { MemoryRouter, Routes, Route } = await import('react-router-dom');
const { createServer } = await import('vite');

const vite = await createServer({
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const { default: TestDrivePage } = await vite.ssrLoadModule('/src/pages/TestDrivePage.jsx');
const { useBookingStore, slotsForDate } = await vite.ssrLoadModule('/src/stores/bookingStore.js');
const { bookingSchema } = await vite.ssrLoadModule('/src/features/test-drive/bookingSchema.js');

let pass = 0;
let fail = 0;
const t = (name, ok, extra = '') => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(ok ? '  OK ' : 'FAIL', name, ok ? '' : extra);
};

/* ---- Schema-level checks ---- */
const iso = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const VALID = {
  name: 'Imran Hossain',
  contact: '01712345678',
  carId: 'porsche-911-carrera-2024',
  date: iso(7),
  time: '11:00',
  showroomId: 'gec-chattogram',
  notes: '',
};

t('schema: valid booking passes', bookingSchema.safeParse(VALID).success);
t('schema: rejects empty', !bookingSchema.safeParse({}).success);
t('schema: rejects past date', !bookingSchema.safeParse({ ...VALID, date: iso(-1) }).success);
t('schema: rejects >90 days out', !bookingSchema.safeParse({ ...VALID, date: iso(91) }).success);
t('schema: rejects bad contact', !bookingSchema.safeParse({ ...VALID, contact: 'hello world' }).success);
t('schema: accepts email contact', bookingSchema.safeParse({ ...VALID, contact: 'imran@example.com' }).success);
t('slots: Friday filters to 15:00+', slotsForDate('2026-09-04').length === 3);

/* ---- Page-level flow ---- */
const rootStack = [];
const mount = async (initialEntry) => {
  const previous = rootStack[rootStack.length - 1];
  if (previous) {
    await act(async () => previous.root.unmount());
    previous.el.remove();
  }
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  rootStack.push({ root, el });
  await act(async () => {
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [initialEntry] },
        React.createElement(Routes, null, React.createElement(Route, { path: '/test-drive', element: React.createElement(TestDrivePage) }))
      )
    );
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
  return el;
};

const setInput = (el, id, value) => {
  const field = el.querySelector(`#${id}`);
  const setter = Object.getOwnPropertyDescriptor(field.constructor.prototype, 'value').set;
  setter.call(field, value);
  field.dispatchEvent(new dom.window.Event(field.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
};

const text = (el) => el.textContent.replace(/\s+/g, ' ');

/* 1. Prefill via ?car= */
let el = await mount('/test-drive?car=tesla-model-3-long-range-2025');
t('prefill: car select carries ?car= param', el.querySelector('#td-car').value === 'tesla-model-3-long-range-2025');
t('prefill: hint shown', text(el).includes('pre-selected'));

/* 2. Empty submit → validation errors, no booking saved */
await act(async () => {
  el.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
});
await act(async () => {
  await new Promise((r) => setTimeout(r, 80));
});
t('validation: name error shown', text(el).includes('Please tell us your name.'));
t('validation: contact error shown', text(el).includes('We need an email or mobile to confirm your slot.'));
t('validation: no booking persisted', useBookingStore.getState().bookings.length === 0);

/* 3. Fill everything and submit */
await act(async () => {
  setInput(el, 'td-name', 'Imran Hossain');
  setInput(el, 'td-contact', '01712345678');
  setInput(el, 'td-car', 'porsche-911-carrera-2024');
  setInput(el, 'td-date', iso(7));
  setInput(el, 'td-time', '11:00');
  setInput(el, 'td-showroom', 'gec-chattogram');
  el.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
});
await act(async () => {
  await new Promise((r) => setTimeout(r, 120));
});
t('booking: confirmation shown', text(el).includes("You're booked in."));
t('booking: reference AV-1042 assigned', text(el).includes('AV-1042'));
t('booking: persisted to localStorage', JSON.parse(window.localStorage.getItem('av-bookings-v1')).state.bookings.length === 1);
t('booking: list shows entry', text(el).includes('Your bookings') && text(el).includes('Upcoming'));

/* 4. Cancel with two-step confirm */
const cancelBtn = [...el.querySelectorAll('button')].find((b) => b.textContent.includes('Cancel'));
await act(async () => cancelBtn.click());
await act(async () => {
  await new Promise((r) => setTimeout(r, 60));
});
t('cancel: asks for confirmation', text(el).includes('Sure?'));
const confirmBtn = [...el.querySelectorAll('button')].find((b) => b.textContent.includes('Sure?'));
await act(async () => confirmBtn.click());
await act(async () => {
  await new Promise((r) => setTimeout(r, 60));
});
t('cancel: removed + persisted', useBookingStore.getState().bookings.length === 0 && JSON.parse(window.localStorage.getItem('av-bookings-v1')).state.bookings.length === 0);
t('cancel: empty-state text returns', text(el).includes('No bookings yet'));

await vite.close();
console.log(`\n${fail === 0 ? 'PASSED' : 'FAILED'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

# AUTOVANTA — Architecture & Development Plan
**Phase 0 deliverable · Frontend-only premium automotive showroom · Status: APPROVED BASELINE**

---

## 1. Product Definition

AutoVanta is a premium automotive showroom & marketplace experience: a long cinematic
brand homepage backed by a complete car catalogue, comparison engine, wishlist, brand
directory, service desk, finance calculator, test-drive booking and an automotive journal.

**Positioning:** luxury automotive campaign × modern marketplace. Not a listing site.

**Inventory concept:** new + certified pre-owned stock (gives the required *mileage*
field real meaning, and enables availability states: `In Stock / Reserved / Coming Soon / Pre-Order`).

**Brand voice:** cinematic, precise, engineered. Copy is short, confident, spec-driven.

---

## 2. Locked Decisions (from client brief + Phase 0 questions)

| Decision | Value |
|---|---|
| Stack | React 19 (JS/JSX only) · Vite · React Router 7 · Tailwind CSS v4 · DaisyUI 5 · Zustand v5 · Motion (`motion/react`) · Lucide React · Recharts · React Hook Form + Zod |
| Language | JavaScript, JSDoc-typed data shapes for editor IntelliSense (no TypeScript) |
| Theme | **Obsidian + Racing Crimson** — near-black carbon surfaces, white type, crimson `#E10600` accent |
| Typography | Display: **Space Grotesk** · Body: **Inter Variable** · Spec/telemetry numerals: **IBM Plex Mono** — all self-hosted via `@fontsource` (no CDN; survives offline preview) |
| Currency | **BDT (৳)** with Bangladeshi numbering — `৳1.25 Cr`, `৳85.5 Lakh`, full form `৳1,25,00,000` on detail pages. Finance math operates on raw BDT integers |
| Imagery | **Hybrid** — AI-generated cinematic hero / category / section / journal imagery stored locally; car catalogue uses a pool of generated category studio shots differentiated per car via tint, object-position and overlay treatment; brand marks are code-built SVG monograms (crisper than generated logos) |
| Backend | None. All data is local mock data; user state persists to `localStorage` |

---

## 3. Design System

### 3.1 Color tokens (DaisyUI custom theme `autovanta`, dark)

| Token | Value | Use |
|---|---|---|
| `base-100` | `#0A0A0C` | page background (obsidian) |
| `base-200` | `#101014` | raised surfaces / cards |
| `base-300` | `#16161C` | borders region, hover surfaces |
| `neutral` | `#050506` | footer, hero backdrop wells |
| `primary` | `#E10600` | racing crimson — CTAs, accents, active states |
| `primary-focus` | `#FF1F1F` | hover/active |
| `secondary` | `#C7C9D1` | titanium/silver — metallic details, eyebrows |
| `accent` | `#3D3F46` | graphite chips |
| `base-content` | `#F4F4F5` | primary text |
| muted text | `#9C9CA6` | secondary text (≥ 4.5:1 on base-100) |
| success/warning/error | DaisyUI defaults tuned dark | availability & form states |

Radius scale stays tight (0.25–0.5rem) — automotive precision, not bubbly SaaS.
Borders: `white/8` hairlines; glass surfaces: `bg-white/[0.03] + backdrop-blur`.

### 3.2 Type scale
Display 64/56/40/32 · Section title 40/28 · Body 16/14 · Spec numerals in mono.
Tracking: tight (-0.02em) on display, wide (+0.18em uppercase) on eyebrows.

### 3.3 Layout rhythm
Container max-w `1280px` (prose 720px). Section vertical rhythm: `py-24/32`.
Homepage alternates full-bleed, split, and contained compositions — deliberately **not** a page of identical cards.

---

## 4. Folder Structure (feature-based)

```
autovanta/
├── docs/                          # ARCHITECTURE.md, PROGRESS.md
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── src/
    ├── main.jsx                   # router + providers + font imports + global.css
    ├── global.css                 # Tailwind v4 + DaisyUI theme + tokens + utilities
    ├── assets/                    # generated imagery (hero/, cars/, categories/,
    │                              #   journal/, showroom/, about/) — all local files
    ├── data/
    │   ├── cars.js                # ~36 cars · full spec model (§7.1)
    │   ├── brands.js              # 12 brands → car relationships
    │   ├── categories.js          # 7 categories + derived counts
    │   ├── services.js            # 8 services
    │   ├── journal.js             # ~12 articles (block-based content model)
    │   ├── showrooms.js           # 3 showrooms (Gulshan, GEC Chattogram flagship, Sylhet)
    │   └── index.js               # barrel + integrity self-check (dev only)
    ├── utils/
    │   ├── format.js              # formatBDT (lakh/crore), km, dates, compactNumber
    │   ├── finance.js             # amortization EMI math (pure, unit-testable)
    │   ├── compare.js             # difference computation across 2–4 cars
    │   ├── search.js              # lightweight fuzzy scoring
    │   ├── storage.js             # safe localStorage wrapper (try/catch, versioned keys)
    │   └── cn.js                  # class merge helper
    ├── hooks/
    │   ├── useMediaQuery.js
    │   ├── useScrollPosition.js   # navbar state, parallax helpers
    │   ├── useDebounce.js
    │   ├── useQueryFilters.js     # catalogue filters ⇄ URL sync
    │   ├── useDocumentTitle.js
    │   └── useAsyncData.js        # simulated latency → real skeleton states
    ├── stores/
    │   ├── wishlistStore.js       # persist 'av-wishlist-v1'
    │   ├── compareStore.js        # persist 'av-compare-v1' (max 4, guarded)
    │   ├── bookingStore.js        # persist 'av-bookings-v1' (test-drive)
    │   ├── uiStore.js             # drawers, search overlay, view mode (persist viewMode)
    │   └── toastStore.js          # transient toasts (not persisted)
    ├── components/
    │   ├── ui/                    # Button, Badge, Chip, RangeSlider, Select, Breadcrumbs,
    │   │                          #   EmptyState, ErrorState, Skeletons, LazyImage, Modal,
    │   │                          #   Drawer, RatingStars, Stat
    │   ├── layout/                # Navbar, QuickNav (sidebar/drawer), SearchOverlay,
    │   │                          #   Footer, BackToTop, PageTransition, ScrollToTop,
    │   │                          #   ErrorBoundary, ToastViewport, RouteLoader
    │   └── shared/                # SectionHeading, Reveal, Stagger, Parallax, CountUp,
    │                              #   MotionPrimitives (variants), BrandMark (SVG logos),
    │                              #   PriceTag, SpecPill, AvailabilityBadge, NewsletterForm
    ├── features/
    │   ├── cars/                  # CarCard, CarListItem, CarGrid, CarFilters, SortBar,
    │   │                          #   ViewToggle, CarGallery, SpecTable, FeaturesList,
    │   │                          #   ColorPicker, FinanceEstimateCard, ActionBar
    │   ├── brands/                # BrandCard, BrandHeader, BrandCatalogue
    │   ├── compare/               # CompareTable, CompareCarCard, MobileCompareCarousel
    │   ├── wishlist/              # WishlistList, WishlistCardActions
    │   ├── services/              # ServiceCard, ServiceDetailBlocks
    │   ├── finance/               # CalculatorForm, PaymentSummary, BreakdownChart (Recharts)
    │   ├── test-drive/            # BookingForm (RHF+Zod), ConfirmationCard, BookingsList
    │   └── journal/               # ArticleCard, CategoryTabs, ArticleBody, ArticleSearch
    ├── pages/                     # thin route-level pages composing features
    │   ├── HomePage.jsx  CarsPage.jsx  CarDetailsPage.jsx  BrandsPage.jsx
    │   ├── BrandDetailsPage.jsx  ComparePage.jsx  WishlistPage.jsx
    │   ├── ServicesPage.jsx  ServiceDetailsPage.jsx  FinancePage.jsx
    │   ├── TestDrivePage.jsx  JournalPage.jsx  ArticlePage.jsx
    │   ├── AboutPage.jsx  ContactPage.jsx  NotFoundPage.jsx
    ├── layouts/
    │   └── RootLayout.jsx
    └── routes/
        ├── routes.jsx             # lazy route table + errorElement wiring
        └── paths.js               # single source of route constants
```

Rules: pages stay thin; no data literals inside components; no component > ~250 lines;
every feature folder is self-contained; data flows *data → feature components → pages*.

---

## 5. Routing Map

| Path | Page | Notes |
|---|---|---|
| `/` | HomePage | 14-section cinematic scroll |
| `/cars` | CarsPage | search · filters (brand, category, price, fuel, transmission) · sort · grid/list · URL-synced state |
| `/cars/:slug` | CarDetailsPage | gallery, specs, performance, features, colors, finance estimate, actions |
| `/brands` | BrandsPage | directory: mark, name, vehicle count, featured model |
| `/brands/:slug` | BrandDetailsPage | brand hero + its catalogue (reuses cars feature) |
| `/compare` | ComparePage | 2–4 cars, difference highlighting, mobile carousel layout |
| `/wishlist` | WishlistPage | saved cars, bulk compare, empty state |
| `/services` | ServicesPage | 8 services detailed |
| `/services/:slug` | ServiceDetailsPage | deep detail + booking CTA |
| `/finance` | FinancePage | full calculator, deep-linkable `?price=` |
| `/test-drive` | TestDrivePage | RHF+Zod booking + saved bookings list |
| `/journal` | JournalPage | cards, search, 6 category filters |
| `/journal/:slug` | ArticlePage | rich article layout, related articles |
| `/about` | AboutPage | story, stats (CountUp), team, showroom info |
| `/contact` | ContactPage | showroom cards, map placeholder, hours, form |
| `*` | NotFoundPage | curated 404 with recovery links |

All routes lazy-loaded (`React.lazy` + `Suspense` → `RouteLoader`), wrapped in
`AnimatePresence` page transitions. `ErrorBoundary` at layout level. `ScrollToTop` on
navigation. Route constants exported from `routes/paths.js` — no magic strings.

---

## 6. State Architecture

**Server-ish data:** static modules in `src/data` + pure selector utilities. No async layer
needed; `useAsyncData` adds a short simulated latency on list pages so skeleton loading
states are real and demonstrable.

**Global state (Zustand v5):**

| Store | State | Persistence |
|---|---|---|
| `wishlistStore` | `ids[]` · toggle/add/remove/clear/has | `av-wishlist-v1` |
| `compareStore` | `ids[]` (max 4) · toggle returns `{ok, reason}` → toast on overflow | `av-compare-v1` |
| `bookingStore` | `bookings[]` · add/cancel (id, car, date/time, showroom, contact) | `av-bookings-v1` |
| `uiStore` | `quickNavOpen` · `searchOpen` · `carsViewMode` | view mode only |
| `toastStore` | transient queue | none |

Persistence via `zustand/middleware persist` through the `safeStorage` wrapper
(versioned keys, corruption-proof rehydrate, SSR-safe). Cross-store interactions
(e.g. "compare saved wishlist cars") read via `getState()` — no derived duplicated state.

**URL state:** catalogue filters/sort/page and finance price live in query params
(source of truth = URL; Zustand holds only ephemeral UI). Shareable, back-button-correct.

**Toasts:** minimal custom system (motion AnimatePresence, aria-live polite) instead of an extra dependency.

---

## 7. Data Model

### 7.1 Car (JSDoc shape)
```js
{
  id: "bmw-m5-competition-2025",
  slug: "bmw-m5-competition-2025",
  brandId: "bmw",
  model: "M5", trim: "Competition",
  year: 2025,
  price: 28500000,                    // BDT integer
  condition: "New" | "Certified Pre-Owned",
  mileageKm: 1200,                    // odometer (real meaning for CPO stock)
  categories: ["sports", "luxury"],   // first = primary; from: sedan suv coupe sports luxury electric hybrid
  bodyType: "Sedan",
  fuel: "Petrol" | "Diesel" | "Hybrid" | "EV",
  transmission: "Automatic" | "DCT" | "CVT" | "Manual",
  drivetrain: "RWD" | "AWD" | "FWD" | "4WD",
  engine: { layout, displacementL, cylinders, aspiration, power hp, powerKw, torqueNm, redline },
  performance: { zeroTo100, topSpeedKmh, braking100to0m },
  efficiency: { combinedKmpl | combinedKmPerKwh, rangeKm? },
  seats, warranty,
  dimensions: { lengthMm, widthMm, heightMm, wheelbaseMm, groundClearanceMm, bootLitres },
  safety: { rating: "5★ ASEAN NCAP", features: [...] },
  features: { comfort: [...], technology: [...], driverAssist: [...] },
  colors: [{ name, hex }],
  images: [{ src, alt, kind: "studio"|"exterior"|"interior"|"detail" }],
  availability: "In Stock" | "Reserved" | "Coming Soon" | "Pre-Order",
  flags: { featured, newArrival, performance },   // homepage section membership
  description, highlights: [...]
}
```
**Seed:** 12 brands (Toyota, Honda, BMW, Mercedes-Benz, Audi, Porsche, Lexus, Tesla, Hyundai, Ford, Jaguar, Mazda) × ~3 = **36 cars**, prices in realistic BD import-market ranges (e.g. Fortuner ≈ ৳1.1 Cr, 911 Carrera ≈ ৳4.2 Cr, Model 3 ≈ ৳78 Lakh).

### 7.2 Other entities
- **Brand:** `{ id, slug, name, country, founded, tagline, description, monogram config, featuredModelId }` — logos rendered by `BrandMark` SVG component (no image files).
- **Service:** `{ slug, title, icon, tagline, description, priceFrom, duration, includes[], process[] }` (8: inspection, maintenance, detailing, ceramic coating, paint protection, customization, tyre service, insurance assistance).
- **Journal article:** `{ slug, title, category, excerpt, author, role, date, readTime, cover, tags, content: Block[] }` where `Block = {type: 'p'|'h2'|'quote'|'list'|'spec', ...}` (~12 articles across 6 categories).
- **Showroom:** `{ id, name, city, address, phone, email, hours, flagship, coordinates, image }` (3: Dhaka Gulshan, **Chattogram GEC — flagship**, Sylhet).

`data/index.js` runs a dev-only integrity check: every car's brandId/category references resolve; slugs unique; image files exist.

---

## 8. Imagery Pipeline (hybrid, all local in `src/assets/`)

| Asset | Count | Phase |
|---|---|---|
| Cinematic hero car (obsidian studio, crimson rim light, 21:9) | 1 (+2 optional later for carousel-ready slots) | 2 |
| Category tiles (sedan, SUV, coupe, sports, luxury, electric, hybrid) | 7 | 2 |
| Performance spotlight wide shot | 1 | 2 |
| Catalogue studio pool per category + interior/exterior angle shots | ~12 reused across 36 cars with per-car tint/position/overlay treatment | 3 |
| Showroom exterior + interior | 2–3 | 5 |
| Journal covers | 8 | 7 |
| About/team ambience | 1–2 (team avatars = SVG initials, not generated faces) | 5 |

Generation rules: one shared prompt template (same studio, lighting angle, lens) so the
pool reads as one campaign; strict 16:9 / 21:9 crops; web-sized JPEGs. Vite bundles them
hashed — no runtime network needed, offline preview stays intact.

---

## 9. Motion System (Motion for React)

**Tokens:** durations 120/200/320/500/700ms · default ease `[0.16, 1, 0.30, 1]` (out-expo) · spring `{stiffness 260, damping 30}` for drawers/chips.

**Shared primitives** (`components/shared`): `Reveal` (whileInView once, 16px rise) · `Stagger` containers · `Parallax` (useScroll + useTransform, capped ±10%) · `CountUp` (stats/specs) · `HoverLift` · `ImageCrossfade` · variant library `motionPrimitives.js`.

**Key applications**
- **Hero:** staged entrance — backdrop scale 1.06→1 with mask, headline line-by-line clip reveal, spec chips spring in with delay, CTA fade-up; on scroll: backdrop parallax −10% + content fade; infinite ambient light drift and ±6px chip float (subtle only).
- **Pages:** `AnimatePresence mode="wait"`, fade + 8px rise (280ms out / 320ms in).
- **Gallery:** crossfade + directional slide, thumbnails with layoutId indicator.
- **Filters:** `AnimatePresence` + `layout` on grid items — cards morph between grid/list.
- **Drawers/modals/overlays:** spring slide, backdrop fade, focus trapped.
- **Wishlist:** heart pop (scale keyframes) + badge count spring; compare: layoutId flight from card to tray.
- **Charts:** Recharts entry animations; spec bars animate width on inView.

**Discipline:** transform/opacity only for interactive animation; `prefers-reduced-motion` globally honored via a motion-guard hook (primitives degrade to opacity or nothing).

---

## 10. Responsive Strategy

Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Desktop (xl+) is the cinematic reference; below that layouts are **redesigned, not shrunk**.

- **Navbar:** full link row ≥ lg; below → logo + search/wishlist/compare icons + menu trigger. **QuickNav sidebar** = slide-over panel from the left on all sizes (secondary quick access as specced: Explore Cars, Featured, New Arrivals, Compare, Wishlist, Test Drive, Finance Calculator, Services) — becomes the mobile drawer.
- **Hero:** desktop = full-viewport image right/back + floating spec chips; mobile = image as graded backdrop, chips become a horizontal scroll strip, CTAs stack full-width.
- **Catalogue filters:** desktop sticky rail; mobile = bottom sheet with active-filter chips + live count.
- **Car grid:** 1 / 2 / 3 columns (md/xl); list view becomes compact rows on mobile.
- **Compare table:** desktop 5-col table with difference highlighting; mobile = swipeable per-metric cards with car-selector tabs.
- **Finance:** inputs above chart on mobile, side-by-side on desktop.
- **Footer:** mega footer → accordion groups on mobile.

---

## 11. Performance & Accessibility

**Performance:** route-level code splitting · all animation transform/opacity · lazy images with blur-up placeholders and aspect-ratio boxes (zero CLS) · memoized filtering (pure `utils`) · capped parallax (single scroll listener via Motion) · content-visibility on below-fold homepage sections · bundle audit at each phase gate.

**Accessibility:** skip-to-content link · landmarks + single h1 per page · focus-visible crimson rings · drawers/modals: `role=dialog`, focus trap, Esc close, return focus · full keyboard nav (gallery, search overlay, tabs) · forms: labelled inputs, inline errors (Zod), `aria-live` result counts & toasts · color contrast ≥ 4.5:1 · hit targets ≥ 44px · `prefers-reduced-motion` respected everywhere.

---

## 12. Verification Protocol (every phase)

1. `npm run dev` — app boots, preview serves, all implemented routes render.
2. Console audit — zero errors/warnings (React key, hook, a11y, Motion deprecations).
3. `npm run build` + `vite preview` — production bundle clean, no oversized chunks.
4. `npx eslint .` — clean.
5. Pure-logic checks via `node` one-liners (finance EMI, formatBDT, compare diff) as each lands.
6. Manual pass: every button/link/control exercised; empty/error/loading states triggered.
7. Responsive pass: 375 / 768 / 1280 / 1536 widths.

Phase gate closes only when all pass; `docs/PROGRESS.md` updated with the phase report.

**Known risks → mitigations**
- Tailwind v4 + DaisyUI 5 CSS-first config quirks → verify at Phase 1 install; fallback plan: Tailwind 3.4 + DaisyUI 4 (JS config) — structure unaffected.
- `motion` package import path (`motion/react`) → confirm version at Phase 1.
- Recharts × React 19 → pin known-good version if v3 misbehaves.
- AnimatePresence + lazy routes flicker → Suspense boundary inside transition wrapper.
- localStorage corruption → versioned keys + safe rehydrate wrapper.

---

## 13. Phase Plan & Exit Criteria

| Phase | Scope | Exit criteria (beyond §12) |
|---|---|---|
| 0 · Architecture | This document + progress tracker | Baseline approved |
| 1 · Foundation | Vite app, Tailwind+DaisyUI theme, fonts, Router, Zustand, Motion, RootLayout, Navbar, QuickNav sidebar/drawer, Footer skeleton, toasts, RouteLoader | All 16 routes render behind layout; nav/drawer/search trigger work |
| 2 · Homepage | All 14 sections with generated hero + section imagery, full motion pass | Long-scroll cinematic homepage complete, each section CTA routes correctly |
| 3 · Catalogue | Cars data layer (36 cars), CarsPage (search/filters/sort/grid-list/URL sync), CarDetails (gallery, specs, colors, finance estimate, actions) | Every filter combination + detail page verified; skeletons shown |
| 4 · Compare + Wishlist | Both stores + persistence, compare table w/ diff highlighting, wishlist page, cross-actions (compare from wishlist/details), toasts | Persistence verified across reload; max-4 guard; mobile compare layout |
| 5 · Brands + Services | Brand directory + brand pages, services pages, showrooms, About content | Brand→catalogue loops work; 8 services detailed |
| 6 · Finance + Test Drive | Real EMI calculator + Recharts breakdown, RHF+Zod booking flow, saved bookings, confirmation | Math verified by hand-calc cases; invalid form states; bookings persist |
| 7 · Journal | 12 articles, search, category filters, article page, related | All slugs resolve; filters + search compose |
| 8 · Responsive + Polish | Full 375→1536 pass, a11y audit, loading/empty/error everywhere, motion consistency | No horizontal scroll at any width; keyboard-only walkthrough |
| 9 · Final QA | Full regression: routes, console, build, dead buttons, math, state bugs, a11y, performance | Zero known defects; final report |

**Explicitly deferred by client brief:** hero multi-car carousel *implementation* (architecture slots reserved — `HeroSlide` data shape + transition wired for one slide now).

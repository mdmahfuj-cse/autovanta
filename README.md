# AutoVanta — Premium Automotive Showroom

A production-quality, **frontend-only** automotive showroom & marketplace experience. AutoVanta delivers a cinematic brand homepage, full car catalogue with advanced filtering, comparison engine, wishlists, brand directory, services desk, finance calculator, test-drive booking, and an automotive journal — all powered by realistic local mock data and built to automotive-grade precision.

**Positioning:** Luxury automotive campaign × modern marketplace. Not a listing site. This is a full-featured, performance-optimized showroom experience with cinematic imagery, precise specs, and seamless user interactions.

---

## 🎯 Quick Start

```bash
npm install         # install dependencies
npm run dev         # start dev server (http://localhost:5173)
npm run build       # production build
npm run preview     # preview production build
npm run lint        # eslint validation
```

**Tech Stack**

React 19 · Vite · JavaScript (JSDoc-typed) · React Router 7 · Tailwind CSS v4 · DaisyUI 5 · Zustand v5 · Motion (`motion/react`) · Lucide React · Recharts · React Hook Form + Zod

---

## 🏗 Architecture Overview

### Design Identity

| Aspect               | Details                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Theme**            | Obsidian (`#0A0A0C`) + Racing Crimson (`#E10600`) — near-black surfaces, white type, crimson accents                                  |
| **Typography**       | Display: **Space Grotesk** · Body: **Inter Variable** · Specs: **IBM Plex Mono** (self-hosted via @fontsource)                        |
| **Currency**         | **BDT (৳)** with Bangladeshi numbering — `৳1.25 Cr`, `৳85.5 Lakh`                                                                     |
| **Accessibility**    | WCAG AA color contrast verified, keyboard navigation, focus traps, `prefers-reduced-motion` honored globally                          |
| **Radius & Borders** | Tight radius (0.25–0.5rem) for automotive precision; `white/8` hairline borders; glassmorphism with `bg-white/[0.03] + backdrop-blur` |

See `scripts/contrast-audit.mjs` and `scripts/a11y-audit.mjs` for verification.

### Color Tokens (DaisyUI Custom Theme)

| Token          | Value     | Usage                                         |
| -------------- | --------- | --------------------------------------------- |
| `base-100`     | `#0A0A0C` | Page background (obsidian)                    |
| `base-200`     | `#101014` | Raised surfaces / cards                       |
| `base-300`     | `#16161C` | Borders, hover surfaces                       |
| `primary`      | `#E10600` | Racing crimson — CTAs, accents, active states |
| `secondary`    | `#C7C9D1` | Titanium/silver — metallic details            |
| `accent`       | `#3D3F46` | Graphite chips                                |
| `base-content` | `#F4F4F5` | Primary text                                  |
| Muted text     | `#9C9CA6` | Secondary text (≥4.5:1 contrast ratio)        |

### Typography Scale

- **Display:** 64 / 56 / 40 / 32
- **Section Titles:** 40 / 28
- **Body:** 16 / 14
- **Tracking:** Tight (-0.02em) on display; wide (+0.18em) on uppercase eyebrows
- **Spec numerals:** IBM Plex Mono for technical precision

### Layout Rhythm

- **Container max-width:** 1280px (prose: 720px)
- **Vertical rhythm:** `py-24` / `py-32` between sections
- **Composition:** Homepage deliberately alternates full-bleed, split, and contained layouts (not a page of identical cards)

---

## 📁 Project Structure (Feature-Based)

```
autovanta/
├── docs/
│   ├── ARCHITECTURE.md          # Full technical baseline
│   └── PROGRESS.md              # Phase tracker
├── scripts/
│   ├── a11y-audit.mjs           # Accessibility audits (h1, alts, named controls)
│   ├── contrast-audit.mjs       # WCAG AA color contrast verification
│   ├── smoke-render.mjs         # Route render validation
│   └── [other QA scripts]
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── src/
    ├── main.jsx                 # Router + providers + font imports
    ├── global.css               # Tailwind v4 + DaisyUI theme + tokens
    ├── assets/
    │   ├── brandLogos.js        # SVG monogram registry
    │   ├── cars/                # Category/car imagery
    │   ├── hero/                # Hero section images
    │   ├── journal/             # Article hero images
    │   ├── showroom/            # Showroom photos
    │   └── about/               # Team/company imagery
    ├── data/                    # Mock data (source of truth)
    │   ├── cars.js              # ~36 cars with full specs
    │   ├── brands.js            # 12 brands with car relationships
    │   ├── categories.js        # 7 categories + derived counts
    │   ├── services.js          # 8 service offerings
    │   ├── journal.js           # ~12 articles (block-based content)
    │   ├── showrooms.js         # 3 showroom locations
    │   ├── team.js              # Team members
    │   ├── hero.js              # Homepage hero content
    │   └── index.js             # Barrel export + integrity self-check
    ├── utils/
    │   ├── format.js            # formatBDT (lakh/crore), km, dates
    │   ├── finance.js           # EMI amortization math (pure, unit-testable)
    │   ├── search.js            # Lightweight fuzzy scoring
    │   ├── carFilters.js        # Filter logic (brand, price, fuel, etc.)
    │   ├── compareMetrics.js    # Difference computation across 2–4 cars
    │   ├── specSheet.js         # Spec formatting & grouping
    │   ├── storage.js           # Safe localStorage wrapper (versioned keys)
    │   ├── cn.js                # Class merge helper (Tailwind + conditional)
    │   └── validateContact.js   # Form validation rules
    ├── hooks/
    │   ├── useMediaQuery.js      # Responsive breakpoint detection
    │   ├── useScrollPosition.js  # Navbar state, parallax helpers
    │   ├── useQueryFilters.js    # Catalogue filters ⇄ URL sync
    │   └── useDocumentTitle.js   # Dynamic page titles
    ├── stores/ (Zustand v5)
    │   ├── wishlistStore.js     # Saved cars (`av-wishlist-v1`)
    │   ├── compareStore.js      # Compare garage — max 4 cars (`av-compare-v1`)
    │   ├── bookingStore.js      # Test-drive bookings (`av-bookings-v1`)
    │   ├── uiStore.js           # UI state (nav, search, view mode)
    │   └── toastStore.js        # Transient notifications
    ├── components/
    │   ├── ui/                  # Reusable atoms
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Drawer.jsx
    │   │   ├── RatingStars.jsx
    │   │   └── [other atoms]
    │   ├── layout/              # App shell
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── QuickNav.jsx     # Sidebar/drawer nav
    │   │   ├── SearchOverlay.jsx
    │   │   ├── ScrollAndFocusManager.jsx
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── ToastViewport.jsx
    │   │   └── RouteLoader.jsx  # Lazy route suspense fallback
    │   └── shared/              # Cross-feature molecules
    │       ├── SectionHeading.jsx
    │       ├── Reveal.jsx       # Scroll-triggered animations
    │       ├── Stagger.jsx      # Child item stagger
    │       ├── Parallax.jsx     # Parallax scroll effect
    │       ├── CountUp.jsx      # Animated counter
    │       ├── BrandMark.jsx    # SVG brand logos
    │       ├── PageTransition.jsx
    │       └── motionTokens.js  # GSAP + Motion.js animation presets
    ├── features/ (Self-contained feature domains)
    │   ├── cars/
    │   │   ├── CarCard.jsx
    │   │   ├── CarGrid.jsx
    │   │   ├── CarFilters.jsx
    │   │   ├── SortBar.jsx
    │   │   ├── CarGallery.jsx
    │   │   ├── SpecTable.jsx
    │   │   ├── FinanceEstimateCard.jsx
    │   │   └── [related components]
    │   ├── brands/
    │   ├── compare/
    │   ├── wishlist/
    │   ├── services/
    │   ├── finance/             # Calculator + Recharts breakdown
    │   ├── test-drive/          # RHF + Zod booking form
    │   ├── journal/
    │   ├── about/
    │   └── home/                # Homepage sections
    ├── pages/ (Thin route-level compositions)
    │   ├── HomePage.jsx
    │   ├── CarsPage.jsx
    │   ├── CarDetailsPage.jsx
    │   ├── BrandsPage.jsx
    │   ├── ComparePage.jsx
    │   ├── WishlistPage.jsx
    │   ├── FinancePage.jsx
    │   ├── TestDrivePage.jsx
    │   ├── JournalPage.jsx
    │   ├── [other pages]
    │   └── NotFoundPage.jsx
    ├── layouts/
    │   └── RootLayout.jsx       # App wrapper (Navbar, Footer, etc.)
    └── routes/
        ├── routes.jsx           # Lazy route table + error wiring
        └── paths.js             # Route constants (single source of truth)
```

**Key Rules:**

- Pages stay thin (composition only, no logic)
- No data literals inside components
- Components ≤ ~250 lines
- Feature folders are self-contained (exports minimal surface)
- Data flows: `data → feature components → pages`

---

## 🛣 Routing Map

                                                                         |

**Route Behavior:**

- All routes are lazy-loaded (`React.lazy` + `<Suspense>`)
- Wrapped in `AnimatePresence` for page transitions
- `ErrorBoundary` at layout level
- `ScrollToTop` fires on navigation
- Route constants in `routes/paths.js` (no magic strings)

---

## 🗄 State Management (Zustand v5)

**No backend:** All data is local mock modules + pure selector utilities. `useAsyncData` hook adds simulated latency on list pages so skeleton loading states are real.

| Store             | State                                                             | Persistence      | Max Size |
| ----------------- | ----------------------------------------------------------------- | ---------------- | -------- |
| **wishlistStore** | `ids[]` · add/remove/toggle/clear/has                             | `av-wishlist-v1` | ∞        |
| **compareStore**  | `ids[]` · add/remove/toggle                                       | `av-compare-v1`  | 4 cars   |
| **bookingStore**  | `bookings[]` (id, car, date, time, showroom, contact)             | `av-bookings-v1` | ∞        |
| **uiStore**       | `quickNavOpen` · `searchOpen` · `carsViewMode` · `scrollPosition` | viewMode only    | —        |
| **toastStore**    | transient queue · add/remove                                      | none             | —        |

**Persistence:** Via `zustand/middleware persist` through `safeStorage` wrapper (versioned keys, corruption-proof, SSR-safe).

**Cross-store logic:** Interactions (e.g., "compare all wishlist cars") read via `getState()` — no duplicated state.

**URL state:** Catalogue filters, sort, pagination, and finance price live in query params (source of truth = URL; shareable, back-button-correct).

---

## 🎨 Feature Highlights

### Cars Catalogue

- **Filter by:** Brand, category, price range, fuel type, transmission, availability
- **Sort by:** Price (asc/desc), year (newest/oldest), most compared, most wishlisted
- **Views:** Grid (default) + List toggle
- **State:** Filters & sort persist to URL for deep linking and sharing

### Comparison Engine

- Up to 4 cars simultaneously
- Difference highlighting (new vs. old specs)
- Mobile-optimized carousel for small screens
- Wishlist batch compare

### Finance Calculator

- Real EMI math (amortization schedule)
- Down payment slider · tenure options (12–72 months)
- Breakdown chart (Recharts) with interest vs. principal
- Deep-linkable via `?price=` query param

### Test-Drive Booking

- React Hook Form + Zod validation
- Showroom selection · preferred date/time
- Saved bookings with cancellation
- Email/SMS simulation (mock data)

### Automotive Journal

- ~12 articles with category filtering (6 categories)
- Search within articles
- Rich block-based content model
- Related articles on detail page

### Showroom Directory

- 3 locations (Gulshan, GEC Chattogram, Sylhet)
- Hours, contact, map (placeholder)
- Linked to test-drive booking

---

## 🔧 Development Guidelines

### Code Standards

- **No TypeScript:** JavaScript + JSDoc for type hints (editor IntelliSense)
- **Component size:** Keep components ≤ ~250 lines; split into smaller units
- **Data placement:** All data literals in `src/data/`, never inside components
- **Naming:** PascalCase for components, camelCase for utilities, UPPER_SNAKE_CASE for constants
- **CSS:** Tailwind utility-first with DaisyUI components; avoid inline styles

### Performance Optimizations

- Lazy route loading with Suspense
- Image optimization via `sharp` (build-time)
- Motion animations use GSAP with hardware acceleration
- Pagination on large lists (cars, journal)
- Memoization for expensive re-renders (compareStore selectors, spec tables)

### Accessibility Checklist

- Heading hierarchy (h1 on every page, nested h2/h3)
- Image alt text on all `<img>` tags
- Form labels properly associated with inputs
- ARIA landmarks (`<nav>`, `<main>`, `<footer>`)
- Keyboard navigation (Tab, Arrow keys, Escape)
- Color contrast ≥ 4.5:1 (verified via `contrast-audit.mjs`)
- `prefers-reduced-motion` honored (Motion.js integration)

### QA Scripts

Run accessibility & quality checks:

```bash
node scripts/a11y-audit.mjs         # Heading structure, alt text, ARIA
node scripts/contrast-audit.mjs     # WCAG AA color contrast
node scripts/smoke-render.mjs       # Route render validation
node scripts/placeholder-images.mjs # Generate fallback imagery
```

---

## 📦 Mock Data Structure

All data is in `src/data/`:

- **cars.js:** ~36 vehicles with specs (engine, transmission, fuel, mileage, price, availability)
- **brands.js:** 12 brands mapped to car relationships
- **categories.js:** 7 categories (sedan, SUV, etc.) with derived counts
- **services.js:** 8 service packages (maintenance, warranty, etc.)
- **journal.js:** ~12 articles with block-based content (text, image, heading)
- **showrooms.js:** 3 location details (name, address, hours, phone)
- **team.js:** Company team members with bios and photos
- **hero.js:** Homepage hero section content

**Integrity:** `src/data/index.js` exports all data + runs a dev-time self-check (validates car references, category counts, etc.).

---

## 🌐 Browser Support

- Modern browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)
- Mobile-first responsive design (320px – 1920px)
- No IE11 support

---

## 📄 License & Data

> All vehicles, prices, articles, team members, and locations in this project are **illustrative mock data** created for demonstration purposes.

---

## 📚 Further Reading

- **Full Architecture Baseline:** See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Progress & Phase Tracker:** See [docs/PROGRESS.md](docs/PROGRESS.md)
- **Tailwind Config:** [tailwind.config.js](tailwind.config.js)
- **Vite Config:** [vite.config.js](vite.config.js)

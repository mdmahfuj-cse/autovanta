# AutoVanta — Premium Automotive Showroom

A production-quality, **frontend-only** automotive showroom & marketplace concept.
Cinematic brand homepage, full car catalogue, compare garage, wishlist, brand
directory, services desk, finance calculator, test-drive booking and an
automotive journal — all on realistic local mock data.

## Stack

React 19 · Vite · JavaScript · React Router · Tailwind CSS v4 · DaisyUI 5 ·
Zustand · Motion · Lucide React · Recharts (from Phase 6) · React Hook Form + Zod (from Phase 6)

## Design identity

- **Theme:** Obsidian + deep Racing Crimson — `#B31217` for fills/buttons, `#E86862` for accessible red text (WCAG AA verified via `scripts/contrast-audit.mjs`)
- **Type:** Space Grotesk (display) · Inter (body) · IBM Plex Mono (spec numerals)
- **Currency:** BDT (৳) with lakh/crore formatting
- **Accessibility:** audited h1/alts/named-controls per route, keyboard focus traps, `prefers-reduced-motion` honored globally (`scripts/a11y-audit.mjs`)

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start dev server (http://localhost:5173)
npm run build   # production build
npm run preview # preview production build
npm run lint    # eslint
```

## Status

See `docs/PROGRESS.md` for the phase tracker and `docs/ARCHITECTURE.md` for the
full architecture baseline.

> All vehicles, prices, articles and people in this project are illustrative mock data.

# AUTOVANTA — Progress Tracker

| Phase | Scope | Status |
|---|---|---|
| 0 | Architecture & plan | ✅ Complete |
| 1 | Foundation (Vite, theme, router, stores, layout, navbar, sidebar) | ✅ Complete |
| 2 | Homepage (hero + 13 sections) | ✅ Complete |
| 3 | Car catalogue + details | ✅ Complete |
| 4 | Compare + wishlist + persistence | ✅ Complete |
| 5 | Brands + services + showrooms | ✅ Complete |
| 6 | Finance calculator + test drive | ✅ Complete |
| 7 | Journal | ✅ Complete |
| 8 | Responsive + polish + a11y | ✅ Complete |
| 9 | Final QA | ✅ Complete |
| 10 | Hero carousel (deferred feature) | ✅ Complete |
| 11 | Deep car details (30+ per section) | ✅ Complete |
| 12 | Fleet expansion 36 → 64 cars (3 image batches) | ✅ Complete |
| 2 | Homepage (hero + 13 sections) | ⬜ Not started |
| 3 | Car catalogue + details | ⬜ Not started |
| 4 | Compare + wishlist + persistence | ⬜ Not started |
| 5 | Brands + services + showrooms | ⬜ Not started |
| 6 | Finance calculator + test drive | ⬜ Not started |
| 7 | Journal | ⬜ Not started |
| 8 | Responsive + polish + a11y | ⬜ Not started |
| 9 | Final QA | ⬜ Not started |

## Decision Log
| # | Decision | Rationale |
|---|---|---|
| D1 | Hybrid imagery: AI-generated local assets + shared category studio pool | Client pick — consistent campaign look, offline-safe |
| D2 | Obsidian + Racing Crimson (`#E10600`) | Client pick |
| D3 | BDT pricing, lakh/crore formatting | Client pick |
| D4 | Mixed inventory (New + Certified Pre-Owned) | Gives `mileageKm` real meaning + richer availability states |
| D5 | Filters/sort in URL query params | Shareable, back-button correct |
| D6 | Custom toast system (no extra dep) | Small surface, full motion control |
| D7 | SVG brand monograms in code | Crisper than generated logos, tiny payload |
| D8 | Hero: single car now, carousel-ready structure | Per brief |

## Verification Log
| Phase | App runs | Console clean | Build clean | Manual | Responsive |
|---|---|---|---|---|---|
| 0 | n/a (planning only) | n/a | n/a | Docs reviewed | n/a |
| 1 | ✓ dev @5173 | ✓ eslint clean + SSR smoke render (16 pages + shell, 0 errors) | ✓ 125 kB gzip main, 16 route chunks | ✓ prod preview @4173 served; SPA fallback verified | ✓ layouts written responsive-first (375→1536 classes); full pass in Phase 8 |
| 2 | ✓ dev @5173, HMR clean | ✓ eslint clean + SSR smoke + 14/14 section markers verified in SSR HTML | ✓ HomePage chunk 32.3 kB gzip; full build clean | ✓ finance EMI hand-checked (৳1,25,835/mo on ৳59.5L @9.8%/60m); compare sample winners spread verified | ✓ mosaic/hero/scroller have mobile-specific layouts; full audit in Phase 8 |

### Phase 2 notes
- Data layer pulled forward (cars/brands/categories/services/journal/showrooms) — homepage previews consume all of it
- 10/15 campaign images generated this turn (per-turn cap); stand-ins in place for cat-ev, cat-hybrid, int-dark, int-tan, detail-wheel — swap next turn, no code changes needed
- Fixed: BRANDS_BY_ID not re-exported from data barrel (runtime crash in CarCard), Hero.jsx import path, fetchPriority casing, slugify leftover, useless escapes
- Wishlist/compare actions on cards already wired to stores with toasts (Phase 4 builds their pages)

### Phase 3 notes
- THEME RE-TUNE (client feedback): primary dimmed #E10600 → #B31217; red stripped from all decorative accents (eyebrows, icons, stat suffixes, big numbers, accent words → muted/silver). Red now survives only as: logo, primary buttons, active states, hover-reveal affordances, small functional chips
- Remaining 5 campaign images generated and swapped (cat-ev, cat-hybrid, int-dark, int-tan, detail-wheel) — all 15 assets now real
- Catalogue: URL-synced filters (q/brand/category/fuel/transmission/maxPrice/flag/sort), debounced search via input-handler timer (no effect-state syncing), grid/list morph with popLayout exits, mobile filter drawer, empty state, sticky desktop rail
- Details: directional gallery crossfade + layoutId thumb ring, key spec strip, 3 spec tables, equipment groups, interactive color picker, finance estimate (real EMI), similar cars, test-drive hand-off (?car=slug)
- Fixed: motionTokens import paths in features/cars/* (2 levels deep), CATEGORIES_BY_ID missing from barrel, useState import
- Note: SSR smoke harness renders pages outside Route — useParams-based pages need a Routes wrapper to test the found branch (validated separately)

### Phase 4 notes
- Compare: 24 metrics in 4 groups (utils/compareMetrics.js — pure, unit-tested); best-value dot per row (min/max direction-aware), identical values dimmed, mixed-unit rows never highlighted; features breakdown cards under the table
- Mobile compare: horizontal scroll with sticky metric column + swipe hint (intentional pattern; replaced the per-metric card carousel from the original architecture note — simpler and more usable)
- New: site-wide CompareTray (hidden on /compare, spring entrance, layout-animated chips, disabled CTA below 2 cars)
- Wishlist: bulk "Compare all" (capacity-aware, skips beyond 4), two-step clear (no modal), popLayout removal animations, curated empty state with suggestions
- Test infra: scripts/compare-wishlist.client-test.mjs — jsdom + createRoot client tests (16 assertions) incl. real localStorage round-trips. Learnings: Zustand v5 SSR selectors read initial state (use client render for stateful assertions); fresh root per scenario (root reuse across tree types is a jsdom-only artifact); jsdom needs matchMedia/IntersectionObserver/ResizeObserver/getComputedStyle stubs
- Fixed: CompareTray import silently dropped by edit_file (re-applied via sed)

### Phase 5 notes
- Brands: editorial 2-col directory (monogram, country/founded, tagline, count, featured model); brand pages = watermark-monogram hero + stat band + featured spotlight + sortable line-up + other-marques strip; recovery state for unknown slugs
- Services: index as 8 alternating editorial sections; detail pages = header, 3 meta cards, includes checklist, numbered process timeline, booking band (call + message), other-services nav
- About: story, CountUp stats band (12.4K+ delivered), 3 values, 6-person team (SVG-initial monograms), showrooms strip
- Contact: 3 showroom cards (flagship with image), sticky validated message form (pure validator in utils/validateContact.js — BD phone OR email, per-field errors, aria wiring, success panel + toast)
- Data: team.js added (STORY_STATS/VALUES/TEAM); barrel now also exports SERVICES_BY_SLUG
- Fixed: SERVICES_BY_SLUG missing from barrel (crashed /services/:slug) — all four lookup maps now re-exported
- Harness learnings: React SSR escapes & → &amp; (apostrophes stay raw) — decode or match entities when asserting raw HTML

### Phase 6 notes
- Deps added: react-hook-form 7.86, zod 4.5.4, @hookform/resolvers, recharts 3.10
- Finance `/finance`: vehicle picker + price/down/rate sliders, tenure and down-% chips, big EMI readout, stats grid, Recharts donut (principal vs interest, interest-share center) + amortization balance area chart (real schedule), first-EMI split note; deep-link prefill ?car= / ?price= wired from detail pages
- Test drive `/test-drive`: RHF+Zod form (BD phone-or-email, date window 0–90d, Friday slot filtering per showroom hours), ?car= prefill with hint, confirmation card with AV-1xxx reference, bookings list (upcoming/completed) persisted `av-bookings-v1`, two-step cancel
- Regression: scripts/test-drive.client-test.mjs — 19 assertions, drives the real form in jsdom
- jsdom/React-19 learnings: react-dom computes isInputEventSupported at import time via 'oninput' in document — false in jsdom → IE propertychange polyfill (undrivable). Fix: define oninput on Document.prototype AND dynamic-import React modules AFTER jsdom setup (ESM imports hoist above stubs); stub attachEvent (RHF focuses first invalid field)
- Fixed: watch() → local date state; inline FieldError → render function; BookingsList motionTokens import depth (3rd occurrence — added full-tree relative-import audit, all resolve)

### Phase 7 notes
- Article content authored: 12 articles, 93 blocks (p/h2/quote/list/spec) in data/articleContent.js; attached by slug in journal.js post-process; dev integrity check now asserts every article has content
- Journal index: lead + grid composition, URL-synced ?q= + ?category= (AND-token search across title/excerpt/category/author/tags), chips with real counts, empty state
- Article page: centered editorial header, spring reading-progress bar, block renderer (reuses SpecTable for spec blocks), tags, author card joined to About TEAM data, category sidebar + test-drive cross-sell, related (same category first)
- Fixed: ARTICLES_BY_SLUG missing from barrel (4th lookup-map export bug); literal \u2019 escapes from JSON write (rendered to real apostrophes); my own wrong chip-count test expectation (2 per category, not 1)
- Author roster deliberately shared with the About team — editorial voice = floor staff

### Phase 8 notes
- CONTRAST: scripts/contrast-audit.mjs (WCAG math over real token pairs incl. alpha blends). Found 8 failures — fixed all:
  * dimmed #b31217 fails as text (2.84:1) → new `--color-primary-text #e86862` token for ALL 56 red text/icon usages; #b31217 stays on buttons (white text 6.96:1), dots/borders/fills
  * error-on-tint → `--color-error-text #ff7a7a`; muted/60 + /70 removed (full muted = 7.27:1); footer neutrals bumped to /80 (5.34:1)
  * focus ring → #e86862 (6.21:1); compare indicator dots → primary-text (5.95:1, 3:1 graphics rule)
  * hierarchy preserved via size/tracking — final audit 17/17 PASS
- A11Y: scripts/a11y-audit.mjs — SSR pass (16 routes: exactly one h1 each, all img alts, all buttons/links named, skip link, landmarks, live regions) + jsdom keyboard pass (QuickNav: role=dialog, aria-modal, focus-in, Tab/Shift+Tab trap wraps, Esc → store reset + scroll unlock + focus restore)
- MOTION: global MotionConfig reducedMotion="user" — every animation degrades at the OS level; per-component guards kept
- RESPONSIVE: static audit of fixed widths / min-widths / vw units / oversized text / negative margins — all either desktop-gated, inside overflow-hidden, or intentional scroll containers; ComparePreview now scrolls like the real table on mobile (min-w-[38rem] in overflow-x-auto) instead of mis-aligned 2-col wrap
- POLISH: navbar menu trigger aria-expanded; dead code removed (PlaceholderPage, useDebounce hook, PRICE_RANGE)
- Harness learnings: AnimatePresence exit completion never fires in jsdom — assert close semantics (store/scroll/focus) instead; MotionConfig reducedMotion="always" gives opacity-only exits for deterministic drawer tests; React feature detection is import-time — dynamic-import React after env setup in all harness scripts
- ADDENDUM (post-report, user request): real company logos on the marque plates — scripts/extract-brand-logos.mjs pulls 9 marks from `simple-icons` + Mercedes/Jaguar from archived 9.21.0 SVGs vendored in scripts/vendor/simple-icons-legacy/ (removed from newer releases at brand request), hand-drawn stroke mark for Lexus (never in simple-icons) → generates src/assets/brandLogos.js (24×24 vectors, ~9.5KB gzip across lazy chunks); BrandMark renders the real monochrome logo (currentColor, falls back to 3-letter code), decorative red corner dot dropped; Brand Directory + Brand Details pages inherit the upgrade; full gate suite re-run green
- ADDENDUM 2 (user request: car images must match names): pool audit showed the 9 shared category shots are specific real cars (cat-sedan = S-Class, cat-luxury = Maybach, cat-suv = Defender, cat-suv-dark = Navigator, cat-sports = McLaren 765LT, cat-coupe = Ferrari 812, cat-coupe-dark = Aston DBS, cat-hybrid = Mirai, cat-ev = generic EV) — all 36 cars drew from these pools → most cars wore competitor bodies (user spotted the M5 on the Maybach shot). Fix: dedicated per-car studio shots + GALLERY_OVERRIDES (own exterior + interior + wheel; 911 keeps hero-gt + perf-flagship pair). DONE (10/36): M5, Model S Plaid, GR Supra, Fortuner GR, Camry HEV, IONIQ 5, MX-5 RF, Ranger Raptor, Mustang GT, LX 600 — covers every homepage surface (hero/featured/new-arrivals/spotlight/compare). REMAINING 7 cars still on pools (honda-crv, ford-everest, jaguar fpace/ipace/xf, mazda cx5/mazda6) — final batch next; batches 1–3 wired = 29/36 with own imagery; batch 3 accepted 10/10 (civic-rs redo passed after "no full-width light bar" constraint; es-300h matches real 2025 ES Luxury design). Gates green after batch-3 wiring.
- ADDENDUM 2 FINAL (batch 4): 7/7 wired — crv (redo: separate slim lamps + chrome wing, Hyundai-face fixed), everest (REJECTED Land-Cruiser-looking first render → regenerated with squared C-clamp-DRL face ✓), fpace ✓, ipace (redo: cab-forward + blade DRLs ✓), xf ✓, cx5 ✓, mazda6 (redo: longer deck + winged shield ✓). GALLERY_OVERRIDES now 36/36 — NO car shares another brand's body; EXT_POOL remains only as defensive fallback. Visual QA: every image individually reviewed (multi-image read_file previews shuffle order — never trust batch order). Redo learning: name the exact DRL signature + forbid the wrong one ("NOT a full-width light bar", "C-shaped hook DRLs"); reject wrong-body renders even when generic (everest→Land Cruiser, crv/civic→Hyundai face, mazda6→compact proportions). Full gate suite GREEN after completion.

### Phase 9 notes
- NEW GATE: scripts/qa-final.mjs (4 parts) — run after `npm run build`:
  * A: deep SSR sweep, 33 routes = 16 base + 17 parameterized hand-off URLs (?q/brand/category/fuel/transmission/flag/maxPrice/sort on /cars, ?car/?price on /finance + /test-drive, ?q/?category on /journal, unknown slugs -> recovery branches), content-marker + forbidden-marker assertions; cars-list routes cross-validated: SSR card-link counts === applyFilters() for the exact params (10/10 match)
  * B: link audit — every internal <a href> across all rendered routes + shell (703 unique) resolves against real route patterns; 0 dead links
  * C: data/math integrity — 36 unique ids/slugs, all brandId/categoryId/featuredModelId references resolve, 36/36 unique primary images + assets exist on disk, journal slugs/content complete, EMI hand-checks (2.85Cr/84m/8.5%/40% down -> 270,804 exact; zero-financed + zero-rate edges), amortization 84 rows -> 0, formatBDT lakh/crore/en-IN cases, filter/sort/search contracts, persistence keys canonical (av-*-v1)
  * D: bundle budgets — main 80.45 kB gzip (<=90), 16/16 route chunks, largest lazy chunk 106.67 kB (<=120), heaviest image 202 kB (<=420); total JS 365 kB gzip, images 5.43 MB (lazy)
- BUG FOUND + FIXED: homeLinks.js newArrivals CTA was `/cars?flag=new` but data/page use `newArrival` — homepage "New arrivals - View all" opened an EMPTY catalog. Now `/cars?flag=newArrival`.
- DOC FIX: format.js docstring example formatBDT(450000) claimed '95,000'; actual '4.5 Lakh' (95,000 = formatBDT(95000))
- HARNESS LEARNINGS (qa-final): detail pages MUST render under a real <Route path> (useParams needs route context — bare createElement takes the unknown-slug branch); MemoryRouter path patterns cannot contain query strings; <link rel="preload"> hrefs are not anchors (link audit matches `<a` tags only); search-input PLACEHOLDER copy ("try Civic") pollutes naive forbidden-marker checks; full-shell renders include QuickNav which lists every car name — use bare-page renders for content markers
- PROD VERIFIED: vite preview @4173 — all routes 200 incl. deep links (SPA fallback), hashed assets 200; dev server log clean (HMR only); zero TODO/FIXME in src
- FINAL GATES (single run): eslint clean - smoke-render 16 OK - qa-final PASSED - compare-wishlist 16/16 - test-drive 19/19 - contrast 17/17 - a11y PASS
- PHASE 9 RE-RUN (user request, after post-Phase-9 changes: 36/36 per-car imagery, real brand logos, navbar restructure x3 with centred trio, QuickNav regroup, vite dedupe pin): FULL 8-GATE SUITE GREEN — (1) prod build clean 1.51s; (2) eslint clean; (3) smoke-render 16 pages OK; (4) qa-final PASSED — 33-route SSR sweep, 703+ internal hrefs resolve, data/math integrity (36 unique primary images, EMI hand-checks, persistence keys), budgets (main 80.45 kB gzip, 16/16 chunks, largest lazy 106.67 kB, heaviest image within 420 kB); (5) compare-wishlist 16/16; (6) test-drive 19/19; (7) contrast 17/17; (8) a11y PASS; plus 0 TODO/FIXME, prod preview: all 16 routes 200 incl. deep links + unknown slugs (SPA fallback), hashed assets 200, dist carries 50 jpgs (7.5 MB, lazy); built navbar contract verified (1 launcher top-left, centred trio, search right of centre); dev server @5174 clean (stale transform error in log traced to an intermediate broken JSX state during the navbar edit sequence — current modules transform 200)
- ADDENDUM (post-report, user request — navbar restructure): menu trigger moved from the right action cluster to the FAR LEFT of the navbar (before the logo, visible on ALL viewports — desktop gets the quick launcher too); navbar now carries the 3 requested items at top level: "Explore Cars" (Cars relabeled), "Compare Garage" (Compare relabeled, keeps count badge), "Book a Test Drive" (new top-level link) — no duplicate entries; QuickNav drawer drops those 3 (now: Featured Cars, New Arrivals, Wishlist / Finance Calculator, Services) and its stale `?flag=new` link fixed to `newArrival`; link row tightened (px-1.5/text-[12.5px] at lg, whitespace-nowrap, min-w-0) so all 9 desktop links fit at 1024; all gates re-run GREEN (714 hrefs resolve, qa-final PASSED, a11y PASS)
- ADDENDUM 2 (user still couldn't see the items): root cause — desktop inline link row was `hidden lg:flex`, so viewports <1024px (incl. the narrow preview pane) showed only the hamburger/logo/icons; FIX: added a second header row "compact link rail" (border-t border-white/5, lg:hidden) — horizontally scrollable (overflow-x-auto no-scrollbar, w-max chips, active chip = bg-white/8) carrying ALL NAV_LINKS incl. the 3 requested items at EVERY width; single nav[aria-label=Primary] wraps both rows; header grows ~40px on mobile — safe (all page roots pad pt-28 = 112px >= 64+40); vite resolve.dedupe react/react-dom pinned after a dual-React "null useState" incident caused by dev-server restart + stale optimizer cache (lesson: an in-process vite.config restart can wedge the dep optimizer — kill and fresh-start instead); gates GREEN (eslint/build/smoke/qa-final/a11y/contrast)
- ADDENDUM 3 (user refinement — exactly 3 centred): navbar centre now carries ONLY the 3 requested actions, truly centred between logo and search (absolute left-1/2 -translate-x-1/2 cluster, md+; Compare Garage keeps live count badge); remaining 6 links (Home, Brands, Journal, About, Contact [+ Services already in drawer]) moved into the QuickNav drawer as its new "Menu" group (first group, icons Home/Building2/Newspaper/Info/Mail) — no nav destination lost, no navbar/drawer duplication; <md keeps a scrollable rail under the bar with the same 3 (short labels Cars/Compare/Test Drive on xs); note: AnimatePresence content (QuickNav) is absent from SSR output — verify drawer contents from source or jsdom (a11y Part B covers it); gates GREEN (eslint/build/smoke/qa-final/a11y/contrast)

### Phase 1 notes
- Resolved versions: React 19.2, Vite 8.2, RR 7.18, Tailwind 4.3, DaisyUI 5.7, Motion 13, Zustand 5.0, Lucide 1.37, ESLint 10
- Vite 8 blocks unknown proxy hosts → `server.allowedHosts: true` set for the preview environment
- Lucide 1.x dropped brand icons (Facebook/IG/YT) — socials intentionally omitted until Phase 8 picks a strategy
- react-hooks v7 rules enforced: no setState-in-effect patterns; SearchDialog query state resets via unmount
- `node_modules` is not persisted between sessions — re-run `npm install` if the dev server is started fresh in a later phase

## Phase Reports
### PHASE 0 — see chat report + docs/ARCHITECTURE.md

### Phase 10 notes (hero multi-car carousel — the feature explicitly deferred by the brief)
- DATA: src/data/hero.js expanded 1 → 3 slides (911 Carrera / M5 Competition / Model S Plaid — the homepage featured trio, all with Phase-10-era correct imagery); each slide carries carId (validated by the barrel integrity check), copy tuned to real specs (727 hp M5 hybrid, 1020 hp/2.1 s Plaid), optional imagePosition tunes the backdrop crop per photograph
- HERO REWRITE (kept deliberately simple + stable per the brief):
  * backdrop = 3 stacked <img>s crossfading via CSS transition-opacity 1200 ms — no AnimatePresence unmount churn on the heavy layer; first image eager+fetchPriority high, others lazy
  * content = AnimatePresence mode="wait" keyed by slide id — entrance choreography (stagger/line-reveal) replays per slide; mode="wait" guarantees EXACTLY ONE h1 at any moment (a11y contract intact)
  * autoplay 7 s, pauses on hover AND focus-within, fully disabled under prefers-reduced-motion; MotionConfig reducedMotion="user" handles the transitions
  * swipe = pointer down/up delta (56 px threshold, horizontal-intent check |dx|>|dy|*1.4) — never intercepts taps/scroll; dots = plain buttons with aria-label + aria-current
  * spec chips, floating plates, price pill and details CTA all derive from the slide's car — copy/specs can never drift
- BUG CAUGHT BY GATES: initial import used CARS_BY_SLUG which is NOT re-exported by the data barrel → HomePage SSR crash (smoke-render failed immediately, exactly as designed); fixed to getCarBySlug
- HARNESS NOTES: React 19 SSR emits fetchPriority camelCase in HTML (browsers are case-insensitive — fine); probe slices by string index are fragile — verify attributes with full-document regex, not window slices
- GATES: eslint clean - build OK - smoke 16 OK - qa-final PASSED - compare/wishlist 16/16 - test-drive 19/19 - contrast 17/17 - a11y PASS

### Phase 11 notes (deep spec sheets — "at least 30 car details in every section")
- NEW MODULE: src/utils/specSheet.js — pure deterministic builders; every row derived from real data-model facts (engine tuple, performance, efficiency, dimensions, seats, fuel, drivetrain, transmission, price, categories) via class tables (kerb weight / fuel tank / tow rating / grip g / Cd per category) + closed formulas (0-200, 0-400m, kickdown, braking 200-0, economy split, CO2 factors, tank range, BDT running costs, charge times, room measurements, turning circle, brake sizes...). No randomness → SSR/client/QA always agree
- SIX SECTIONS, MINIMUMS ACROSS ALL 36 CARS: engine & drivetrain 33, performance & efficiency 31, dimensions & chassis 37, comfort 32, technology 30, driver assistance & safety 31 (flagship/premium cars carry more; comfort/tech/safety cap at 34 per card for presentation)
- Libraries: COMFORT 56 / TECH 39 / SAFETY 43 predicate entries (universal set alone clears 30 for every car; tier/category/fuel items extend it — EVs get range/charging/one-pedal rows, hybrids get system-output rows, SUVs get wading/tow/hill-descent, sports get telemetry/lap-timer)
- PAGE: CarDetailsPage consumes builders; SpecTable now renders rows in a 2-col grid (border-b rows) so 30-row tables stay scannable; car.features arrays remain in the data model untouched (only the details page now renders the deeper sheets)
- PERMANENT GATE: qa-final Part C now asserts min rows per section >= 30 across ALL 36 cars — the requirement can never silently regress
- LEARNINGS: (1) predicate libraries must be sized for the WEAKEST car (core-tier sedan) — bulk universal sets first, then extend with tier/category/fuel items; (2) apostrophes in single-quoted string literals (owner's) — use typographic ' or double quotes; (3) watch operator precedence in template-literal formulas (a + b + cat === 'sports' is (a+b+cat)==='sports' — parenthesize)
- GATES: eslint clean - build OK - smoke 16 OK - qa-final PASSED (incl. new depth gate) - compare/wishlist 16/16 - test-drive 19/19 - contrast 17/17 - a11y PASS; rendered counts verified on 911 page (33/31/37 rows + 34/34/34 items)
### Phase 12 notes — fleet expansion 36 → 64 (IN PROGRESS)
- TARGET: user asked for "more than 60" cars → plan +28 = 64 total, 12 brands intact, ≥2 cars/brand maintained
- BATCH A (9 cars) LANDED: LC300 VXR (featured), Corolla Cross HEV (newArrival), 330i M Sport (featured), M2 (performance), GLC300 4MATIC, Q5 Sportback 45 TFSI (slug audi-q5-sportback-45tfsi-2024, file audi-q5-45tfsi-2024.jpg — render showed Sportback roofline), RX500h F Sport (featured), Model X LR (newArrival), Mach-E GT (performance); all 9 with own generated image + gallery override + full RAW entry
- FIX: specSheet.js isEv used fuel === 'Electric' but data uses 'EV' → EVs rendered petrol rows since Phase 11; fixed 2 sites (isEv + kerb)
- qa-final fleet-count assertions made DYNAMIC: new EXPECTED_FLEET const (env-overridable, default 64); uniq/count asserts now derive from CARS.length
- BATCH A GATES (EXPECTED_FLEET=45): eslint clean, build 1.29 s, smoke 16, qa-final PASSED, depth gate 45 cars min/section = engine 33 / perf 31 / dims 37 / comfort 34 / tech 30 / safety 31, compare/wishlist 16/16, test-drive 19/19, contrast PASS, a11y PASS
- PENDING: batch B (10 images: cayman regen + a6/ix/cle300/hilux-gr/accord/sonata/ftype/cx90/m3-perf), batch C (9: nx350h/f150/e-pace/mazda3/hrv/palisade/q3/a200/rav4) → 55 → 64; image cap = 10/turn, batch A consumed this turn's budget
- BATCH B (10 cars) LANDED: 718 Cayman regen (REJECT fixed — pure mid-engine proportions, no scoop; performance), A6 45 TFSI, iX xDrive50 (newArrival), CLE 300 Coupe, Hilux Revo GR Sport 2.8 Diesel 4x4 (fleet fuel diversity), Accord e:HEV (newArrival), Sonata N Line (performance), F-Type P450 V8 (performance), CX-90 PHEV 7-seat (newArrival), Model 3 Performance (performance); all with own image + override + entry
- BATCH B GATES (EXPECTED_FLEET=55): eslint clean, build 1.48 s, smoke 16, qa-final PASSED (55/55 unique primaries), depth gate 55 cars = engine 33 / perf 31 / dims 37 / comfort 34 / tech 30 / safety 31, compare/wishlist 16/16, test-drive 19/19, contrast PASS, a11y PASS
- REMAINING: batch C = 9 images + entries (nx350h/f150/e-pace/mazda3/hrv/palisade/q3/a200/rav4) → 64 total

### Phase 12 notes — fleet expansion 36 → 64 ✅
- BATCH C (9 cars) LANDED: NX 350h (hybrid luxury SUV), F-150 Lariat 3.5 EcoBoost (400 hp full-size pickup), E-Pace P250 (BRG), Mazda3 Skyactiv-X hatch, HR-V e:HEV, Palisade Calligraphy 2.2 CRDi (diesel 7-seat, newArrival), Q3 35 TFSI, A 200 AMG Line hatch, RAV4 Hybrid AWD-i; every image verified on-model (NX spindle grille, F-150 FORD-bar + C-clamp LEDs, Palisade T-DRLs)
- FLEET: 64 cars / 12 marques / every brand ≥4 (toyota 7, bmw/mercedes/audi 6, others 5, porsche 4); 64/64 unique primary images; fuel mix now covers Petrol/Diesel/Hybrid/EV across pickups, hatches, 3-rows, V8s
- FLEET-NUMBER SWEEP: hero slide copy "36 curated machines" → "64 curated machines" (hero.js); cars.js header comment → "(64 units · 12 marques)"; qa-final fleet asserts already dynamic (EXPECTED_FLEET default 64)
- PROSE FIXES: 4 dropped-apostrophe typos in new entries (America's, doesn't, Mazda's, Cox's — U+2019 per phase-11 lesson)
- VERIFIED SSR: homepage renders "64 curated machines"; iX (EV) page shows range 630 + kWh and NO fuel-tank row (EV fix holds); Hilux/M5 show fuel-tank + km/l rows (ICE branch intact); M5 shows 360° row
- GATES (EXPECTED_FLEET default 64, no env override): eslint clean - build 1.48 s - smoke 16 OK - qa-final PASSED (64/64 catalog, 64/64 unique primaries, gallery assets on disk for all 64, depth gate min/section = engine 33 / perf 31 / dims 37 / comfort 34 / tech 30 / safety 31) - compare/wishlist 16/16 - test-drive 19/19 - contrast PASS - a11y PASS
- IMAGE-VERIFICATION LESSON: read_file every generated car image before writing entries (caught 2 rejects: Cayman v1, Q5 v1); bare-page SSR render starves useParams() — render under Routes+Route with the real path pattern

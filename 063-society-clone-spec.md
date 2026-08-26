# SOCIETYSIXTY — NEW PAGE BUILD PLAN
### Full, detailed spec for building a brand-new page whose layout, spacing, type scale, and animations mirror the PlanFest reference — with original copy and placeholder media.

> **Reference (structure / spacing / motion only):** https://planfest.framer.website/
> **Project (add a NEW page to it):** https://zero60-dev.vercel.app/
> **New route to create:** **`/societysixty`** — a genuinely new page. This is NOT the existing `/society` page. Do not delete or edit `/society`; SOCIETYSIXTY lives on its own route.
> **New brand label used on the page:** **SOCIETYSIXTY**
>
> **Copied from reference:** section order, layout mechanics, spacing rhythm, grid proportions, type scale, animation/interaction behavior, responsive behavior.
> **NEVER copied:** PlanFest images, videos, icons, logos, brand assets, or its written copy. All media = placeholders. All text = the original SOCIETYSIXTY copy in §15.

---

## 0. HARD RULES

1. **Create a new route `/societysixty`** (e.g. `app/societysixty/page.tsx`). Do not modify `/`, `/about`, `/services`, `/portfolio`, `/collaborations`, `/contact`, or the existing `/society`.
2. **Reuse shared Navbar + Footer** by import. If you add a nav link for SOCIETYSIXTY, that edit must not visually change any existing page — verify each afterward.
3. **Zero PlanFest assets.** No `framerusercontent.com` URLs anywhere. Placeholders only, matching each slot's aspect ratio/crop/position (§9).
4. **Zero PlanFest strings.** Before finishing, grep the whole implementation for: `planfest`, `Planfest`, `Isaac`, `isaacdsign`, `framer.link`, `framerusercontent`, `Alexander Reid`, `Sophia Laurent`, `Ethan Walker`, `Isabella Moreau`, `Daniel Carter`, `Olivia Bennett`, `CLAIM ACCESS`, `Event Template`, `About this Event`. Zero matches.
5. **Match structure/spacing/scale/motion of PlanFest, but render in the 063 elegant design language** (light/refined), consistent with the existing site — NOT PlanFest's dark festival palette. Keep colors tokenized so the palette is a one-variable swap if the client changes their mind.
6. **Measure, don't guess.** Use Chrome DevTools → Computed styles on the live PlanFest page to read real values (font-family, sizes, line-height, letter-spacing, gaps, paddings, max-width, radius, border color/opacity, transition duration/easing). Record them in §3 before coding.
7. **`prefers-reduced-motion` fallback** on every animation (final state visible, motion off/calmed).
8. **`npm run build`, lint, and typecheck pass** with zero errors before reporting done.

---

## 1. WHAT "NEW PAGE" MEANS HERE

- A new URL: `https://<project>/societysixty`, reachable by direct navigation and (optionally) from a nav link.
- Its own component tree under `components/societysixty/`.
- Its own copy (§15) and its own placeholder media (§9).
- It stands alone: nothing about it should break or alter existing pages.

---

## 2. REPO RECON (do this first, before writing any component)

Open and confirm:
- [ ] `package.json` → Next.js version; is **framer-motion** and/or **gsap** installed? Tailwind? CSS Modules? styled-components?
- [ ] Router type: App Router (`app/`) vs Pages (`pages/`). Detected: **App Router** (`next/image`, folder routes).
- [ ] How existing routes are structured (look at `app/society/page.tsx` and one other page) to copy conventions.
- [ ] Design tokens: Tailwind config and/or global CSS variables (colors, spacing, radius, fonts). Reuse these; add new tokens only if missing.
- [ ] Existing reusable pieces to reuse: **marquee/ticker component**, section container/max-width wrapper, button, `next/image` wrapper, Navbar, Footer.
- [ ] Font setup: is `next/font` used? Add SOCIETYSIXTY's display/body faces the same way.

Write down what you found before building — the rest of this plan adapts to it.

---

## 3. DESIGN-TOKEN EXTRACTION TABLE (fill from DevTools on PlanFest)

| Token | PlanFest measured value | SOCIETYSIXTY value to use |
|---|---|---|
| Container max-width | ___ px | match |
| Page horizontal padding (desktop/tablet/mobile) | ___ / ___ / ___ | match |
| Section vertical padding (top/bottom) | ___ | match |
| Grid columns per section + gap | ___ | match |
| Card radius / image radius / button radius | ___ | match |
| Border color + opacity, width | ___ | match ratio, elegant hue |
| Background / surface | ___ (dark) | **elegant light** (from 063 site) |
| Primary text / secondary text | ___ | elegant equivalents |
| Accent | ___ | 063 accent |
| Transition base (duration / easing) | ___ / ___ | match |

**Typography — record family / weight / size / line-height / letter-spacing / transform for each:**
Hero H1 · Hero subtitle · Eyebrow · Section H2 · Card H3 · Body · Metric number · Marquee text · Nav link · Button · FAQ question · FAQ answer.

**Fonts:** copy the exact `font-family` string from Computed. Identify the display + body faces. If legally usable (Google Fonts / open license), use them; otherwise pick the closest legal match and **note the substitution + reason** in the final report. Never silently swap fonts.

---

## 4. SECTION-BY-SECTION BUILD SPEC

Reference order confirmed from the live page. Build all ten in this order. "Framer duplicate DOM blocks" = repeats for entrance/scroll animation — reproduce the *effect*, not literal triplicate markup.

### 4.1 `SocietySixtyHero`
- **Layout:** full-viewport-height section. Foreground portrait image (~2:3, 1024×1536) center; behind it, additional images that reveal/parallax on load/scroll. H1 + subtitle stacked; a row of 4 category chips.
- **Type:** H1 = the big display face, uppercase, tight line-height; subtitle = lighter/smaller.
- **Spacing:** hero content vertically centered or lower-third per reference; chips row gap = measured value.
- **Image slots:** 1 main portrait + 2–3 background portraits (placeholders, `object-fit: cover`, same focal crop).
- **Animation:** on load, once — bg image scale+fade in → H1 clip/translate-up + fade → subtitle fade-up → chips stagger in (~80ms each). Optional subtle bg parallax/scale on scroll.
- **Responsive:** full height at all sizes; H1 uses `clamp()`; chips wrap on mobile.
- **Copy:** §15 Hero.

### 4.2 `SocietySixtyIntro`
- **Layout:** centered column, narrow measure. Eyebrow → H2 → one short paragraph → CTA button.
- **Animation:** scroll-into-view reveal (translate-up ~28px + fade, ~0.6s ease-out, once); optional line-split reveal on the H2.
- **CTA:** links to `/contact`. Hover: bg/border/color shift + tiny scale, ~180ms.
- **Copy:** §15 Intro.

### 4.3 `SocietySixtyPillars` (3 feature cards)
- **Layout:** 3-column grid, equal cards. Each card = square-ish icon/image (~1.08:1, 400×369) on top + H3 + one-line description.
- **Animation:** staggered scroll reveal (stagger ~100ms). Hover: card lift + image scale ~1.03 + subtle border/color shift.
- **Responsive:** 3 → 2 → 1 columns.
- **Copy:** §15 Pillars.

### 4.4 `SocietySixtyShowreel` (video row)
- **Layout:** 3 equal video tiles in a row.
- **Media:** placeholder muted-loop videos or poster-image tiles at the same box size; `autoplay muted loop playsInline`; lazy-load and only play when in view.
- **Animation:** tiles reveal on scroll; play on enter, pause on leave.
- **Responsive:** 3-across → stacked.

### 4.5 `SocietySixtyMetrics`
- **Layout:** eyebrow → H2 → 4 metric blocks; each block = **count-up number** + 1:1 icon (256×256) + label. Small glyph (✧) marquee word-rows act as thin separators between metrics.
- **Animation:** numbers count 0 → target when block enters viewport (once). Separator rows are slow marquees.
- **Responsive:** 4 → 2×2 → 1 column.
- **Copy/values:** §15 Metrics.

### 4.6 `SocietySixtyMarquee` (band)
- **Layout:** full-bleed. **Two rows scrolling opposite directions**, words separated by a glyph (✧ / 𑁍).
- **Mechanics:** duplicate the track and translate -50% for a **seamless loop with no boundary jump**; `linear` timing; container `overflow-x: hidden`. Optional pause-on-hover.
- **Reuse** the site's existing marquee component if present.
- **Responsive:** slightly slower on mobile; never causes page horizontal scroll.
- **Copy:** §15 Marquee terms.

### 4.7 `SocietySixtyVoices`
- **Layout:** eyebrow → H2 → grid of 6 portrait cards (2:3, 500×750) each with name + role, plus one text cell woven into the grid.
- **Animation:** staggered reveal; hover = image zoom within a fixed, overflow-hidden frame + caption emphasis.
- **Responsive:** grid collapses 3→2→1; text cell reflows.
- **Copy:** §15 Voices (original roles/names — placeholders, not PlanFest's).

### 4.8 `SocietySixtyGallery`
- **Layout:** H2 across two lines → **horizontal infinite-scroll gallery** of many mixed-aspect images.
- **Mechanics:** duplicated image set for a seamless loop; continuous auto-scroll (marquee); optional drag/scrub. Keep the *mix* of portrait/landscape/square ratios.
- **Animation:** images scale/reveal slightly on enter.
- **Responsive:** smaller image heights on mobile; loop preserved.
- **Copy:** §15 Gallery heading.

### 4.9 `SocietySixtyFAQ`
- **Layout:** eyebrow → H2 → accordion of 6 Q&A.
- **Mechanics:** one item open at a time; animate answer height (auto) + opacity; rotate +/– or chevron; fully keyboard accessible (`button`, `aria-expanded`, `aria-controls`).
- **Responsive:** full-width stack.
- **Copy:** §15 FAQ.

### 4.10 Footer
- **Reuse the existing shared site Footer** by import (large image band + logo + tagline + socials + nav + copyright). Do not rebuild. Ensure branding stays 063 / SOCIETYSIXTY-consistent.

---

## 5. ANIMATION SYSTEM

- Use the library **already in the repo** (framer-motion or gsap). Only fall back to **CSS transitions + IntersectionObserver** if neither exists.
- Animate `transform`, `opacity`, `filter` only (GPU-friendly). Avoid animating layout properties.
- Central helpers: `useReveal`/`useInView` (scroll reveal), `useCountUp` (metrics). Reuse existing hooks if present.
- Defaults to verify against the reference: reveals ~0.5–0.8s ease-out, translate 24–40px; stagger 80–120ms; marquees linear/infinite; buttons 150–250ms.
- **Reduced motion:** wrap all of the above so that when `prefers-reduced-motion: reduce`, content is shown at final state, count-ups show final number, marquees are static or very slow.

---

## 6. RESPONSIVE SYSTEM

Verify at **1440 / 1280 / 768 / 390**.
- Type: fluid `clamp()` between measured desktop and mobile sizes.
- Grids: Pillars/Voices 3→2→1; Metrics 4→2×2→1; Showreel 3→stack.
- Hero: full height everywhere; chips wrap; check bg crop via `object-position`.
- Marquee/Gallery: never cause horizontal page scroll (`overflow-x: hidden` on wrappers).
- Nav: reuse existing desktop-inline → mobile "Menu".

---

## 7. FILE / COMPONENT ARCHITECTURE (new files only)

```
app/societysixty/page.tsx              // composes sections in order; sets <title>/metadata
components/societysixty/
  SocietySixtyHero.tsx
  SocietySixtyIntro.tsx
  SocietySixtyPillars.tsx
  SocietySixtyShowreel.tsx
  SocietySixtyMetrics.tsx
  SocietySixtyMarquee.tsx              // or reuse global marquee
  SocietySixtyVoices.tsx
  SocietySixtyGallery.tsx
  SocietySixtyFAQ.tsx
  data.ts                              // all copy/arrays for the page (edit copy here)
hooks/ (if not already present)
  useReveal.ts
  useCountUp.ts
```
Import the shared Navbar/Footer; don't duplicate them. No single mega-component.

---

## 8. ROUTING + NAV

- Route: `app/societysixty/page.tsx` → serves `/societysixty`. Set page metadata/title (`SOCIETYSIXTY — ZERO-SIXTY-THREE`).
- Works via direct URL and nav click.
- **Optional nav link:** if adding "SOCIETYSIXTY" to the shared nav, confirm every existing page still renders unchanged. If unsure, leave nav as-is and reach the page by URL — decide with the client.

---

## 9. PLACEHOLDER MEDIA PLAN

Preserve each slot's ratio/crop/position; only pixels differ.
- Hero: 2:3 portrait ×(1 main + 2–3 bg), `cover`.
- Pillars icons: ~1.08:1 (400×369).
- Metrics icons: 1:1 (256×256).
- Voices: 2:3 (500×750), `cover`, overflow hidden for hover zoom.
- Gallery: keep PlanFest's *mix* of ratios.
- Showreel: neutral muted-loop clips or poster tiles at the same box size.
- Footer: reuse existing.
- Sources: neutral blocks, local placeholders via `next/image`, or appropriately-licensed generic event stock. Always meaningful `alt`. Never hotlink `framerusercontent.com`.

---

## 10. ACCESSIBILITY
Semantic landmarks; exactly one `<h1>`; logical heading order; accordion as real buttons with `aria-expanded`/`aria-controls`; keyboard-operable; visible focus; alt text on every image; sufficient contrast in the elegant palette; reduced-motion honored.

---

## 11. PERFORMANCE
`next/image` with correct `sizes`; lazy-load below-the-fold media; only play videos in view; GPU-friendly animations; avoid unnecessary re-renders (memoize marquee tracks/data); no layout-thrashing scroll handlers (use IntersectionObserver).

---

## 12. QA LOOP + ACCEPTANCE MATRIX (don't stop at first build)

Put PlanFest and `/societysixty` side by side; check each section: same order · section height/rhythm · content max-width · type hierarchy & scale · grid proportions/gaps · image ratios/crop · border/radius · hover states · reveal timing/easing · responsive collapse.

Must-pass:
- [ ] Hero H1 comparable scale/position; entrance stagger; bg crop matches; no layout shift
- [ ] Metrics count up on scroll (once); correct final values; 1:1 icons
- [ ] Marquees: two directions; **seamless, no boundary jump**; no page h-scroll; reduced-motion fallback
- [ ] Voices: 6 portraits 2:3; hover zoom inside clipped frame; grid collapses
- [ ] Gallery: seamless horizontal loop; mixed ratios preserved
- [ ] FAQ: one-open-at-a-time; animated height+opacity; keyboard operable; icon rotates
- [ ] `npm run build` + lint + typecheck pass
- [ ] `/societysixty` works via direct URL and nav
- [ ] No console errors; no horizontal scrollbar at 1440/1280/768/390
- [ ] `prefers-reduced-motion` respected
- [ ] Grep clean for all §0.4 strings
- [ ] Existing 7 pages visually unchanged

---

## 13. BUILD ORDER (suggested sequence)

1. Repo recon (§2); record stack + tokens.
2. Extract PlanFest tokens/type/animation values (§3) in DevTools.
3. Create route + empty section shells + `data.ts`.
4. Global tokens/fonts wired (reuse existing where possible).
5. Build sections top→bottom (§4), static first.
6. Layer animations (§5) with reduced-motion guards.
7. Responsive pass (§6) at all four widths.
8. Placeholder media (§9) at correct ratios.
9. Accessibility + performance passes (§10–11).
10. QA loop (§12); iterate until acceptance matrix is green.
11. Build/lint/typecheck; grep clean; verify other pages.
12. Write the final report (§14).

---

## 14. FINAL REPORT FORMAT (return these; no false "exact" claims)
1. What was analyzed from PlanFest (with the real measured values from §3)
2. Sections built (map to §4)
3. Animations/interactions implemented + library used
4. Fonts used and why (original identified + substitution + reason, if any)
5. Placeholder media per slot (ratios)
6. Files/components created
7. Compromises where exact replication wasn't possible (honest)
8. Confirmation the existing pages (incl. `/society`) are untouched + how verified
9. Confirmation build/lint/typecheck pass

**Priority if trade-offs forced:** 1) Visual fidelity → 2) Animation fidelity → 3) Typography → 4) Spacing/layout → 5) Responsiveness → 6) Performance → 7) Accessibility → 8) Code quality. Only call a value "exact" if it was measured.

---

## 15. ORIGINAL COPY SHEET (SOCIETYSIXTY — use this, not PlanFest's text)

**Hero**
- H1: `ELEVATED CELEBRATIONS, PERFECTLY PRODUCED`
- Subtitle: `Curated experiences for weddings, brands, and private occasions.`
- Chips: `Weddings` · `Corporate` · `Live Music` · `Private Events`

**Intro**
- Eyebrow: `SocietySixty`
- H2: `THE EVENING EVERYONE REMEMBERS`
- Paragraph: `Refined production, live energy, and considered detail — built for brands, creators, and celebrations that deserve to be felt.`
- CTA: `Make an enquiry` → `/contact`

**Pillars (3 cards)**
1. `Curated Experiences` — `Events shaped end to end, so every moment lands with intention.`
2. `Creative Direction` — `A distinct look, sound, and flow tailored to the occasion.`
3. `Trusted Network` — `Artists, hosts, and technicians who deliver on the night.`

**Metrics (4)**
- `Events Produced` · `Years of Craft` · `Client Satisfaction (%)` · `Cities Served`  (use real or placeholder targets)

**Marquee terms**
`Weddings` · `Corporate` · `Live Music` · `Private Experiences` · `Event Program Support` · `AV / Production` (two opposite-direction rows)

**Voices (6 portraits — placeholder people/roles)**
- Role labels: `Vocalist` · `Creative Director` · `Head of Production` · `DJ / Selector` · `Host / Emcee` · `Lead Photographer`
- Text cell: `A team of performers, directors, and technicians shaping the feel of every SocietySixty night — from first idea to final encore.`
- Names: use generic placeholders (e.g. `Performer One`…`Performer Six`) until the client supplies real names.

**Gallery**
- H2 (two lines): `MOMENTS WORTH KEEPING` / `NIGHTS WORTH RELIVING`

**FAQ (6)**
1. `What kinds of events do you produce?` — `Weddings, corporate programmes, live music nights, private celebrations, and immersive brand experiences.`
2. `How do we start an enquiry?` — `Send us the date, venue, and vision through our contact page and we'll shape a proposal.`
3. `Do you handle private, invite-only events?` — `Yes — discreet, fully-managed private occasions are a core part of what we do.`
4. `Can you provide entertainment and performers?` — `Absolutely: vocalists, DJs, hosts, and full live line-ups, matched to your night.`
5. `Do you work with brands and sponsors?` — `Yes — we build brand activations and sponsor-friendly programmes for modern audiences.`
6. `Is SocietySixty right for creators and businesses?` — `Definitely — it's built for brands, founders, artists, and anyone planning something worth remembering.`

**Footer:** reuse existing shared footer; keep 063 / SOCIETYSIXTY branding and existing contact details.

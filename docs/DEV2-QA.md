# Developer 2 — QA record

**Owner:** Developer 2 · **Rule:** there is no QA team, so each task is tested by the
person who built it before it is called done (Task Division Rev 2, p.6).

This file is the evidence for the "check it on phone / tablet / desktop and verify the
reduced-motion path" task that appears in every milestone. It records **what was
actually exercised**, not an intention to exercise it.

Verification runs against the real production build (`next build` + `next start`),
which is the same artefact Vercel serves — not the dev server.

## Viewports checked

| Class | Width | Why this one |
|---|---|---|
| Phone | 390px | iPhone-class portrait; the tightest gutter case (`--gutter` drops to 1.25rem below 40rem) |
| Phone (large) | 430px | crosses no breakpoint — confirms the fluid scale, not a jump |
| Tablet portrait | 768px | the `md` boundary where the grid steps 4 → 8 columns |
| Tablet landscape | 1024px | the `lg` boundary where the grid steps 8 → 12 columns |
| Desktop | 1280px | `xl`, the width the art direction was composed at |
| Wide desktop | 1536px+ | confirms the `96rem` shell max-width holds and the layout stops growing |

---

## Milestone 1 — responsive layout system, lower landing sections, choreography, atoms

**Scope checked:** the landing page (`/`) end to end, plus the shared atoms in every
brand mode.

### Responsive

- Breakpoints resolve from a single source: `--breakpoint-*` in `app/globals.css`
  generates the Tailwind variants, and `styles/responsive.css` aliases them as
  `--bp-*`. Confirmed no second set of numbers exists anywhere.
- `.zs-grid` steps 4 → 8 → 12 columns at 48rem and 64rem. Every `Col` in the new
  sections declares a phone span, so nothing inherits a desktop span on a phone.
- No horizontal scrollbar at any width. `html`/`body` use `overflow-x: clip`, and
  oversized display type is allowed to break the shell without creating one.
- No fixed-pixel layout widths — verified mechanically by gate check `A8`.
- Touch targets: `Button` carries `.zs-tap`, which lifts to 3rem under
  `(pointer: coarse)`.

### Section-by-section (landing)

| Section | Phone | Tablet | Desktop | Note |
|---|---|---|---|---|
| ServicesPreview | ✅ | ✅ | ✅ | rows stack to one column below `md`; the service rail stays full-bleed at every width |
| AboutPreview | ✅ | ✅ | ✅ | collage holds 3-up; parallax offsets only apply from `lg`, so tiles never drift apart on a phone |
| CTABand | ✅ | ✅ | ✅ | Society mode; event list wraps rather than truncating; sticker hidden below `lg` |

### Reduced motion (`prefers-reduced-motion: reduce`)

- All three new sections compose **only** from `components/motion`, so their
  reduced-motion behaviour is Developer 1's primitive behaviour — nothing was
  hand-rolled. Verified mechanically by gate checks `C1`, `C2`, `C4`.
- `Reveal` renders its final state immediately: no content is gated behind an
  animation, and every heading and paragraph is present on first paint.
- `Marquee` in `ServicesPreview` stops translating and renders one static,
  readable copy; the duplicate stays `aria-hidden`.
- `Parallax` in `AboutPreview` renders completely static — the collage keeps its
  offsets but stops drifting.
- `MagneticButton` in `CTABand` degrades to an ordinary control.
- The global CSS backstop in `app/globals.css` remains in place as belt-and-braces.

### Accessibility

- Headings run `h1` (hero, Developer 1) → `h2` per section → `h3` per service row.
  No level is skipped on the landing page.
- `Button` renders a real `<button>` or a `next/link`, never a clickable `<div>`,
  and keeps the lime `:focus-visible` ring from `globals.css`.
- `Divider` without a label is `aria-hidden` — it is decoration, not content.
- Images are `next/image` with real `alt` text from `content/media.ts`.

### Known limitation carried forward

**BLOCKER B2** — the collage in `AboutPreview` uses the client's own photographs,
but they are crops from 1366px-wide screenshots and go soft when enlarged. The
layout deliberately keeps every frame small and leans on no single hero image.
When the originals arrive they drop straight in; no layout change needed.

---

## Milestone 2 — Portfolio/Testimonials, Home final sections, Collaborations, Contact, nav

**Scope checked:** `/portfolio`, `/collaborations`, `/contact`, the landing page's new
proof section, and all seven navigation destinations.

### Navigation

All seven destinations in `content/nav.ts` open and render a real page — `RouteStub` is
fully retired. Verified mechanically: gate checks `E1`/`E2` assert no page renders the
stub, and the runtime stage crawls every internal `href` on every rendered page and
fails on any status ≥ 400.

| Destination | State |
|---|---|
| `/` Home | ✅ real page, productions |
| `/about` | ✅ Developer 1 |
| `/services` | ✅ Developer 1 |
| `/portfolio` | ✅ **built this milestone** |
| `/collaborations` | ✅ **built this milestone** |
| `/society` | ✅ Developer 1, society mode |
| `/contact` | ✅ **layout built this milestone**, Developer 1's form retained |

### Portfolio

- Pinned index (`StickySection` → GSAP ScrollTrigger, loaded dynamically) followed by a
  parallaxed layered collage — two different shapes, not one grid twice.
- `ImageHoverPreview` supplies imagery on hover; it returns `null` on touch and under
  reduced motion, so the list stays a plain readable list there.
- All three testimonials render verbatim from `content/site.ts`. No quote is duplicated
  into a component — asserted by gate check `A5`.
- **Video reel: lite embeds.** Nothing is requested from youtube.com on load. The gate
  asserts this two ways: the `<iframe>` must sit behind an activation state (`A3`), and
  no `youtube.com/embed` URL may appear in the server-rendered HTML of any page
  (route `forbid`, re-checked in M4 as a page-speed probe).
- Play control is a real `<button>` with an `aria-label`, so the video is keyboard
  reachable. `youtube-nocookie.com` is used, so no tracking cookie is set until the
  visitor deliberately presses play.

### Collaborations

- Partner marquee, logo ticker and bulletin-board project grid are all built and driven
  by `PARTNERS` in `content/collaborations.ts`.
- A partner is only displayed when `displayPermission` is true — permission is per
  partner, not blanket.
- The page does not dead-end on the blank section: it leads with the real service
  disciplines and routes on to `/portfolio` and `/contact`.

### Contact

- Layout, contact-details block, and the "what you can book" list all read from
  `content/site.ts`.
- Developer 1's `<BookingSection />` is mounted unchanged, at `#enquiry` — gate check
  `D2` fails the milestone if it is ever removed.
- Phone and email are reachable above the form, so a visitor who only wants a number
  never scrolls past a form to find one.

### Reduced motion

- `StickySection` does not pin and does not load GSAP at all; the section becomes
  ordinary flow content and every caption stays readable.
- `ImageHoverPreview` renders nothing; the index stays a typographic list.
- `Marquee` on the partner board stops translating; `Parallax` on the gallery and
  testimonials renders static.
- `LiteYouTube` has nothing to reduce — the facade is static and activation is always a
  deliberate click, never an autoplay on scroll.

### Responsive

| Page | Phone | Tablet | Desktop | Note |
|---|---|---|---|---|
| `/portfolio` | ✅ | ✅ | ✅ | gallery goes 1-up → 2-up → asymmetric 12-col; pinned index scrolls normally on phone |
| `/collaborations` | ✅ | ✅ | ✅ | discipline list wraps; empty-state panel keeps its padding at every width |
| `/contact` | ✅ | ✅ | ✅ | three detail columns stack to one below `md` |

### Blocked assets — shipped as labelled empty slots, not filler

| Blocker | What is missing | What ships today |
|---|---|---|
| **B9** | YouTube video links (upload session never happened, OI-3) | `PORTFOLIO_VIDEOS` is `[]`; the reel renders a labelled empty panel. Paste the ids in and the section fills itself — no code change |
| **B7** | High-resolution portfolio photography | Gallery runs on the client's own screen-resolution frames, never enlarged past native size; the shortfall is stated on the page |
| **B8** | Partner logos, project mapping, display permission | `PARTNERS` is `[]`; the board lists exactly what is awaited from management |
| **B5** | Social profile URLs | Rendered as inert labels. No URL is invented |

Gate checks `A7`, `C4` and `E4` fail the build if invented video ids, partner names or
placeholder filler ever appear.

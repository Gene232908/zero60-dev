# Handoff to Developer 2

**From:** Developer 1 · **Covers:** Milestone 1 foundation + Milestone 2 content relay
**Rule:** only Developer 1 contacts the client. Ask me for any value, credential or content —
do not contact Sir Marco directly (Task Division Rev 2, p.6).

---

## 1. What is ready for you to build on

### Design tokens — `styles/tokens.css`
Two brand modes re-map the same custom properties. **Never hardcode a colour, font or duration.**

```
[data-brand="productions"]   rugged  — black ground, Archivo grotesque, grain on, bold lime
[data-brand="society"]       elegant — paper ground, Fraunces serif, grain off, lime as hairline
```

Set the mode with `<BrandProvider brand="society">`, or `data-brand` on any wrapper. It works at
**section** level, not just page level — see `DualBrandSplit` on the landing page, which renders the
same markup twice under both modes.

Confirmed palette: `#ADFF2A` lime · `#FFFFFF` white · `#000000` black.

### Motion library — `components/motion/`
Compose from these. **Do not introduce a second animation approach** (Task Division Rev 2, p.2/p.6).

| Primitive | Use for |
|---|---|
| `Reveal` | standard scroll entry — `fade` / `rise` / `mask` / `clip`, with `stagger` |
| `Marquee` | seamless infinite ticker |
| `Parallax` | restrained scroll drift (`subtle` / `medium` / `strong`) |
| `KineticHeading` | oversized display type, masked word reveal + optional scroll drift |
| `MagneticButton` | magnetic hover control — renders `<Link>` or `<button>` |
| `CustomCursor` | context-label cursor, fine-pointer only |
| `StickerSpin` | slow rotating badge |
| `NoiseOverlay` | grain, opacity driven by the brand token |
| `PageTransition` | route-change mask wipe |
| `ImageHoverPreview` | cursor-following preview for editorial lists |
| `StickySection` | GSAP ScrollTrigger pin |

Timing lives in `components/motion/motion-tokens.ts` — `DUR`, `EASE`, `STAGGER`, `TRAVEL`, `PARALLAX`.
Never write a raw duration.

**Two things the acceptance gate will fail you on:**
1. A static `import … from 'gsap'` anywhere outside `components/motion/gsap-loader.ts`. GSAP must stay
   code-split — use `loadGsap()`.
2. A section importing `framer-motion` directly without also using `@/components/motion`. That is the
   "separate animation approach" Rev 2 forbids.

Every primitive already honours `prefers-reduced-motion` internally, so composing them is accessible by
default. Lenis is never instantiated under reduced motion.

---

## 2. Content relayed to you (Milestone 2 EASY task)

### `content/site.ts` — all real, transcribed verbatim from the live site

| Export | Contents | Your pages that need it |
|---|---|---|
| `BRAND` | wordmark, tagline, "What we do" intro | Home |
| `SERVICES` | 8 service lines + full descriptions | Home |
| `EVENT_TYPES` | 6 event categories + their provisions | Home |
| **`TESTIMONIALS`** | **3 testimonials, verbatim** — Sarah M. (Brewsters Inc.), Emily & Jake R., Mark L. | **Portfolio / Testimonials** |
| `CONTACT` | +971 58 512 4365 · info@zerosixtythree.com · www.zerosixtythree.com | Contact, Footer |
| `BOOKABLE_SERVICES` | the live contact section's own service list | seeds the M3 booking form |
| `CLOSING` | "Get in touch with us" closing line | Contact |

### `content/media.ts` — the client's own photography

Provenance and processing are documented in the file header. Read it before adding images.

| Export | Contents |
|---|---|
| `TILES` | 5 editorial frames (guitar, mixer, stage, camera op, camera) |
| `SCENES` | 7 wide B&W frames for bands and section backgrounds |
| `EVENT_MEDIA` | 6 event photos — **maps 1:1 onto `EVENT_TYPES`**, same order |
| `LOGO` | brand mark, two sizes |

⚠️ These are cropped from 1366px-wide screenshots, so several are low-resolution and go soft at large
sizes. Originals are still outstanding (BLOCKER B2). Do not build a layout that depends on a large,
sharp image until they arrive.

### Still outstanding for your pages

| You need | Status |
|---|---|
| **YouTube video links** | 🔴 Blocked. The upload session requires management to type their own password on the dev machine and has not happened. You cannot finish the portfolio video sections until I send these |
| Portfolio photographs | 🔴 Not supplied — only the low-res crops above |
| Partner / collaboration logos | 🔴 Not supplied, and we need confirmation of display permission per partner |
| Which projects sit under which partner | 🔴 Not supplied |
| Social profile URLs | 🔴 Icons shown on the live site, no hrefs given. Render inert, never invent a URL |

I am chasing all of these — see `docs/ASSET-REQUEST.md`, which is the list sent to management.

---

## 3. Your pages — untouched and waiting

I have deliberately **not** built these. They are still `RouteStub` placeholders, and the acceptance
gate fails my milestone if I touch them (check E5).

- `app/(site)/portfolio/page.tsx` — Portfolio / Testimonials (M2, HARD)
- `app/(site)/collaborations/page.tsx` — Collaborations (M2, MEDIUM)
- `app/(site)/contact/page.tsx` — Contact layout (M2, EASY)
- `app/admin/**` — the entire admin side (M3). Does not exist yet; the gate blocks me from creating it

`RouteStub` is in `components/sections/RouteStub.tsx` — delete the stub usage when you build the real page.

**Brand mode per page:** `productions` everywhere except `/society`, which is `society`. Portfolio,
Collaborations and Contact are all `productions`.

**Portfolio specifically:** use **lite/lazy YouTube embeds**, not the standard iframe player
(Task Division Rev 2, p.3). A full embed per video will destroy the page-speed budget.

---

## 4. Conventions worth knowing before your first commit

- **Never commit credentials.** `.env*` is gitignored. Firebase and SMTP values come from me.
- **Branch per milestone**, merge to `main`, agree the merge owner first. Dev repo:
  `github.com/Gene232908/zero60-dev`.
- **`next/image` only** — a raw `<img>` fails the gate.
- **Placeholders must be labelled.** Where client data is missing we ship a clearly-marked empty slot,
  never invented filler. See `content/placeholders.ts`.
- The acceptance gate is `node .claude/gate.mjs` — run it before you call anything done. It runs the
  milestone checklist plus build, typecheck, lint, and a real HTTP check of every route.

## 5. Open question for management

~~`docs/ASSET-REQUEST.md` §62 — the supplied logo is white and lime, so it disappears against the 063
Society off-white background. We need a dark variant before Society mode reaches the header and footer.~~

**✅ RESOLVED.** Management supplied `public/zero63logo-black.png`.
`scripts/generate-society-mark.mjs` trims and resizes it to
`public/brand/logo-mark-dark.{webp,png}`, and `logoForBrand()` in `content/media.ts`
picks the legible mark per mood. The Navbar re-declares `data-brand` from
`content/nav.ts`, so any page that runs in Society mode — including Contact, if it
ever does — gets the dark mark and a near-black nav automatically.

---

## 6. Milestone 3 additions — what the admin side connects to

The inquiry flow is built. Your admin screens read the collections it writes.

### Collections — `lib/firebase/collections.ts`
Import `COLLECTIONS`; never hardcode a collection name.

| Collection | Who can touch it |
|---|---|
| `inquiries` | Public may **create** a validated document. Read/update/delete: **admin only** |
| `bookings` | Admin only |
| `customers` | Admin only |

`BookingRecord` and `CustomerRecord` types are in the same file, including
`amountCollected`, `fromWebsite` and `returningCustomer` — the fields your
partnership computation and Returning Customer tag need.

### Security rules — `firestore.rules`
Admin is a **custom claim** (`request.auth.token.admin == true`), not an email
allowlist. Your admin login must mint that claim, or every admin read fails.
Deploy with `firebase deploy --only firestore:rules`.

There is a default-deny catch-all at the bottom. Any collection you add is closed
until you deliberately open it.

### Booking status — `lib/booking/status.ts`
`BOOKING_STATUSES` is the single source of truth (New / Confirmed / Paid /
Cancelled / Refunded). Marco may cut this to New/Paid/Cancelled — plan.md R-5
requires that to be a one-line edit, so drive your status control off this array
rather than hardcoding options.

### The partnership computation is yours
Task Division Rev 2 p.4 assigns it to you (HARD). I have deliberately not
implemented it — the M3 scope guard fails my build if I do. `REVENUE_STATUSES`
in `lib/booking/status.ts` records which statuses qualify, so we agree on the
input; the arithmetic and the cap are yours.

### Environment variables
See `.env.example` for every name. Values come from me, never from the client
directly, and never into git.

---

## 7. Milestone 4 — the metadata seam, and what is waiting for you

Read this before you start the SEO task, because we both touch metadata and only
one of us should touch each part of it.

### What I have already done (do not redo it)
- **`app/layout.tsx` root metadata** — `metadataBase`, a title **template**, the
  default description, and the Open Graph / Twitter card blocks.
- **Icons + share card** — `app/favicon.ico`, `icon.png`, `apple-icon.png`,
  `opengraph-image.png`, wired automatically by Next's file conventions. There is
  no `icons` field to maintain. Regenerate them with
  `node scripts/generate-brand-images.mjs`.
- **Meta Pixel** — `components/analytics/MetaPixel.tsx`, mounted in the root
  layout, inert until `NEXT_PUBLIC_META_PIXEL_ID` is set.

### What is yours
Per-page **titles and descriptions**, `sitemap`, `robots`, and page-speed
(Task Division Rev 2 p.5, your HARD task). The M4 gate **fails my build** if I add
any of them, so they are genuinely untouched.

**How to add a page title.** The root template does the branding, so export only
the distinctive part from the page:

```tsx
// app/(site)/services/page.tsx
export const metadata: Metadata = {
  title: 'Services',                       // → "Services — ZERO-SIXTY-THREE PRODUCTIONS"
  description: '...',                      // yours to write
};
```

Do **not** repeat the brand name in the title — the template appends it. On the
063 Society page you may want `title: '063 Society'`.

**Share images per page** are also yours if you want them: drop an
`opengraph-image.png` into that route's folder and it overrides the root one.

### One thing to know about the pixel
`MetaPixel` re-fires `PageView` on every client-side route change, because the
App Router never reloads the document and Meta would otherwise only ever see the
first page. If you add any custom navigation that bypasses `next/navigation`,
that tracking breaks silently — tell me rather than patching it, it is my task.

`trackPixelEvent()` in `lib/analytics/meta-pixel.ts` is safe to call from the
admin side too, but **do not send customer details to Meta** — the enquiry data
belongs in Firestore, not in an ad platform.

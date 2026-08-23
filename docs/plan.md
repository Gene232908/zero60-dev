# plan.md — Developer 1

**Project:** ZeroSixtyThree + 063 Society — Website Enhancement
**Role:** Developer 1 (Foundation, Client Contact, Core Pages, 063 Society, Booking + Firebase + Email, Deployment)
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Firebase (free tier) · Framer Motion + Lenis · Vercel
**Reads together with:** *Website Development & Partnership Proposal (revised)*, *Milestone 1–4 Development Plan*, *Task Division (Rev 2)*.
**Status:** This is Developer 1's build plan only. Where a task belongs to Developer 2, it appears under "Handoffs" so the seams are clear — I do not build Developer 2's tasks.

---

## 0. Read this first — what this project actually is

This is **not a new website. It is an enhancement of a live site** (`https://zerosixtythree.com`). The owner (Sir Marco) already has a running one-page, long-scrolling site and he is paying to have it made *better*. So the bar is not "ship a working site" — the bar is **visible, obvious improvement in UI, UX, and motion** over what he has today. Anything that merely matches the current site is a failure of the brief.

Three things from the client call drive every decision below:

1. **Break the long scroll into a real, organized, multi-page site** (6 pages) that still feels like one cohesive world — "separate it and organize it properly, add more animation, but stay professional and modern."
2. **The site is maximalist.** More-is-more: bold type, layered compositions, heavy but purposeful motion. Our job is to make maximalism read as *premium and intentional*, never cluttered or amateur.
3. **Two moods under one roof.** Sir Marco said it plainly: **063 Productions is "urban / rugged," 063 Society is "elegant,"** and he asked us to *align* them. This duality is the central art-direction problem and the reason the foundation I build in Milestone 1 is a **dual-brand system**, not a single theme.

> My operating principle for this build: treat the low fixed price as irrelevant to the quality bar. The return here is the 2% partnership + the footer credit that markets us. A site that converts and impresses is the asset. Build accordingly.

---

## 1. Confirmed decisions (from the client call) — lock these in

These override anything ambiguous in the older documents:

| Topic | Decision | Source |
|---|---|---|
| Database | **Firebase (free/Spark tier)** — *not* Supabase. Marco refused a paid subscription and worried about the free tier pausing when idle. Firebase Spark does not pause on inactivity, which is exactly why we chose it. | Call |
| Paid DB subscription | **None at launch.** Only the domain is a recurring client cost. A paid Firebase plan applies *only if* usage later exceeds free tier — separate from the 35k and the 2k/mo. | Call + Proposal §6 |
| Hosting | **Vercel** (free tier). | Call + Task Division |
| Domain | Keep the existing **`zerosixtythree.com`**; cancel the current Canva-hosted site and repoint DNS to the new Vercel deployment. **See Open Item OI-1 — this contradicts the Task Division's "no custom domain this phase" line.** | Call + Milestone Plan §M4 |
| Pages | **6 total:** Home, About, Services, Portfolio/Testimonials, Contact, **063 Society** — all on the same domain. Plus a **Collaborations** page, confirmed included in the 35k. | Call + Milestone Plan §M2 |
| Footer credit | **New confirmed deliverable:** a "Developed by" credit banner in the footer, with **our logo, clickable to our site.** Marco: "Definitely, pare." (Exact wording/logo/URL to confirm — provisionally *Crest Services*.) | Call |
| Booking form fields | name, email, mobile, event type, **date**, **location** (keep), requested services, **estimated guests** (keep — Marco needs it for sound-system sizing), notes. Source-of-inquiry selector: 063 / 063 Society. | Call + Proposal §4 |
| Booking status set | New · Confirmed · Paid · Cancelled · Refunded — **must be easy to reduce** (Marco may want only New/Paid/Cancelled). Build it config-driven. | Call |
| Partnership 2% | Applies **only** to website-sourced, confirmed **and paid** bookings, incl. qualified returning customers. **Hard cap AED 250 per booking.** Off-website leads (phone/WhatsApp/walk-in) excluded. | Call + Proposal §11 |
| Minor-updates scope | "Update contact information" was **removed** from monthly-support minor updates (contact flows through admin now); **social links stay** in the footer. | Call |
| Email notifications | New-inquiry email via **Nodemailer + client SMTP** (creds in env vars). | Task Division + Call |
| Timeline / payment | ~1 month, ~1 milestone/week. Payment **per milestone**, released after approval + transfer to client GitHub. Unfinished/revision-pending milestone is not billable. | Call + Milestone Plan §3 |

---

## 2. Art direction — the system I own and hand to Developer 2

I set the visual + motion language in Milestone 1. Everything Developer 2 builds sits on top of these tokens, so they must be right before anyone builds pages.

### 2.1 Palette (aligned to the brand colors + the site's black/white photographic base)

The current site is essentially black-and-white concert photography. We keep that photographic base and make **acid lime the single signature accent** — high-contrast, loud, unmistakably "063."

```
--brand-lime:  #ADFF2A   /* signal green — primary accent, energy, CTAs, highlights */
--brand-white: #FFFFFF
--brand-black: #000000
```

System-derived neutrals (tints/shades for depth — not new brand colors):

```
--ink-900: #0A0A0A   --ink-800: #141414   --ink-700: #1E1E1E   /* layered blacks */
--paper:   #F7F7F4                                             /* warm off-white, Society only */
--line:    rgba(255,255,255,0.12)                              /* hairlines on dark */
```

Usage rule: **lime is a spice, not a sauce.** Big lime fills for hero accents, CTAs, tickers, hover states, and the "Society vs Productions" wayfinding — never lime-on-lime walls of text.

### 2.2 Dual-brand modes (the core mechanism)

Implement theming as a **`data-brand` attribute** that re-maps the CSS variables, so any page *or section* can switch mood without new components:

- **`data-brand="productions"` → rugged / maximalist:** black canvas, heavy condensed display type, exposed grid lines, grain overlay, aggressive marquees, fast punchy motion, lime used boldly.
- **`data-brand="society"` → elegant:** near-black or `--paper`, high-contrast **serif** display, generous whitespace, thin lime hairline accents, slow refined fades and line-draws, restrained motion.

This is how we honor "align them but keep them distinct": **one component library, two token sets, one accent color.**

### 2.3 Typography (via `next/font`, self-hosted, zero layout shift)

- **Display — Productions:** a heavy grotesque/condensed (e.g. **Archivo Expanded / Anton / Clash Display**) for oversized kinetic headlines.
- **Display — Society:** a high-contrast **serif** (e.g. **Fraunces** variable, or Playfair Display) for elegance.
- **Body (shared):** a clean grotesque (e.g. **Inter / Geist**) for readability across both modes.
- All loaded through `next/font` so Developer 2 never fights FOUT or CLS.

### 2.4 Motion language (the reason M1 is a *motion* foundation, not just tokens)

Maximalism lives or dies on motion. Rather than let animation be improvised per page, I ship a **shared motion library** so the whole site moves with one grammar and one performance/accessibility policy:

- **Framer Motion** — declarative component + scroll animation.
- **Lenis** — smooth scroll (premium feel; drives scroll-linked effects).
- **GSAP + ScrollTrigger** — reserved for pinned/kinetic sequences; code-split so it never bloats first load.
- **`prefers-reduced-motion`** — honored globally at the primitive level (every animated primitive degrades to a clean fade/no-op). Non-negotiable for a heavy-motion site.

**Motion tokens:** standard durations, easings, and spring configs so nothing feels arbitrary.

**Shared animated primitives I build (Developer 2 composes with these):**
`<Reveal>` (fade/mask/clip on enter) · `<Marquee>` (service + client tickers) · `<Parallax>` · `<KineticHeading>` (variable-weight / on-scroll) · `<MagneticButton>` · `<CustomCursor>` · `<StickerSpin>` (reuse their existing sparkle SVG as a rotating badge) · `<NoiseOverlay>` / duotone image treatment · `<PageTransition>` wrapper.

### 2.5 Maximalist device catalog (what "enhanced" looks like on screen)

Layered/overlapping image collages · oversized kinetic type that reacts to scroll · full-bleed marquees of services and client logos · bento-grid service layouts · duotone/halftone + grain photo treatment · magnetic CTAs + custom cursor · pinned horizontal-scroll portfolio gallery · animated section transitions. Society pages use the *restrained* subset (line-draws, slow fades, elegant serif reveals).

---

## 3. Architecture & repo conventions

```
app/
  (site)/                 # public site group
    page.tsx              # Home
    about/ services/ portfolio/ contact/
    society/              # 063 Society (elegant mode)
    collaborations/
  admin/                  # Dev 2 territory — separate, unlinked route (I provide the data layer + auth scaffolding)
  api/
    inquiry/route.ts      # POST booking → Firestore + Nodemailer notify (Dev 1)
  layout.tsx  globals.css
components/
  ui/                     # Button, Container, SectionHeading, Badge, Tag, Divider
  motion/                 # Reveal, Marquee, Parallax, KineticHeading, MagneticButton, CustomCursor, PageTransition
  layout/                 # Navbar (6-page + mobile menu), Footer (+ credit banner), BrandProvider
  sections/               # composed page sections
lib/
  firebase/               # client + admin init, Firestore helpers, security-rules source
  email/                  # Nodemailer transport + templates
  seo/                    # metadata helpers (Dev 2 fills page-level SEO)
  utils/                  # cn(), formatters, partnership calc helper (shared with admin)
content/                  # copy + services/collab data (typed)
styles/tokens.css         # design tokens + data-brand maps + motion tokens
public/                   # logos, sparkle SVG, images, favicon, social share image
```

**Git workflow (from the shared rules):** each dev on own branch; never push to `main` directly; agree the merge owner before every merge; pull latest `main` before starting a task; **never commit credentials** — SMTP/Firebase go in env vars (`.env.local` locally, Vercel env in prod). No QA team — I test my own work before calling it done. Deployment is always last.

---

## 4. Milestone-by-milestone — Developer 1 tasks

Each milestone: my deliverables, what I must collect from the client first, my handoffs to Developer 2, and definition of done.

### Milestone 1 — Foundation, Design System, Motion System, Landing (Week 1)

**My build (Developer 1):**
- **[HARD] Foundation + dual-brand + motion system** *(expanded from the original "base + tokens")*:
  - Next.js App Router + TypeScript + Tailwind, folder structure above, ESLint/Prettier, path aliases.
  - `styles/tokens.css`: full token set + **`data-brand` maps** (productions/society) + motion tokens.
  - `BrandProvider` + `next/font` wiring for both display faces + body.
  - **Motion foundation:** Framer Motion + Lenis installed and wired, `prefers-reduced-motion` policy, GSAP code-split wrapper, and the shared animated primitives from §2.4 as a documented library.
  - This is the single most important task in the project — Developer 2 cannot build maximalist pages without it, so it merges to `main` first (target: day 1–2).
- **[MED] Landing hero + top sections** — replace the long-scroll top with a composed, kinetic maximalist hero (productions mode): oversized headline, service marquee, layered imagery, magnetic CTA ("Get in touch" / "View portfolio").
- **[MED] Navbar (6 pages) + mobile menu** — accessible, animated, sticky, brand-aware; full-screen mobile menu with motion.
- **[EASY] Collect from client + relay to Dev 2** — logo PDFs (063 + 063 Society), theme colors (confirmed: lime/white/black), sample photos; hand final values to Developer 2.
- **[EASY] Placeholder content in landing sections** — clearly-marked placeholders (real media lands in M2).

**Collect before starting:** logo files (PDF/hi-res), theme colors, a few sample photos.

**Handoffs to Dev 2:** the merged foundation (tokens + motion primitives + responsive breakpoint tokens) is the thing Dev 2's M1 work (responsive layout system, lower landing sections, *applying* scroll choreography, shared small components, responsive QA) is built on. Dev 2 **composes** motion from my primitives — they don't invent a parallel animation approach. *(This is the M1 side of the Task Division Rev 2 adjustment.)*

**Definition of done:** layout/colors/fonts/motion direction approved by management on the review call; works phone/tablet/desktop; no console errors; merged to `main` after the agreed merge.

---

### Milestone 2 — 063 Society, About, Services + Content + YouTube (Week 2)

**My build (Developer 1):**
- **[HARD] Full 063 Society page — elegant mode** (`data-brand="society"`): its own sections, service categories (weddings, corporate, event program support, music & entertainment, AV/production), elegant serif treatment, restrained motion, thin lime accents. This is where the rugged↔elegant "alignment" gets proven on screen. I'll share the first layout with management early for alignment, as promised on the call.
- **[MED] About page** — brand story + photos, productions mode, maximalist but readable.
- **[MED] Services page** — bento-grid of the service lines with hover/reveal motion.
- **[EASY] Collect final content + relay to Dev 2** — service descriptions, testimonials, partner logos, portfolio photos → send to Developer 2 so they're never blocked.
- **[EASY] YouTube upload session with management** — on the dev machine, **management types their own password** and may change it after; capture the video links and send them to Developer 2 for the portfolio player.

**Collect before starting:** final service copy (063 + Society), portfolio photos/videos/testimonials, collaboration/partner logos + which projects sit under each, YouTube account access (entered by management).

**Handoffs to Dev 2:** Developer 2's M2 pages (Home final, **Portfolio/Testimonials gallery**, **Collaborations**, Contact layout, nav wiring) must use the dual-brand modes and my motion primitives, and the **maximalist treatment is now explicit in their tasks** — plus the portfolio must use performant lite-YouTube embeds. *(This is the M2 adjustment the replacement Task Division PDF carries.)* I feed them content + video links as it arrives.

**Definition of done:** all my pages approved on the review call; Society mode visibly elegant yet clearly the same brand family; responsive; no console errors.

---

### Milestone 3 — Booking Form, Firebase, Email Notifications (Week 3)

**My build (Developer 1):**
- **[HARD] Firebase setup — Firestore structure + security rules:**
  - Collections: `inquiries` (raw form submissions), `bookings`/`customers` (records), with fields for source, status, amount collected, returning-customer flag/origin.
  - **Security rules:** public may **create** an inquiry document (validated shape only) but **cannot read/update/delete**; only authenticated admin can read/manage. This is the guardrail the whole admin side depends on.
  - Client-side + server (admin) init in `lib/firebase/`.
- **[MED] Booking/inquiry form** — all approved fields (§1) + source-of-inquiry selector (063 / 063 Society), brand-aware styling, accessible, real submit to `/api/inquiry`.
- **[MED] Email notification** — Nodemailer route handler using client SMTP env vars; sends on new inquiry to the client's notification address; clean HTML template.
- **[EASY] Form states** — validation messages, thank-you state, error state.
- **[EASY] Collect + relay** — SMTP details (host/port/user/pass/sender), notification email, **Firebase editor invitation**, final field list → and give Developer 2 the values/shape they need for the admin side.

**Collect before starting:** Firebase account created *by management* + editor invite for us; SMTP creds; notification email; final field list. (I create the account *with* them, step by step, and handle all setup/config myself.)

**Handoffs to Dev 2:** the moment the Firestore structure + rules merge to `main`, Developer 2 connects the admin side (login, records, status control, amount field, returning-customer tag, **2% + AED 250 cap computation**, monthly summary, invoice) to real data. Until then they work against sample data. The **partnership calc helper** lives in shared `lib/utils` so the admin and any invoice logic use one source of truth.

**Definition of done:** form + DB + notification tested with sample entries on the review call; a submission lands in Firestore and fires an email; no console errors.

---

### Milestone 4 — Deployment, Meta Pixel, GitHub Transfer, Testing, Handover (Week 4)

**My build (Developer 1):**
- **[HARD] Deploy to Vercel** — production build; env vars for Firebase + SMTP; publish. **Connect the existing domain `zerosixtythree.com`** (repoint DNS from the old Canva site) — see OI-1; this reflects the client promise and the Milestone Plan. Deployment is **last**, only after Dev 2's SEO work is merged and both branches are clean.
- **[MED] Meta Pixel** — install + confirm page-view and form-submit events fire (this is Marco's lead-tracking).
- **[MED] Source-code transfer to client GitHub** — push complete code to the client account, confirm access. (Ownership: once the full fee is settled, all code lives in the client's GitHub and stays with them, even after the partnership term.)
- **[EASY] Favicon, tab titles, social share image.**
- **[EASY] Live booking-flow smoke test** on the Vercel/live URL: submit → save → email notification.

**Collect before starting:** domain access (registrar/DNS), Meta Business access, client GitHub account.

**Handoffs to Dev 2:** Dev 2 owns full SEO (titles/descriptions/sitemap/robots/page-speed), live admin testing, the admin walkthrough guide, and full-site/link/responsive live checks. We **agree the final release-branch merge owner** before I deploy. Handover walkthrough call is done together.

**Definition of done:** site live on the approved domain, tested end-to-end, code in client GitHub, formally handed over. The **30-day free bug-fix window** starts at publish; the 2k/mo support + 2% partnership begin after it.

---

## 5. Cross-cutting responsibilities I carry as Developer 1

- **Sole client contact.** I collect every credential, email, number, category, content item, and access grant, and pass final values to Developer 2. Developer 2 never contacts the client.
- **Footer credit banner** (new): build the "Developed by [our logo]" banner in the shared footer, linking to our site — confirm exact name/logo/URL with management.
- **Performance budget** (heavy motion + lots of media): `next/image` everywhere, lite/lazy YouTube embeds, code-split GSAP, lazy-mount below-fold motion, keep LCP honest. Maximalism must not mean slow.
- **Accessibility baseline:** reduced-motion respected at the primitive level, focus states, alt text, keyboard-navigable nav/menu/form, adequate contrast (lime-on-black passes; watch lime-on-white for text — use it for shapes, not body copy).

---

## 6. Client-provided assets checklist (I chase these — they gate the timeline)

- [ ] Logo files — 063 **and** 063 Society (PDF / hi-res) — *M1*
- [ ] Theme colors — confirmed lime/white/black — *M1*
- [ ] Sample + final photos, portfolio photos — *M1/M2*
- [ ] Final service descriptions (063 + Society) — *M2*
- [ ] Testimonials — *M2*
- [ ] Collaboration/partner logos + projects per partner — *M2*
- [ ] YouTube account access (typed by management) + resulting video links — *M2*
- [ ] Firebase account + editor invite — *M3*
- [ ] SMTP creds + notification email address — *M3*
- [ ] Final booking/admin field list — *M3*
- [ ] Domain/registrar access — *M4*
- [ ] Meta Business access — *M4*
- [ ] Client GitHub account — *M4*
- [ ] Our own logo + destination URL for the footer credit banner — *M1 (build) / confirm anytime*

---

## 7. Open items & risks

- **OI-1 — Domain conflict (decide before M4).** Task Division v1 says "Do NOT connect a custom domain this phase; run on the Vercel URL." The Milestone Plan §M4 and the client call both say connect `zerosixtythree.com`. **My call: connect the domain** — it's what the client was promised and what the signed milestone plan states. The Task Division Rev 2 updates the deployment task to match. Flag to Developer 2 so both branches agree.
- **R-1 — Performance vs maximalism.** Mitigation in §5. Watch the portfolio page (gallery + video) hardest.
- **R-2 — Firebase free tier.** Chosen precisely because Spark doesn't pause on idle (unlike Supabase free). Keep an eye on read/write quotas once real traffic starts; a paid plan is a *separate* client cost only if we exceed free tier.
- **R-3 — Society elegance vs a loud accent color.** Resolved by restraint: Society uses lime as thin hairline/detail only, serif type, whitespace. Prove it early with the first Society layout to management (promised on the call).
- **R-4 — Content latency.** The single biggest schedule risk. I request each milestone's assets *before* the milestone starts and relay to Dev 2 immediately so no one is blocked.
- **R-5 — Status set may shrink.** Build booking-status as config-driven so trimming to New/Paid/Cancelled is a one-line change, not a refactor.

---

## 8. Definition of done (applies to every task I ship)

Works on phone/tablet/desktop · I tested it myself and it does what the milestone says · no console errors, no broken links/images · **reduced-motion path verified** · pushed to my branch and merged to `main` after the agreed merge · for client-facing work, management reviewed it and in-scope revisions are already done.

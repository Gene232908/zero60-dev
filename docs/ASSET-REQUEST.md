# Image & Asset Request — ZeroSixtyThree + 063 Society

**From:** Developer 1 · **For:** Sir Marco / management
**Status of what we have:** the 13 section exports of the live site were enough to transcribe all the
copy, and I cropped 18 usable photographs out of their text-free areas. Those are stand-ins — they come
from 1366px-wide screenshots, so they are low-resolution and go soft at large sizes.

**What this document is:** every image slot in the new site, what should be in it, and the size it needs
to be. Anything not supplied stays a clearly-labelled empty slot — we do not invent client material.

---

## Start here — the 10 that unblock the most

If time is short, these ten replace every low-resolution stand-in currently on the landing page and make
the site presentable end to end.

| # | Slot | What it should show | Ratio | Min size |
|---|---|---|---|---|
| 1 | Hero | The single strongest image you own. A crew member mid-work — camera operator, engineer at the desk, or a lit stage. Needs empty space top or bottom, because oversized type overlaps it | 4:5 portrait | 1600 × 2000 |
| 2 | Landing band | A wide establishing shot — full stage, truss and lighting rig, ideally before doors open | 21:9 very wide | 2800 × 1200 |
| 3 | "063 Productions" panel | The rugged side of the brand: cables, road cases, truss, a working engineer, low light | 4:5 portrait | 1600 × 2000 |
| 4 | **"063 Society" panel** | The elegant side. **We have nothing at all for Society** — see §3 | 4:5 portrait | 1600 × 2000 |
| 5–10 | Event index (6) | One per category: **corporate seminar · concert/festival · wedding · sports event · community/charity · themed event**. These appear on hover, so each must read instantly at a glance | 4:5 portrait | 1200 × 1500 |

---

## 1. Landing page — built, currently on stand-ins

Covered by the table above. Slots 5–10 map one-to-one onto the six event categories already written on
your live site, so the photograph must match its category.

## 2. About page (Milestone 2)

| # | Slot | What it should show | Ratio | Min size |
|---|---|---|---|---|
| 11–15 | Five editorial tiles | The live site already leads About with five images — same idea, better quality. Suggested: an instrument being played · hands on a mixing desk · a rigged stage · a camera operator · stills/prints laid out | 2:3 portrait | 1200 × 1800 |
| 16 | Team / founders | The people behind 063. A working shot beats a posed line-up | 3:2 landscape | 2000 × 1400 |
| 17 | Full-bleed story image | One big atmospheric frame — a packed crowd, or the crew at work during a live show | 21:9 very wide | 2800 × 1200 |

## 3. 063 Society page (Milestone 2) — **fully blocked**

Nothing about 063 Society exists in any material supplied so far: no copy, no service categories, no
photographs. This is the largest single gap in the project.

The Society mood is **elegant** — lighter, airier, more refined than Productions. Think polished venues,
styled tables, evening receptions, string players, soft light. Not dark stage-and-truss imagery.

| # | Slot | What it should show | Ratio | Min size |
|---|---|---|---|---|
| 18 | Society hero | The most refined event you have shot | 4:5 portrait | 1600 × 2000 |
| 19–23 | Service categories (5) | **weddings · corporate · event programme support · music & entertainment · AV/production** — one image each, in the elegant register | 4:5 portrait | 1200 × 1500 |
| 24–26 | Society gallery (3) | Wide atmospheric frames of finished, styled events | 3:2 landscape | 2000 × 1400 |

> Also needed for Society: the written copy and the confirmed service-category list.

## 4. Services page (Milestone 2)

One image per service line, matching the eight descriptions already on your site.

| # | Service | What it should show | Ratio | Min size |
|---|---|---|---|---|
| 27 | Audio rental | PA stacks, speakers, microphones, flight cases | 4:3 | 1600 × 1200 |
| 28 | Singers & performers | A vocalist or band mid-performance | 4:3 | 1600 × 1200 |
| 29 | DJ services | DJ at the decks, crowd visible | 4:3 | 1600 × 1200 |
| 30 | Sound engineering | Engineer at the console, front-of-house | 4:3 | 1600 × 1200 |
| 31 | Sports announcing | Commentator at a match, headset on | 4:3 | 1600 × 1200 |
| 32 | Hosting & emcee | Host on stage with a microphone | 4:3 | 1600 × 1200 |
| 33 | Videography | Camera operator or rig in action | 4:3 | 1600 × 1200 |
| 34 | Photography | Photographer shooting an event | 4:3 | 1600 × 1200 |

## 5. Portfolio / Testimonials (Milestone 2 — Developer 2 builds it)

| # | Item | Notes |
|---|---|---|
| 35–60 | **24–40 portfolio photographs** | Your best work. Mix landscape and portrait. Group them by event if you can — it lets us caption them properly |
| — | **YouTube video links** | From the upload session we run together, with you typing the password. Needed before the gallery can be finished |
| — | Testimonial portraits *(optional)* | Headshots for Sarah M., Emily & Jake R., Mark L. — only if they have agreed |

## 6. Collaborations (Milestone 2 — Developer 2 builds it)

| # | Item | Notes |
|---|---|---|
| — | **Partner / client logos** | Vector (SVG, AI, EPS or PDF) if possible, otherwise transparent PNG at 1000px+. Please confirm you have permission to display each one |
| — | **Which projects sit under which partner** | Plus 2–3 photographs per partner |

## 7. Brand assets

| # | Item | Status | Notes |
|---|---|---|---|
| 61 | Logo — main mark | ✅ received | `zero63logo.png`, 2000×2000, transparent. In use in the header and footer |
| 62 | **Logo — dark version for light backgrounds** | ✅ received | Supplied as `public/zero63logo-black.png` (2000×2000). Trimmed and resized to `public/brand/logo-mark-dark.{webp,png}` by `scripts/generate-society-mark.mjs`; 063 Society now loads it in the header |
| 63 | **Logo — vector source** | 🔴 needed | AI, EPS, SVG or PDF. Required for a crisp favicon and for any print use |
| 64 | 063 Society logo | 🔴 needed | If Society has its own mark, in both light and dark versions |
| 65 | Social share image | 🟠 Milestone 4 | 1200 × 630. We can compose this from the assets above if you prefer |

## 8. Non-image items still outstanding

- **Social profile URLs** — the live site shows Facebook and Instagram icons but no links.
- **City / area** — we only have the `+971` dialling code, so the site currently says "United Arab
  Emirates". Tell us the city and we will use it.
- **Footer credit** — the agency name, logo and destination URL for the "Developed by" banner.

---

## Technical notes

**Please send**
- Original camera files or full-resolution exports. **2000px on the longest edge minimum**; bigger is fine.
- JPEG or PNG, sRGB colour.
- A mix of landscape and portrait — the layout uses both, and portrait is what we are shortest of.
- Images with some quiet space in them. Large type sits over several of these, and a photograph that is
  busy corner to corner leaves the text nowhere to go.

**Please avoid**
- ❌ **Screenshots.** This is what we had to work with, and why the current images are soft.
- ❌ **Anything with text already on it** — headings, logos or captions burned into the picture. The site
  puts its own type over these, and baked-in text collides with it.
- ❌ Images downloaded back off Instagram, Facebook or WhatsApp. They are heavily recompressed and small.
- ❌ Stock photography, unless you hold the licence.

**How to send them**
Google Drive, WeTransfer or Dropbox is easiest. Please keep the original filenames and, where you can,
group them into folders by event or by service — that tells us what each picture is of.

---

## Totals

| Group | Count |
|---|---|
| Landing page (replacing stand-ins) | 10 |
| About | 7 |
| 063 Society | 9 |
| Services | 8 |
| Portfolio | 24–40 |
| Collaborations | partner logos + 2–3 per partner |
| Brand assets | 3 outstanding |
| **Roughly** | **60–80 photographs, plus logos and the video links** |

Nothing here blocks us from continuing to build — every missing slot renders as a labelled placeholder,
and swapping in the real file later is a one-line change per image. The two that matter most are
**063 Society (§3)**, which is a whole page we cannot start. The **dark logo variant (§62)** has since been
supplied and is live in Society mode.

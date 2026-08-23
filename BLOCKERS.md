# BLOCKERS — client-provided data still outstanding

**Owner:** Developer 1 (sole client contact — Developer 2 receives final values from me.)
**Rule for this build:** never invent client data. Every item below ships as a clearly-labelled
empty slot or env placeholder until management supplies the real value.

Status legend: 🔴 blocking now · 🟠 blocks an upcoming milestone · ✅ received

---

## Confirmed — no longer blocking

| Item | Value | Source |
|---|---|---|
| ✅ Theme colours | `#ADFF2A` lime · `#FFFFFF` white · `#000000` black | Client call + Task Division Rev 2 p.2 |
| ✅ Database | Firebase, Spark (free) tier — not Supabase | Client call |
| ✅ Hosting | Vercel (free tier) | Client call + Task Division Rev 2 |
| ✅ Domain decision | Connect existing `zerosixtythree.com` in M4 (Rev 2 supersedes the v1 "Vercel URL only" note) | Task Division Rev 2 p.1 / p.5 |

---

## 🔴 Milestone 1 — blocking now

| # | Item | Why it blocks | Current stand-in |
|---|---|---|---|
| B1 | **Logo files** — ZeroSixtyThree **and** 063 Society (PDF / hi-res) | Cannot finalise the wordmark lockup, favicon or nav mark | Type-set wordmark from the confirmed palette |
| B2 | **Sample photos** for visual direction | Hero, dual-brand split and work index all have image slots | Labelled SVG frames in `public/placeholders/` |
| B3 | **Footer credit banner** — our agency name, logo asset and destination URL | The "Developed by" banner is a contracted M1 deliverable | Renders the banner with an inert, labelled placeholder — no invented URL |

## 🟠 Milestone 2

| # | Item | Blocks |
|---|---|---|
| B4 | Final service descriptions (063 Productions **and** 063 Society) | Services page, Society page, ticker copy |
| B5 | Portfolio photos + videos | Portfolio gallery (Dev 2), work index imagery |
| B6 | Testimonials | Portfolio/Testimonials page (Dev 2) |
| B7 | Collaboration / partner logos + which projects sit under each | Collaborations page (Dev 2) |
| B8 | YouTube account access — **typed by management themselves** on the dev machine | Upload session, then the video links Dev 2 needs for the lite embeds |
| B9 | Brand story copy for About | About page |

## 🟠 Milestone 3

| # | Item | Blocks |
|---|---|---|
| B10 | **Firebase** account created by management + editor invitation for the developer | Firestore structure + security rules |
| B10a | ⚠️ **Which Firebase project is final?** A web config for project `zero60dev` was supplied on 2026-08-23 and is stored in the local, gitignored `.env.local`. Per plan.md §4 M3 the account is meant to be **created by management** with an editor invite to us — so confirm whether `zero60dev` is the client-owned project or a developer sandbox to be replaced before launch | Firestore setup target; a sandbox project would have to be migrated before M4 deployment |
| B10b | **Firebase Admin service-account** credentials (project id, client email, private key) | Server-side validated inquiry writes |
| B11 | **SMTP** credentials — host, port, user, password, sender | Nodemailer notification route |
| B12 | Notification email address that receives new inquiries | Email template target |
| B13 | Final booking/admin field list | Locks the inquiry schema and the validated-create security rule |

> All of B10–B12 are **environment variables only**. Never committed. See `.env.example` when M3 opens.

## 🟠 Milestone 4

| # | Item | Blocks |
|---|---|---|
| B14 | **Domain** / registrar access for `zerosixtythree.com` | DNS repoint from the old Canva-hosted site |
| B15 | **Meta Business** access | Meta Pixel install + event verification |
| B16 | **Client GitHub** account | Final source-code transfer (happens once the fee is settled) |
| B17 | Social share image direction | OG image |

---

## Open items carried from plan.md §7

- **OI-1 — Domain conflict.** Task Division **v1** said "no custom domain this phase";
  **Rev 2** and the Milestone Plan both say connect `zerosixtythree.com`.
  **Resolved: connect the domain** (Rev 2 supersedes v1). Flagged to Developer 2 so both branches agree.
- **R-2 — Firebase free tier.** Chosen because Spark does not pause on idle. Watch read/write
  quotas once real traffic starts; a paid plan would be a separate client cost.

---

## Out of scope (quoted separately — do not build)

Payment gateway · separate 063 Society domain · CRM · chatbot · SMS/Twilio · online payments.

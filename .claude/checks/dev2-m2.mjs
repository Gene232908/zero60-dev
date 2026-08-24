/**
 * DEVELOPER 2 — MILESTONE 2 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: Task Division Rev 2, p.3, "Developer 2" table.
 *
 *   HARD    Portfolio/Testimonials: maximalist photo gallery (layered / pinned)
 *           + YouTube sections using PERFORMANT LITE embeds, composed from
 *           Developer 1's motion primitives
 *   MEDIUM  Home page final sections with the real content (productions mode)
 *   MEDIUM  Collaborations: partner-logo marquee + linked project photos
 *   EASY    Contact page layout + contact-details block, correct brand mode
 *   EASY    Connect all six nav links, verify each opens, check reduced motion
 *
 * BLOCKED-ASSET POLICY (agreed with the user, matches content/placeholders.ts):
 * YouTube links (B9), portfolio photos (B7) and partner logos (B8) were never
 * supplied. The pages are built COMPLETE and data-driven, with the data arrays
 * currently empty and rendering a labelled empty slot. Dropping the real values
 * in later must require no code change. Inventing video IDs or partner names
 * fails this gate — see A7 and C4.
 */

export const title = 'Portfolio/Testimonials, Home final sections, Collaborations, Contact layout, nav wiring';

export const brief = `DEVELOPER 2 — MILESTONE 2 TASKS (Task Division Rev 2, p.3):
  [HARD]   /portfolio — replace the stub. Maximalist layered/pinned photo gallery +
           YouTube sections using a LITE embed (facade first, iframe only after the
           user activates it). All 3 TESTIMONIALS from content/site.ts, verbatim.
  [MEDIUM] Home final sections with the real client content, productions mode.
  [MEDIUM] /collaborations — replace the stub. Partner-logo Marquee + linked project
           photos, bulletin-board feel.
  [EASY]   /contact — build the page layout and a contact-details block. KEEP
           <BookingSection /> mounted: it is Developer 1's M3 form.
  [EASY]   Verify all seven nav destinations open, and the reduced-motion path.
BLOCKED ASSETS: no YouTube links (B9), no portfolio photos (B7), no partner logos (B8).
Build the components fully and drive them from data modules that are currently EMPTY
and render a clearly-labelled placeholder. Never invent a video id, partner or logo.`;

/** Verbatim fragments — proof the real testimonials shipped, not a paraphrase. */
const T1 = 'made our corporate conference seamless';
const T2 = 'Our wedding was perfect thanks to Zero-Sixty-Three';
const T3 = 'Fantastic job by Zero-Sixty-Three for my birthday party';

export const routes = [
  { path: '/', expect: ['data-brand="productions"', 'Two houses'] },
  { path: '/about', expect: 'Complete event mastery' },
  { path: '/services', expect: 'Sound Engineering' },
  { path: '/society', expect: 'data-brand="society"' },
  {
    path: '/portfolio',
    expect: [T1, T2, T3, 'Sarah M.', 'Emily &amp; Jake R.', 'Mark L.'],
    // The stub is gone, and no eager YouTube iframe reached the HTML.
    forbid: ['placeholder route', 'https://www.youtube.com/embed', 'https://www.youtube-nocookie.com/embed'],
  },
  { path: '/collaborations', forbid: 'placeholder route' },
  { path: '/contact', expect: ['+971 58 512 4365', 'info@zerosixtythree.com', 'Estimated guests'] },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

/** Every internal link on every page must resolve. */
export const crawl = true;

export const checks = [
  // ================= A. Portfolio / Testimonials (HARD) =================
  {
    id: 'A1',
    desc: 'The Portfolio stub is gone — a real page is built',
    run: (c) => {
      const p = c.read('app/(site)/portfolio/page.tsx');
      if (!p) return 'app/(site)/portfolio/page.tsx not found';
      return !/RouteStub/.test(p) || 'still renders RouteStub';
    },
  },
  {
    id: 'A2',
    desc: 'A lite YouTube embed component exists (not the standard iframe player)',
    run: (c) => {
      const f = ['components/media/LiteYouTube.tsx', 'components/motion/LiteYouTube.tsx'].find((p) => c.exists(p));
      return Boolean(f) || 'components/media/LiteYouTube.tsx not found — Rev 2 p.3 requires lite/lazy embeds';
    },
  },
  {
    id: 'A3',
    desc: 'The lite embed is a facade: the iframe mounts only after the viewer activates it',
    run: (c) => {
      const path = ['components/media/LiteYouTube.tsx', 'components/motion/LiteYouTube.tsx'].find((p) => c.exists(p));
      if (!path) return 'lite embed component not found';
      const s = c.read(path);
      if (!/'use client'/.test(s)) return 'lite embed is not a client component, so it cannot gate activation';
      if (!/useState/.test(s)) return 'no activation state — the iframe is not gated';
      if (!/<iframe/.test(s)) return 'no iframe at all — the video can never play';
      // The iframe must be inside a conditional, never rendered unconditionally.
      const gated = /(\{\s*(active|playing|isActive|loaded|show\w*)\s*&&[\s\S]{0,400}?<iframe)|(\?\s*\([\s\S]{0,400}?<iframe)/.test(s);
      return gated || 'the <iframe> is rendered unconditionally — that is the heavy embed Rev 2 forbids';
    },
  },
  {
    id: 'A4',
    desc: 'The lite embed shows a real poster facade with an accessible play control',
    run: (c) => {
      const path = ['components/media/LiteYouTube.tsx', 'components/motion/LiteYouTube.tsx'].find((p) => c.exists(p));
      const s = c.read(path || '');
      if (!/next\/image|Image/.test(s)) return 'no next/image poster — the facade has nothing to show';
      if (!/<button/.test(s)) return 'no <button> play control — activation must be keyboard reachable';
      if (!/aria-label|aria-labelledby|sr-only/.test(s)) return 'the play control has no accessible name';
      return true;
    },
  },
  {
    id: 'A5',
    desc: 'All three client testimonials render verbatim from content/site.ts',
    run: (c) => {
      const files = [...c.walk('app/(site)/portfolio'), ...c.walk('components/sections')];
      const usesData = files.some((f) => /TESTIMONIALS/.test(c.read(f)));
      if (!usesData) return 'nothing reads TESTIMONIALS from content/site.ts';
      const src = files.map((f) => c.read(f)).join('\n');
      const hardcoded = [T1, T2, T3].filter((q) => src.includes(q));
      return (
        hardcoded.length === 0 ||
        `testimonial text is hardcoded in a component instead of read from content/site.ts: ${hardcoded.join(' | ')}`
      );
    },
  },
  {
    id: 'A6',
    desc: 'The gallery is layered/pinned — composed from the shared motion primitives',
    run: (c) => {
      const src = [...c.walk('app/(site)/portfolio'), ...c.walk('components/sections')]
        .filter((f) => /portfolio|gallery|testimonial/i.test(f))
        .map((f) => c.read(f))
        .join('\n');
      if (!src) return 'no portfolio/gallery section files found';
      if (!/@\/components\/motion/.test(src)) return 'the portfolio does not compose from @/components/motion';
      const maximalist = /(StickySection|Parallax|ImageHoverPreview|KineticHeading)/.test(src);
      return maximalist || 'no layering/pinning primitive used (StickySection / Parallax / ImageHoverPreview)';
    },
  },
  {
    id: 'A7',
    desc: 'BLOCKER B9/B7: no invented YouTube ids or fake portfolio media',
    run: (c) => {
      const files = c.srcFiles().concat(c.walk('content'));
      const bad = [];
      for (const f of files) {
        const s = c.stripComments(c.read(f));
        const id = /['"]([A-Za-z0-9_-]{11})['"]\s*(,|\}|\])/.exec(s);
        if (/youtubeId|videoId|ytId/.test(s) && id && !/PLACEHOLDER/i.test(s)) bad.push(`${f} (${id[1]})`);
        if (/youtu\.be\/[A-Za-z0-9_-]{11}/.test(s)) bad.push(`${f} (youtu.be link)`);
      }
      return bad.length === 0 || `invented video identifiers found: ${bad.join(', ')} — B9 is still outstanding`;
    },
  },
  {
    id: 'A8',
    desc: 'BLOCKER B9: the video list is data-driven, currently empty, and labelled as awaiting the client',
    run: (c) => {
      const f = ['content/portfolio.ts', 'content/videos.ts'].find((p) => c.exists(p));
      if (!f) return 'content/portfolio.ts not found — the video/gallery list must be data-driven so real links drop in with no code change';
      const s = c.read(f);
      if (!/PLACEHOLDER|BLOCKER|B9/i.test(s)) return `${f} does not record that the YouTube links are still outstanding (B9)`;
      const emptied = /:\s*(Video|PortfolioVideo|\w+)\[\]\s*=\s*\[\s*\]/.test(s) || /=\s*\[\s*\]\s*;/.test(s);
      return emptied || `${f} contains video entries, but the client never supplied any (B9)`;
    },
  },
  {
    id: 'A9',
    desc: 'The empty video slot is visible to the user, not a silently blank section',
    run: (c) => {
      const src = [...c.walk('app/(site)/portfolio'), ...c.walk('components/sections')]
        .map((f) => c.read(f))
        .join('\n');
      return /PLACEHOLDER_NOTICE|PLACEHOLDER|awaiting/i.test(src) || 'no labelled empty slot rendered when the video list is empty';
    },
  },

  // ================= B. Home final sections (MEDIUM) =================
  {
    id: 'B1',
    desc: 'The landing page still composes Developer 2\'s M1 sections plus the M2 final sections',
    run: (c) => {
      const home = c.read('app/(site)/page.tsx');
      const need = ['ServicesPreview', 'AboutPreview', 'CTABand', 'FinalCTA'];
      const missing = need.filter((n) => !new RegExp(`<${n}\\b`).test(home));
      return missing.length === 0 || `no longer rendered on the landing page: ${missing.join(', ')}`;
    },
  },
  {
    id: 'B2',
    desc: 'Home runs in productions mode and uses the real client content',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /Preview|CTABand|Hero|Ticker|Manifesto/.test(f));
      const usesContent = files.some((f) => /@\/content\/site/.test(c.read(f)));
      return usesContent || 'the landing sections do not read the real content from content/site.ts';
    },
  },
  {
    id: 'B3',
    desc: 'A testimonials teaser links Home to the finished Portfolio page',
    run: (c) => {
      const src = c.walk('components/sections').map((f) => c.read(f)).join('\n');
      return /['"]\/portfolio['"]/.test(src) || 'nothing on the site links through to /portfolio';
    },
  },

  // ================= C. Collaborations (MEDIUM) =================
  {
    id: 'C1',
    desc: 'The Collaborations stub is gone — a real page is built',
    run: (c) => {
      const p = c.read('app/(site)/collaborations/page.tsx');
      if (!p) return 'app/(site)/collaborations/page.tsx not found';
      return !/RouteStub/.test(p) || 'still renders RouteStub';
    },
  },
  {
    id: 'C2',
    desc: 'The partner logos run in a Marquee, per the brief',
    run: (c) => {
      const src = [...c.walk('app/(site)/collaborations'), ...c.walk('components/sections')]
        .filter((f) => /collab|partner/i.test(f))
        .map((f) => c.read(f))
        .join('\n');
      if (!src) return 'no collaborations section files found';
      return /<Marquee\b/.test(src) || 'no <Marquee> — Rev 2 p.3 asks for a partner-logo marquee';
    },
  },
  {
    id: 'C3',
    desc: 'BLOCKER B8: partners are data-driven, currently empty, and labelled as awaiting the client',
    run: (c) => {
      const f = ['content/collaborations.ts', 'content/partners.ts'].find((p) => c.exists(p));
      if (!f) return 'content/collaborations.ts not found — partners must be data-driven';
      const s = c.read(f);
      if (!/PLACEHOLDER|BLOCKER|B8/i.test(s)) return `${f} does not record that partner logos are still outstanding (B8)`;
      const emptied = /=\s*\[\s*\]\s*;/.test(s) || /\[\s*\]\s*$/m.test(s);
      return emptied || `${f} lists partners the client never supplied (B8)`;
    },
  },
  {
    id: 'C4',
    desc: 'BLOCKER B8: no invented partner names, logos or project attributions',
    run: (c) => {
      const files = [...c.walk('content'), ...c.walk('components/sections'), ...c.walk('app/(site)/collaborations')];
      const bad = [];
      for (const f of files) {
        const s = c.stripComments(c.read(f));
        if (!/partner|collab/i.test(f)) continue;
        // Inspect the actual record fields, not prose: a doc line that happens to say
        // "Partner and collaborator logos" is not invented data.
        const m = /(?:name|title):\s*['"][^'"]*(Acme|Example|Partner\s(?:One|Two|A|B)|Lorem|Sample|Test)/i.exec(s);
        if (m) bad.push(`${f} (${m[0].trim()})`);
      }
      return bad.length === 0 || `invented partner data: ${bad.join(', ')}`;
    },
  },
  {
    id: 'C5',
    desc: 'The empty partner slot is visibly labelled rather than silently blank',
    run: (c) => {
      const src = [...c.walk('app/(site)/collaborations'), ...c.walk('components/sections')]
        .filter((f) => /collab|partner/i.test(f))
        .map((f) => c.read(f))
        .join('\n');
      return /PLACEHOLDER|awaiting|BLOCKER/i.test(src) || 'no labelled empty slot for the missing partner logos';
    },
  },

  // ================= D. Contact layout (EASY) =================
  {
    id: 'D1',
    desc: 'A contact-details block component exists and reads CONTACT from content/site.ts',
    run: (c) => {
      const f = c.walk('components/sections').find((p) => /ContactDetails|ContactInfo/i.test(p));
      if (!f) return 'components/sections/ContactDetails.tsx not found';
      return /@\/content\/site/.test(c.read(f)) || `${f} does not read CONTACT from content/site.ts`;
    },
  },
  {
    id: 'D2',
    desc: "SCOPE: Developer 1's booking form is still mounted on /contact (it is their M3 deliverable)",
    run: (c) => {
      const p = c.read('app/(site)/contact/page.tsx');
      return /<BookingSection\b/.test(p) || 'BookingSection was removed from /contact — that is Developer 1\'s form';
    },
  },
  {
    id: 'D3',
    desc: 'The contact block never invents a social URL (B5)',
    run: (c) => {
      const files = c.walk('components/sections').filter((p) => /Contact/i.test(p));
      const bad = files.filter((f) => /https?:\/\/(www\.)?(facebook|instagram)\.com\/\S/i.test(c.stripComments(c.read(f))));
      return bad.length === 0 || `invented social profile URL in: ${bad.join(', ')} — B5 is still outstanding`;
    },
  },

  // ================= E. Navigation + reduced motion (EASY) =================
  {
    id: 'E1',
    desc: 'Every nav destination is a real page — no stub is reachable from the navigation',
    run: (c) => {
      const nav = c.read('content/nav.ts');
      const hrefs = [...nav.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]);
      if (hrefs.length < 7) return `content/nav.ts declares only ${hrefs.length} destinations`;
      const bad = [];
      for (const href of hrefs) {
        const file = href === '/' ? 'app/(site)/page.tsx' : `app/(site)${href}/page.tsx`;
        if (!c.exists(file)) bad.push(`${href} (no ${file})`);
        else if (/RouteStub/.test(c.read(file))) bad.push(`${href} (still a stub)`);
      }
      return bad.length === 0 || `nav destinations not finished: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E2',
    desc: 'RouteStub is fully retired — no page renders it any more',
    run: (c) => {
      const users = c.walk('app').filter((f) => /\.tsx$/.test(f) && /<RouteStub\b/.test(c.read(f)));
      return users.length === 0 || `still rendering RouteStub: ${users.join(', ')}`;
    },
  },
  {
    id: 'E3',
    desc: 'Reduced motion is honoured by every animated client component',
    run: (c) => {
      const animated = c
        .srcFiles()
        .filter((f) => /^components\//.test(f))
        .filter((f) => {
          const s = c.read(f);
          return /'use client'/.test(s) && /(useAnimation|animate=|whileInView|requestAnimationFrame|ScrollTrigger)/.test(s);
        });
      const bad = animated.filter(
        (f) => !/useReducedMotionSafe|useMotionAllowed|prefers-reduced-motion|useReducedMotion/.test(c.read(f)),
      );
      return bad.length === 0 || `animates without a reduced-motion path: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E4',
    desc: 'The M2 responsive + reduced-motion QA pass is recorded',
    run: (c) => {
      const q = c.read('docs/DEV2-QA.md');
      if (!q) return 'docs/DEV2-QA.md not found';
      const missing = ['Milestone 2', 'portfolio', 'collaborations'].filter((k) => !new RegExp(k, 'i').test(q));
      return missing.length === 0 || `docs/DEV2-QA.md has no Milestone 2 record for: ${missing.join(', ')}`;
    },
  },

  // ================= F. Quality bar + ordering =================
  {
    id: 'F1',
    desc: 'No raw <img> — next/image everywhere',
    run: (c) => {
      const offenders = c.srcFiles().filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F2',
    desc: 'GSAP still code-split, and no second animation approach',
    run: (c) => {
      const gsap = c
        .srcFiles()
        .filter((f) => !f.endsWith('components/motion/gsap-loader.ts') && /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)));
      if (gsap.length) return `static gsap import in: ${gsap.join(', ')}`;
      const fm = [...c.walk('components/sections'), ...c.walk('components/ui'), ...c.walk('components/media')].filter((f) => {
        const s = c.read(f);
        return /from\s+['"]framer-motion['"]/.test(s) && !/@\/components\/motion/.test(s);
      });
      return fm.length === 0 || `direct framer-motion use outside the shared library: ${fm.join(', ')}`;
    },
  },
  {
    id: 'F3',
    desc: 'The M1 foundation survived: responsive tokens and UI atoms are still in place',
    run: (c) => {
      const need = [
        'styles/responsive.css',
        'components/ui/Button.tsx',
        'components/ui/SectionHeading.tsx',
        'components/ui/Divider.tsx',
        'components/ui/Section.tsx',
        'components/ui/Grid.tsx',
      ];
      const missing = need.filter((f) => !c.exists(f));
      return missing.length === 0 || `Milestone 1 deliverables removed: ${missing.join(', ')}`;
    },
  },
  {
    id: 'F4',
    desc: 'SCOPE: no admin side yet (Milestone 3) and no SEO artefacts yet (Milestone 4)',
    run: (c) => {
      if (c.exists('app/admin')) return 'app/admin exists — the admin side is Milestone 3';
      const seo = ['app/sitemap.ts', 'app/robots.ts'].filter((f) => c.exists(f));
      return seo.length === 0 || `${seo.join(', ')} exists — full SEO is Milestone 4`;
    },
  },
  {
    id: 'F5',
    desc: 'BLOCKERS.md records that the M2 assets were delivered as labelled empty slots',
    run: (c) => {
      const b = c.read('BLOCKERS.md');
      const missing = ['B7', 'B8', 'B9'].filter((k) => !b.includes(k));
      return missing.length === 0 || `BLOCKERS.md no longer tracks: ${missing.join(', ')}`;
    },
  },
];

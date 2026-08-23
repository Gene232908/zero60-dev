/**
 * MILESTONE 2 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: docs/plan.md §4 M2 (Developer 1 rows) + Task Division Rev 2
 * p.3 + the shared rules on p.6 (correct data-brand per page, compose motion
 * from the shared primitives, reduced motion, performance budget).
 *
 * Developer 1 owns exactly three page builds this milestone:
 *   HARD    063 Society page, elegant mode
 *   MEDIUM  About page
 *   MEDIUM  Services page, animated bento
 * plus two EASY tasks (collect + relay content, YouTube session).
 *
 * Scope guards assert M2 did NOT build M3/M4 work or Developer 2's pages.
 */

export const title = '063 Society (elegant), About, Services + real content';

export const routes = [
  { path: '/', expect: 'Two houses' },
  { path: '/about', expect: 'Complete event mastery' },
  { path: '/services', expect: 'Sound Engineering' },
  { path: '/society', expect: 'data-brand="society"' },
  { path: '/portfolio', expect: 'Milestone 2' },
  { path: '/collaborations', expect: 'Milestone 2' },
  { path: '/contact', expect: 'CONTACT' },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

/** The five Society service categories named in plan.md §4 M2. */
const SOCIETY_CATEGORIES = [
  'wedding',
  'corporate',
  'event program', // matches both "program" and "programme" support
  'music',
  'production',
];

/** Motion devices that belong to the rugged register, not the elegant one. */
const RUGGED_ONLY = ['Marquee', 'StickerSpin', 'NoiseOverlay'];

const srcFiles = (ctx) =>
  [...ctx.walk('app'), ...ctx.walk('components'), ...ctx.walk('lib'), ...ctx.walk('content')].filter((f) =>
    /\.(ts|tsx)$/.test(f),
  );

/** Files that make up the Society route. */
const societySources = (c) =>
  [...c.walk('components/sections'), ...c.walk('app')]
    .filter((f) => /society/i.test(f) && /\.tsx$/.test(f))
    .map((f) => c.read(f))
    .join('\n');

export const checks = [
  // ---------------- A. 063 Society page (HARD) ----------------
  {
    id: 'A1',
    desc: 'Society route declares elegant mode via data-brand="society"',
    run: (c) => {
      const layout = c.read('app/(site)/society/layout.tsx');
      if (!layout) return 'app/(site)/society/layout.tsx not found';
      return /brand=["']society["']|data-brand=["']society["']/.test(layout) || 'society layout does not set the society brand mode';
    },
  },
  {
    id: 'A2',
    desc: 'Society page is a real composed page, not a stub (>= 4 section components)',
    run: (c) => {
      const page = c.read('app/(site)/society/page.tsx');
      if (!page) return 'society page not found';
      if (/RouteStub/.test(page)) return 'society page is still a RouteStub placeholder';
      const sections = (page.match(/@\/components\/sections\//g) || []).length;
      return sections >= 4 || `society page composes only ${sections} section components, needs >= 4`;
    },
  },
  {
    id: 'A3',
    desc: 'Society page carries all five named service categories (plan.md §4 M2)',
    run: (c) => {
      const src = societySources(c) + c.read('content/society.ts');
      const missing = SOCIETY_CATEGORIES.filter((cat) => !new RegExp(cat, 'i').test(src));
      return missing.length === 0 || `Society categories missing: ${missing.join(', ')}`;
    },
  },
  {
    id: 'A4',
    desc: 'Society sections compose from the shared motion primitives',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /society/i.test(f) && f.endsWith('.tsx'));
      if (files.length < 4) return `only ${files.length} Society section components exist, needs >= 4`;
      const users = files.filter((f) => /@\/components\/motion/.test(c.read(f)));
      return users.length === files.length || `${files.length - users.length} Society section(s) do not use the shared primitives`;
    },
  },
  {
    id: 'A5',
    desc: 'Society uses the RESTRAINED motion subset (no rugged-register devices)',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /society/i.test(f) && f.endsWith('.tsx'));
      const offenders = [];
      for (const f of files) {
        const t = c.read(f);
        for (const dev of RUGGED_ONLY) {
          if (new RegExp(`<${dev}[\\s/>]`).test(t)) offenders.push(`${f} uses <${dev}>`);
        }
      }
      return offenders.length === 0 || `Society must stay elegant: ${offenders.join('; ')}`;
    },
  },
  {
    id: 'A6',
    desc: 'Society copy is centralised and every unsupplied field is labelled PLACEHOLDER',
    run: (c) => {
      const f = c.read('content/society.ts');
      if (!f) return 'content/society.ts not found — Society copy must be centralised';
      return /PLACEHOLDER/.test(f) || 'no PLACEHOLDER markers — Society copy was never supplied, so it cannot be presented as real';
    },
  },

  // ---------------- B. About page (MEDIUM) ----------------
  {
    id: 'B1',
    desc: 'About page is a real composed page, not a stub',
    run: (c) => {
      const page = c.read('app/(site)/about/page.tsx');
      if (!page) return 'about page not found';
      if (/RouteStub/.test(page)) return 'about page is still a RouteStub placeholder';
      const sections = (page.match(/@\/components\/sections\//g) || []).length;
      return sections >= 3 || `about page composes only ${sections} section components, needs >= 3`;
    },
  },
  {
    id: 'B2',
    desc: 'About uses the real client brand story from content/site.ts',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /about/i.test(f) && f.endsWith('.tsx'));
      if (!files.length) return 'no About section components found';
      const usesBrand = files.some((f) => /@\/content\/site/.test(c.read(f)));
      return usesBrand || 'About sections do not pull copy from content/site.ts';
    },
  },
  {
    id: 'B3',
    desc: 'About uses the real client photography from content/media.ts',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /about/i.test(f) && f.endsWith('.tsx'));
      const usesMedia = files.some((f) => /@\/content\/media/.test(c.read(f)));
      return usesMedia || 'About sections do not use the real imagery in content/media.ts';
    },
  },

  // ---------------- C. Services page (MEDIUM) ----------------
  {
    id: 'C1',
    desc: 'Services page is a real composed page, not a stub',
    run: (c) => {
      const page = c.read('app/(site)/services/page.tsx');
      if (!page) return 'services page not found';
      return !/RouteStub/.test(page) || 'services page is still a RouteStub placeholder';
    },
  },
  {
    id: 'C2',
    desc: 'Services page renders every service from content/site.ts (none dropped)',
    run: (c) => {
      const files = [
        ...c.walk('components/sections').filter((f) => /service/i.test(f) && f.endsWith('.tsx')),
      ];
      const src = files.map((f) => c.read(f)).join('\n') + c.read('app/(site)/services/page.tsx');
      if (!/SERVICES/.test(src)) return 'Services page does not iterate the SERVICES list from content/site.ts';
      return true;
    },
  },
  {
    id: 'C3',
    desc: 'Services uses a bento layout (mixed column/row spans, not a uniform grid)',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => /service/i.test(f) && f.endsWith('.tsx'));
      const src = files.map((f) => c.read(f)).join('\n');
      const hasGrid = /grid-cols-/.test(src);
      const spans = new Set((src.match(/(?:col|row)-span-\d+/g) || []));
      if (!hasGrid) return 'no grid layout found on the Services page';
      return spans.size >= 3 || `only ${spans.size} distinct span sizes — a bento needs varied tile sizes`;
    },
  },

  // ---------------- D. Content + handoff (EASY) ----------------
  {
    id: 'D1',
    desc: 'Developer 2 handoff document exists and names what was relayed',
    run: (c) => {
      const f = c.read('docs/HANDOFF-DEV2.md');
      if (!f) return 'docs/HANDOFF-DEV2.md not found — the M2 EASY task is to relay content to Developer 2';
      const need = ['testimonial', 'content/site.ts', 'content/media.ts', 'YouTube'];
      const missing = need.filter((k) => !new RegExp(k, 'i').test(f));
      return missing.length === 0 || `handoff doc does not mention: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'Testimonials are available to Developer 2 in typed content (their page, our content task)',
    run: (c) => {
      const f = c.read('content/site.ts');
      return /TESTIMONIALS/.test(f) || 'TESTIMONIALS not exported from content/site.ts';
    },
  },

  // ---------------- E. Scope guards ----------------
  {
    id: 'E1',
    desc: 'SCOPE: still no database/email dependencies (M3 work)',
    run: (c) => {
      const d = c.deps();
      const bad = ['firebase', 'firebase-admin', 'nodemailer'].filter((p) => d[p]);
      return bad.length === 0 || `M2 must not install: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E2',
    desc: 'SCOPE: no API routes and no admin area (M3 / Developer 2 work)',
    run: (c) => {
      const bad = [];
      if (c.exists('app/api')) bad.push('app/api');
      if (c.exists('app/admin')) bad.push('app/admin');
      return bad.length === 0 || `out of M2 scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E3',
    desc: 'SCOPE: no booking/inquiry form yet (M3 work)',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => /<form[\s>]/i.test(c.read(f)));
      return offenders.length === 0 || `form element found in: ${offenders.join(', ')} — booking form is M3`;
    },
  },
  {
    id: 'E4',
    desc: 'SCOPE: no SEO/tracking/deployment artefacts (Developer 2 SEO + M4)',
    run: (c) => {
      const bad = [];
      for (const p of ['app/sitemap.ts', 'app/robots.ts', 'vercel.json']) if (c.exists(p)) bad.push(p);
      const pixel = srcFiles(c).filter((f) => /fbq\(|connect\.facebook\.net|gtag\(/.test(c.read(f)));
      if (pixel.length) bad.push(`tracking pixel in ${pixel.join(', ')}`);
      return bad.length === 0 || `out of M2 scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E5',
    desc: "SCOPE: Developer 2's pages (Portfolio, Collaborations, Contact) remain untouched stubs",
    run: (c) => {
      const theirs = {
        '/portfolio': 'app/(site)/portfolio/page.tsx',
        '/collaborations': 'app/(site)/collaborations/page.tsx',
        '/contact': 'app/(site)/contact/page.tsx',
      };
      const built = Object.entries(theirs)
        .filter(([, p]) => !/RouteStub/.test(c.read(p)))
        .map(([r]) => r);
      return built.length === 0 || `Developer 1 must not build Developer 2's pages: ${built.join(', ')}`;
    },
  },
  {
    id: 'E6',
    desc: 'SECURITY: no committed credentials, .env ignored',
    run: (c) => {
      const gi = c.read('.gitignore');
      if (!/\.env/.test(gi)) return '.gitignore does not ignore .env files';
      const secretish = srcFiles(c).filter((f) =>
        /(api[_-]?key|secret|password|smtp_pass)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]/i.test(c.read(f)),
      );
      return secretish.length === 0 || `possible hardcoded secret in: ${secretish.join(', ')}`;
    },
  },

  // ---------------- F. Quality bar (carried from M1) ----------------
  {
    id: 'F1',
    desc: 'No raw <img> — next/image everywhere (performance budget)',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F2',
    desc: 'GSAP still code-split — no static gsap import outside the loader',
    run: (c) => {
      const offenders = srcFiles(c).filter(
        (f) => !f.endsWith('components/motion/gsap-loader.ts') && /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)),
      );
      return offenders.length === 0 || `static gsap import in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F3',
    desc: 'Every motion primitive still honours the reduced-motion policy',
    run: (c) => {
      const prims = c.walk('components/motion').filter((f) => /\/[A-Z]\w+\.tsx$/.test(f));
      const bad = prims.filter((f) => !/useReducedMotionSafe|prefers-reduced-motion|useReducedMotion/.test(c.read(f)));
      return bad.length === 0 || `primitives ignoring reduced motion: ${bad.join(', ')}`;
    },
  },
  {
    id: 'F4',
    desc: 'No hand-rolled one-off animation — new sections compose from the primitives',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => f.endsWith('.tsx'));
      const bad = files.filter((f) => {
        const t = c.read(f);
        // A section importing framer-motion directly without the shared library
        // is exactly the "separate animation approach" Rev 2 forbids.
        return /from ['"]framer-motion['"]/.test(t) && !/@\/components\/motion/.test(t);
      });
      return bad.length === 0 || `sections bypassing the shared motion library: ${bad.join(', ')}`;
    },
  },
  {
    id: 'F5',
    desc: 'Blockers register still current and lists the outstanding client data',
    run: (c) => {
      const f = c.read('BLOCKERS.md');
      if (!f) return 'BLOCKERS.md not found';
      const need = ['logo', 'photo', 'SMTP', 'Firebase', 'domain', 'GitHub', 'Society'];
      const missing = need.filter((k) => !new RegExp(k, 'i').test(f));
      return missing.length === 0 || `BLOCKERS.md does not mention: ${missing.join(', ')}`;
    },
  },
];

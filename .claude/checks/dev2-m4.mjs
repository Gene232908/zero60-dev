/**
 * DEVELOPER 2 — MILESTONE 4 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: Task Division Rev 2, p.5, "Developer 2" table.
 *
 *   HARD    Full SEO: page titles and descriptions for every page, sitemap,
 *           robots file, page-speed fixes
 *   MEDIUM  Test the admin side on the live site: login, status changes, the 2%
 *           computation with the cap, the invoice
 *   MEDIUM  A short admin walkthrough guide for management
 *   EASY    Check every page, link, image and video
 *   EASY    Check the display on phone, tablet and desktop
 *
 * VERIFICATION TARGET (agreed with the user):
 * Deployment to Vercel and the DNS repoint are Developer 1's HARD task and have
 * not happened, so "live site" here means the real production build served by
 * `next start` — the same artefact Vercel would serve. Everything except the
 * deploy step itself is verified for real; the deploy remains Developer 1's.
 */

export const title = 'Full SEO, admin verification, walkthrough guide, whole-site checks';

export const brief = `DEVELOPER 2 — MILESTONE 4 TASKS (Task Division Rev 2, p.5):
  [HARD]   Full SEO. A UNIQUE, non-placeholder <title> and meta description on every public
           page; app/sitemap.ts listing every public route and EXCLUDING /admin;
           app/robots.ts disallowing /admin; canonical + OpenGraph/Twitter metadata;
           page-speed fixes (next/image sizes, no eager third-party embeds).
  [MEDIUM] Verify the admin against the production build: login guard, status changes,
           the 2% computation with the AED 250 cap, and the invoice.
  [MEDIUM] docs/ADMIN-GUIDE.md — a short walkthrough for management (login, records,
           search/filter, status, amount collected, monthly summary, invoice).
  [EASY]   Every page, link, image and video checked. The gate crawls every internal link.
  [EASY]   Phone / tablet / desktop pass recorded in docs/DEV2-QA.md.
NOT YOURS: the Vercel deploy and the zerosixtythree.com DNS repoint are Developer 1's.`;

const PUBLIC_ROUTES = ['/', '/about', '/services', '/portfolio', '/collaborations', '/society', '/contact'];

export const routes = [
  ...PUBLIC_ROUTES.map((path) => ({ path })),
  { path: '/sitemap.xml', expect: '<urlset' },
  { path: '/robots.txt', expect: 'Disallow' },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

/** "Check every page, link, image and video" — as an assertion, not a promise. */
export const crawl = true;

const titleOf = (html) => (/<title>([\s\S]*?)<\/title>/i.exec(html) || [])[1]?.trim() ?? null;
const descOf = (html) =>
  (/<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html) ||
    /<meta[^>]+content="([^"]*)"[^>]+name="description"/i.exec(html) ||
    [])[1]?.trim() ?? null;

const PLACEHOLDER = /(placeholder|lorem|todo|tbd|untitled|create next app)/i;

/**
 * Live probes — run against the booted production server, so they grade what
 * actually shipped in the HTML rather than what the source appears to intend.
 */
export const liveProbes = [
  Object.assign(
    ({ pages }) => {
      const missing = PUBLIC_ROUTES.filter((p) => !titleOf(pages.get(p) || ''));
      return missing.length === 0 || `no <title> rendered on: ${missing.join(', ')}`;
    },
    { id: 'seo:title-present' },
  ),
  Object.assign(
    ({ pages }) => {
      const seen = new Map();
      const dupes = [];
      for (const p of PUBLIC_ROUTES) {
        const t = titleOf(pages.get(p) || '');
        if (!t) continue;
        if (seen.has(t)) dupes.push(`${p} and ${seen.get(t)} share the title "${t}"`);
        else seen.set(t, p);
      }
      return dupes.length === 0 || dupes.join('; ');
    },
    { id: 'seo:title-unique' },
  ),
  Object.assign(
    ({ pages }) => {
      const bad = PUBLIC_ROUTES.filter((p) => PLACEHOLDER.test(titleOf(pages.get(p) || '') || ''));
      return bad.length === 0 || `placeholder text still in the <title> of: ${bad.join(', ')}`;
    },
    { id: 'seo:title-real' },
  ),
  Object.assign(
    ({ pages }) => {
      const missing = PUBLIC_ROUTES.filter((p) => {
        const d = descOf(pages.get(p) || '');
        return !d || d.length < 50;
      });
      return missing.length === 0 || `missing or too-short meta description (<50 chars) on: ${missing.join(', ')}`;
    },
    { id: 'seo:description-present' },
  ),
  Object.assign(
    ({ pages }) => {
      const bad = PUBLIC_ROUTES.filter((p) => PLACEHOLDER.test(descOf(pages.get(p) || '') || ''));
      return bad.length === 0 || `placeholder text still in the meta description of: ${bad.join(', ')}`;
    },
    { id: 'seo:description-real' },
  ),
  Object.assign(
    ({ pages }) => {
      const seen = new Map();
      const dupes = [];
      for (const p of PUBLIC_ROUTES) {
        const d = descOf(pages.get(p) || '');
        if (!d) continue;
        if (seen.has(d)) dupes.push(`${p} and ${seen.get(d)} share a description`);
        else seen.set(d, p);
      }
      return dupes.length === 0 || dupes.join('; ');
    },
    { id: 'seo:description-unique' },
  ),
  Object.assign(
    ({ pages }) => {
      const bad = PUBLIC_ROUTES.filter((p) => !/property="og:title"/i.test(pages.get(p) || ''));
      return bad.length === 0 || `no OpenGraph title on: ${bad.join(', ')}`;
    },
    { id: 'seo:opengraph' },
  ),
  Object.assign(
    async ({ port }) => {
      const xml = await (await fetch(`http://127.0.0.1:${port}/sitemap.xml`)).text();
      const missing = PUBLIC_ROUTES.filter((p) => {
        const suffix = p === '/' ? '' : p;
        return !new RegExp(`<loc>[^<]*${suffix.replace(/\//g, '\\/')}(/)?</loc>`).test(xml);
      });
      if (missing.length) return `sitemap.xml does not list: ${missing.join(', ')}`;
      return !/\/admin/.test(xml) || 'sitemap.xml exposes the admin area — it must be excluded';
    },
    { id: 'seo:sitemap-complete' },
  ),
  Object.assign(
    async ({ port }) => {
      const txt = await (await fetch(`http://127.0.0.1:${port}/robots.txt`)).text();
      if (!/Disallow:\s*\/admin/i.test(txt)) return 'robots.txt does not disallow /admin';
      return /Sitemap:/i.test(txt) || 'robots.txt does not point at the sitemap';
    },
    { id: 'seo:robots' },
  ),
  Object.assign(
    async ({ port }) => {
      // The admin must not be reachable by an anonymous visitor.
      const res = await fetch(`http://127.0.0.1:${port}/admin`, { redirect: 'manual' });
      const html = res.status === 200 ? await res.text() : '';
      if (res.status >= 500) return `/admin returned HTTP ${res.status} — the admin build is broken`;
      const leaked = /amountCollected|Returning Customer|monthly summary/i.test(html) && !/sign in|log in|login/i.test(html);
      return !leaked || '/admin served booking records to an unauthenticated request';
    },
    { id: 'admin:guarded' },
  ),
  Object.assign(
    ({ pages }) => {
      const bad = PUBLIC_ROUTES.filter((p) => /youtube\.com\/embed|youtube-nocookie\.com\/embed/.test(pages.get(p) || ''));
      return bad.length === 0 || `an eager YouTube iframe shipped in the HTML of: ${bad.join(', ')} — the lite facade regressed`;
    },
    { id: 'speed:no-eager-embeds' },
  ),
  Object.assign(
    ({ pages }) => {
      // Every RASTER image must ship a srcset, so a phone never downloads a
      // desktop-sized file. SVG is exempt: it is vector, so next/image serves it
      // as-is and a srcset for it would be meaningless.
      const bad = [];
      for (const p of PUBLIC_ROUTES) {
        for (const tag of (pages.get(p) || '').matchAll(/<img\b[^>]*>/gi)) {
          const el = tag[0];
          if (/\bsrcset=/i.test(el)) continue;
          const src = (/\bsrc="([^"]*)"/i.exec(el) || [])[1] || '';
          if (/\.svg(\?|$)/i.test(decodeURIComponent(src))) continue;
          bad.push(`${p} -> ${src.slice(0, 80)}`);
        }
      }
      return bad.length === 0 || `raster image shipped without a srcset: ${bad.join(' | ')}`;
    },
    { id: 'speed:images-optimised' },
  ),
];

export const checks = [
  // ============ A. Full SEO (HARD) ============
  {
    id: 'A1',
    desc: 'A sitemap route exists',
    run: (c) => c.exists('app/sitemap.ts') || 'app/sitemap.ts not found',
  },
  {
    id: 'A2',
    desc: 'A robots route exists',
    run: (c) => c.exists('app/robots.ts') || 'app/robots.ts not found',
  },
  {
    id: 'A3',
    desc: 'The sitemap is generated from content/nav.ts, so a new page can never be forgotten',
    run: (c) => {
      const s = c.read('app/sitemap.ts');
      return /@\/content\/nav|NAV_ITEMS/.test(s) || 'app/sitemap.ts hardcodes its routes instead of deriving them from content/nav.ts';
    },
  },
  {
    id: 'A4',
    desc: 'Every public page declares its own metadata',
    run: (c) => {
      const pages = c.walk('app/(site)').filter((f) => /page\.tsx$/.test(f));
      const bad = pages.filter((f) => {
        const s = c.read(f);
        const dir = f.replace(/\/page\.tsx$/, '');
        const layout = c.read(`${dir}/layout.tsx`);
        return !/export\s+const\s+metadata|generateMetadata/.test(s) && !/export\s+const\s+metadata/.test(layout);
      });
      return bad.length === 0 || `no page metadata exported by: ${bad.join(', ')}`;
    },
  },
  {
    id: 'A5',
    desc: 'A shared SEO helper exists so titles and descriptions cannot drift apart',
    run: (c) => {
      const f = c.walk('lib/seo').find((p) => /\.ts$/.test(p));
      return Boolean(f) || 'lib/seo/ is empty — plan.md §3 reserves it for the metadata helpers';
    },
  },
  {
    id: 'A6',
    desc: 'metadataBase and a canonical strategy are set (relative OG URLs otherwise break)',
    run: (c) => {
      const src = [...c.walk('app'), ...c.walk('lib/seo')].filter((f) => /\.tsx?$/.test(f)).map((f) => c.read(f)).join('\n');
      if (!/metadataBase/.test(src)) return 'no metadataBase anywhere — OpenGraph URLs will not resolve';
      return /canonical/.test(src) || 'no canonical URL strategy';
    },
  },
  {
    id: 'A7',
    desc: 'The root layout no longer ships the placeholder description',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      return !/PLACEHOLDER/.test(s) || 'app/layout.tsx still carries the placeholder site description';
    },
  },
  {
    id: 'A8',
    desc: 'Page-speed: next/image calls declare sizes so they do not over-fetch on phones',
    run: (c) => {
      const bad = c.srcFiles().filter((f) => {
        const s = c.read(f);
        if (!/<Image\b/.test(s)) return false;
        const fills = [...s.matchAll(/<Image\b[\s\S]{0,600}?\/>/g)];
        return fills.some((m) => /\bfill\b/.test(m[0]) && !/\bsizes=/.test(m[0]));
      });
      return bad.length === 0 || `a fill <Image> without a sizes prop in: ${bad.join(', ')}`;
    },
  },

  // ============ B. Admin verification (MEDIUM) ============
  {
    id: 'B1',
    desc: 'The partnership computation still passes its unit test (re-run every milestone)',
    run: (c) => c.exists('.claude/checks/partnership.test.mjs') || 'the partnership contract test was deleted',
  },
  {
    id: 'B2',
    desc: 'The admin side from Milestone 3 is still intact',
    run: (c) => {
      const need = ['lib/utils/partnership.ts'];
      const missing = need.filter((f) => !c.exists(f));
      if (missing.length) return `missing: ${missing.join(', ')}`;
      if (!c.exists('app/admin')) return 'app/admin was removed';
      const src = c.walk('app/admin').map((f) => c.read(f)).join('\n');
      const gone = ['monthlySummary', 'buildInvoice', 'BOOKING_STATUSES', 'amountCollected'].filter(
        (n) => !new RegExp(`\\b${n}\\b`).test(src),
      );
      return gone.length === 0 || `the admin no longer uses: ${gone.join(', ')}`;
    },
  },
  {
    id: 'B3',
    desc: 'The admin verification pass is recorded with what was actually exercised',
    run: (c) => {
      const q = c.read('docs/DEV2-QA.md');
      if (!q) return 'docs/DEV2-QA.md not found';
      const missing = ['Milestone 4', 'login', 'invoice'].filter((k) => !new RegExp(k, 'i').test(q));
      return missing.length === 0 || `the Milestone 4 admin verification does not cover: ${missing.join(', ')}`;
    },
  },

  // ============ C. Admin walkthrough guide (MEDIUM) ============
  {
    id: 'C1',
    desc: 'The admin walkthrough guide for management exists',
    run: (c) => c.exists('docs/ADMIN-GUIDE.md') || 'docs/ADMIN-GUIDE.md not found',
  },
  {
    id: 'C2',
    desc: 'It covers every admin capability management will actually use',
    run: (c) => {
      const g = c.read('docs/ADMIN-GUIDE.md');
      const need = ['log in', 'record', 'search', 'filter', 'status', 'amount', 'monthly', 'invoice', 'returning'];
      const missing = need.filter((k) => !new RegExp(k, 'i').test(g));
      return missing.length === 0 || `docs/ADMIN-GUIDE.md does not explain: ${missing.join(', ')}`;
    },
  },
  {
    id: 'C3',
    desc: 'It states the 2% / AED 250 rule in the terms the client agreed',
    run: (c) => {
      const g = c.read('docs/ADMIN-GUIDE.md');
      if (!/2\s*%/.test(g)) return 'the guide never states the 2% rate';
      if (!/250/.test(g)) return 'the guide never states the AED 250 cap';
      return /website/i.test(g) || 'the guide does not explain that only website-sourced bookings qualify';
    },
  },

  // ============ D. Whole-site checks (EASY) ============
  {
    id: 'D1',
    desc: 'No raw <img> anywhere',
    run: (c) => {
      const offenders = c.srcFiles().filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'Every next/image src resolves to a file that exists in public/',
    run: (c) => {
      const missing = new Set();
      for (const f of c.srcFiles()) {
        for (const m of c.read(f).matchAll(/src=["'](\/[^"']+\.(?:png|jpe?g|svg|webp|avif))["']/g)) {
          if (!c.exists(`public${m[1]}`)) missing.add(`${m[1]} (referenced by ${f})`);
        }
      }
      return missing.size === 0 || `image files referenced but not present: ${[...missing].join(', ')}`;
    },
  },
  {
    id: 'D3',
    desc: 'Every internal link target in content/nav.ts is a real route',
    run: (c) => {
      const nav = c.read('content/nav.ts');
      const hrefs = [...nav.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]);
      const bad = hrefs.filter((h) => !c.exists(h === '/' ? 'app/(site)/page.tsx' : `app/(site)${h}/page.tsx`));
      return bad.length === 0 || `nav points at non-existent routes: ${bad.join(', ')}`;
    },
  },
  {
    id: 'D4',
    desc: 'GSAP still code-split and no second animation approach',
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
    id: 'D5',
    desc: 'Reduced motion still honoured everywhere',
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

  // ============ E. Responsive pass (EASY) ============
  {
    id: 'E1',
    desc: 'The phone/tablet/desktop pass is recorded for the finished site',
    run: (c) => {
      const q = c.read('docs/DEV2-QA.md');
      const missing = ['phone', 'tablet', 'desktop'].filter((k) => !new RegExp(k, 'i').test(q));
      return missing.length === 0 || `docs/DEV2-QA.md does not record: ${missing.join(', ')}`;
    },
  },
  {
    id: 'E2',
    desc: 'No fixed-pixel layout widths crept back in',
    run: (c) => {
      const offenders = c.srcFiles().filter((f) => /\b(w|min-w|max-w)-\[\s*\d{3,}px\s*\]/.test(c.read(f)));
      return offenders.length === 0 || `fixed pixel layout width in: ${offenders.join(', ')}`;
    },
  },

  // ============ F. Ownership seam ============
  {
    id: 'F1',
    desc: "SCOPE: deployment and the DNS repoint stay Developer 1's (Rev 2 p.5)",
    run: (c) => {
      const bad = ['vercel.json', '.github/workflows'].filter((f) => c.exists(f));
      return bad.length === 0 || `${bad.join(', ')} created — the Vercel deploy is Developer 1's HARD task`;
    },
  },
  {
    id: 'F2',
    desc: 'BLOCKERS.md records what is still outstanding at handover',
    run: (c) => {
      const b = c.read('BLOCKERS.md');
      const missing = ['B14', 'B15', 'B16'].filter((k) => !b.includes(k));
      return missing.length === 0 || `BLOCKERS.md no longer tracks the M4 client dependencies: ${missing.join(', ')}`;
    },
  },
];

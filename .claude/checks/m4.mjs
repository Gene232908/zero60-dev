/**
 * MILESTONE 4 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: docs/plan.md §4 M4 (Developer 1 rows) + Task Division Rev 2 p.5.
 *
 * Developer 1 owns publishing and tracking:
 *   HARD    Deploy to Vercel + connect zerosixtythree.com   — done LAST
 *   MEDIUM  Meta Pixel, page-view + form-submit events
 *   MEDIUM  Source-code transfer to the client GitHub
 *   EASY    Favicon, browser tab titles, social share image
 *   EASY    Live booking-flow smoke test on the published URL
 *
 * Two of those five cannot be asserted by a static checker, by their nature:
 *   - the deploy and the DNS repoint happen on Vercel, not in this repo
 *   - the GitHub transfer happens on a remote we do not control
 * They are gated by client access (BLOCKERS B14/B15/B16) and verified by hand on
 * the handover call. What this file CAN assert is that everything shipping into
 * that deploy is correct and, critically, that nothing regressed across M1-M3.
 *
 * The scope guards here are looser than M1-M3 in exactly one direction: SEO and
 * tracking artefacts are no longer forbidden, because this is the milestone they
 * belong to. Developer 2's half of M4 (sitemap, robots, per-page metadata) is
 * still guarded — it is their task, not ours.
 */

export const title = 'Meta Pixel, share card + icons, deployment readiness';

export const routes = [
  { path: '/', expect: 'Two houses' },
  { path: '/about', expect: 'Complete event mastery' },
  { path: '/services', expect: 'Sound Engineering' },
  { path: '/society', expect: 'data-brand="society"' },
  { path: '/contact', expect: 'Estimated guests' },
  { path: '/portfolio', expect: 'Milestone 2' },
  { path: '/collaborations', expect: 'Milestone 2' },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

const srcFiles = (ctx) =>
  [...ctx.walk('app'), ...ctx.walk('components'), ...ctx.walk('lib'), ...ctx.walk('content')].filter(
    (f) => /\.(ts|tsx)$/.test(f),
  );

/** See m3.mjs — a scope guard that cannot tell prose from code punishes good comments. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/** PNG/ICO dimensions, read from the file header — no image library needed. */
function pngSize(ctx, path) {
  try {
    const b = ctx.readBuffer(path);
    if (b.length > 24 && b.toString('ascii', 1, 4) === 'PNG') {
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
  } catch {
    /* fall through */
  }
  return null;
}

export const checks = [
  // ---------------- A. Icons + share card (EASY) ----------------
  {
    id: 'A1',
    desc: 'Favicon is the brand mark, not the create-next-app default',
    run: (c) => {
      if (!c.exists('app/favicon.ico')) return 'app/favicon.ico is missing';
      const b = c.readBuffer('app/favicon.ico');
      // The stock Next.js favicon is 25,931 bytes. Anything of that exact size
      // means the placeholder was never replaced.
      if (b.length === 25931) return 'still the default Next.js favicon';
      if (b.length < 500) return `suspiciously small (${b.length}b)`;
      // ICONDIR: reserved=0, type=1
      if (!(b.readUInt16LE(0) === 0 && b.readUInt16LE(2) === 1)) return 'not a valid ICO container';
      const entries = b.readUInt16LE(4);
      return entries >= 2 || `only ${entries} size in the .ico — ship at least 16 and 32px`;
    },
  },
  {
    id: 'A2',
    desc: 'icon.png and apple-icon.png exist at the sizes browsers and iOS ask for',
    run: (c) => {
      const want = { 'app/icon.png': 512, 'app/apple-icon.png': 180 };
      const bad = [];
      for (const [p, size] of Object.entries(want)) {
        if (!c.exists(p)) {
          bad.push(`${p} missing`);
          continue;
        }
        const d = pngSize(c, p);
        if (!d) bad.push(`${p} unreadable`);
        else if (d.width !== size || d.height !== size) bad.push(`${p} is ${d.width}x${d.height}, want ${size}`);
      }
      return bad.length === 0 || bad.join('; ');
    },
  },
  {
    id: 'A3',
    desc: 'Social share image exists at the 1200x630 Open Graph size',
    run: (c) => {
      if (!c.exists('app/opengraph-image.png')) return 'app/opengraph-image.png is missing';
      const d = pngSize(c, 'app/opengraph-image.png');
      if (!d) return 'unreadable PNG';
      if (d.width !== 1200 || d.height !== 630) return `is ${d.width}x${d.height}, want 1200x630`;
      // Facebook rejects over 8MB; Next fails the build over it too.
      const kb = c.readBuffer('app/opengraph-image.png').length / 1024;
      return kb < 8192 || `${kb.toFixed(0)}kB exceeds the 8MB Open Graph limit`;
    },
  },
  {
    id: 'A4',
    desc: 'Brand images are reproducible — a committed generator, not orphan binaries',
    run: (c) => {
      const s = c.read('scripts/generate-brand-images.mjs');
      if (!s) return 'scripts/generate-brand-images.mjs is missing';
      const missing = ['favicon.ico', 'icon.png', 'apple-icon.png', 'opengraph-image.png'].filter(
        (out) => !s.includes(out),
      );
      return missing.length === 0 || `generator does not produce: ${missing.join(', ')}`;
    },
  },

  // ---------------- B. Tab titles / metadata baseline (EASY) ----------------
  {
    id: 'B1',
    desc: 'Root metadata sets a title template so every page gets a branded tab title',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      if (!/template:/.test(s)) return 'no title.template in the root metadata';
      return /default:/.test(s) || 'title.template without a title.default — pages with no title break';
    },
  },
  {
    id: 'B2',
    desc: 'No PLACEHOLDER text left in the shipped metadata',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      return !/PLACEHOLDER/.test(s) || 'app/layout.tsx still ships PLACEHOLDER metadata copy';
    },
  },
  {
    id: 'B3',
    desc: 'metadataBase is configured, so share/canonical URLs resolve absolutely',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      if (!/metadataBase/.test(s)) return 'no metadataBase — relative metadata URLs fail the build';
      return c.exists('lib/seo/site-url.ts') || 'metadataBase should resolve through lib/seo/site-url.ts';
    },
  },
  {
    id: 'B4',
    desc: 'The site origin is env-driven, not a hardcoded literal in the layout',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      return (
        !/new URL\(['"]https?:\/\//.test(s) ||
        'hardcoded origin in app/layout.tsx — preview deploys would claim to be production'
      );
    },
  },
  {
    id: 'B5',
    desc: 'Open Graph + Twitter card declared once at the root',
    run: (c) => {
      const s = c.read('app/layout.tsx');
      const missing = ['openGraph', 'twitter'].filter((k) => !s.includes(k));
      return missing.length === 0 || `root metadata missing: ${missing.join(', ')}`;
    },
  },

  // ---------------- C. Meta Pixel (MEDIUM) ----------------
  {
    id: 'C1',
    desc: 'Meta Pixel component exists and is mounted in the root layout',
    run: (c) => {
      if (!c.exists('components/analytics/MetaPixel.tsx')) return 'components/analytics/MetaPixel.tsx is missing';
      const layout = c.read('app/layout.tsx');
      return /<MetaPixel\s*\/>/.test(layout) || 'MetaPixel is never mounted in app/layout.tsx';
    },
  },
  {
    id: 'C2',
    desc: 'Pixel ID comes ONLY from an env var — never committed',
    run: (c) => {
      const files = srcFiles(c).filter((f) => /analytics/.test(f));
      if (!files.length) return 'no analytics module found';
      for (const f of files) {
        const src = stripComments(c.read(f));
        // A Meta Pixel ID is a bare 15-16 digit number. One in the source is a leak.
        const literal = src.match(/['"]\d{15,16}['"]/);
        if (literal) return `hardcoded pixel id in ${f}: ${literal[0]}`;
      }
      const joined = files.map((f) => c.read(f)).join('\n');
      return (
        /process\.env\.NEXT_PUBLIC_META_PIXEL_ID/.test(joined) ||
        'pixel id is not read from NEXT_PUBLIC_META_PIXEL_ID'
      );
    },
  },
  {
    id: 'C3',
    desc: 'Pixel is INERT without the env var (nothing loads until B15 is granted)',
    run: (c) => {
      const s = c.read('components/analytics/MetaPixel.tsx');
      return (
        /if\s*\(!\s*META_PIXEL_ID\s*\)\s*return null/.test(s) ||
        'component must return null when the pixel id is unset'
      );
    },
  },
  {
    id: 'C4',
    desc: 'PageView is re-fired on client-side route changes (App Router does not reload)',
    run: (c) => {
      const s = c.read('components/analytics/MetaPixel.tsx');
      if (!/usePathname/.test(s)) return 'no usePathname — only the first page would ever be counted';
      return /PageView/.test(s) || 'no PageView tracking on route change';
    },
  },
  {
    id: 'C5',
    desc: 'Form submit fires Lead, and only after the SERVER accepts the enquiry',
    run: (c) => {
      const s = c.read('components/forms/BookingForm.tsx');
      if (!/trackInquirySubmitted/.test(s)) return 'BookingForm never reports a submission to the pixel';
      const body = stripComments(s);

      /**
       * The call must sit past the `!response.ok` bail-out, so a rejected
       * enquiry can never be reported as a lead.
       *
       * Anchor on that bail-out specifically — NOT on the first
       * `setStatus('error')`, which belongs to the local-validation guard that
       * runs before the fetch and would sit earlier than any placement, making
       * the check vacuous. And test EVERY call site, not just the first: an
       * extra premature call is exactly the regression worth catching.
       */
      const okCheck = body.indexOf('!response.ok');
      if (okCheck === -1) return 'BookingForm never checks response.ok before reporting success';

      const guardEnd = body.indexOf('return;', okCheck);
      if (guardEnd === -1) return 'the !response.ok branch does not bail out';

      const premature = [];
      for (let i = body.indexOf('trackInquirySubmitted('); i !== -1; i = body.indexOf('trackInquirySubmitted(', i + 1)) {
        if (i < guardEnd) premature.push(i);
      }
      return (
        premature.length === 0 ||
        'Lead is fired before the server response is checked — it would count failed submits'
      );
    },
  },
  {
    id: 'C6',
    desc: 'PRIVACY: no customer detail is passed to Meta',
    run: (c) => {
      const s = stripComments(c.read('lib/analytics/meta-pixel.ts'));
      const leaked = ['email', 'mobile', 'phone', 'name', 'location', 'notes'].filter((f) =>
        new RegExp(`\\b${f}\\b`, 'i').test(s),
      );
      return leaked.length === 0 || `customer field(s) referenced in the pixel payload: ${leaked.join(', ')}`;
    },
  },

  // ---------------- D. Deployment readiness (HARD, finished on Vercel) ----------------
  {
    id: 'D1',
    desc: 'Every new env var is documented in .env.example with a blank value',
    run: (c) => {
      const ex = c.read('.env.example');
      if (!ex) return '.env.example is missing';
      const missing = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_META_PIXEL_ID'].filter((v) => !ex.includes(v));
      if (missing.length) return `undocumented: ${missing.join(', ')}`;
      const filled = ex
        .split('\n')
        .filter((l) => /^[A-Z_]+=.+/.test(l.trim()))
        .map((l) => l.split('=')[0]);
      return filled.length === 0 || `.env.example must ship blank values, but has: ${filled.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'SECURITY: no real credential anywhere in the source tree',
    run: (c) => {
      const bad = [];
      for (const f of [...srcFiles(c), '.env.example', 'firestore.rules']) {
        const src = c.read(f);
        if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(src)) bad.push(`${f}: private key`);
        if (/AIza[0-9A-Za-z_-]{35}/.test(src)) bad.push(`${f}: Google API key`);
        if (/\bsk_live_[0-9A-Za-z]+/.test(src)) bad.push(`${f}: live secret key`);
      }
      return bad.length === 0 || bad.join('; ');
    },
  },
  {
    id: 'D3',
    desc: 'SECURITY: .env files are gitignored',
    run: (c) => {
      const ig = c.read('.gitignore');
      return /^\.env/m.test(ig) || '.gitignore does not cover .env files';
    },
  },

  // ---------------- E. Scope guards — Developer 2 still owns their half ----------------
  {
    id: 'E1',
    desc: "SCOPE: sitemap, robots and per-page SEO remain Developer 2's HARD task",
    run: (c) => {
      const bad = [];
      for (const p of ['app/sitemap.ts', 'app/robots.ts', 'app/sitemap.xml', 'app/robots.txt']) {
        if (c.exists(p)) bad.push(p);
      }
      // Per-page metadata exports are Developer 2's, not ours. The ROOT layout is ours.
      const pages = c.walk('app').filter((f) => /\/page\.tsx$/.test(f));
      for (const p of pages) {
        if (/export\s+(const\s+metadata|async\s+function\s+generateMetadata)/.test(c.read(p))) {
          bad.push(`${p} (page metadata is Dev 2's SEO task)`);
        }
      }
      return bad.length === 0 || `out of Developer 1's scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E2',
    desc: 'SCOPE: no admin UI and no 2% / AED 250 computation (Developer 2)',
    run: (c) => {
      const bad = [];
      if (c.exists('app/admin')) bad.push('app/admin');

      /**
       * Look for the computation, not for loose numbers. `0.02` on its own is a
       * -0.02em letter-spacing far more often than it is a 2% commission rate,
       * so a file only counts if it names the thing OR pairs the rate with the
       * AED 250 cap — which together are unmistakably the partnership calc.
       */
      const calc = srcFiles(c).filter((f) => {
        const src = stripComments(c.read(f));
        if (/\b(partnershipShare|calcPartnership|commission)\b/i.test(src)) return true;
        return /(^|[^.\w-])0\.02\b/.test(src) && /\b250\b/.test(src);
      });
      if (calc.length) bad.push(`partnership calc in ${calc.join(', ')}`);
      return bad.length === 0 || `out of Developer 1's scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'E3',
    desc: "SCOPE: Developer 2's Portfolio and Collaborations pages remain untouched stubs",
    run: (c) => {
      const theirs = {
        '/portfolio': 'app/(site)/portfolio/page.tsx',
        '/collaborations': 'app/(site)/collaborations/page.tsx',
      };
      const built = Object.entries(theirs)
        .filter(([, p]) => !/RouteStub/.test(c.read(p)))
        .map(([r]) => r);
      return built.length === 0 || `must not build Developer 2's pages: ${built.join(', ')}`;
    },
  },

  // ---------------- F. No regression across M1-M3 ----------------
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
    desc: 'GSAP still code-split — no static import outside the loader',
    run: (c) => {
      const offenders = srcFiles(c).filter(
        (f) =>
          !f.endsWith('components/motion/gsap-loader.ts') &&
          /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)),
      );
      return offenders.length === 0 || `static gsap import in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F3',
    desc: 'Every motion primitive still honours the reduced-motion policy',
    run: (c) => {
      const prims = c
        .walk('components/motion')
        .filter((f) => /\.tsx$/.test(f) && !/index|tokens/.test(f));
      const offenders = prims.filter((f) => !/useReducedMotionSafe|useMotionAllowed/.test(c.read(f)));
      return offenders.length === 0 || `no reduced-motion policy in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F4',
    desc: 'The admin SDK is never imported into client code',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => {
        const src = c.read(f);
        return /['"]use client['"]/.test(src) && /firebase-admin|lib\/firebase\/admin/.test(src);
      });
      return offenders.length === 0 || `admin SDK reachable from the browser via: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F5',
    desc: 'Blockers register lists the Milestone 4 client dependencies',
    run: (c) => {
      const b = c.read('BLOCKERS.md');
      if (!b) return 'BLOCKERS.md is missing';
      const missing = ['B14', 'B15', 'B16'].filter((id) => !b.includes(id));
      return missing.length === 0 || `BLOCKERS.md does not track: ${missing.join(', ')}`;
    },
  },
];

/**
 * MILESTONE 1 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: docs/plan.md §4 M1 + Task Division Rev 2 p.2 (Developer 1 rows)
 * + the shared rules on p.6 (data-brand, reduced-motion, performance budget).
 *
 * Every check returns `true` for PASS, or a string reason for FAIL.
 * Scope guards (G*) assert that M1 did NOT build M2/M3/M4 or Developer 2 work.
 */

export const title = 'Foundation, Dual-Brand Tokens, Motion System, Landing';

/**
 * Runtime route probes.
 *
 * Each route must return 200 AND contain a marker unique to that page. We check
 * a POSITIVE marker rather than grepping for 404 text, because Next 16 inlines
 * the notFound boundary ("This page could not be found") into the RSC flight
 * payload of every healthy page — grepping for it fails good pages.
 */
export const routes = [
  { path: '/', expect: 'Two houses' },
  { path: '/about', expect: 'ABOUT' },
  { path: '/services', expect: 'SERVICES' },
  { path: '/portfolio', expect: 'FOLIO' },
  { path: '/society', expect: 'data-brand="society"' },
  { path: '/collaborations', expect: 'COLLAB' },
  { path: '/contact', expect: 'CONTACT' },
];

/** A route that must NOT exist — proves the 200 assertions above aren't vacuous. */
export const notFoundProbe = '/__gate-probe-this-must-404';

const PRIMITIVES = [
  'Reveal',
  'Marquee',
  'Parallax',
  'KineticHeading',
  'MagneticButton',
  'CustomCursor',
  'StickerSpin',
  'NoiseOverlay',
  'PageTransition',
];

// Primitives that must degrade under prefers-reduced-motion.
const MOTION_SENSITIVE = PRIMITIVES;

const srcFiles = (ctx) =>
  [...ctx.walk('app'), ...ctx.walk('components'), ...ctx.walk('lib'), ...ctx.walk('content')].filter((f) =>
    /\.(ts|tsx)$/.test(f),
  );

export const checks = [
  // ---------------- A. Foundation ----------------
  {
    id: 'A1',
    desc: 'Next.js App Router base exists (root layout + globals.css)',
    run: (c) =>
      (c.exists('app/layout.tsx') && c.exists('app/globals.css')) ||
      'expected app/layout.tsx and app/globals.css',
  },
  {
    id: 'A2',
    desc: 'TypeScript strict mode enabled',
    run: (c) => /"strict"\s*:\s*true/.test(c.read('tsconfig.json')) || 'tsconfig.json missing "strict": true',
  },
  {
    id: 'A3',
    desc: 'Tailwind v4 wired through PostCSS',
    run: (c) =>
      /@tailwindcss\/postcss/.test(c.read('postcss.config.mjs')) || 'postcss.config.mjs must use @tailwindcss/postcss',
  },
  {
    id: 'A4',
    desc: 'Path alias @/* configured',
    run: (c) => /"@\/\*"/.test(c.read('tsconfig.json')) || 'tsconfig.json missing "@/*" path alias',
  },
  {
    id: 'A5',
    desc: 'ESLint + Prettier configured',
    run: (c) =>
      (c.exists('eslint.config.mjs') && (c.exists('.prettierrc') || c.exists('.prettierrc.json'))) ||
      'need eslint.config.mjs and a .prettierrc',
  },
  {
    id: 'A6',
    desc: 'plan.md folder structure present (components/{ui,motion,layout,sections}, lib/utils, content, styles)',
    run: (c) => {
      const need = [
        'components/ui',
        'components/motion',
        'components/layout',
        'components/sections',
        'lib/utils',
        'content',
        'styles',
      ];
      const missing = need.filter((d) => !c.exists(d));
      return missing.length === 0 || `missing folders: ${missing.join(', ')}`;
    },
  },

  // ---------------- B. Dual-brand token system ----------------
  {
    id: 'B1',
    desc: 'styles/tokens.css exists and is imported by globals.css',
    run: (c) =>
      (c.exists('styles/tokens.css') && /tokens\.css/.test(c.read('app/globals.css'))) ||
      'styles/tokens.css must exist and be imported from app/globals.css',
  },
  {
    id: 'B2',
    desc: 'Confirmed brand colors present verbatim (#ADFF2A / #FFFFFF / #000000)',
    run: (c) => {
      const t = c.read('styles/tokens.css');
      const missing = ['#ADFF2A', '#FFFFFF', '#000000'].filter((h) => !t.toUpperCase().includes(h));
      return missing.length === 0 || `tokens.css missing: ${missing.join(', ')}`;
    },
  },
  {
    id: 'B3',
    desc: 'data-brand="productions" AND data-brand="society" token maps both defined',
    run: (c) => {
      const t = c.read('styles/tokens.css');
      const hasP = /\[data-brand=["']productions["']\]/.test(t);
      const hasS = /\[data-brand=["']society["']\]/.test(t);
      if (hasP && hasS) return true;
      return `tokens.css missing map(s): ${!hasP ? 'productions ' : ''}${!hasS ? 'society' : ''}`;
    },
  },
  {
    id: 'B4',
    desc: 'The two brand maps actually diverge (society is not a copy of productions)',
    run: (c) => {
      const t = c.read('styles/tokens.css');
      const grab = (mode) => {
        const m = t.match(new RegExp(`\\[data-brand=["']${mode}["']\\][^{]*\\{([^}]*)\\}`));
        return m ? m[1].trim() : '';
      };
      const p = grab('productions');
      const s = grab('society');
      if (!p || !s) return 'could not parse one of the brand blocks';
      if (p === s) return 'productions and society token blocks are identical — no real dual-brand system';
      const declCount = (b) => b.split(';').filter((x) => x.includes('--')).length;
      if (declCount(s) < 6) return `society block only re-maps ${declCount(s)} tokens — too thin to be a real mood`;
      return true;
    },
  },
  {
    id: 'B5',
    desc: 'Motion tokens (durations + easings) defined in tokens.css',
    run: (c) => {
      const t = c.read('styles/tokens.css');
      const hasDur = /--dur-/.test(t);
      const hasEase = /--ease-/.test(t);
      return (hasDur && hasEase) || `missing ${!hasDur ? '--dur-* ' : ''}${!hasEase ? '--ease-*' : ''} motion tokens`;
    },
  },

  // ---------------- C. Fonts + BrandProvider ----------------
  {
    id: 'C1',
    desc: 'next/font wired with three faces (productions display, society serif display, body)',
    run: (c) => {
      const f = c.read('lib/fonts.ts') || c.read('app/fonts.ts');
      if (!f) return 'expected lib/fonts.ts declaring the three faces via next/font';
      if (!/next\/font/.test(f)) return 'lib/fonts.ts does not import from next/font';
      const vars = f.match(/variable:\s*['"]--font-[a-z-]+['"]/g) || [];
      return vars.length >= 3 || `only ${vars.length} font CSS variables declared, need 3 (display/serif/body)`;
    },
  },
  {
    id: 'C2',
    desc: 'BrandProvider exists and applies the data-brand attribute',
    run: (c) => {
      const f = c.read('components/layout/BrandProvider.tsx');
      if (!f) return 'components/layout/BrandProvider.tsx not found';
      return /data-brand/.test(f) || 'BrandProvider does not set data-brand';
    },
  },
  {
    id: 'C3',
    desc: 'Root layout applies font variables and a default data-brand',
    run: (c) => {
      const f = c.read('app/layout.tsx');
      const hasFont = /\.variable/.test(f) || /font-/.test(f);
      const hasBrand = /data-brand/.test(f) || /BrandProvider/.test(f);
      return (hasFont && hasBrand) || `root layout missing ${!hasFont ? 'font variables ' : ''}${!hasBrand ? 'data-brand' : ''}`;
    },
  },

  // ---------------- D. Motion foundation ----------------
  {
    id: 'D1',
    desc: 'framer-motion, lenis and gsap installed',
    run: (c) => {
      const d = c.deps();
      const missing = ['framer-motion', 'lenis', 'gsap'].filter((p) => !d[p]);
      return missing.length === 0 || `not in package.json: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'Lenis smooth scroll provider exists and is mounted in the root layout',
    run: (c) => {
      const f = c.read('components/layout/SmoothScroll.tsx');
      if (!f) return 'components/layout/SmoothScroll.tsx not found';
      if (!/lenis/i.test(f)) return 'SmoothScroll does not use lenis';
      return /SmoothScroll/.test(c.read('app/layout.tsx')) || 'SmoothScroll not mounted in app/layout.tsx';
    },
  },
  {
    id: 'D3',
    desc: 'Central reduced-motion policy module exists',
    run: (c) => {
      const f = c.read('components/motion/use-reduced-motion.ts');
      if (!f) return 'components/motion/use-reduced-motion.ts not found';
      return (
        /prefers-reduced-motion/.test(f) || 'the policy module must query the prefers-reduced-motion media feature'
      );
    },
  },
  {
    id: 'D4',
    desc: 'Global CSS reduced-motion kill-switch present',
    run: (c) => {
      const g = c.read('app/globals.css') + c.read('styles/tokens.css');
      return (
        /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(g) ||
        'no @media (prefers-reduced-motion: reduce) block in globals.css/tokens.css'
      );
    },
  },
  {
    id: 'D5',
    desc: 'Lenis itself is disabled under reduced motion',
    run: (c) => {
      const f = c.read('components/layout/SmoothScroll.tsx');
      return (
        /reduced|prefers-reduced-motion/i.test(f) ||
        'SmoothScroll must bail out when the user prefers reduced motion (smooth scroll is scroll hijacking)'
      );
    },
  },
  {
    id: 'D6',
    desc: `All 9 shared motion primitives exist and are re-exported from components/motion/index.ts`,
    run: (c) => {
      const missingFiles = PRIMITIVES.filter((p) => !c.exists(`components/motion/${p}.tsx`));
      if (missingFiles.length) return `missing primitive files: ${missingFiles.join(', ')}`;
      const idx = c.read('components/motion/index.ts');
      if (!idx) return 'components/motion/index.ts barrel not found';
      const notExported = PRIMITIVES.filter((p) => !idx.includes(p));
      return notExported.length === 0 || `not exported from barrel: ${notExported.join(', ')}`;
    },
  },
  {
    id: 'D7',
    desc: 'Every motion primitive honours the reduced-motion policy at the primitive level',
    run: (c) => {
      const bad = MOTION_SENSITIVE.filter((p) => {
        const f = c.read(`components/motion/${p}.tsx`);
        return !/useReducedMotionSafe|prefers-reduced-motion|useReducedMotion/.test(f);
      });
      return bad.length === 0 || `these primitives ignore reduced motion: ${bad.join(', ')}`;
    },
  },
  {
    id: 'D8',
    desc: 'GSAP is code-split — no static top-level gsap import anywhere outside the loader',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => {
        if (f.endsWith('components/motion/gsap-loader.ts')) return false;
        return /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f));
      });
      if (offenders.length) return `static gsap import in: ${offenders.join(', ')} (must go through gsap-loader)`;
      const loader = c.read('components/motion/gsap-loader.ts');
      if (!loader) return 'components/motion/gsap-loader.ts not found';
      return /await import\(|import\(/.test(loader) || 'gsap-loader must use a dynamic import()';
    },
  },
  {
    id: 'D9',
    desc: 'Motion tokens are consumed from a single TS source (no magic durations scattered in primitives)',
    run: (c) => {
      const f = c.read('components/motion/motion-tokens.ts');
      if (!f) return 'components/motion/motion-tokens.ts not found';
      const users = PRIMITIVES.filter((p) => /motion-tokens/.test(c.read(`components/motion/${p}.tsx`)));
      return users.length >= 5 || `only ${users.length} primitives import motion-tokens — motion language is not shared`;
    },
  },

  // ---------------- E. Navigation + routes ----------------
  {
    id: 'E1',
    desc: 'Navbar exists and is driven by a single nav source listing all 6 destinations',
    run: (c) => {
      const nav = c.read('content/nav.ts');
      if (!nav) return 'content/nav.ts not found';
      const need = ['/about', '/services', '/portfolio', '/society', '/contact'];
      const missing = need.filter((h) => !nav.includes(h));
      if (missing.length) return `nav source missing hrefs: ${missing.join(', ')}`;
      const bar = c.read('components/layout/Navbar.tsx');
      if (!bar) return 'components/layout/Navbar.tsx not found';
      return /content\/nav|nav['"]/.test(bar) || 'Navbar does not consume content/nav.ts';
    },
  },
  {
    id: 'E2',
    desc: 'Animated mobile menu exists with correct a11y wiring (aria-expanded + aria-controls)',
    run: (c) => {
      const f = c.read('components/layout/MobileMenu.tsx') + c.read('components/layout/Navbar.tsx');
      if (!f) return 'MobileMenu.tsx not found';
      const hasExpanded = /aria-expanded/.test(f);
      const hasControls = /aria-controls/.test(f);
      return (
        (hasExpanded && hasControls) ||
        `mobile menu missing ${!hasExpanded ? 'aria-expanded ' : ''}${!hasControls ? 'aria-controls' : ''}`
      );
    },
  },
  {
    id: 'E3',
    desc: 'All 7 routes exist as real pages (6 nav destinations + collaborations)',
    run: (c) => {
      const map = {
        '/': 'app/(site)/page.tsx',
        '/about': 'app/(site)/about/page.tsx',
        '/services': 'app/(site)/services/page.tsx',
        '/portfolio': 'app/(site)/portfolio/page.tsx',
        '/society': 'app/(site)/society/page.tsx',
        '/collaborations': 'app/(site)/collaborations/page.tsx',
        '/contact': 'app/(site)/contact/page.tsx',
      };
      const missing = Object.entries(map).filter(([, p]) => !c.exists(p)).map(([r]) => r);
      return missing.length === 0 || `missing route files for: ${missing.join(', ')}`;
    },
  },
  {
    id: 'E4',
    desc: 'Society route runs in society (elegant) mode; landing runs in productions mode',
    run: (c) => {
      const soc = c.read('app/(site)/society/page.tsx') + c.read('app/(site)/society/layout.tsx');
      if (!/society/.test(soc) || !/data-brand|brand=/.test(soc)) {
        return 'society route does not declare the society brand mode';
      }
      return true;
    },
  },
  {
    id: 'E5',
    desc: 'Footer exists with the "Developed by" credit banner and a labelled placeholder URL',
    run: (c) => {
      const f = c.read('components/layout/Footer.tsx');
      if (!f) return 'components/layout/Footer.tsx not found';
      if (!/Developed by/i.test(f)) return 'Footer missing the "Developed by" credit banner';
      return /TODO|PLACEHOLDER|BLOCKER/i.test(f) || 'credit banner must carry a clearly-labelled placeholder for the agency logo/URL (client data not yet supplied)';
    },
  },

  // ---------------- F. Landing ----------------
  {
    id: 'F1',
    desc: 'Landing composes at least 5 distinct sections (visual rhythm, not one repeated block)',
    run: (c) => {
      const page = c.read('app/(site)/page.tsx');
      if (!page) return 'landing page not found';
      const sectionImports = (page.match(/@\/components\/sections\//g) || []).length;
      return sectionImports >= 5 || `landing only composes ${sectionImports} section components — needs >= 5 for real rhythm`;
    },
  },
  {
    id: 'F2',
    desc: 'Landing sections are built FROM the shared primitives (not hand-rolled animation)',
    run: (c) => {
      const files = c.walk('components/sections').filter((f) => f.endsWith('.tsx'));
      if (files.length < 5) return `only ${files.length} section components exist`;
      const users = files.filter((f) => /@\/components\/motion/.test(c.read(f)));
      return (
        users.length >= Math.ceil(files.length * 0.6) ||
        `only ${users.length}/${files.length} sections import the shared motion primitives`
      );
    },
  },
  {
    id: 'F3',
    desc: 'No raw <img> — next/image everywhere (performance budget)',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F4',
    desc: 'Placeholder media is clearly labelled as placeholder (no invented client data)',
    run: (c) => {
      const f = c.read('content/placeholders.ts');
      if (!f) return 'content/placeholders.ts not found — placeholders must be centralised and labelled';
      return /PLACEHOLDER/i.test(f) || 'placeholder content is not marked PLACEHOLDER';
    },
  },
  {
    id: 'F5',
    desc: 'Blockers register exists listing the client data we are missing',
    run: (c) => {
      const f = c.read('BLOCKERS.md');
      if (!f) return 'BLOCKERS.md not found at repo root';
      const need = ['logo', 'photo', 'SMTP', 'Firebase', 'domain', 'GitHub'];
      const missing = need.filter((k) => !new RegExp(k, 'i').test(f));
      return missing.length === 0 || `BLOCKERS.md does not mention: ${missing.join(', ')}`;
    },
  },
  {
    id: 'F6',
    desc: 'No horizontal overflow escape hatch missing (oversized type must be clipped)',
    run: (c) => {
      const g = c.read('app/globals.css');
      return /overflow-x:\s*(hidden|clip)/.test(g) || 'globals.css must clip horizontal overflow (huge display type will otherwise scroll the page sideways)';
    },
  },

  // ---------------- G. Scope guards (M1 must NOT contain these) ----------------
  {
    id: 'G1',
    desc: 'SCOPE: no database/email dependencies yet (M3 work)',
    run: (c) => {
      const d = c.deps();
      const bad = ['firebase', 'firebase-admin', 'nodemailer'].filter((p) => d[p]);
      return bad.length === 0 || `M1 must not install: ${bad.join(', ')}`;
    },
  },
  {
    id: 'G2',
    desc: 'SCOPE: no API routes and no admin area (M3 / Developer 2 work)',
    run: (c) => {
      const bad = [];
      if (c.exists('app/api')) bad.push('app/api');
      if (c.exists('app/admin')) bad.push('app/admin');
      return bad.length === 0 || `out of M1 scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'G3',
    desc: 'SCOPE: no booking/inquiry form yet (M3 work)',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => /<form[\s>]/i.test(c.read(f)));
      return offenders.length === 0 || `form element found in: ${offenders.join(', ')} — booking form is M3`;
    },
  },
  {
    id: 'G4',
    desc: 'SCOPE: no SEO/tracking/deployment artefacts yet (Developer 2 SEO + M4)',
    run: (c) => {
      const bad = [];
      for (const p of ['app/sitemap.ts', 'app/robots.ts', 'app/sitemap.xml', 'vercel.json']) {
        if (c.exists(p)) bad.push(p);
      }
      const pixel = srcFiles(c).filter((f) => /fbq\(|connect\.facebook\.net|gtag\(/.test(c.read(f)));
      if (pixel.length) bad.push(`tracking pixel in ${pixel.join(', ')}`);
      return bad.length === 0 || `out of M1 scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'G5',
    desc: 'SECURITY: no committed credentials, .env ignored',
    run: (c) => {
      const gi = c.read('.gitignore');
      if (!/\.env/.test(gi)) return '.gitignore does not ignore .env files';
      const secretish = srcFiles(c).filter((f) => {
        const t = c.read(f);
        return /(api[_-]?key|secret|password|smtp_pass)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]/i.test(t);
      });
      return secretish.length === 0 || `possible hardcoded secret in: ${secretish.join(', ')}`;
    },
  },
];

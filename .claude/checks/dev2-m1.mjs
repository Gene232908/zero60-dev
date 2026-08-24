/**
 * DEVELOPER 2 — MILESTONE 1 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: Task Division Rev 2, p.2, "Developer 2" table.
 *
 *   HARD    Responsive layout system + breakpoints (on the shared tokens) so the
 *           landing page works on phone, tablet and desktop
 *   MEDIUM  Lower landing sections: services preview, about preview,
 *           call to action, footer
 *   MEDIUM  Compose the landing scroll choreography (reveals, parallax, marquee,
 *           smooth scrolling) FROM Developer 1's primitives — no second
 *           animation approach
 *   EASY    Shared small components on the tokens: buttons, section headings,
 *           dividers
 *   EASY    Check the landing page on phone/tablet/desktop, fix spacing, verify
 *           the reduced-motion path
 *
 * OWNERSHIP NOTE (recorded so the seam is not silently crossed):
 * Developer 1 already shipped `FinalCTA` and `Footer` as part of their own M1
 * landing/chrome work. Rev 2 p.6 says "Do not review or correct the other
 * developer's tasks", so Developer 2 does NOT rewrite them. Check B4 asserts
 * they survive untouched; Developer 2's CTA contribution is the mid-page
 * conversion band that leads into Developer 1's closing climax.
 */

export const title = 'Responsive layout system, lower landing sections, scroll choreography, UI atoms';

export const brief = `DEVELOPER 2 — MILESTONE 1 TASKS (Task Division Rev 2, p.2):
  [HARD]   Responsive layout system + breakpoints built on styles/tokens.css, so the
           landing page holds up on phone / tablet / desktop.
  [MEDIUM] Lower landing sections: services preview, about preview, CTA band.
           Do NOT rewrite Developer 1's FinalCTA or Footer — they are already shipped.
  [MEDIUM] Landing scroll choreography composed ONLY from @/components/motion
           (Reveal, Parallax, Marquee, KineticHeading...). No second animation approach.
  [EASY]   Shared UI atoms on the tokens: Button, SectionHeading, Divider.
  [EASY]   Responsive + reduced-motion verification, recorded in docs/DEV2-QA.md.
Rules: no hardcoded colours/durations (use the tokens), next/image only,
GSAP only via loadGsap(), and Portfolio/Collaborations stay stubs until M2.`;

export const routes = [
  { path: '/', expect: ['data-brand="productions"', 'Two houses'] },
  { path: '/about', expect: 'Complete event mastery' },
  { path: '/services', expect: 'Sound Engineering' },
  { path: '/society', expect: 'data-brand="society"' },
  { path: '/contact', expect: 'Estimated guests' },
  { path: '/portfolio', expect: 'Milestone 2' },
  { path: '/collaborations', expect: 'Milestone 2' },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

/** Files Developer 2 adds this milestone. */
const UI_ATOMS = [
  'components/ui/Button.tsx',
  'components/ui/SectionHeading.tsx',
  'components/ui/Divider.tsx',
];

const DEV2_SECTIONS = [
  'components/sections/ServicesPreview.tsx',
  'components/sections/AboutPreview.tsx',
  'components/sections/CTABand.tsx',
];

/** A literal hex colour outside the token file defeats the dual-brand system. */
const HEX = /#[0-9a-fA-F]{3,8}\b/;
/** A raw ms/s duration in a class or style bypasses the motion grammar. */
const RAW_DURATION = /(?:duration|transition)[-:]\s*\[?\d+m?s/;

export const checks = [
  // ================= A. Responsive layout system (HARD) =================
  {
    id: 'A1',
    desc: 'A single responsive/breakpoint layer exists and is imported by globals.css',
    run: (c) => {
      if (!c.exists('styles/responsive.css')) return 'styles/responsive.css not found';
      const g = c.read('app/globals.css');
      return /responsive\.css/.test(g) || 'app/globals.css does not import styles/responsive.css';
    },
  },
  {
    id: 'A2',
    desc: 'Breakpoints are declared ONCE as named tokens (sm/md/lg/xl), not scattered magic numbers',
    run: (c) => {
      const r = c.read('styles/responsive.css');
      const missing = ['sm', 'md', 'lg', 'xl'].filter((b) => !new RegExp(`--bp-${b}\\s*:`).test(r));
      return missing.length === 0 || `no --bp-${missing.join(', --bp-')} token in styles/responsive.css`;
    },
  },
  {
    id: 'A3',
    desc: 'Tailwind breakpoints are derived from the same tokens (one source, not two)',
    run: (c) => {
      const g = c.read('app/globals.css');
      if (!/@theme/.test(g)) return 'app/globals.css has no @theme block declaring the breakpoints';
      const missing = ['sm', 'md', 'lg', 'xl'].filter((b) => !new RegExp(`--breakpoint-${b}\\s*:`).test(g));
      return missing.length === 0 || `@theme does not declare --breakpoint-${missing.join(', --breakpoint-')}`;
    },
  },
  {
    id: 'A4',
    desc: 'A responsive Section primitive exists on the tokens',
    run: (c) => c.exists('components/ui/Section.tsx') || 'components/ui/Section.tsx not found',
  },
  {
    id: 'A5',
    desc: 'A responsive editorial Grid primitive exists, with per-breakpoint columns',
    run: (c) => {
      if (!c.exists('components/ui/Grid.tsx')) return 'components/ui/Grid.tsx not found';
      const g = c.read('components/ui/Grid.tsx');
      return /\b(sm|md|lg):/.test(g) || 'Grid declares no responsive variants — it is not a responsive grid';
    },
  },
  {
    id: 'A6',
    desc: 'Fluid sizing: the responsive layer uses clamp(), not fixed desktop pixels',
    run: (c) => {
      const r = c.read('styles/responsive.css');
      return /clamp\(/.test(r) || 'styles/responsive.css contains no clamp() — sizing is not fluid';
    },
  },
  {
    id: 'A7',
    desc: 'Every landing section carries responsive variants (nothing is desktop-only)',
    run: (c) => {
      const home = c.read('app/(site)/page.tsx');
      const mounted = [...home.matchAll(/<([A-Z]\w+)\s*\/>/g)].map((m) => m[1]);
      const bad = [];
      for (const name of mounted) {
        const file = `components/sections/${name}.tsx`;
        if (!c.exists(file)) continue;
        const src = c.read(file);
        if (!/\b(sm|md|lg|xl):/.test(src)) bad.push(name);
      }
      return bad.length === 0 || `landing sections with no responsive variants: ${bad.join(', ')}`;
    },
  },
  {
    id: 'A8',
    desc: 'No fixed-pixel layout widths (they break the phone/tablet path)',
    run: (c) => {
      const offenders = c
        .srcFiles()
        .filter((f) => /\b(w|min-w|max-w)-\[\s*\d{3,}px\s*\]/.test(c.read(f)));
      return offenders.length === 0 || `fixed pixel layout width in: ${offenders.join(', ')}`;
    },
  },

  // ================= B. Lower landing sections (MEDIUM) =================
  {
    id: 'B1',
    desc: 'Lower landing sections exist: services preview, about preview, CTA band',
    run: (c) => {
      const missing = DEV2_SECTIONS.filter((f) => !c.exists(f));
      return missing.length === 0 || `not found: ${missing.join(', ')}`;
    },
  },
  {
    id: 'B2',
    desc: 'All three are actually mounted on the landing page (built, not orphaned)',
    run: (c) => {
      const home = c.read('app/(site)/page.tsx');
      const missing = DEV2_SECTIONS.map((f) => f.split('/').pop().replace('.tsx', '')).filter(
        (n) => !new RegExp(`<${n}\\b`).test(home),
      );
      return missing.length === 0 || `built but never rendered on the landing page: ${missing.join(', ')}`;
    },
  },
  {
    id: 'B3',
    desc: 'The previews use the real client content, not invented filler',
    run: (c) => {
      const sp = c.read('components/sections/ServicesPreview.tsx');
      const ap = c.read('components/sections/AboutPreview.tsx');
      if (!/@\/content\/site/.test(sp)) return 'ServicesPreview does not read from content/site.ts';
      if (!/SERVICES|SERVICE_RAIL/.test(sp)) return 'ServicesPreview does not use the SERVICES content';
      if (!/@\/content\/site/.test(ap)) return 'AboutPreview does not read from content/site.ts';
      return true;
    },
  },
  {
    id: 'B4',
    desc: "SCOPE: Developer 1's FinalCTA and Footer are left intact (Rev 2 p.6 — one owner per task)",
    run: (c) => {
      if (!c.exists('components/sections/FinalCTA.tsx')) return "Developer 1's FinalCTA.tsx was deleted";
      if (!c.exists('components/layout/Footer.tsx')) return "Developer 1's Footer.tsx was deleted";
      const f = c.read('components/layout/Footer.tsx');
      if (!/FOOTER_CREDIT_PLACEHOLDER/.test(f)) return "the Developer 1 footer credit banner was removed from Footer.tsx";
      const home = c.read('app/(site)/page.tsx');
      return /<FinalCTA\b/.test(home) || 'FinalCTA is no longer rendered on the landing page';
    },
  },

  // ================= C. Scroll choreography (MEDIUM) =================
  {
    id: 'C1',
    desc: "Developer 2's sections compose from the shared motion library",
    run: (c) => {
      const bad = DEV2_SECTIONS.filter((f) => c.exists(f) && !/@\/components\/motion/.test(c.read(f)));
      return bad.length === 0 || `no @/components/motion import in: ${bad.join(', ')}`;
    },
  },
  {
    id: 'C2',
    desc: 'NO second animation approach: framer-motion is never imported directly by a section',
    run: (c) => {
      const offenders = [...c.walk('components/sections'), ...c.walk('components/ui')].filter((f) => {
        const src = c.read(f);
        return /from\s+['"]framer-motion['"]/.test(src) && !/@\/components\/motion/.test(src);
      });
      return offenders.length === 0 || `direct framer-motion use outside the shared library: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'C3',
    desc: 'GSAP stays code-split (static import only in the loader)',
    run: (c) => {
      const offenders = c
        .srcFiles()
        .filter((f) => !f.endsWith('components/motion/gsap-loader.ts') && /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)));
      return offenders.length === 0 || `static gsap import in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'C4',
    desc: 'The landing choreography actually uses the primitive vocabulary (reveal, parallax, marquee)',
    run: (c) => {
      const src = DEV2_SECTIONS.filter((f) => c.exists(f)).map((f) => c.read(f)).join('\n');
      const missing = ['Reveal', 'Parallax', 'Marquee'].filter((p) => !new RegExp(`<${p}\\b`).test(src));
      return missing.length === 0 || `landing choreography never uses: ${missing.join(', ')}`;
    },
  },
  {
    id: 'C5',
    desc: 'Smooth scrolling is Developer 1\'s Lenis mount — not re-implemented',
    run: (c) => {
      const offenders = c
        .srcFiles()
        .filter((f) => !/components\/layout\/SmoothScroll\.tsx$/.test(f) && /from\s+['"]lenis['"]/.test(c.read(f)));
      return offenders.length === 0 || `a second Lenis instance is being created in: ${offenders.join(', ')}`;
    },
  },

  // ================= D. Shared UI atoms (EASY) =================
  {
    id: 'D1',
    desc: 'Button, SectionHeading and Divider exist in components/ui',
    run: (c) => {
      const missing = UI_ATOMS.filter((f) => !c.exists(f));
      return missing.length === 0 || `not found: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'They are exported from a components/ui barrel',
    run: (c) => {
      const idx = c.read('components/ui/index.ts');
      if (!idx) return 'components/ui/index.ts not found';
      const missing = ['Button', 'SectionHeading', 'Divider', 'Section', 'Grid', 'Container'].filter(
        (n) => !new RegExp(`\\b${n}\\b`).test(idx),
      );
      return missing.length === 0 || `not exported from components/ui/index.ts: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D3',
    desc: 'The atoms are token-driven: no hardcoded hex colour anywhere in components/ui',
    run: (c) => {
      const offenders = c.walk('components/ui').filter((f) => /\.tsx?$/.test(f) && HEX.test(c.stripComments(c.read(f))));
      return offenders.length === 0 || `hardcoded hex colour (must use the brand tokens) in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'D4',
    desc: 'No raw durations: timing comes from the motion tokens',
    run: (c) => {
      const offenders = [...c.walk('components/ui'), ...DEV2_SECTIONS.filter((f) => c.exists(f))]
        .filter((f) => /\.tsx?$/.test(f))
        .filter((f) => RAW_DURATION.test(c.stripComments(c.read(f))));
      return offenders.length === 0 || `raw duration instead of a --dur-* / DUR token in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'D5',
    desc: 'Button is genuinely reusable: variants and an accessible disabled/link path',
    run: (c) => {
      const b = c.read('components/ui/Button.tsx');
      if (!/variant/.test(b)) return 'Button exposes no variant prop — it is not a shared component';
      if (!/next\/link|href/.test(b)) return 'Button cannot render as a link (href/next-link path missing)';
      return true;
    },
  },
  {
    id: 'D6',
    desc: 'The atoms are actually used by the landing sections (not dead code)',
    run: (c) => {
      const src = DEV2_SECTIONS.filter((f) => c.exists(f)).map((f) => c.read(f)).join('\n');
      const unused = ['SectionHeading', 'Divider'].filter((n) => !new RegExp(`<${n}\\b`).test(src));
      return unused.length === 0 || `atom built but never used in the landing sections: ${unused.join(', ')}`;
    },
  },

  // ================= E. Responsive + reduced-motion QA (EASY) =================
  {
    id: 'E1',
    desc: 'Every animated client component honours prefers-reduced-motion',
    run: (c) => {
      const animated = c
        .srcFiles()
        .filter((f) => /^components\/(sections|ui|layout)\//.test(f))
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
    id: 'E2',
    desc: 'The responsive + reduced-motion QA pass is recorded, with the viewports actually checked',
    run: (c) => {
      const q = c.read('docs/DEV2-QA.md');
      if (!q) return 'docs/DEV2-QA.md not found — the EASY QA task has no evidence';
      const missing = ['phone', 'tablet', 'desktop', 'reduced'].filter((k) => !new RegExp(k, 'i').test(q));
      return missing.length === 0 || `docs/DEV2-QA.md does not cover: ${missing.join(', ')}`;
    },
  },
  {
    id: 'E3',
    desc: 'No raw <img> — next/image everywhere',
    run: (c) => {
      const offenders = c.srcFiles().filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'E4',
    desc: 'No invented client data (the placeholder discipline still holds)',
    run: (c) => {
      const src = DEV2_SECTIONS.filter((f) => c.exists(f)).map((f) => `${f}\n${c.read(f)}`).join('\n');
      const invented = /(lorem ipsum|John Doe|example\.com|\+1\s?555)/i.exec(src);
      return !invented || `invented placeholder data "${invented[0]}" — use content/placeholders.ts instead`;
    },
  },

  // ================= F. Milestone ordering (Rev 2 p.6) =================
  {
    id: 'F1',
    desc: 'SCOPE: Portfolio and Collaborations are still stubs — they are Milestone 2 work',
    run: (c) => {
      const bad = ['app/(site)/portfolio/page.tsx', 'app/(site)/collaborations/page.tsx'].filter(
        (f) => !/RouteStub/.test(c.read(f)),
      );
      return (
        bad.length === 0 ||
        `${bad.join(', ')} was built early. Rev 2 p.6: "Finish your milestone tasks before starting anything from the next milestone."`
      );
    },
  },
  {
    id: 'F2',
    desc: 'SCOPE: no admin side yet (Milestone 3) and no SEO artefacts yet (Milestone 4)',
    run: (c) => {
      if (c.exists('app/admin')) return 'app/admin exists — the admin side is Milestone 3, not Milestone 1';
      const seo = ['app/sitemap.ts', 'app/robots.ts'].filter((f) => c.exists(f));
      return seo.length === 0 || `${seo.join(', ')} exists — full SEO is Milestone 4`;
    },
  },
];

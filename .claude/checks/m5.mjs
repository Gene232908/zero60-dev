/**
 * MILESTONE 5 ACCEPTANCE CHECKLIST — the de-templating craft pass (mechanical).
 *
 * Brief: enhance the existing site so it stops reading as a competent template,
 * WITHOUT redesigning it. Layout, section order, copy and the client-confirmed
 * palette are frozen; motion, interaction states and detail are the work.
 *
 * That brief splits cleanly in two, and this file is only the first half:
 *
 *   MECHANICAL (here)  — states that do not exist, curves that are the stock
 *                        four, idioms lifted straight from a starter kit, and
 *                        the structural contract that proves nothing was
 *                        redesigned. All grep-able, costs no tokens, and cannot
 *                        be talked out of a verdict.
 *   TASTE (judge)      — "does this read as handcrafted?" runs in gate.mjs as a
 *                        separate headless Claude against .claude/judge-rubric.md.
 *
 * Neither half alone is sufficient. The mechanical checks can be satisfied by a
 * section that is technically distinct and still soulless; the judge alone can be
 * sweet-talked. Both must be green.
 *
 * Baseline: .claude/design-baseline.json, captured at dda4cf8 BEFORE any craft
 * work. Group D diffs against it — that is what makes "don't redesign" a fact
 * rather than a promise.
 */

export const title = 'De-templating craft pass — motion signature, interaction states, detail';

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

// ---------------------------------------------------------------- helpers

/** A guard that cannot tell prose from code punishes good comments. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const code = (ctx, p) => stripComments(ctx.read(p));

const baseline = (ctx) => {
  try {
    return JSON.parse(ctx.read('.claude/design-baseline.json'));
  } catch {
    return null;
  }
};

/** Developer 1's sections. RouteStub is Developer 2's placeholder — not ours to craft. */
const DEV1_SECTIONS = [
  'AboutHero', 'AboutStory', 'AboutTiles', 'BookingSection', 'DualBrandSplit',
  'EventIndex', 'FinalCTA', 'Hero', 'Manifesto', 'ServiceTicker', 'ServicesBento',
  'ServicesHero', 'ServicesLedger', 'SocietyCTA', 'SocietyCategories',
  'SocietyGallery', 'SocietyHero', 'SocietyStatement',
];

/**
 * The four curves the site shipped with, plus the framework/browser defaults.
 * All are the generic easeOut/easeQuint family every starter kit uses — which is
 * precisely why a "signature" curve that merely aliases one proves nothing.
 */
const STOCK_CURVES = [
  '0.16,1,0.3,1',
  '0.65,0,0.35,1',
  '0.22,1,0.36,1',
  '0.55,0,1,0.45',
  '0.4,0,0.2,1',
  '0.25,0.1,0.25,1',
  '0.42,0,0.58,1',
  '0,0,1,1',
];

const SIGNATURE_NAMES = ['signature', 'anticipate', 'overshoot', 'refined'];

/**
 * What the taste half of the gate grades. Same roster as DEV1_SECTIONS — the
 * judge is asked about exactly the sections this pass is allowed to touch, so a
 * Developer 2 stub can never drag the verdict red.
 */
export const judgeSections = DEV1_SECTIONS;

const normCurve = (s) => s.replace(/\s+/g, '');

/** Every cubic-bezier declaration in tokens.css, keyed by token name. */
function cssCurves(ctx) {
  const out = {};
  for (const m of code(ctx, 'styles/tokens.css').matchAll(
    /--ease-([a-z-]+):\s*cubic-bezier\(([^)]+)\)/g,
  )) {
    out[m[1]] = normCurve(m[2]);
  }
  return out;
}

/** Every 4-number bezier array in motion-tokens.ts, keyed by its property name. */
function jsCurves(ctx) {
  const out = {};
  for (const m of code(ctx, 'components/motion/motion-tokens.ts').matchAll(
    /([a-zA-Z]+)\s*:\s*\[\s*([0-9.,\s-]+?)\s*\]/g,
  )) {
    const parts = m[2].split(',').map((s) => s.trim());
    if (parts.length === 4 && parts.every((p) => p !== '' && !Number.isNaN(Number(p)))) {
      out[m[1]] = normCurve(m[2]);
    }
  }
  return out;
}

const tsxFiles = (ctx) =>
  [...ctx.walk('app'), ...ctx.walk('components')].filter((f) => /\.tsx$/.test(f));

const list = (arr, n = 6) =>
  arr.slice(0, n).join(', ') + (arr.length > n ? ` (+${arr.length - n} more)` : '');

// ---------------------------------------------------------------- checks

export const checks = [
  // ========== A. Interaction states — the site shipped with hover only ==========
  {
    id: 'A1',
    desc: 'MagneticButton has a distinct PRESSED state, not just hover',
    run: (ctx) => {
      const src = code(ctx, 'components/motion/MagneticButton.tsx');
      const pressed = /active:/.test(src) || /whileTap/.test(src) || /data-pressed/.test(src);
      return pressed ||
        'no pressed state — a control that does not answer the click reads as a template. Add active:/whileTap that is physically distinct from hover (press in; do not just dim).';
    },
  },
  {
    id: 'A2',
    desc: 'MagneticButton carries its own focus-visible treatment, not just the global outline',
    run: (ctx) =>
      /focus-visible[:-]/.test(code(ctx, 'components/motion/MagneticButton.tsx')) ||
      'the only focus styling is the blanket :focus-visible outline in globals.css. The primary control should own a focus treatment that fits it.',
  },
  {
    id: 'A3',
    desc: 'MagneticButton supports a real disabled state (prop + styling + semantics)',
    run: (ctx) => {
      const src = code(ctx, 'components/motion/MagneticButton.tsx');
      if (!/disabled\??\s*:\s*boolean/.test(src)) return 'no `disabled` prop on the site primary control.';
      if (!/disabled:/.test(src) && !/aria-disabled/.test(src)) {
        return '`disabled` prop exists but nothing renders differently — a disabled control must look disabled.';
      }
      return true;
    },
  },
  {
    id: 'A4',
    desc: 'BookingForm submit LOOKS disabled while submitting, not merely behaves so',
    run: (ctx) => {
      const src = code(ctx, 'components/forms/BookingForm.tsx');
      if (!/disabled=\{busy\}|disabled=\{status/.test(src)) {
        return 'submit button is no longer disabled while in flight — regression.';
      }
      return /disabled:/.test(src) ||
        'submit sets disabled={busy} but has no `disabled:` styling, so a submitting form looks identical to an idle one.';
    },
  },
  {
    id: 'A5',
    desc: 'Form fields have focus and invalid treatments distinct from idle',
    run: (ctx) => {
      const src = code(ctx, 'components/forms/BookingForm.tsx');
      if (!/focus-visible[:-]|focus:/.test(src)) return 'no focus styling on inputs beyond the global outline.';
      if (!/aria-invalid|invalid:|data-invalid/.test(src)) {
        return 'no invalid-state styling — validation errors read as plain text only.';
      }
      return true;
    },
  },
  {
    id: 'A6',
    desc: 'REGRESSION: global :focus-visible floor still present in globals.css',
    run: (ctx) =>
      /:focus-visible\s*\{[^}]*outline/.test(code(ctx, 'app/globals.css')) ||
      'the global keyboard-focus outline was removed — that is an accessibility regression, not a de-templating.',
  },

  // ========== B. Motion signature — stop using only the stock four ==========
  {
    id: 'B1',
    desc: 'tokens.css declares at least 2 signature easing curves beyond the stock set',
    run: (ctx) => {
      const curves = cssCurves(ctx);
      const found = SIGNATURE_NAMES.filter((n) => curves[n]);
      return found.length >= 2 ||
        `tokens.css defines only the generic set (${Object.keys(curves).join(', ')}). Add at least 2 of --ease-signature / --ease-anticipate / --ease-overshoot, chosen for this brand.`;
    },
  },
  {
    id: 'B2',
    desc: 'Signature curves are genuinely NEW values, not aliases of the stock four',
    run: (ctx) => {
      const curves = cssCurves(ctx);
      const sig = SIGNATURE_NAMES.filter((n) => curves[n]);
      if (sig.length < 2) return 'blocked by B1 — signature curves not defined yet.';
      const aliased = sig.filter((n) => STOCK_CURVES.includes(curves[n]));
      return aliased.length === 0 ||
        `these "signature" curves are stock values under a new name: ${aliased.map((n) => `--ease-${n}: ${curves[n]}`).join('; ')}. Renaming a template curve does not de-template it.`;
    },
  },
  {
    id: 'B3',
    desc: 'motion-tokens.ts mirrors the signature curves — CSS and JS motion must not drift',
    run: (ctx) => {
      const css = cssCurves(ctx);
      const js = jsCurves(ctx);
      const sig = SIGNATURE_NAMES.filter((n) => css[n]);
      if (sig.length < 2) return 'blocked by B1.';
      const missing = sig.filter((n) => !js[n]);
      if (missing.length) {
        return `defined in CSS but missing from motion-tokens.ts: ${missing.join(', ')}. That file's own rule is that the two never drift.`;
      }
      const mismatched = sig.filter((n) => js[n] !== css[n]);
      return mismatched.length === 0 ||
        `CSS and JS disagree on: ${mismatched.map((n) => `${n} (css ${css[n]} vs js ${js[n]})`).join('; ')}`;
    },
  },
  {
    id: 'B4',
    desc: 'The stock scale-105/110 image-zoom hover is gone',
    run: (ctx) => {
      const hits = tsxFiles(ctx).filter((f) => /group-hover:scale-1(05|10)\b/.test(code(ctx, f)));
      return hits.length === 0 ||
        `the most template-standard hover in existence is still in: ${list(hits)}. Replace with a reveal that belongs to this content.`;
    },
  },
  {
    id: 'B5',
    desc: 'Reveal offers choreography beyond the original fade/rise/mask/clip set',
    run: (ctx) => {
      const src = code(ctx, 'components/motion/Reveal.tsx');
      const m = src.match(/export type RevealVariant\s*=\s*([^;]+);/);
      if (!m) return 'RevealVariant union not found — was the primitive replaced? This is an enhancement pass.';
      const variants = [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
      const original = ['fade', 'rise', 'mask', 'clip'];
      const dropped = original.filter((v) => !variants.includes(v));
      if (dropped.length) return `original variants must be preserved (enhance, not replace). Missing: ${dropped.join(', ')}`;
      return variants.length > 4 ||
        'Reveal still offers exactly the four original variants, so every section enters the same way. Add choreography that lets a section lead with its own beat.';
    },
  },
  {
    id: 'B6',
    desc: 'REGRESSION: no hardcoded durations or beziers in components — everything via tokens',
    run: (ctx) => {
      const bad = [];
      for (const f of tsxFiles(ctx)) {
        if (f.includes('motion-tokens')) continue;
        // SmoothScroll's `duration` is Lenis's scroll-smoothing constant, not an
        // animation token. Routing it through the DUR scale (which tops out at a
        // 1.2s cinematic reveal) would be a category error, and a gate that flags
        // correct code only teaches the maker to route around the gate.
        if (f.endsWith('components/layout/SmoothScroll.tsx')) continue;
        const src = code(ctx, f);
        if (/duration:\s*[0-9.]+\s*[,}]/.test(src) && !/DUR\./.test(src)) bad.push(`${f} (raw duration)`);
        if (/cubic-bezier\(/.test(src)) bad.push(`${f} (raw cubic-bezier)`);
        if (/duration-\[[0-9]+m?s\]/.test(src)) bad.push(`${f} (raw duration utility)`);
      }
      return bad.length === 0 || `motion values must come from the token layer: ${list(bad)}`;
    },
  },

  // ========== C. Performance + accessibility must not regress ==========
  {
    id: 'C1',
    desc: 'No transition-all anywhere — it animates properties you did not choose',
    run: (ctx) => {
      const hits = tsxFiles(ctx).filter((f) => /\btransition-all\b/.test(code(ctx, f)));
      return hits.length === 0 || `transition-all found in: ${list(hits)}`;
    },
  },
  {
    id: 'C2',
    desc: 'No layout-triggering properties animated (width/height/top/left/margin)',
    run: (ctx) => {
      const bad = tsxFiles(ctx).filter((f) =>
        /transition-\[(?:[^\]]*\b(?:width|height|top|left|right|bottom|margin|padding)\b[^\]]*)\]/.test(code(ctx, f)),
      );
      return bad.length === 0 ||
        `these animate layout properties and will drop frames: ${list(bad)}. Animate transform/opacity/filter instead.`;
    },
  },
  {
    id: 'C3',
    desc: 'REGRESSION: every motion primitive still honours reduced motion',
    run: (ctx) => {
      const prims = ctx
        .walk('components/motion')
        .filter((f) => /\.tsx$/.test(f) && !/index|use-reduced/.test(f));
      const missing = prims.filter((f) => !/useReducedMotionSafe|useFinePointer/.test(code(ctx, f)));
      return missing.length === 0 ||
        `motion primitives with no reduced-motion path: ${list(missing)}. New choreography must degrade too.`;
    },
  },
  {
    id: 'C4',
    desc: 'REGRESSION: prefers-reduced-motion kill-switch still in globals.css',
    run: (ctx) =>
      /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(ctx.read('app/globals.css')) ||
      'the global reduced-motion block is gone — new CSS-driven motion would be unstoppable for users who asked for less.',
  },
  {
    id: 'C5',
    desc: 'will-change used deliberately, not sprayed across the tree',
    run: (ctx) => {
      const hits = tsxFiles(ctx).filter((f) => /will-change/.test(code(ctx, f)));
      return hits.length <= 10 ||
        `will-change appears in ${hits.length} files. Each pins a compositor layer; spraying it costs more than it saves.`;
    },
  },

  // ========== D. ENHANCE, DON'T REPLACE — the structural contract ==========
  {
    id: 'D1',
    desc: 'CONTRACT: every page renders the same sections, in the same order, as the baseline',
    run: async (ctx) => {
      const base = baseline(ctx);
      if (!base) return 'design-baseline.json missing — the no-redesign contract cannot be verified.';
      const mod = await import(new URL('../baseline.mjs', import.meta.url).href).catch(() => null);
      if (!mod?.sectionOrder) return 'baseline.mjs could not be loaded to re-read page structure.';
      const drift = [];
      for (const [name, page] of Object.entries(base.pages)) {
        const now = mod.sectionOrder(ctx.read(page.file));
        if (now.join('>') !== page.sections.join('>')) {
          drift.push(`${name}: baseline [${page.sections.join(' > ')}] but now [${now.join(' > ')}]`);
        }
      }
      return drift.length === 0 ||
        `LAYOUT CHANGED — this is an enhancement pass, not a redesign:\n         ${drift.join('\n         ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'CONTRACT: no section component deleted, renamed or replaced',
    run: (ctx) => {
      const base = baseline(ctx);
      if (!base) return 'design-baseline.json missing.';
      const now = ctx.walk('components/sections').map((f) => f.split('/').pop()).sort();
      const removed = base.sectionFiles.filter((f) => !now.includes(f));
      return removed.length === 0 ||
        `section components removed: ${removed.join(', ')}. Enhance them in place.`;
    },
  },
  {
    id: 'D3',
    desc: 'CONTRACT: client-confirmed palette is byte-identical to the baseline',
    run: async (ctx) => {
      const base = baseline(ctx);
      if (!base) return 'design-baseline.json missing.';
      const mod = await import(new URL('../baseline.mjs', import.meta.url).href).catch(() => null);
      if (!mod?.palette) return 'baseline.mjs could not be loaded.';
      const now = mod.palette(ctx.read('styles/tokens.css'));
      const drift = Object.entries(base.palette).filter(([k, v]) => now[k] !== v);
      return drift.length === 0 ||
        `palette repainted: ${drift.map(([k, v]) => `--${k} was ${v}, now ${now[k] ?? 'MISSING'}`).join('; ')}. The hexes are client-confirmed.`;
    },
  },
  {
    id: 'D4',
    desc: 'SCOPE: Portfolio and Collaborations remain untouched Developer 2 stubs',
    run: (ctx) => {
      for (const p of ['app/(site)/portfolio/page.tsx', 'app/(site)/collaborations/page.tsx']) {
        const src = code(ctx, p);
        if (!/RouteStub/.test(src) || !/owner="Developer 2"/.test(src)) {
          return `${p} is no longer a Developer 2 RouteStub — out of scope for this pass.`;
        }
      }
      return true;
    },
  },

  // ========== E. Coverage — the loop must reach every section ==========
  {
    id: 'E1',
    desc: 'Every Developer 1 section shows craft-pass evidence (signature motion, choreography, or a real state)',
    run: (ctx) => {
      const sigRe = new RegExp(`--ease-(${SIGNATURE_NAMES.join('|')})|EASE\\.(${SIGNATURE_NAMES.join('|')})`);
      // The new Reveal variants count as evidence in their own right. Several
      // sections here are purely editorial — no links, no controls — and a check
      // that only accepted interaction states would push a maker to sprinkle a
      // meaningless `active:` on a paragraph to clear the gate. Choreography IS
      // the craft work for a section with nothing to click.
      const choreoRe = /variant="(lead|settle|draw)"|--ease-brand|--ease-press/;
      const untouched = [];
      for (const name of DEV1_SECTIONS) {
        const src = code(ctx, `components/sections/${name}.tsx`);
        if (!src) { untouched.push(`${name} (file missing)`); continue; }
        const hasSignature = sigRe.test(src);
        const hasState = /active:|whileTap|focus-visible[:-]|group-focus/.test(src);
        const hasChoreo = choreoRe.test(src);
        if (!hasSignature && !hasState && !hasChoreo) untouched.push(name);
      }
      return untouched.length === 0 ||
        `${untouched.length} sections carry no craft-pass evidence — the loop has not reached them: ${list(untouched, 20)}`;
    },
  },
];

/**
 * MILESTONE 3 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: docs/plan.md §4 M3 (Developer 1 rows) + Task Division Rev 2
 * p.4 + §1 of plan.md (the approved booking-form field list).
 *
 * Developer 1 owns the inquiry flow end to end:
 *   HARD    Firebase — Firestore structure + security rules
 *   MEDIUM  Booking form, all approved fields
 *   MEDIUM  Email notification via Nodemailer + client SMTP
 *   EASY    validation messages, thank-you state, error state
 *   EASY    collect + relay credentials to Developer 2
 *
 * The whole admin side and the 2% / AED 250 partnership computation are
 * Developer 2's — asserted by the scope guards below.
 *
 * SECURITY is the theme of this milestone, so the credential checks are the
 * strictest in the suite: a real key reaching the source tree fails the build.
 */

export const title = 'Booking form, Firebase + security rules, email notifications';

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

/** The approved field list — plan.md §1 "Booking form fields". */
const APPROVED_FIELDS = [
  'name',
  'email',
  'mobile',
  'eventType',
  'date',
  'location',
  'services',
  'guests',
  'notes',
  'source',
];

/** Config-driven status set — plan.md §1 + R-5 (must be trivial to reduce). */
const STATUSES = ['new', 'confirmed', 'paid', 'cancelled', 'refunded'];

const srcFiles = (ctx) =>
  [...ctx.walk('app'), ...ctx.walk('components'), ...ctx.walk('lib'), ...ctx.walk('content')].filter((f) =>
    /\.(ts|tsx)$/.test(f),
  );

/**
 * Strip comments before scanning for forbidden CODE.
 *
 * Documenting an ownership seam ("Developer 2 owns the partnership computation")
 * is exactly what we want in the source. Implementing that computation is not.
 * A scope guard that cannot tell prose from code punishes good comments.
 */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

export const checks = [
  // ---------------- A. Firebase + security rules (HARD) ----------------
  {
    id: 'A1',
    desc: 'firebase and firebase-admin installed (Firebase is the database this milestone)',
    run: (c) => {
      const d = c.deps();
      const missing = ['firebase', 'firebase-admin'].filter((p) => !d[p]);
      return missing.length === 0 || `not in package.json: ${missing.join(', ')}`;
    },
  },
  {
    id: 'A2',
    desc: 'Firebase client init exists and reads config ONLY from env vars',
    run: (c) => {
      const f = c.read('lib/firebase/client.ts');
      if (!f) return 'lib/firebase/client.ts not found';
      if (!/process\.env\./.test(f)) return 'client init does not read from process.env';
      if (/AIzaSy[A-Za-z0-9_\-]{10,}/.test(f)) return 'a literal Firebase API key is hardcoded here';
      return true;
    },
  },
  {
    id: 'A3',
    desc: 'Firebase Admin init exists, server-only, env-driven',
    run: (c) => {
      const f = c.read('lib/firebase/admin.ts');
      if (!f) return 'lib/firebase/admin.ts not found';
      if (!/process\.env\./.test(f)) return 'admin init does not read from process.env';
      if (!/server-only|import 'server-only'/.test(f)) {
        return "admin init must be server-only (import 'server-only') so it can never ship to the browser";
      }
      return true;
    },
  },
  {
    id: 'A4',
    desc: 'Firestore security rules source is committed',
    run: (c) => c.exists('firestore.rules') || 'firestore.rules not found at repo root',
  },
  {
    id: 'A5',
    desc: 'Rules allow the public to CREATE an inquiry, with shape validation',
    run: (c) => {
      const r = c.read('firestore.rules');
      if (!/match\s+\/inquiries\//.test(r)) return 'no /inquiries match block in the rules';
      if (!/allow create/.test(r)) return 'public create is not permitted on inquiries';
      const validates = /request\.resource\.data/.test(r) && /(size\(\)|is string|hasAll|hasOnly)/.test(r);
      return validates || 'create is allowed but the document shape is never validated';
    },
  },
  {
    id: 'A6',
    desc: 'Rules DENY public read/update/delete on inquiries',
    run: (c) => {
      const r = c.read('firestore.rules');
      const block = (r.match(/match\s+\/inquiries\/[^{]*\{([\s\S]*?)\n\s{0,6}\}/) || [])[1] || r;
      if (/allow read[^;]*if\s+true/.test(block)) return 'inquiries are publicly readable';
      if (/allow (write|update|delete)[^;]*if\s+true/.test(block)) return 'inquiries are publicly writable';
      const denies = /allow read.*:\s*if\s+isAdmin|allow read, update, delete|allow read, write: if false|isAdmin\(\)/.test(block);
      return denies || 'no explicit admin-only guard on inquiry read/update/delete';
    },
  },
  {
    id: 'A7',
    desc: 'Bookings/customers collections are admin-only',
    run: (c) => {
      const r = c.read('firestore.rules');
      const hasBookings = /match\s+\/(bookings|customers)\//.test(r);
      if (!hasBookings) return 'no /bookings or /customers match block — the admin data layer is missing';
      return /isAdmin\(\)/.test(r) || 'no isAdmin() guard protecting the booking/customer records';
    },
  },
  {
    id: 'A8',
    desc: 'Default-deny catch-all rule present (nothing is reachable by accident)',
    run: (c) => {
      const r = c.read('firestore.rules');
      return (
        /match\s+\/\{document=\*\*\}[\s\S]*?allow read, write:\s*if\s+false/.test(r) ||
        'no default-deny catch-all — any collection added later would be wide open'
      );
    },
  },

  // ---------------- B. Shared validation schema ----------------
  {
    id: 'B1',
    desc: 'Shared inquiry schema exists and covers every approved field',
    run: (c) => {
      const f = c.read('lib/validation/inquiry.ts');
      if (!f) return 'lib/validation/inquiry.ts not found';
      const missing = APPROVED_FIELDS.filter((k) => !new RegExp(`\\b${k}\\b`).test(f));
      return missing.length === 0 || `schema missing approved fields: ${missing.join(', ')}`;
    },
  },
  {
    id: 'B2',
    desc: 'Source-of-inquiry selector covers both brands (063 / 063 Society)',
    run: (c) => {
      const f = c.read('lib/validation/inquiry.ts');
      const hasProductions = /productions/i.test(f);
      const hasSociety = /society/i.test(f);
      return (hasProductions && hasSociety) || 'source of inquiry does not offer both 063 and 063 Society';
    },
  },
  {
    id: 'B3',
    desc: 'The API route validates server-side with the SAME shared schema',
    run: (c) => {
      const f = c.read('app/api/inquiry/route.ts');
      if (!f) return 'app/api/inquiry/route.ts not found';
      return (
        /@\/lib\/validation\/inquiry/.test(f) ||
        'route does not import the shared schema — client-side validation alone is not validation'
      );
    },
  },

  // ---------------- C. API route + email ----------------
  {
    id: 'C1',
    desc: 'POST handler exists on /api/inquiry',
    run: (c) => {
      const f = c.read('app/api/inquiry/route.ts');
      return /export async function POST/.test(f) || 'no exported POST handler';
    },
  },
  {
    id: 'C2',
    desc: 'Nodemailer installed and SMTP transport reads credentials ONLY from env',
    run: (c) => {
      if (!c.deps()['nodemailer']) return 'nodemailer not in package.json';
      const f = c.read('lib/email/transport.ts');
      if (!f) return 'lib/email/transport.ts not found';
      if (!/process\.env\./.test(f)) return 'SMTP transport does not read from process.env';
      if (/pass\s*:\s*['"][^'"]{6,}['"]/.test(f)) return 'a literal SMTP password is hardcoded here';
      return true;
    },
  },
  {
    id: 'C3',
    desc: 'A new inquiry triggers the notification email',
    run: (c) => {
      const f = c.read('app/api/inquiry/route.ts');
      return /@\/lib\/email/.test(f) || 'route never calls the email layer';
    },
  },
  {
    id: 'C4',
    desc: 'Email failure does not lose the inquiry (the write is what matters)',
    run: (c) => {
      const f = c.read('app/api/inquiry/route.ts');
      const guarded = /catch[\s\S]{0,400}(email|mail|notify)/i.test(f) || /(email|notify)[\s\S]{0,200}catch/i.test(f);
      return guarded || 'the email send is not wrapped so a SMTP outage would fail a saved inquiry';
    },
  },

  // ---------------- D. Booking form ----------------
  {
    id: 'D1',
    desc: 'Booking form component exists and renders every approved field',
    run: (c) => {
      const f = c.read('components/forms/BookingForm.tsx');
      if (!f) return 'components/forms/BookingForm.tsx not found';
      const missing = APPROVED_FIELDS.filter((k) => !new RegExp(`["'\`]?${k}["'\`]?`).test(f));
      return missing.length === 0 || `form missing approved fields: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D2',
    desc: 'Form has validation messages, a thank-you state and an error state',
    run: (c) => {
      const f = c.read('components/forms/BookingForm.tsx');
      const hasSuccess = /success|thank/i.test(f);
      const hasError = /error/i.test(f);
      const hasFieldErrors = /fieldErrors|errors\[|aria-invalid/.test(f);
      const missing = [
        !hasSuccess && 'thank-you state',
        !hasError && 'error state',
        !hasFieldErrors && 'per-field validation messages',
      ].filter(Boolean);
      return missing.length === 0 || `missing: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D3',
    desc: 'Form is accessible: labels bound to inputs, invalid fields announced',
    run: (c) => {
      const f = c.read('components/forms/BookingForm.tsx');
      const missing = [
        !/htmlFor=/.test(f) && 'htmlFor on labels',
        !/aria-invalid/.test(f) && 'aria-invalid',
        !/aria-describedby/.test(f) && 'aria-describedby for error text',
      ].filter(Boolean);
      return missing.length === 0 || `missing: ${missing.join(', ')}`;
    },
  },
  {
    id: 'D4',
    desc: 'Form is actually reachable on a route',
    run: (c) => {
      const importers = srcFiles(c).filter((f) => /BookingForm/.test(c.read(f)));

      // Mounted straight onto a page.
      if (importers.some((f) => f.startsWith('app/'))) return true;

      // Or one hop away: a section renders the form, and a page renders that
      // section. (The runtime stage is the authoritative reachability proof —
      // it fetches /contact and asserts a form field is present.)
      for (const section of importers.filter((f) => f.startsWith('components/'))) {
        const name = section.split('/').pop()?.replace(/\.tsx$/, '');
        if (!name) continue;
        const mounted = srcFiles(c).some(
          (f) => f.startsWith('app/') && new RegExp(`\\b${name}\\b`).test(c.read(f)),
        );
        if (mounted) return true;
      }
      return 'BookingForm is not reachable from any page';
    },
  },

  // ---------------- E. Config-driven booking status (R-5) ----------------
  {
    id: 'E1',
    desc: 'Booking statuses live in ONE config module (R-5: trimming must be a one-line change)',
    run: (c) => {
      const f = c.read('lib/booking/status.ts');
      if (!f) return 'lib/booking/status.ts not found';
      const missing = STATUSES.filter((s) => !new RegExp(s, 'i').test(f));
      return missing.length === 0 || `status set missing: ${missing.join(', ')}`;
    },
  },

  // ---------------- F. Scope guards ----------------
  {
    id: 'F1',
    desc: "SCOPE: no admin UI — the whole admin side is Developer 2's",
    run: (c) => (!c.exists('app/admin') ? true : 'app/admin exists — that is Developer 2 territory'),
  },
  {
    id: 'F2',
    desc: 'SCOPE: no 2% / AED 250 partnership computation (Developer 2, HARD)',
    run: (c) => {
      // Precise signals only. A bare "0.02" also matches CSS like
      // `tracking-[-0.02em]`, which is not a commission calculation.
      const signals = [
        /\bcommission\b/i,
        /\bpartnership\s*(calc|computation|fee|rate|amount)/i,
        /\bAED\s*250\b/,
        /[*]\s*0\.02\b|\b0\.02\s*[*]/,
      ];
      const offenders = srcFiles(c).filter((f) => {
        const t = stripComments(c.read(f));
        return signals.some((re) => re.test(t));
      });
      return offenders.length === 0 || `partnership computation found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'F3',
    desc: 'SCOPE: no SEO/tracking/deployment artefacts (Developer 2 SEO + M4)',
    run: (c) => {
      const bad = [];
      for (const p of ['app/sitemap.ts', 'app/robots.ts', 'vercel.json']) if (c.exists(p)) bad.push(p);
      const pixel = srcFiles(c).filter((f) => /fbq\(|connect\.facebook\.net|gtag\(/.test(c.read(f)));
      if (pixel.length) bad.push(`tracking pixel in ${pixel.join(', ')}`);
      return bad.length === 0 || `out of M3 scope: ${bad.join(', ')}`;
    },
  },
  {
    id: 'F4',
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

  // ---------------- G. Security (strictest checks in the suite) ----------------
  {
    id: 'G1',
    desc: 'SECURITY: no real credential of any kind in the source tree',
    run: (c) => {
      const patterns = [
        [/AIzaSy[A-Za-z0-9_\-]{20,}/, 'Firebase API key'],
        [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
        [/[a-z0-9._%+-]+@[a-z0-9.-]+\.iam\.gserviceaccount\.com/i, 'service-account email'],
      ];
      const hits = [];
      for (const f of [...srcFiles(c), 'firestore.rules', '.env.example'].filter(Boolean)) {
        const t = c.read(f);
        for (const [re, label] of patterns) if (re.test(t)) hits.push(`${label} in ${f}`);
      }
      return hits.length === 0 || `credential material committed: ${hits.join('; ')}`;
    },
  },
  {
    id: 'G2',
    desc: 'SECURITY: .env ignored, and .env.example ships placeholders only',
    run: (c) => {
      if (!/\.env/.test(c.read('.gitignore'))) return '.gitignore does not ignore .env files';
      const ex = c.read('.env.example');
      if (!ex) return '.env.example not found — Developer 2 and Vercel need the variable names';
      const filled = ex
        .split('\n')
        .filter((l) => /^[A-Z_]+=.+/.test(l.trim()))
        .filter((l) => !/(your|xxx|placeholder|change|<|>)/i.test(l));
      return filled.length === 0 || `.env.example contains real-looking values: ${filled.join(' | ')}`;
    },
  },
  {
    id: 'G3',
    desc: 'SECURITY: the admin SDK is never imported into client code',
    run: (c) => {
      const clientFiles = srcFiles(c).filter((f) => /^components\//.test(f) || /'use client'/.test(c.read(f)));
      const leaks = clientFiles.filter((f) => /firebase\/admin|firebase-admin/.test(c.read(f)));
      return leaks.length === 0 || `admin SDK imported into client code: ${leaks.join(', ')}`;
    },
  },

  // ---------------- H. Quality bar (carried forward) ----------------
  {
    id: 'H1',
    desc: 'No raw <img> — next/image everywhere',
    run: (c) => {
      const offenders = srcFiles(c).filter((f) => /<img[\s>]/.test(c.read(f)));
      return offenders.length === 0 || `raw <img> found in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'H2',
    desc: 'GSAP still code-split',
    run: (c) => {
      const offenders = srcFiles(c).filter(
        (f) => !f.endsWith('components/motion/gsap-loader.ts') && /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)),
      );
      return offenders.length === 0 || `static gsap import in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'H3',
    desc: 'Every motion primitive still honours reduced motion',
    run: (c) => {
      const prims = c.walk('components/motion').filter((f) => /\/[A-Z]\w+\.tsx$/.test(f));
      const bad = prims.filter((f) => !/useReducedMotionSafe|prefers-reduced-motion|useReducedMotion/.test(c.read(f)));
      return bad.length === 0 || `primitives ignoring reduced motion: ${bad.join(', ')}`;
    },
  },
  {
    id: 'H4',
    desc: 'Blockers register lists the M3 credential dependencies',
    run: (c) => {
      const f = c.read('BLOCKERS.md');
      const need = ['SMTP', 'Firebase', 'notification email'];
      const missing = need.filter((k) => !new RegExp(k, 'i').test(f));
      return missing.length === 0 || `BLOCKERS.md does not mention: ${missing.join(', ')}`;
    },
  },
];

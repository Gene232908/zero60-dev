/**
 * DEVELOPER 2 — MILESTONE 3 ACCEPTANCE CHECKLIST (mechanical).
 *
 * Source of truth: Task Division Rev 2, p.4, "Developer 2 — admin side" table,
 * plus docs/HANDOFF-DEV2.md §6 (what Developer 1 left ready).
 *
 *   HARD    2% partnership computation with the AED 250 cap per booking, the
 *           monthly summary of paid customers, and the automatic invoice /
 *           billing statement — via the shared helper in lib/utils
 *   MEDIUM  Secure admin login + a separate admin link not shown on the public site
 *   MEDIUM  Records screen: viewing, searching and filtering bookings
 *   EASY    Config-driven booking status control + actual-amount-collected field
 *   EASY    Returning Customer tag + came-from-the-website indicator
 *
 * The arithmetic is NOT graded by reading it. `tests` below runs
 * .claude/checks/partnership.test.mjs against the real TypeScript source.
 */

export const title = 'Admin side: partnership computation, secure login, records screen, status control';

export const brief = `DEVELOPER 2 — MILESTONE 3 TASKS (Task Division Rev 2, p.4):
  [HARD]   lib/utils/partnership.ts — 2% of amount collected, hard cap AED 250 PER BOOKING,
           website-sourced + revenue-status bookings only, monthly summary, invoice builder.
           It must satisfy .claude/checks/partnership.test.mjs exactly — that test was written
           first and is not yours to edit. Use RELATIVE imports with .ts extensions so Node
           can load it (e.g. import { REVENUE_STATUSES } from '../booking/status.ts').
  [MEDIUM] Secure admin login at /admin. Firebase Auth + the admin custom claim
           (request.auth.token.admin === true — see HANDOFF-DEV2.md §6). Unauthenticated
           users must not reach any admin screen. The admin link must NOT appear on the
           public site (not in content/nav.ts, not in the Footer).
  [MEDIUM] Records screen: list bookings with search and filter. Read collection names from
           COLLECTIONS in lib/firebase/collections.ts — never a hardcoded string.
  [EASY]   Status control driven by BOOKING_STATUSES (R-5: trimming the set must be a
           one-line edit) + an editable amountCollected field.
  [EASY]   Returning Customer tag + a fromWebsite indicator on each record.
Credentials are still missing (B10b/B11/B12) — the admin must degrade honestly, never fake data.`;

export const routes = [
  { path: '/', expect: 'Two houses' },
  { path: '/portfolio', forbid: 'placeholder route' },
  { path: '/collaborations', forbid: 'placeholder route' },
  { path: '/contact', expect: 'Estimated guests' },
  { path: '/society', expect: 'data-brand="society"' },
];

export const notFoundProbe = '/__gate-probe-this-must-404';

/** The gate runs the arithmetic rather than trusting a reading of it. */
export const tests = ['.claude/checks/partnership.test.mjs'];

const adminFiles = (c) => c.walk('app/admin').filter((f) => /\.(ts|tsx)$/.test(f));
const publicFiles = (c) =>
  [...c.walk('app/(site)'), ...c.walk('components/layout'), ...c.walk('components/sections'), ...c.walk('content')].filter(
    (f) => /\.(ts|tsx)$/.test(f),
  );

export const checks = [
  // ============ A. Partnership computation (HARD) ============
  {
    id: 'A1',
    desc: 'The shared partnership helper lives in lib/utils (one source of truth for form, admin and invoice)',
    run: (c) => c.exists('lib/utils/partnership.ts') || 'lib/utils/partnership.ts not found (Rev 2 p.4 puts it in lib/utils)',
  },
  {
    id: 'A2',
    desc: 'Rate and cap are named constants, not magic numbers buried in a component',
    run: (c) => {
      const s = c.read('lib/utils/partnership.ts');
      if (!/PARTNERSHIP_RATE/.test(s)) return 'no exported PARTNERSHIP_RATE';
      if (!/PARTNERSHIP_CAP_AED/.test(s)) return 'no exported PARTNERSHIP_CAP_AED';
      return true;
    },
  },
  {
    id: 'A3',
    desc: 'It is unit-testable by the gate: relative imports only, no "@/" alias',
    run: (c) => {
      const s = c.read('lib/utils/partnership.ts');
      const alias = /from\s+['"]@\//.test(s);
      return !alias || 'partnership.ts imports via the "@/" alias, so the gate cannot execute it — use a relative ../ path with the .ts extension';
    },
  },
  {
    id: 'A4',
    desc: 'Qualifying statuses come from lib/booking/status.ts, not a second hardcoded list',
    run: (c) => {
      const s = c.stripComments(c.read('lib/utils/partnership.ts'));
      if (!/REVENUE_STATUSES/.test(s)) return 'partnership.ts does not use REVENUE_STATUSES — it invents its own eligibility rule';
      const literal = /\[\s*'(new|confirmed|paid|cancelled|refunded)'/.test(s);
      return !literal || 'a hardcoded status list in partnership.ts duplicates lib/booking/status.ts';
    },
  },
  {
    id: 'A5',
    desc: 'The rate and cap are never re-declared anywhere else in the codebase',
    run: (c) => {
      const offenders = c
        .srcFiles()
        .filter((f) => f !== 'lib/utils/partnership.ts')
        .filter((f) => /\b0\.02\b/.test(c.stripComments(c.read(f))));
      return offenders.length === 0 || `the 2% rate is duplicated outside the shared helper in: ${offenders.join(', ')}`;
    },
  },
  {
    id: 'A6',
    desc: 'Monthly summary and invoice builder are exported',
    run: (c) => {
      const s = c.read('lib/utils/partnership.ts');
      const missing = ['qualifies', 'commissionForBooking', 'monthlySummary', 'buildInvoice'].filter(
        (n) => !new RegExp(`export\\s+(function|const)\\s+${n}\\b`).test(s),
      );
      return missing.length === 0 || `not exported from partnership.ts: ${missing.join(', ')}`;
    },
  },
  {
    id: 'A7',
    desc: 'The admin actually surfaces the computation (monthly summary + invoice screens)',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      if (!src) return 'no admin files found';
      const missing = ['monthlySummary', 'buildInvoice'].filter((n) => !new RegExp(`\\b${n}\\b`).test(src));
      return missing.length === 0 || `the admin never calls: ${missing.join(', ')} — the HARD task is not wired up`;
    },
  },

  // ============ B. Secure admin login (MEDIUM) ============
  {
    id: 'B1',
    desc: 'An admin area exists with a login route',
    run: (c) => {
      if (!c.exists('app/admin')) return 'app/admin not found';
      const hasLogin = adminFiles(c).some((f) => /login/i.test(f));
      return hasLogin || 'no admin login route under app/admin';
    },
  },
  {
    id: 'B2',
    desc: 'Authentication is Firebase Auth on the admin CUSTOM CLAIM, not an email allowlist',
    run: (c) => {
      const src = adminFiles(c).concat(c.walk('lib')).map((f) => c.read(f)).join('\n');
      if (!/firebase\/auth|getAuth|signInWithEmailAndPassword/.test(src)) return 'no Firebase Auth usage found';
      if (!/admin\b/.test(src)) return 'no admin claim referenced';
      const claim = /(token\.admin|claims\.admin|customClaims|getIdTokenResult)/.test(src);
      return claim || 'the admin custom claim is never checked — HANDOFF-DEV2.md §6 says the rules require request.auth.token.admin === true';
    },
  },
  {
    id: 'B3',
    desc: 'Admin screens are guarded: an unauthenticated visitor cannot reach them',
    run: (c) => {
      const guard = adminFiles(c).some((f) => /(redirect|notFound|AdminGuard|requireAdmin|onAuthStateChanged)/.test(c.read(f)));
      return guard || 'no auth guard in app/admin — the records screen is publicly reachable';
    },
  },
  {
    id: 'B4',
    desc: 'The admin link is NOT shown anywhere on the public website (Rev 2 p.4)',
    run: (c) => {
      const leaks = publicFiles(c).filter((f) => /['"]\/admin(\/|['"])/.test(c.stripComments(c.read(f))));
      return leaks.length === 0 || `a link to /admin is exposed on the public site in: ${leaks.join(', ')}`;
    },
  },
  {
    id: 'B5',
    desc: 'The admin area is excluded from search engines',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      return /noindex|robots:\s*\{/.test(src) || 'app/admin sets no noindex robots metadata';
    },
  },
  {
    id: 'B6',
    desc: 'SECURITY: the Firebase Admin SDK never reaches client code',
    run: (c) => {
      const clientFiles = c.srcFiles().filter((f) => /'use client'/.test(c.read(f)));
      const leaks = clientFiles.filter((f) => /firebase\/admin|firebase-admin/.test(c.read(f)));
      return leaks.length === 0 || `admin SDK imported into client code: ${leaks.join(', ')}`;
    },
  },
  {
    id: 'B7',
    desc: 'SECURITY: no credential of any kind in the source tree',
    run: (c) => {
      const bad = [];
      for (const f of c.srcFiles().concat(['firestore.rules', '.env.example'])) {
        const s = c.read(f);
        if (/AIzaSy[A-Za-z0-9_\-]{20,}/.test(s)) bad.push(`${f} (Firebase API key)`);
        if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(s)) bad.push(`${f} (private key)`);
      }
      return bad.length === 0 || `credential committed: ${bad.join(', ')}`;
    },
  },

  // ============ C. Records screen (MEDIUM) ============
  {
    id: 'C1',
    desc: 'A records screen lists bookings',
    run: (c) => {
      const f = adminFiles(c).find((p) => /(bookings|records)/i.test(p) && /page\.tsx$/.test(p));
      return Boolean(f) || 'no admin bookings/records page found';
    },
  },
  {
    id: 'C2',
    desc: 'It supports searching AND filtering',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      if (!/search/i.test(src)) return 'no search control on the records screen';
      if (!/filter/i.test(src)) return 'no filter control on the records screen';
      return true;
    },
  },
  {
    id: 'C3',
    desc: 'Collection names come from COLLECTIONS — never a hardcoded string',
    run: (c) => {
      const files = adminFiles(c).concat(c.walk('lib/admin'));
      const src = files.map((f) => c.read(f)).join('\n');
      if (!src) return 'no admin files found';
      if (!/COLLECTIONS/.test(src)) return 'the admin never imports COLLECTIONS from lib/firebase/collections.ts';
      const hard = files.filter((f) => /collection\(\s*\w+\s*,\s*['"](inquiries|bookings|customers)['"]/.test(c.read(f)));
      return hard.length === 0 || `hardcoded collection name in: ${hard.join(', ')}`;
    },
  },
  {
    id: 'C4',
    desc: 'The admin degrades honestly when Firebase credentials are absent (B10b) — no invented records',
    run: (c) => {
      const src = adminFiles(c).concat(c.walk('lib/admin')).map((f) => c.read(f)).join('\n');
      const invented = /(John Doe|Jane Doe|jane@example|john@example|Sample Customer|Test Booking)/i.exec(src);
      if (invented) return `invented record data "${invented[0]}" would look like a real client booking — B13 forbids it`;
      return /not configured|unavailable|no records|empty|PLACEHOLDER/i.test(src) || 'the admin has no empty/unconfigured state';
    },
  },

  // ============ D. Status control + amount collected (EASY) ============
  {
    id: 'D1',
    desc: 'The status control is driven by BOOKING_STATUSES (R-5: one-line trim)',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      return /BOOKING_STATUSES/.test(src) || 'the admin status control does not read BOOKING_STATUSES from lib/booking/status.ts';
    },
  },
  {
    id: 'D2',
    desc: 'No second hardcoded status list anywhere in the admin',
    run: (c) => {
      const bad = adminFiles(c).filter((f) => {
        const s = c.stripComments(c.read(f));
        return /\[\s*'new'\s*,|\[\s*"new"\s*,|'confirmed'\s*,\s*'paid'/.test(s);
      });
      return bad.length === 0 || `hardcoded status list in: ${bad.join(', ')} — trimming the set would then be a refactor, breaking R-5`;
    },
  },
  {
    id: 'D3',
    desc: 'The actual-amount-collected field is editable in the admin',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      if (!/amountCollected/.test(src)) return 'amountCollected never appears in the admin';
      return /<input|type="number"|onChange/.test(src) || 'amountCollected is displayed but never editable';
    },
  },

  // ============ E. Returning customer + origin (EASY) ============
  {
    id: 'E1',
    desc: 'The Returning Customer tag is rendered',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      if (!/returningCustomer/.test(src)) return 'returningCustomer never appears in the admin';
      return /Returning/.test(src) || 'the returning-customer flag is read but never shown as a tag';
    },
  },
  {
    id: 'E2',
    desc: 'The came-from-the-website indicator is rendered',
    run: (c) => {
      const src = adminFiles(c).map((f) => c.read(f)).join('\n');
      if (!/fromWebsite/.test(src)) return 'fromWebsite never appears in the admin';
      return /Website|website/.test(src) || 'the fromWebsite flag is read but never shown';
    },
  },
  {
    id: 'E3',
    desc: 'The origin flag is wired to the computation — it is what makes a booking qualify',
    run: (c) => {
      const s = c.stripComments(c.read('lib/utils/partnership.ts'));
      return /fromWebsite/.test(s) || 'partnership.ts ignores fromWebsite, so off-website bookings would earn commission';
    },
  },

  // ============ F. Quality bar + ordering ============
  {
    id: 'F1',
    desc: 'Milestones 1 and 2 survived: foundation, atoms and the finished public pages',
    run: (c) => {
      const need = [
        'styles/responsive.css',
        'components/ui/Button.tsx',
        'components/ui/Section.tsx',
        'content/portfolio.ts',
        'content/collaborations.ts',
      ];
      const missing = need.filter((f) => !c.exists(f));
      if (missing.length) return `earlier milestone deliverables removed: ${missing.join(', ')}`;
      const stubbed = ['app/(site)/portfolio/page.tsx', 'app/(site)/collaborations/page.tsx'].filter((f) =>
        /RouteStub/.test(c.read(f)),
      );
      return stubbed.length === 0 || `regressed back to a stub: ${stubbed.join(', ')}`;
    },
  },
  {
    id: 'F2',
    desc: 'No raw <img>, GSAP still code-split',
    run: (c) => {
      const imgs = c.srcFiles().filter((f) => /<img[\s>]/.test(c.read(f)));
      if (imgs.length) return `raw <img> found in: ${imgs.join(', ')}`;
      const gsap = c
        .srcFiles()
        .filter((f) => !f.endsWith('components/motion/gsap-loader.ts') && /^\s*import\s[^;]*from\s+['"]gsap/m.test(c.read(f)));
      return gsap.length === 0 || `static gsap import in: ${gsap.join(', ')}`;
    },
  },
  {
    id: 'F3',
    desc: 'SCOPE: no SEO artefacts yet — sitemap, robots and page-speed are Milestone 4',
    run: (c) => {
      const seo = ['app/sitemap.ts', 'app/robots.ts'].filter((f) => c.exists(f));
      return seo.length === 0 || `${seo.join(', ')} exists — that is Milestone 4 work`;
    },
  },
  {
    id: 'F4',
    desc: "SCOPE: Developer 1's inquiry flow is untouched",
    run: (c) => {
      const need = ['app/api/inquiry/route.ts', 'components/forms/BookingForm.tsx', 'firestore.rules', 'lib/booking/status.ts'];
      const missing = need.filter((f) => !c.exists(f));
      if (missing.length) return `Developer 1 files deleted: ${missing.join(', ')}`;
      const rules = c.read('firestore.rules');
      return /allow create/.test(rules) || 'the public inquiry-create rule was removed from firestore.rules';
    },
  },
  {
    id: 'F5',
    desc: 'The M3 QA pass is recorded in docs/DEV2-QA.md',
    run: (c) => {
      const q = c.read('docs/DEV2-QA.md');
      if (!q) return 'docs/DEV2-QA.md not found';
      const missing = ['Milestone 3', 'admin'].filter((k) => !new RegExp(k, 'i').test(q));
      return missing.length === 0 || `no Milestone 3 QA record covering: ${missing.join(', ')}`;
    },
  },
];

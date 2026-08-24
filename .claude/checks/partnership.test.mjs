/**
 * PARTNERSHIP COMPUTATION — REAL UNIT TEST.
 *
 * This is the checker, and it was written BEFORE the implementation existed.
 * Developer 2's Milestone 3 HARD task is the 2% partnership computation with the
 * AED 250 cap. Money logic is the one place where "the agent read the code and
 * it looked right" is worthless, so the gate runs the arithmetic and checks the
 * numbers.
 *
 * Node 22 strips TypeScript natively, so this imports the real source file —
 * not a copy, not a mock. That is why lib/utils/partnership.ts must use RELATIVE
 * imports with explicit .ts extensions: Node does not resolve the "@/" alias or
 * guess extensions.
 *
 * CONTRACT (client call + Proposal §11, recorded in docs/plan.md §1):
 *   - 2% of the amount actually collected
 *   - hard cap of AED 250 PER BOOKING (never per month, never per invoice)
 *   - website-sourced bookings only; phone / WhatsApp / walk-in are excluded
 *   - only revenue-bearing statuses qualify (lib/booking/status.ts REVENUE_STATUSES)
 *   - qualified returning customers still count
 *
 * Run: node --experimental-strip-types .claude/checks/partnership.test.mjs
 */
import {
  PARTNERSHIP_RATE,
  PARTNERSHIP_CAP_AED,
  qualifies,
  commissionForBooking,
  monthlySummary,
  buildInvoice,
} from '../../lib/utils/partnership.ts';
import { BOOKING_STATUSES, REVENUE_STATUSES } from '../../lib/booking/status.ts';

let failures = 0;
function check(label, actual, expected) {
  const ok = Object.is(actual, expected);
  if (!ok) {
    failures++;
    console.error(`  FAIL  ${label}\n          expected: ${expected}\n          actual:   ${actual}`);
  }
}
function checkTrue(label, actual) {
  if (actual !== true) {
    failures++;
    console.error(`  FAIL  ${label}\n          expected true, got: ${actual}`);
  }
}

/** A booking the admin has marked paid, that came through the website. */
const booking = (over = {}) => ({
  inquiryId: 'inq-1',
  status: 'paid',
  amountCollected: 10000,
  fromWebsite: true,
  returningCustomer: false,
  createdAt: '2026-03-10T00:00:00.000Z',
  updatedAt: '2026-03-10T00:00:00.000Z',
  ...over,
});

console.log('partnership computation — contract test');

// ---- 1. The constants are the agreed ones, not approximations ----
check('rate is 2%', PARTNERSHIP_RATE, 0.02);
check('cap is AED 250', PARTNERSHIP_CAP_AED, 250);

// ---- 2. Plain arithmetic below the cap ----
check('2% of 10,000 = 200', commissionForBooking(booking({ amountCollected: 10000 })), 200);
check('2% of 100 = 2', commissionForBooking(booking({ amountCollected: 100 })), 2);
check('2% of 333 rounds to 6.66', commissionForBooking(booking({ amountCollected: 333 })), 6.66);
check('zero collected earns nothing', commissionForBooking(booking({ amountCollected: 0 })), 0);

// ---- 3. The cap, including its exact boundary ----
check('12,500 is exactly at the cap', commissionForBooking(booking({ amountCollected: 12500 })), 250);
check('12,501 is capped', commissionForBooking(booking({ amountCollected: 12501 })), 250);
check('20,000 is capped at 250', commissionForBooking(booking({ amountCollected: 20000 })), 250);
check('1,000,000 is still capped at 250', commissionForBooking(booking({ amountCollected: 1000000 })), 250);

// ---- 4. Only website-sourced bookings qualify ----
check('off-website booking earns nothing', commissionForBooking(booking({ fromWebsite: false })), 0);
check('off-website booking does not qualify', qualifies(booking({ fromWebsite: false })), false);

// ---- 5. Only revenue-bearing statuses qualify (single source of truth) ----
for (const { value } of BOOKING_STATUSES) {
  const expected = REVENUE_STATUSES.includes(value);
  check(`status "${value}" qualifies === ${expected}`, qualifies(booking({ status: value })), expected);
  if (!expected) {
    check(`status "${value}" earns nothing`, commissionForBooking(booking({ status: value })), 0);
  }
}

// ---- 6. Returning customers still count (client call, Proposal §11) ----
check(
  'a qualified returning customer still earns commission',
  commissionForBooking(booking({ returningCustomer: true, amountCollected: 5000 })),
  100,
);

// ---- 7. Missing / hostile amounts must never produce NaN or a negative ----
check('null amount earns nothing', commissionForBooking(booking({ amountCollected: null })), 0);
check('undefined amount earns nothing', commissionForBooking(booking({ amountCollected: undefined })), 0);
check('negative amount earns nothing', commissionForBooking(booking({ amountCollected: -5000 })), 0);
check('NaN amount earns nothing', commissionForBooking(booking({ amountCollected: NaN })), 0);
check('string amount earns nothing', commissionForBooking(booking({ amountCollected: '10000' })), 0);

// ---- 8. THE CLASSIC BUG: the cap is per booking, never per month ----
{
  const march = [
    booking({ inquiryId: 'a', amountCollected: 20000, createdAt: '2026-03-02T00:00:00.000Z' }),
    booking({ inquiryId: 'b', amountCollected: 20000, createdAt: '2026-03-18T00:00:00.000Z' }),
  ];
  const s = monthlySummary(march, { year: 2026, month: 3 });
  check('two capped bookings = 500, not 250', s.commission, 500);
  check('summary counts both as qualifying', s.qualifyingBookings, 2);
  check('summary reports gross collected', s.grossCollected, 40000);
}

// ---- 9. The monthly summary filters by period and by eligibility ----
{
  const mixed = [
    booking({ inquiryId: 'in-1', amountCollected: 5000, createdAt: '2026-03-05T00:00:00.000Z' }), // 100
    booking({ inquiryId: 'in-2', amountCollected: 3000, createdAt: '2026-03-25T00:00:00.000Z' }), // 60
    booking({ inquiryId: 'out-month', amountCollected: 9000, createdAt: '2026-04-01T00:00:00.000Z' }),
    booking({ inquiryId: 'off-site', amountCollected: 9000, fromWebsite: false, createdAt: '2026-03-09T00:00:00.000Z' }),
    booking({ inquiryId: 'unpaid', amountCollected: 9000, status: 'new', createdAt: '2026-03-09T00:00:00.000Z' }),
  ];
  const s = monthlySummary(mixed, { year: 2026, month: 3 });
  check('only the two eligible March bookings count', s.qualifyingBookings, 2);
  check('March commission is 160', s.commission, 160);
  check('an empty month is 0, not NaN', monthlySummary([], { year: 2026, month: 7 }).commission, 0);
}

// ---- 10. The invoice agrees with the summary, line by line ----
{
  const bookings = [
    booking({ inquiryId: 'a', amountCollected: 20000, createdAt: '2026-03-02T00:00:00.000Z' }), // 250 capped
    booking({ inquiryId: 'b', amountCollected: 5000, createdAt: '2026-03-11T00:00:00.000Z' }), // 100
    booking({ inquiryId: 'skip', amountCollected: 5000, status: 'cancelled', createdAt: '2026-03-11T00:00:00.000Z' }),
  ];
  const inv = buildInvoice(bookings, { year: 2026, month: 3 });
  const summary = monthlySummary(bookings, { year: 2026, month: 3 });
  check('invoice has one line per qualifying booking', inv.lines.length, 2);
  check('invoice total matches the summary', inv.total, summary.commission);
  check('invoice total is 350', inv.total, 350);
  checkTrue('invoice carries a reference', typeof inv.reference === 'string' && inv.reference.length > 0);
  checkTrue(
    'each invoice line names its booking and its commission',
    inv.lines.every((l) => typeof l.inquiryId === 'string' && typeof l.commission === 'number'),
  );
  checkTrue(
    'a capped line is marked as capped, so the client can see why',
    inv.lines.some((l) => l.capped === true),
  );
  check('the capped line is the 20,000 one', inv.lines.find((l) => l.capped === true)?.inquiryId, 'a');
}

// ---- 11. Purity: computing must not mutate the caller's records ----
{
  const original = booking({ amountCollected: 20000 });
  const snapshot = JSON.stringify(original);
  commissionForBooking(original);
  monthlySummary([original], { year: 2026, month: 3 });
  buildInvoice([original], { year: 2026, month: 3 });
  check('booking records are not mutated', JSON.stringify(original), snapshot);
}

if (failures > 0) {
  console.error(`\npartnership computation: ${failures} assertion(s) FAILED`);
  process.exit(1);
}
console.log('partnership computation: all assertions passed');

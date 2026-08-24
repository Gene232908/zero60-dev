/**
 * PARTNERSHIP COMPUTATION — the 2% revenue share.
 *
 * Milestone 3 · Developer 2 · Task Division Rev 2, p.4 (HARD).
 *
 * THE AGREED TERMS (client call + Proposal §11, recorded in docs/plan.md §1):
 *   - 2% of the amount actually collected on a booking
 *   - a hard cap of AED 250 PER BOOKING
 *   - website-sourced bookings only — phone, WhatsApp and walk-in are excluded
 *   - only revenue-bearing statuses count (REVENUE_STATUSES, the shared list)
 *   - qualified returning customers still count
 *
 * Rev 2 p.4 puts this in `lib/utils` deliberately: the admin screens, the
 * monthly summary and the invoice must all compute the same number from the
 * same code. Nothing anywhere else may re-declare the rate or the cap — the
 * gate fails the build if `0.02` appears in any other file.
 *
 * ── Two deliberate constraints ──────────────────────────────────────────────
 *
 * 1. NO "@/" ALIAS, AND AN EXPLICIT .ts EXTENSION ON THE IMPORT BELOW.
 *    This module is money logic, so the gate does not grade it by reading it —
 *    it executes it. `.claude/checks/partnership.test.mjs` imports this exact
 *    file through Node's TypeScript stripping and checks the arithmetic. Node
 *    resolves neither the "@/" alias nor an extensionless specifier, so the
 *    import has to look like this for the file to remain testable.
 *    (tsconfig sets `allowImportingTsExtensions`, which needs `noEmit`.)
 *
 * 2. PURE FUNCTIONS, NO MUTATION. The admin passes live record arrays straight
 *    in; a helper that sorted or annotated them in place would corrupt what the
 *    screen is displaying. The test asserts records come back untouched.
 */

import { REVENUE_STATUSES } from '../booking/status.ts';

/** 2% of the amount collected. */
export const PARTNERSHIP_RATE = 0.02;

/** Hard ceiling per booking, in AED. Never applied to a month or an invoice. */
export const PARTNERSHIP_CAP_AED = 250;

/**
 * The fields the computation needs.
 *
 * Structurally compatible with `BookingRecord` in lib/firebase/collections.ts,
 * but declared loosely on purpose: this must also be safe to run over raw
 * Firestore documents, where any field may be missing or the wrong type.
 */
export type CommissionableBooking = {
  inquiryId?: string;
  status?: string;
  amountCollected?: number | null;
  fromWebsite?: boolean;
  returningCustomer?: boolean;
  createdAt?: string;
};

export type MonthlyPeriod = {
  year: number;
  /** 1-indexed: 1 = January, 12 = December. */
  month: number;
};

export type MonthlySummary = {
  year: number;
  month: number;
  periodStart: string;
  periodEnd: string;
  /** Bookings falling inside the period, whether or not they qualify. */
  bookingsInPeriod: number;
  /** Bookings that actually earn commission. */
  qualifyingBookings: number;
  /** Total collected across qualifying bookings, in AED. */
  grossCollected: number;
  /** Total commission owed for the period, in AED. */
  commission: number;
  /** How many bookings hit the AED 250 ceiling. */
  cappedCount: number;
};

export type InvoiceLine = {
  inquiryId: string;
  amountCollected: number;
  commission: number;
  /** True when the raw 2% exceeded the cap and was clipped. */
  capped: boolean;
};

export type Invoice = {
  reference: string;
  year: number;
  month: number;
  periodStart: string;
  periodEnd: string;
  rate: number;
  cap: number;
  lines: InvoiceLine[];
  /** Sum of the lines. Equals the period's `commission`. */
  total: number;
};

/** Round to fils. Avoids 6.660000000000001 reaching an invoice. */
function toAed(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * The collected amount, or 0 if it is not a usable positive number.
 * Firestore documents are not guaranteed to be well-typed, and a NaN must never
 * be able to propagate into a billing statement.
 */
function collectedAmount(booking: CommissionableBooking): number {
  const amount = booking.amountCollected;
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) return 0;
  return amount;
}

/**
 * Does this booking earn commission at all?
 *
 * Both conditions are required: it came through the website, AND it reached a
 * revenue-bearing status. Eligibility is read from lib/booking/status.ts so that
 * if Marco trims the status set (docs/plan.md R-5) this follows automatically.
 */
export function qualifies(booking: CommissionableBooking): boolean {
  if (booking.fromWebsite !== true) return false;
  if (typeof booking.status !== 'string') return false;
  return (REVENUE_STATUSES as readonly string[]).includes(booking.status);
}

/**
 * Commission for ONE booking, in AED.
 *
 * The cap is applied here, per booking — never to a monthly total. Two capped
 * bookings in a month owe AED 500, not AED 250. That distinction is the single
 * most expensive thing to get wrong in this file, so the test pins it.
 */
export function commissionForBooking(booking: CommissionableBooking): number {
  if (!qualifies(booking)) return 0;
  const amount = collectedAmount(booking);
  if (amount === 0) return 0;
  return toAed(Math.min(amount * PARTNERSHIP_RATE, PARTNERSHIP_CAP_AED));
}

/** True when the raw 2% was clipped by the ceiling. */
function wasCapped(booking: CommissionableBooking): boolean {
  if (!qualifies(booking)) return false;
  return collectedAmount(booking) * PARTNERSHIP_RATE > PARTNERSHIP_CAP_AED;
}

/** UTC period bounds. Booking timestamps are stored as ISO strings in UTC. */
function periodBounds({ year, month }: MonthlyPeriod) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0) - 1);
  return { start, end };
}

/** Is this booking's createdAt inside the period? */
function inPeriod(booking: CommissionableBooking, period: MonthlyPeriod): boolean {
  if (typeof booking.createdAt !== 'string') return false;
  const created = new Date(booking.createdAt);
  if (Number.isNaN(created.getTime())) return false;
  return created.getUTCFullYear() === period.year && created.getUTCMonth() === period.month - 1;
}

/**
 * The monthly summary of paid customers (Rev 2 p.4).
 *
 * Commission is summed from the per-booking figures, so the cap has already
 * been applied individually before anything is totalled.
 */
export function monthlySummary(
  bookings: readonly CommissionableBooking[],
  period: MonthlyPeriod,
): MonthlySummary {
  const { start, end } = periodBounds(period);
  const within = bookings.filter((b) => inPeriod(b, period));
  const earning = within.filter((b) => qualifies(b));

  return {
    year: period.year,
    month: period.month,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    bookingsInPeriod: within.length,
    qualifyingBookings: earning.length,
    grossCollected: toAed(earning.reduce((sum, b) => sum + collectedAmount(b), 0)),
    commission: toAed(earning.reduce((sum, b) => sum + commissionForBooking(b), 0)),
    cappedCount: earning.filter((b) => wasCapped(b)).length,
  };
}

/**
 * The automatic invoice / billing statement (Rev 2 p.4).
 *
 * One line per qualifying booking, each showing what was collected and what is
 * owed on it, with capped lines flagged — so management can see *why* a large
 * booking still only produced AED 250 without having to ask.
 */
export function buildInvoice(
  bookings: readonly CommissionableBooking[],
  period: MonthlyPeriod,
): Invoice {
  const summary = monthlySummary(bookings, period);

  const lines: InvoiceLine[] = bookings
    .filter((b) => inPeriod(b, period) && qualifies(b))
    .map((b) => ({
      inquiryId: typeof b.inquiryId === 'string' ? b.inquiryId : '',
      amountCollected: collectedAmount(b),
      commission: commissionForBooking(b),
      capped: wasCapped(b),
    }));

  return {
    reference: `063-PS-${period.year}-${String(period.month).padStart(2, '0')}`,
    year: period.year,
    month: period.month,
    periodStart: summary.periodStart,
    periodEnd: summary.periodEnd,
    rate: PARTNERSHIP_RATE,
    cap: PARTNERSHIP_CAP_AED,
    lines,
    total: toAed(lines.reduce((sum, line) => sum + line.commission, 0)),
  };
}

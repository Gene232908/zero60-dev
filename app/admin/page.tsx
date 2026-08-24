'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PARTNERSHIP_CAP_AED,
  PARTNERSHIP_RATE,
  buildInvoice,
  monthlySummary,
} from '@/lib/utils/partnership';
import { useBookingRecords } from './_components/useBookingRecords';
import { RecordsPlaceholder } from './_components/EmptyState';

/**
 * Admin overview — the monthly summary and the billing statement.
 *
 * Milestone 3 · Developer 2 · Task Division Rev 2, p.4 (HARD):
 * "the 2% partnership computation with the AED 250 cap per booking, the monthly
 *  summary of paid customers, and the automatic invoice/billing statement
 *  (using the shared partnership-calc helper)".
 *
 * Every figure on this screen comes from lib/utils/partnership.ts. Nothing is
 * recomputed locally — that helper is the single source of truth the form, the
 * admin and the invoice all share, and its arithmetic is pinned by a contract
 * test the gate runs on every build.
 *
 * The cap is applied PER BOOKING. Two capped bookings in a month bill AED 500,
 * not AED 250; the statement flags each capped line so management can see why a
 * large booking still only produced AED 250.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const money = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminOverviewPage() {
  const { state, bookings } = useBookingRecords();
  const now = new Date();
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);

  const period = useMemo(() => ({ year, month }), [year, month]);
  const summary = useMemo(() => monthlySummary(bookings, period), [bookings, period]);
  const invoice = useMemo(() => buildInvoice(bookings, period), [bookings, period]);

  const years = Array.from({ length: 5 }, (_, i) => now.getUTCFullYear() - 2 + i);

  return (
    <div className="shell py-[var(--space-lg)]">
      <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)] border-b border-line pb-[var(--space-sm)]">
        <h1 className="display text-[clamp(1.5rem,4vw,2.5rem)]">Overview</h1>
        <p className="eyebrow">
          {(PARTNERSHIP_RATE * 100).toFixed(0)}% share · cap AED {PARTNERSHIP_CAP_AED} per booking
        </p>
      </div>

      {/* ---- Period picker ---- */}
      <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-sm)]">
        <div>
          <label htmlFor="summary-month" className="eyebrow mb-2 block">
            Month
          </label>
          <select
            id="summary-month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="zs-tap border border-line bg-transparent px-4 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="summary-year" className="eyebrow mb-2 block">
            Year
          </label>
          <select
            id="summary-year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="zs-tap border border-line bg-transparent px-4 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.status !== 'ok' ? (
        <div className="mt-[var(--space-md)]">
          <RecordsPlaceholder state={state} />
        </div>
      ) : (
        <>
          {/* ---- Monthly summary of paid customers ---- */}
          <dl className="mt-[var(--space-lg)] grid gap-[var(--grid-gap-x)] sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Qualifying bookings" value={String(summary.qualifyingBookings)} note={`of ${summary.bookingsInPeriod} in period`} />
            <Stat label="Collected (AED)" value={money(summary.grossCollected)} note="across qualifying bookings" />
            <Stat label="Commission due (AED)" value={money(summary.commission)} note="sum of per-booking figures" accent />
            <Stat label="Capped bookings" value={String(summary.cappedCount)} note={`hit the AED ${PARTNERSHIP_CAP_AED} ceiling`} />
          </dl>

          {/* ---- Automatic billing statement ---- */}
          <section className="mt-[var(--space-xl)]">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line-strong pb-[var(--space-2xs)]">
              <h2 className="display text-[clamp(1.25rem,3vw,1.75rem)]">Billing statement</h2>
              <p className="eyebrow">{invoice.reference}</p>
            </div>

            {invoice.lines.length === 0 ? (
              <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] text-fg-muted">
                No qualifying bookings in {MONTHS[month - 1]} {year}. A booking earns commission only
                when it came through the website and reached a revenue-bearing status.
              </p>
            ) : (
              <div className="mt-[var(--space-md)] overflow-x-auto">
                <table className="w-full min-w-[40rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      {['Enquiry', 'Collected (AED)', 'Commission (AED)', ''].map((h) => (
                        <th key={h} scope="col" className="eyebrow py-3 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lines.map((line) => (
                      <tr key={line.inquiryId} className="border-b border-line">
                        <td className="py-3 pr-4 text-[length:var(--text-sm)]">{line.inquiryId}</td>
                        <td className="py-3 pr-4 text-[length:var(--text-sm)]">{money(line.amountCollected)}</td>
                        <td className="py-3 pr-4 text-[length:var(--text-sm)] text-fg">{money(line.commission)}</td>
                        <td className="py-3 pr-4">
                          {line.capped ? (
                            <span className="border border-accent px-2 py-0.5 text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-accent">
                              Capped
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-line-strong">
                      <th scope="row" className="py-3 pr-4 text-left text-[length:var(--text-sm)]">
                        Total due
                      </th>
                      <td />
                      <td className="py-3 pr-4 text-[length:var(--text-base)] text-accent">
                        {money(invoice.total)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      <p className="mt-[var(--space-lg)] text-[length:var(--text-xs)] leading-relaxed text-fg-faint">
        Commission applies only to website-sourced bookings that reached a revenue-bearing status,
        including qualified returning customers. Off-website leads — phone, WhatsApp, walk-in — are
        excluded. See the{' '}
        <Link href="/admin/bookings" className="text-accent underline-offset-4 hover:underline">
          records screen
        </Link>{' '}
        to set the amount collected on a booking.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className="border-t border-line pt-[var(--space-xs)]">
      <dt className="eyebrow">{label}</dt>
      <dd>
        <span className={`display block text-[clamp(1.5rem,4vw,2.5rem)] ${accent ? 'text-accent' : 'text-fg'}`}>
          {value}
        </span>
        <span className="text-[length:var(--text-xs)] text-fg-faint">{note}</span>
      </dd>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { BOOKING_STATUSES, statusLabel } from '@/lib/booking/status';
import { commissionForBooking } from '@/lib/utils/partnership';
import { useBookingRecords } from '../_components/useBookingRecords';
import { RecordsPlaceholder } from '../_components/EmptyState';

/**
 * Records screen — Milestone 3, Developer 2.
 *
 * Task Division Rev 2, p.4:
 *   [MEDIUM] "the records screen with viewing, searching and filtering of bookings"
 *   [EASY]   "the config-driven booking status control (New/Confirmed/Paid/
 *             Cancelled/Refunded) and the actual-amount-collected field"
 *   [EASY]   "the Returning Customer tag and the indicator for whether the
 *             customer originally came from the website"
 *
 * CONFIG-DRIVEN STATUS (docs/plan.md R-5). Every status option is rendered from
 * BOOKING_STATUSES. Marco may cut the set to New/Paid/Cancelled, and that has to
 * be a one-line deletion in lib/booking/status.ts — not a hunt through the admin.
 * The gate fails the build if a status list is ever hardcoded here.
 *
 * The commission column reads the shared helper, so the number in the table is
 * the same number the invoice bills. There is no second implementation.
 */

/** "Any status" sentinel for the filter — not a booking status. */
const ALL = '__all__';

export default function AdminBookingsPage() {
  const { state, bookings, patch, saveError } = useBookingRecords();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [websiteOnly, setWebsiteOnly] = useState(false);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (statusFilter !== ALL && booking.status !== statusFilter) return false;
      if (websiteOnly && !booking.fromWebsite) return false;
      if (!needle) return true;
      return [booking.id, booking.inquiryId, booking.status]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [bookings, search, statusFilter, websiteOnly]);

  return (
    <div className="shell py-[var(--space-lg)]">
      <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)] border-b border-line pb-[var(--space-sm)]">
        <h1 className="display text-[clamp(1.5rem,4vw,2.5rem)]">Records</h1>
        <p className="eyebrow">
          {state.status === 'ok' ? `${visible.length} of ${bookings.length} bookings` : 'Bookings'}
        </p>
      </div>

      {/* ---- Search + filter ---- */}
      <div className="mt-[var(--space-md)] grid gap-[var(--space-sm)] md:grid-cols-3">
        <div className="md:col-span-1">
          <label htmlFor="records-search" className="eyebrow mb-2 block">
            Search
          </label>
          <input
            id="records-search"
            type="search"
            value={search}
            placeholder="Reference or enquiry id"
            onChange={(e) => setSearch(e.target.value)}
            className="zs-tap w-full border border-line bg-transparent px-4 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
          />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="records-status-filter" className="eyebrow mb-2 block">
            Filter by status
          </label>
          <select
            id="records-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="zs-tap w-full border border-line bg-transparent px-4 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
          >
            <option value={ALL}>Any status</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end md:col-span-1">
          <label className="zs-tap inline-flex items-center gap-3 text-[length:var(--text-sm)] text-fg-muted">
            <input
              type="checkbox"
              checked={websiteOnly}
              onChange={(e) => setWebsiteOnly(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Website-sourced only
          </label>
        </div>
      </div>

      {saveError ? (
        <p role="alert" className="mt-[var(--space-sm)] border-l-2 border-accent pl-3 text-[length:var(--text-sm)]">
          {saveError}
        </p>
      ) : null}

      {/* ---- Table ---- */}
      <div className="mt-[var(--space-md)]">
        {state.status !== 'ok' || bookings.length === 0 ? (
          <RecordsPlaceholder state={state} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  {['Enquiry', 'Status', 'Amount collected (AED)', 'Origin', 'Customer', 'Commission'].map(
                    (heading) => (
                      <th key={heading} scope="col" className="eyebrow py-3 pr-4 align-bottom">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => (
                  <tr key={booking.id} className="border-b border-line align-middle">
                    <td className="py-3 pr-4 text-[length:var(--text-sm)]">
                      <span className="block text-fg">{booking.inquiryId || booking.id}</span>
                      <span className="text-[length:var(--text-xs)] text-fg-faint">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>

                    {/* Config-driven status control — R-5 */}
                    <td className="py-3 pr-4">
                      <label className="sr-only" htmlFor={`status-${booking.id}`}>
                        Status for {booking.inquiryId || booking.id}
                      </label>
                      <select
                        id={`status-${booking.id}`}
                        value={booking.status}
                        onChange={(e) => patch(booking.id, { status: e.target.value })}
                        className="border border-line bg-transparent px-3 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
                      >
                        {BOOKING_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actual amount collected */}
                    <td className="py-3 pr-4">
                      <label className="sr-only" htmlFor={`amount-${booking.id}`}>
                        Amount collected for {booking.inquiryId || booking.id}
                      </label>
                      <input
                        id={`amount-${booking.id}`}
                        type="number"
                        min={0}
                        step={1}
                        value={booking.amountCollected ?? ''}
                        placeholder="—"
                        onChange={(e) =>
                          patch(booking.id, {
                            amountCollected: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                        className="w-32 border border-line bg-transparent px-3 py-2 text-[length:var(--text-sm)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
                      />
                    </td>

                    {/* Did they originally come from the website? */}
                    <td className="py-3 pr-4">
                      <label className="inline-flex items-center gap-2 text-[length:var(--text-sm)]">
                        <input
                          type="checkbox"
                          checked={Boolean(booking.fromWebsite)}
                          onChange={(e) => patch(booking.id, { fromWebsite: e.target.checked })}
                          className="h-4 w-4 accent-accent"
                        />
                        <span className={booking.fromWebsite ? 'text-accent' : 'text-fg-faint'}>
                          {booking.fromWebsite ? 'Website' : 'Off-website'}
                        </span>
                      </label>
                    </td>

                    {/* Returning Customer tag */}
                    <td className="py-3 pr-4">
                      <label className="inline-flex items-center gap-2 text-[length:var(--text-sm)]">
                        <input
                          type="checkbox"
                          checked={Boolean(booking.returningCustomer)}
                          onChange={(e) => patch(booking.id, { returningCustomer: e.target.checked })}
                          className="h-4 w-4 accent-accent"
                        />
                        {booking.returningCustomer ? (
                          <span className="border border-accent px-2 py-0.5 text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-accent">
                            Returning
                          </span>
                        ) : (
                          <span className="text-fg-faint">New customer</span>
                        )}
                      </label>
                    </td>

                    {/* Commission — from the shared helper, never recomputed here */}
                    <td className="py-3 pr-4 text-[length:var(--text-sm)]">
                      <span className="text-fg">
                        {commissionForBooking(booking).toFixed(2)}
                      </span>
                      <span className="block text-[length:var(--text-xs)] text-fg-faint">
                        {statusLabel(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visible.length === 0 ? (
              <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] text-fg-muted">
                No bookings match this search or filter.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

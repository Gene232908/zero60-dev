/**
 * Booking status — config-driven by design (docs/plan.md R-5).
 *
 * Marco may want to reduce the set to just New / Paid / Cancelled. That has to
 * be a one-line change here, not a refactor across the form, the admin screens
 * and the invoice logic. So this array is the single source of truth: delete a
 * line and the whole system follows.
 *
 * Developer 2's admin status control reads from here (Task Division Rev 2, p.4).
 */

export const BOOKING_STATUSES = [
  { value: 'new', label: 'New', description: 'Inquiry received, not yet actioned.' },
  { value: 'confirmed', label: 'Confirmed', description: 'Booking agreed with the customer.' },
  { value: 'paid', label: 'Paid', description: 'Payment received in full.' },
  { value: 'cancelled', label: 'Cancelled', description: 'Booking will not go ahead.' },
  { value: 'refunded', label: 'Refunded', description: 'Payment returned to the customer.' },
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number]['value'];

/** Every inquiry starts here. */
export const DEFAULT_STATUS: BookingStatus = 'new';

export const BOOKING_STATUS_VALUES = BOOKING_STATUSES.map((s) => s.value);

export function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === 'string' && BOOKING_STATUS_VALUES.includes(value as BookingStatus);
}

export function statusLabel(value: string): string {
  return BOOKING_STATUSES.find((s) => s.value === value)?.label ?? value;
}

/**
 * Which statuses count as revenue-bearing.
 *
 * Developer 2 owns the partnership computation itself (Task Division Rev 2 p.4,
 * HARD). This flag is only here so both sides agree on *which* bookings qualify
 * — the client call was explicit that it applies to confirmed AND paid bookings
 * only. The arithmetic is not implemented on this side.
 */
export const REVENUE_STATUSES: BookingStatus[] = ['paid'];

/**
 * Firestore collection names and record shapes — docs/plan.md §4 M3.
 *
 * Three collections:
 *   inquiries   raw form submissions. Public may CREATE (validated shape only);
 *               nobody but the admin may read, update or delete.
 *   bookings    records derived from inquiries: status, amount collected, source.
 *   customers   people, so a returning customer can be recognised across bookings.
 *
 * Developer 2's admin side reads these (Task Division Rev 2, p.4). Names live
 * here so neither side hardcodes a string that the other might change.
 */

export const COLLECTIONS = {
  inquiries: 'inquiries',
  bookings: 'bookings',
  customers: 'customers',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Fields the admin side needs on a booking record.
 *
 * `amountCollected` and `returningCustomer` are Developer 2's to populate and
 * display; declared here so the two sides share one shape rather than drifting.
 * The partnership calculation that consumes `amountCollected` is theirs (HARD).
 */
export type BookingRecord = {
  inquiryId: string;
  status: string;
  /** What was actually collected, in AED. Set by the admin, never by the form. */
  amountCollected: number | null;
  /** Did this customer originally arrive through the website? */
  fromWebsite: boolean;
  returningCustomer: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerRecord = {
  name: string;
  email: string;
  mobile: string;
  /** Where we first met them — website, or an off-website channel. */
  origin: 'website' | 'offline';
  bookingCount: number;
  createdAt: string;
};

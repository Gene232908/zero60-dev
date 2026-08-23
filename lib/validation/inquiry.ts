import { z } from 'zod';

/**
 * The inquiry schema — ONE definition, used by the form, the API route and the
 * Firestore security rules (which mirror it in rules syntax).
 *
 * Field list is the approved one from docs/plan.md §1 "Booking form fields":
 * name, email, mobile, event type, date, location, requested services,
 * estimated guests, notes, plus the source-of-inquiry selector (063 / 063 Society).
 *
 * `guests` is kept because Marco needs it to size the sound system, and
 * `location` and `date` are kept for the same reason — all three were explicitly
 * confirmed on the client call.
 *
 * ⚠️ BLOCKER B13: the FINAL field list is still unconfirmed. This is the approved
 * set as recorded in the planning documents. If management adds or removes a
 * field, change it here and the form, the route and the rules follow.
 */

/** Which brand the enquiry came through. */
export const INQUIRY_SOURCES = [
  { value: 'productions', label: '063 Productions' },
  { value: 'society', label: '063 Society' },
] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number]['value'];

/**
 * Event types. Taken from the client's own six event categories on the live
 * site, plus an "other" escape hatch so nobody is turned away by a dropdown.
 */
export const EVENT_TYPE_OPTIONS = [
  'Corporate event or seminar',
  'Concert or festival',
  'Wedding',
  'Sports event',
  'Community or charity event',
  'Themed event or production',
  'Other',
] as const;

/** Requested services — the client's own list from the live contact section. */
export const SERVICE_OPTIONS = [
  'Sound System Rental',
  'Singer',
  'Performer',
  'DJ',
  'Sound Engineer',
  'Sports Announcer',
  'Host',
  'Photography',
  'Videography',
] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120, 'That name is too long.'),

  email: z.email('Please enter a valid email address.').max(200),

  // Deliberately permissive: international formats vary and a rejected phone
  // number is a lost lead. We check it is plausible, not that it is canonical.
  mobile: z
    .string()
    .trim()
    .min(6, 'Please enter a contact number.')
    .max(32, 'That number is too long.')
    .regex(/^[+()\d\s-]+$/, 'Please use digits, spaces, + and - only.'),

  eventType: z.string().trim().min(1, 'Please choose an event type.').max(80),

  // ISO date string from <input type="date">. Empty is allowed — plenty of
  // enquiries arrive before a date is settled.
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date.')
    .or(z.literal(''))
    .optional(),

  location: z.string().trim().max(200, 'That location is too long.').optional().or(z.literal('')),

  services: z
    .array(z.string().max(60))
    .min(1, 'Please select at least one service.')
    .max(SERVICE_OPTIONS.length),

  // Marco sizes the sound system from this, so it is a real number, not free text.
  guests: z
    .number({ error: 'Please enter an estimated guest count.' })
    .int('Please enter a whole number.')
    .min(1, 'There must be at least one guest.')
    .max(1_000_000, 'Please contact us directly for an event this size.')
    .optional(),

  notes: z.string().trim().max(2000, 'Please keep notes under 2000 characters.').optional().or(z.literal('')),

  source: z.enum(['productions', 'society'], { error: 'Please choose which brand you are contacting.' }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/**
 * Server-side shape actually written to Firestore. The client never supplies
 * these — they are stamped on the server so a submitter cannot forge them.
 */
export type InquiryRecord = InquiryInput & {
  createdAt: string;
  status: string;
  /** Set by the server; the public form cannot claim a booking already exists. */
  fromWebsite: true;
};

/** Flatten Zod issues into a { field: message } map for the form to render. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * PLACEHOLDER CONTENT — Milestone 1
 *
 * Every string and every image in this file is a PLACEHOLDER. None of it is
 * client-supplied copy. Real photography, service copy, testimonials and
 * partner logos arrive in Milestone 2 (see BLOCKERS.md for what is outstanding).
 *
 * Rule for this project: never invent client data. Where a value is missing we
 * ship a clearly-labelled empty slot instead of plausible-looking fiction.
 */

export const PLACEHOLDER_NOTICE = 'PLACEHOLDER — awaiting final content from client';

export type PlaceholderImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder: true;
};

/** Art-directed stand-in frames. Swap for client photography in M2. */
export const PLACEHOLDER_IMAGES: Record<string, PlaceholderImage> = {
  heroPrimary: {
    src: '/placeholders/frame-hero.svg',
    alt: 'PLACEHOLDER — hero image slot, awaiting client photography',
    width: 1600,
    height: 2000,
    placeholder: true,
  },
  heroSecondary: {
    src: '/placeholders/frame-wide.svg',
    alt: 'PLACEHOLDER — secondary hero image slot, awaiting client photography',
    width: 2000,
    height: 1200,
    placeholder: true,
  },
  productions: {
    src: '/placeholders/frame-productions.svg',
    alt: 'PLACEHOLDER — 063 Productions image slot, awaiting client photography',
    width: 1400,
    height: 1750,
    placeholder: true,
  },
  society: {
    src: '/placeholders/frame-society.svg',
    alt: 'PLACEHOLDER — 063 Society image slot, awaiting client photography',
    width: 1400,
    height: 1750,
    placeholder: true,
  },
  workA: {
    src: '/placeholders/frame-work-a.svg',
    alt: 'PLACEHOLDER — portfolio image slot A, awaiting client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
  workB: {
    src: '/placeholders/frame-work-b.svg',
    alt: 'PLACEHOLDER — portfolio image slot B, awaiting client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
  workC: {
    src: '/placeholders/frame-work-c.svg',
    alt: 'PLACEHOLDER — portfolio image slot C, awaiting client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
};

/** Hero composition. Wordmark is factual; the strapline is a PLACEHOLDER. */
export const HERO_PLACEHOLDER = {
  wordmark: ['ZERO', 'SIXTY', 'THREE'],
  strapline: 'PLACEHOLDER — brand strapline to be supplied by client',
  location: 'PLACEHOLDER — city / region',
  since: 'PLACEHOLDER — established year',
  meta: 'PLACEHOLDER — one-line positioning statement',
};

/** Full-bleed ticker. Service names are structural, not final client wording. */
export const TICKER_PLACEHOLDER = [
  'PLACEHOLDER — SERVICE ONE',
  'PLACEHOLDER — SERVICE TWO',
  'PLACEHOLDER — SERVICE THREE',
  'PLACEHOLDER — SERVICE FOUR',
  'PLACEHOLDER — SERVICE FIVE',
];

/** The large editorial statement. Real brand story lands in M2 (About page). */
export const MANIFESTO_PLACEHOLDER = {
  eyebrow: 'PLACEHOLDER — section label',
  statement: ['PLACEHOLDER', 'BRAND', 'STATEMENT'],
  body: 'PLACEHOLDER — the brand story paragraph will be supplied by the client in Milestone 2. This slot holds its length and rhythm so the composition can be reviewed now.',
};

/**
 * The dual-brand section: the one place on the landing page where both moods
 * sit side by side. Copy is placeholder; the *structure* is the deliverable.
 */
export const DUAL_BRAND_PLACEHOLDER = {
  productions: {
    name: '063 Productions',
    mood: 'Rugged',
    blurb: 'PLACEHOLDER — 063 Productions positioning copy, to be supplied by client.',
    href: '/services',
    image: PLACEHOLDER_IMAGES.productions,
  },
  society: {
    name: '063 Society',
    mood: 'Elegant',
    blurb: 'PLACEHOLDER — 063 Society positioning copy, to be supplied by client.',
    href: '/society',
    image: PLACEHOLDER_IMAGES.society,
  },
};

/** Editorial index list — replaces a generic card grid (design brief §19). */
export const WORK_INDEX_PLACEHOLDER = [
  { index: '01', title: 'PLACEHOLDER — PROJECT ONE', year: '—', image: PLACEHOLDER_IMAGES.workA },
  { index: '02', title: 'PLACEHOLDER — PROJECT TWO', year: '—', image: PLACEHOLDER_IMAGES.workB },
  { index: '03', title: 'PLACEHOLDER — PROJECT THREE', year: '—', image: PLACEHOLDER_IMAGES.workC },
  { index: '04', title: 'PLACEHOLDER — PROJECT FOUR', year: '—', image: PLACEHOLDER_IMAGES.workA },
];

/** Structured information block — deliberately not a card grid. */
export const CAPABILITIES_PLACEHOLDER = {
  eyebrow: 'PLACEHOLDER — section label',
  heading: ['PLACEHOLDER', 'CAPABILITIES'],
  rows: [
    { label: 'PLACEHOLDER — capability one', detail: 'PLACEHOLDER — supporting detail' },
    { label: 'PLACEHOLDER — capability two', detail: 'PLACEHOLDER — supporting detail' },
    { label: 'PLACEHOLDER — capability three', detail: 'PLACEHOLDER — supporting detail' },
    { label: 'PLACEHOLDER — capability four', detail: 'PLACEHOLDER — supporting detail' },
    { label: 'PLACEHOLDER — capability five', detail: 'PLACEHOLDER — supporting detail' },
  ],
};

/** The closing statement — visual climax of the page (design brief §21). */
export const FINAL_CTA_PLACEHOLDER = {
  lines: ['PLACEHOLDER', 'CLOSING', 'STATEMENT'],
  supporting: 'PLACEHOLDER — closing supporting line',
  contactLabel: 'Start a conversation',
  contactHref: '/contact',
};

/**
 * Footer credit banner — Developer 1 deliverable (Task Division Rev 2, M1).
 * Agency name, logo and destination URL are all UNCONFIRMED. Provisionally
 * "Crest Services" per the client call, pending sign-off. Do not hardcode a
 * real URL until management confirms it.
 */
export const FOOTER_CREDIT_PLACEHOLDER = {
  prefix: 'Developed by',
  agencyName: 'PLACEHOLDER — agency name (provisionally Crest Services, unconfirmed)',
  href: null as string | null, // TODO/BLOCKER: destination URL not yet supplied
  logoSrc: null as string | null, // TODO/BLOCKER: agency logo asset not yet supplied
};

/** Contact details shown in the footer. Client has not supplied final values. */
export const CONTACT_PLACEHOLDER = {
  email: 'PLACEHOLDER — contact email',
  phone: 'PLACEHOLDER — contact number',
  socials: [
    { label: 'Instagram', href: null as string | null },
    { label: 'YouTube', href: null as string | null },
    { label: 'TikTok', href: null as string | null },
  ],
};

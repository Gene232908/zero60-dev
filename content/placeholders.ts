/**
 * PLACEHOLDER CONTENT — what the client has NOT supplied yet.
 *
 * Real copy now lives in content/site.ts, transcribed from the live site. This
 * file holds only the genuinely missing pieces, so the gap between "we have it"
 * and "we are waiting on it" stays obvious in the code.
 *
 * Rule for this project: never invent client data. Where a value is missing we
 * ship a clearly-labelled empty slot instead of plausible-looking fiction.
 *
 * See BLOCKERS.md for the full register.
 */

export const PLACEHOLDER_NOTICE = 'PLACEHOLDER — awaiting final asset from client';

export type PlaceholderImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder: true;
};

/**
 * BLOCKER B2 — photography.
 *
 * The client supplied the live site as flattened section screenshots with the
 * headings and body copy baked into the JPEGs. Those are usable as a content
 * reference (and the copy has been transcribed into content/site.ts) but they
 * cannot be used as site photography — they would render the OLD site's text
 * inside the new one. Original, un-composited image files are still required.
 */
export const PLACEHOLDER_IMAGES: Record<string, PlaceholderImage> = {
  heroPrimary: {
    src: '/placeholders/frame-hero.svg',
    alt: 'PLACEHOLDER — hero image slot, awaiting original client photography',
    width: 1600,
    height: 2000,
    placeholder: true,
  },
  heroSecondary: {
    src: '/placeholders/frame-wide.svg',
    alt: 'PLACEHOLDER — full-bleed image slot, awaiting original client photography',
    width: 2000,
    height: 1200,
    placeholder: true,
  },
  productions: {
    src: '/placeholders/frame-productions.svg',
    alt: 'PLACEHOLDER — 063 Productions image slot, awaiting original client photography',
    width: 1400,
    height: 1750,
    placeholder: true,
  },
  society: {
    src: '/placeholders/frame-society.svg',
    alt: 'PLACEHOLDER — 063 Society image slot, awaiting original client photography',
    width: 1400,
    height: 1750,
    placeholder: true,
  },
  workA: {
    src: '/placeholders/frame-work-a.svg',
    alt: 'PLACEHOLDER — event image slot A, awaiting original client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
  workB: {
    src: '/placeholders/frame-work-b.svg',
    alt: 'PLACEHOLDER — event image slot B, awaiting original client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
  workC: {
    src: '/placeholders/frame-work-c.svg',
    alt: 'PLACEHOLDER — event image slot C, awaiting original client photography',
    width: 1200,
    height: 1500,
    placeholder: true,
  },
};

/**
 * BLOCKER B4 — 063 Society.
 *
 * The supplied material covers 063 Productions only. Nothing about 063 Society
 * — no copy, no service categories, no imagery — exists in the source, so the
 * elegant half of the brand is entirely placeholder until the client provides it.
 */
export const SOCIETY_PLACEHOLDER = {
  name: '063 Society',
  mood: 'Elegant',
  blurb: 'PLACEHOLDER — 063 Society positioning copy, not yet supplied by client.',
  intro:
    'PLACEHOLDER — 063 Society introduction. Service categories (weddings, corporate, event programme support, music & entertainment, AV/production) and final copy arrive in Milestone 2.',
};

/**
 * BLOCKER B3 — footer credit banner.
 *
 * Agency name, logo asset and destination URL are all unconfirmed. Provisionally
 * "Crest Services" per the client call, pending sign-off. Do not hardcode a real
 * URL until management confirms it.
 */
export const FOOTER_CREDIT_PLACEHOLDER = {
  prefix: 'Developed by',
  agencyName: 'PLACEHOLDER — agency name (provisionally Crest Services, unconfirmed)',
  href: null as string | null, // TODO/BLOCKER: destination URL not yet supplied
  logoSrc: null as string | null, // TODO/BLOCKER: agency logo asset not yet supplied
};

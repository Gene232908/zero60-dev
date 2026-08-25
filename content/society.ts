/**
 * 063 SOCIETY — content module.
 *
 * ⚠️ READ THIS BEFORE EDITING.
 *
 * The client has supplied NOTHING for 063 Society: no copy, no descriptions, no
 * photography. The only Society facts that exist in any project document are:
 *
 *   1. The brand name — "063 Society".
 *   2. The mood — elegant, as against Productions' rugged (client call,
 *      Task Division Rev 2 p.1, plan.md §2.2).
 *   3. The five service categories, named in plan.md §4 M2 and Task Division
 *      Rev 2 p.3: weddings · corporate · event program support ·
 *      music & entertainment · AV/production.
 *
 * So the category NAMES below are real — they come from the signed planning
 * documents. Every description, every piece of body copy and every image is a
 * labelled PLACEHOLDER. Nothing here is invented to fill space.
 *
 * This is BLOCKER B4. The page architecture, the elegant token mode and the
 * restrained motion are all real and reviewable today; the words and pictures
 * drop in without touching a component.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * REDESIGN (2026-08-25). The brief asked for the page to be rebuilt at the
 * pacing and compositional standard of planfest.framer.website and
 * lightfall.framer.website — a longer narrative arc rather than five sections.
 * That expanded the page from 5 sections to 10, which needed more content
 * SLOTS, not more invented content. Every slot added below is a labelled
 * placeholder of the correct length and rhythm, so the composition can be
 * judged now and the client's words drop straight in.
 *
 * The one thing deliberately NOT imported from the reference brief: its
 * "private membership society / request access / limited membership" framing.
 * 063 Society is the elegant EVENTS arm of ZeroSixtyThree — weddings, corporate,
 * AV — per the signed plan. A membership programme would be a fabricated
 * commercial claim on a client site. The reference's DESIGN logic is applied in
 * full; its subject matter is not.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const SOCIETY_BRAND = {
  name: '063 Society',
  wordmark: ['063', 'Society'],
  mood: 'Elegant',
  /** PLACEHOLDER — awaiting the client's own positioning line. */
  tagline: 'PLACEHOLDER — 063 Society positioning line, to be supplied by client.',
  /** PLACEHOLDER — awaiting the client's own introduction copy. */
  intro:
    'PLACEHOLDER — 063 Society introduction. This slot holds the length and rhythm of the real paragraph so the composition can be reviewed now; the wording is not ours to write.',
  /** PLACEHOLDER — awaiting the client's own closing statement. */
  closing: ['PLACEHOLDER', 'Society', 'statement'],
} as const;

/**
 * The manifesto — Section 02, the editorial statement that follows the hero.
 *
 * Set as separate lines because the section reveals them one at a time with an
 * increasing indent. Three lines is the composition; a longer statement would
 * need the indents re-tuned in SocietyManifesto.
 *
 * PLACEHOLDER (B4).
 */
export const SOCIETY_MANIFESTO = {
  lines: ['PLACEHOLDER —', 'the Society', 'statement.'],
  /** The small supporting line under the statement. */
  footnote: 'PLACEHOLDER — supporting line beneath the statement.',
} as const;

/**
 * Section 03 — the editorial "what this is" spread.
 *
 * A label, a lead paragraph and a supporting paragraph: the magazine-spread
 * shape the brief asked for instead of a conventional About block.
 *
 * PLACEHOLDER (B4).
 */
export const SOCIETY_ABOUT = {
  label: 'The Society',
  lead: 'PLACEHOLDER — the lead paragraph for the Society editorial spread. Set at a larger size than body copy, this slot carries the weight of the section and holds roughly the sentence count the real copy should run to.',
  support:
    'PLACEHOLDER — the supporting paragraph. Smaller, set beneath the lead across a narrower measure, it exists to give the spread a second beat rather than to repeat the first.',
} as const;

/**
 * Section 04 — the approach. Three named principles.
 *
 * The brief called for "cultural pillars"; the honest equivalent for an events
 * house is how it works. Titles are DESCRIPTIVE OF PROCESS, not commercial
 * claims — they say nothing about the client that the plan does not.
 *
 * Descriptions are PLACEHOLDER (B4).
 */
export type SocietyPillar = {
  index: string;
  title: string;
  description: string;
};

export const SOCIETY_PILLARS: SocietyPillar[] = [
  {
    index: '01',
    title: 'Consider',
    description: 'PLACEHOLDER — how a Society event begins, to be supplied by client.',
  },
  {
    index: '02',
    title: 'Compose',
    description: 'PLACEHOLDER — how the event is planned and built, to be supplied by client.',
  },
  {
    index: '03',
    title: 'Conduct',
    description: 'PLACEHOLDER — how the night itself is run, to be supplied by client.',
  },
];

export type SocietyCategory = {
  index: string;
  /** Real — named in plan.md §4 M2 / Task Division Rev 2 p.3. */
  title: string;
  /** PLACEHOLDER — no descriptions supplied. */
  description: string;
};

export const SOCIETY_CATEGORIES: SocietyCategory[] = [
  {
    index: '01',
    title: 'Weddings',
    description: 'PLACEHOLDER — weddings description, to be supplied by client.',
  },
  {
    index: '02',
    title: 'Corporate',
    description: 'PLACEHOLDER — corporate description, to be supplied by client.',
  },
  {
    index: '03',
    title: 'Event Program Support',
    description: 'PLACEHOLDER — event program support description, to be supplied by client.',
  },
  {
    index: '04',
    title: 'Music & Entertainment',
    description: 'PLACEHOLDER — music & entertainment description, to be supplied by client.',
  },
  {
    index: '05',
    title: 'AV / Production',
    description: 'PLACEHOLDER — AV and production description, to be supplied by client.',
  },
];

/**
 * Section 05 — the marquee band.
 *
 * The brief asked for a horizontal moving strip. SOCIETY_NOTES has said "no
 * marquees" since Milestone 1 — that rule was written against the PRODUCTIONS
 * marquee: uppercase grotesque, fast, loud, a branding shout. The brief is
 * explicitly overriding it, so the rule is amended rather than ignored: Society
 * gets a marquee, but at the elegant register — serif, mixed case, roughly half
 * the speed, hairline separators, no accent fill. See SOCIETY_NOTES below.
 *
 * These are the five REAL category names, so the band states only what the
 * signed plan already states.
 */
export const SOCIETY_MARQUEE: readonly string[] = [
  'Weddings',
  'Corporate',
  'Event Program Support',
  'Music & Entertainment',
  'AV / Production',
] as const;

/**
 * Section 07 — what a Society event covers.
 *
 * Drawn from the five real categories, re-cut as an asymmetric editorial
 * composition rather than repeating the index. Each entry pairs a neutral
 * structural title with a placeholder line.
 *
 * PLACEHOLDER descriptions (B4).
 */
export type SocietyExperience = {
  index: string;
  title: string;
  note: string;
};

export const SOCIETY_EXPERIENCES: SocietyExperience[] = [
  {
    index: '01',
    title: 'The Room',
    note: 'PLACEHOLDER — line about the space and how it is dressed.',
  },
  {
    index: '02',
    title: 'The Sound',
    note: 'PLACEHOLDER — line about audio, music and entertainment.',
  },
  {
    index: '03',
    title: 'The Record',
    note: 'PLACEHOLDER — line about photography, video and AV capture.',
  },
];

/**
 * Section 09 — the enquiry section.
 *
 * NOT "request access". 063 Society takes enquiries; it does not run a
 * membership. The heading is a placeholder; the contact details come from
 * content/site.ts and are real.
 */
export const SOCIETY_ENQUIRY = {
  heading: ['An occasion', 'worth the', 'detail.'],
  /** PLACEHOLDER — awaiting the client's own invitation line. */
  invitation: 'PLACEHOLDER — 063 Society invitation line, to be supplied by client.',
  cta: 'Make an enquiry',
} as const;

/**
 * The elegant register, stated explicitly so the art direction survives the
 * handover and the eventual content drop.
 *
 * Society is NOT "Productions in a lighter colour". It is: paper ground,
 * high-contrast serif display, generous whitespace, lime reduced to a hairline,
 * slow line-draws and fades instead of grain and shouting.
 */
export const SOCIETY_NOTES = {
  register: 'Elegant — restrained motion, serif display, generous air, lime as hairline only.',
  /**
   * AMENDED 2026-08-25. Previously "No marquees, no grain overlay, no rotating
   * stickers, no aggressive kinetic type."
   *
   * The redesign brief explicitly requires a horizontal marquee band, so the
   * blanket ban is replaced by a qualified one. What the original rule was
   * actually protecting against is Productions' marquee VOICE — fast, uppercase
   * grotesque, accent-filled, used as a shout. A serif marquee at half speed
   * with hairline separators is a different device that happens to share a
   * mechanism, and it earns its place as the bridge between two sections.
   */
  avoid:
    'No grain overlay, no rotating stickers, no aggressive kinetic type. A marquee is permitted ONLY at the elegant register: serif, mixed case, ≥60s per pass, hairline separators, never accent-filled.',
} as const;

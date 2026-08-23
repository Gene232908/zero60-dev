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
 * The elegant register, stated explicitly so the art direction survives the
 * handover and the eventual content drop.
 *
 * Society is NOT "Productions in a lighter colour". It is: paper ground,
 * high-contrast serif display, generous whitespace, lime reduced to a hairline,
 * slow line-draws and fades instead of marquees and grain.
 */
export const SOCIETY_NOTES = {
  register: 'Elegant — restrained motion, serif display, generous air, lime as hairline only.',
  avoid: 'No marquees, no grain overlay, no rotating stickers, no aggressive kinetic type.',
} as const;

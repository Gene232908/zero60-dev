/**
 * COLLABORATIONS CONTENT — Milestone 2, Developer 2.
 *
 * ⚠️ BLOCKER B8 — partner logos, and which projects sit under which partner,
 * were never supplied. There is also an unresolved permission question: the
 * handoff notes that we need confirmation of display permission per partner
 * before showing anyone's mark (docs/HANDOFF-DEV2.md §2).
 *
 * Publishing an invented partner would be worse than an empty page — it would
 * put a third party's name on a client site without their consent. So the list
 * stays empty, the page states plainly what is missing, and the marquee, the
 * project board and the permission column are all built and waiting.
 *
 * TO GO LIVE: add entries to PARTNERS. No component or layout change needed.
 */

import { PLACEHOLDER_NOTICE } from './placeholders';

export type PartnerProject = {
  title: string;
  /** Local image path under public/. Never a hotlinked third-party asset. */
  image?: { src: string; alt: string; width: number; height: number };
};

export type Partner = {
  name: string;
  /** Local logo asset. Requires written display permission — see B8. */
  logo?: { src: string; alt: string; width: number; height: number };
  /** Which projects sit under this partner. */
  projects: PartnerProject[];
  /** Has the client confirmed we may display this partner's mark? */
  displayPermission: boolean;
};

/**
 * BLOCKER B8 — empty until management supplies logos, project mapping and
 * per-partner display permission.
 * @see docs/BLOCKERS.md B8
 */
export const PARTNERS: Partner[] = [];

/** Rendered in place of the marquee and the project board while B8 is open. */
export const PARTNERS_PLACEHOLDER = {
  notice: PLACEHOLDER_NOTICE,
  heading: 'Collaborators',
  body:
    'Partner logos, the projects that sit under each partner, and written permission to display each mark are all still outstanding. Nothing is shown here rather than showing a third party without their consent.',
  blocker: 'BLOCKER B8',
  awaiting: [
    'Partner and collaborator logo files',
    'Which projects sit under which partner',
    'Written confirmation of display permission, per partner',
  ],
} as const;

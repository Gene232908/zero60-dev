/**
 * COLLABORATIONS CONTENT — Milestone 2, Developer 2.
 *
 * ⚠️ BLOCKER B8 — partner logos, and which projects sit under which partner,
 * were never supplied. There is also an unresolved permission question: the
 * handoff notes that we need confirmation of display permission per partner
 * before showing anyone's mark (docs/HANDOFF-DEV2.md §2).
 *
 * Publishing an invented REAL partner would be worse than an empty page — it
 * would put a third party's name on a client site without their consent. So
 * PARTNERS stays driven by SAMPLE_PARTNERS below, not any actual company:
 * generic "Partner One / Two / Three" labels and the client's OWN event
 * photography (already public in this repo, not a third-party asset), so the
 * client can review the marquee and the project-board LAYOUT while B8 stays
 * open. Swap SAMPLE_PARTNERS for PARTNERS (or replace its contents directly)
 * once real logos, project mapping and written permission land — the
 * component reads whichever array PARTNERS points to, so no layout change is
 * needed either way.
 *
 * TO GO LIVE WITH REAL PARTNERS: replace the contents of PARTNERS with actual
 * entries (name, licensed logo, real projects, displayPermission: true per
 * partner). No component or layout change needed.
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
 * SAMPLE DATA — NOT REAL PARTNERS. Generic labels only ("Partner One" etc.),
 * no invented company names, no third-party logos or marks. The photography
 * is the client's own (public/media/*), used elsewhere on the live site, so
 * nothing here borrows imagery that isn't already the client's to show. This
 * exists purely so the client can see how the marquee + project board look
 * once populated — it answers "what will this look like", not BLOCKER B8
 * itself, which still needs real partner names, logos and signed permission.
 */
export const SAMPLE_PARTNERS: Partner[] = [
  {
    name: 'Partner One',
    projects: [
      { title: 'Sample project — corporate summit', image: { src: '/media/ev-corporate.webp', alt: 'Sample preview image — corporate event coverage', width: 1200, height: 900 } },
      { title: 'Sample project — awards night', image: { src: '/media/ev-themed.webp', alt: 'Sample preview image — themed event coverage', width: 1200, height: 900 } },
      { title: 'Sample project — product launch', image: { src: '/media/bento-emcee.webp', alt: 'Sample preview image — hosting/emcee coverage', width: 1200, height: 900 } },
    ],
    displayPermission: true,
  },
  {
    name: 'Partner Two',
    projects: [
      { title: 'Sample project — wedding reception', image: { src: '/media/ev-wedding.webp', alt: 'Sample preview image — wedding coverage', width: 1200, height: 900 } },
      { title: 'Sample project — festival stage', image: { src: '/media/ev-concert.webp', alt: 'Sample preview image — concert coverage', width: 1200, height: 900 } },
    ],
    displayPermission: true,
  },
  {
    name: 'Partner Three',
    projects: [
      { title: 'Sample project — championship match', image: { src: '/media/ev-sports.webp', alt: 'Sample preview image — sports event coverage', width: 1200, height: 900 } },
      { title: 'Sample project — charity gala', image: { src: '/media/ev-community.webp', alt: 'Sample preview image — community/charity event coverage', width: 1200, height: 900 } },
      { title: 'Sample project — festival AV rig', image: { src: '/media/stage-truss.webp', alt: 'Sample preview image — stage/AV rig', width: 1200, height: 900 } },
    ],
    displayPermission: true,
  },
] as const;

/**
 * Wired to SAMPLE_PARTNERS so the page shows the populated layout. Swap this
 * assignment back to `[]`, or replace the contents outright, once real
 * partner data with signed permission is available (see BLOCKER B8 above).
 */
export const PARTNERS: Partner[] = SAMPLE_PARTNERS;

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

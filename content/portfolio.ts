/**
 * PORTFOLIO CONTENT — Milestone 2, Developer 2.
 *
 * ⚠️ READ THIS BEFORE ADDING ANYTHING HERE.
 *
 * The portfolio is built COMPLETE but currently runs on empty data, because the
 * two things it needs were never supplied:
 *
 *   BLOCKER B9 — YouTube video links. The upload session requires management to
 *                type their own password on the developer machine, and it has
 *                not happened (docs/BLOCKERS.md, OI-3). There are therefore no
 *                video ids in existence to put here.
 *   BLOCKER B7 — Portfolio photography. The only imagery supplied is cropped
 *                from 1366px-wide screenshots of the live site.
 *
 * The project rule is absolute: never invent client data (docs/plan.md,
 * content/placeholders.ts). A plausible-looking video id or a stock photograph
 * would reach the client review looking like real work, so both lists below stay
 * empty and the page renders a clearly-labelled empty slot instead.
 *
 * TO GO LIVE: paste the ids into PORTFOLIO_VIDEOS. Nothing else changes — no
 * component edit, no layout change. The gate checks that this stays true.
 */

import { PLACEHOLDER_NOTICE } from './placeholders';
import { SCENES, PORTFOLIO_FRAMES } from './media';
import type { Media } from './media';

export type PortfolioVideo = {
  /** YouTube watch id, e.g. the part after `?v=`. */
  videoId: string;
  title: string;
  /** Optional local poster frame; falls back to a plain panel when absent. */
  poster?: Media;
};

/**
 * BLOCKER B9 — empty until management supplies the links.
 * @see docs/BLOCKERS.md B9, OI-3
 */
export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [];

/** Shown in place of the video grid while B9 is outstanding. */
export const VIDEO_PLACEHOLDER = {
  notice: PLACEHOLDER_NOTICE,
  heading: 'Video reel',
  body:
    'The YouTube links are not available yet. The upload session needs management to sign in themselves on the developer machine — once that happens the reel appears here with no further work.',
  blocker: 'BLOCKER B9',
} as const;

/**
 * Gallery frames.
 *
 * BLOCKER B7 — no portfolio photography was supplied, so the gallery runs on the
 * client's own wide scene frames from content/media.ts. These are genuine client
 * images (not stock, not invented), but they are low-resolution crops, so the
 * layout keeps them at moderate sizes and never enlarges one to fill a viewport.
 */
export type GalleryFrame = {
  media: Media;
  /** Short editorial caption — descriptive of the frame, never a fabricated credit. */
  caption: string;
};

export const GALLERY_FRAMES: GalleryFrame[] = [
  { media: SCENES.stageTruss, caption: 'Stage and truss, pre-show' },
  { media: SCENES.audioDesk, caption: 'Front of house' },
  { media: SCENES.soundEngineer, caption: 'Sound engineering' },
  { media: SCENES.djDecks, caption: 'DJ set' },
  // The two frames supplied specifically for the portfolio. SCENES.drums used to
  // sit here and was dropped — it is a 512x408 screenshot crop, and enlarging it
  // in a gallery is exactly where that shows.
  { media: PORTFOLIO_FRAMES[0], caption: 'Live performance' },
  { media: PORTFOLIO_FRAMES[1], caption: 'Crowd and stage wash' },
  // REMOVED — client direction: the Videography (SCENES.videoCamera) and
  // Photography (SCENES.photoLens) frames come out of the portfolio.
  //
  // Removed from the DATA, not just from the "In the room" collage the client
  // pointed at, and that is a deliberate reading of the request rather than a
  // literal one. This one array feeds both movements of the gallery: the
  // typographic index at the top, and the collage below it. Dropping the two
  // frames from the collage alone would have left their rows in the index,
  // where pointing at one still raises the same photograph under the cursor
  // via ImageHoverPreview — the picture the client asked to remove would have
  // gone on appearing, in the one place they were most likely to look next.
  //
  // Everything downstream counts off this array, so "8 frames" in the Divider
  // and the section header became 6 on their own. Nothing else needed editing.
  //
  // TO RESTORE either one, put its line back — the images themselves are
  // untouched in content/media.ts and still in use elsewhere on the site.
];

/** Shown alongside the gallery so the missing originals are never mistaken for the final state. */
export const GALLERY_PLACEHOLDER = {
  notice: PLACEHOLDER_NOTICE,
  body:
    'These are the client\'s own frames, recovered from the live site at screen resolution. High-resolution originals are still outstanding, so nothing here is enlarged beyond its native size.',
  blocker: 'BLOCKER B7',
} as const;

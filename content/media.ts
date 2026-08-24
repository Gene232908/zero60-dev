/**
 * MEDIA MANIFEST — the client's own imagery.
 *
 * Provenance: cropped from the live-site section exports in `current website/`.
 * Those exports are flattened screenshots with headings and body copy baked in,
 * so each crop targets a region with no text in it. Nothing here is stock and
 * nothing is generated — it is the client's photography, re-framed.
 *
 * Processing: the service-section exports sit under a heavy dark scrim (they
 * were designed as backgrounds for white type), so those crops are exposure-
 * lifted and desaturated to grayscale. That also matches the brand's existing
 * black-and-white photographic base (plan.md §2.1) and the duotone treatment
 * called for in §2.5.
 *
 * ⚠️ STILL A BLOCKER (B2): these are limited by their source — the screenshots
 * are 1366px wide, so several crops are low-resolution and will look soft at
 * large sizes. They are good enough to review the design end-to-end. Replace
 * with the original, un-composited photography before launch.
 */

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true = the client's own photograph; false = a generated stand-in frame. */
  client: boolean;
};

const m = (src: string, width: number, height: number, alt: string): Media => ({
  src: `/media/${src}.webp`,
  alt,
  width,
  height,
  client: true,
});

/** Editorial tiles — the five images the live About section leads with. */
export const TILES = {
  guitar: m('tile-guitar', 226, 348, 'Acoustic guitar being played'),
  mixer: m('tile-mixer', 226, 348, 'Hands working a mixing console'),
  stage: m('tile-stage', 228, 344, 'Empty stage rigged with lighting truss'),
  cameraOp: m('tile-camera-op', 226, 348, 'Camera operator filming an event'),
  camera: m('tile-camera', 226, 348, 'Camera body and printed photographs'),
} as const;

/** Wide, moody B&W frames — used as full-bleed bands and section backgrounds. */
export const SCENES = {
  stageTruss: m('stage-truss', 1240, 308, 'Stage and lighting truss before an event'),
  audioDesk: m('audio-desk-top', 1366, 262, 'Audio mixing desk in low light'),
  djDecks: m('dj-decks', 964, 192, 'DJ decks and controller'),
  soundEngineer: m('sound-engineer', 664, 444, 'Sound engineer at the mixing desk'),
  drums: m('drums', 512, 408, 'Drum kit on a lit stage'),
  videoCamera: m('video-camera', 664, 448, 'Cinema camera rig on a shoot'),
  photoLens: m('photo-lens', 1064, 318, 'Camera lens resting on a reflective surface'),
} as const;

/**
 * Event-category imagery. These map 1:1 onto EVENT_TYPES in content/site.ts —
 * the live site pairs exactly these photographs with exactly these categories.
 */
export const EVENT_MEDIA: Media[] = [
  m('ev-corporate', 190, 156, 'Speaker presenting at a corporate seminar'),
  m('ev-concert', 200, 156, 'Crowd and stage lighting at a concert'),
  m('ev-wedding', 190, 140, 'Wedding reception table setting'),
  m('ev-sports', 202, 140, 'Supporters cheering at a sports event'),
  m('ev-community', 190, 142, 'Children taking part in a community event'),
  m('ev-themed', 200, 142, 'Audio equipment set up for an outdoor themed event'),
];

/**
 * The brand mark, in both moods.
 *
 * `mark` is the supplied white-and-lime logo, correct on the black Productions
 * ground. It disappears against 063 Society's paper ground, which is exactly the
 * problem docs/ASSET-REQUEST.md §62 and docs/HANDOFF-DEV2.md §5 raised. The dark
 * variant has since been supplied by management and is derived by
 * scripts/generate-society-mark.mjs.
 *
 * Sources: public/zero63logo.png and public/zero63logo-black.png, both trimmed
 * and resized rather than shipped raw.
 */
export const LOGO = {
  mark: '/brand/logo-mark.webp',
  markLarge: '/brand/logo-mark.png',
  /** Dark mark — for the paper ground of 063 Society. */
  markDark: '/brand/logo-mark-dark.webp',
  markDarkLarge: '/brand/logo-mark-dark.png',
  alt: 'Zero-Sixty-Three Productions',
} as const;

/** The mark that stays legible in a given brand mood. */
export function logoForBrand(brand: 'productions' | 'society'): string {
  return brand === 'society' ? LOGO.markDark : LOGO.mark;
}

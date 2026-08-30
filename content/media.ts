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
 * The landing hero plate.
 *
 * Supplied separately by management as public/src/herobg.jpg and processed by
 * scripts/generate-hero-bg.mjs — desaturated, pulled down and re-encoded from
 * 1370KB to 142KB. It ships grayscale on purpose: the lime duotone is applied in
 * CSS from var(--accent), so the one confirmed brand colour keeps a single
 * source of truth rather than being baked into a binary.
 *
 * Resolution caveat (BLOCKER B2): the source is 1366px wide and is upscaled to
 * 1600px here, so it is soft on a very wide display. Replace with the original
 * full-resolution frame before launch.
 */
/**
 * The hero two framed photographs.
 *
 * These used to borrow TILES.cameraOp and SCENES.drums, which meant the most
 * prominent image on the site was also a small About tile. Management supplied
 * dedicated frames, so the hero now has its own identity — see
 * docs/IMAGE-CHECKLIST.pdf note.
 */
export const HERO = {
  main: m('hero-main', 1200, 1500, 'Camera operator filming a live event'),
  detail: m('hero-detail', 1000, 800, 'Mixing console faders in close-up'),
} as const;

/**
 * 063 SOCIETY — real photography at last.
 *
 * Every Society slot rendered a grey placeholder frame from
 * content/placeholders.ts because no Society imagery had ever been supplied
 * (BLOCKER B4). Management has now provided all three.
 *
 * SOCIETY.main used to serve BOTH the Two Houses panel on the landing page and
 * the Society page hero. It no longer does: the landing panel now takes
 * SOCIETY.tall (client direction — see the note on the SOCIETY panel in
 * components/sections/DualBrandSplit.tsx). `main` is warm, bright and
 * saturated, which is correct on /society's paper ground and wrong on a black
 * landing page; `tall` is the low-key frame of the three and holds its dark
 * mass at the top, where that panel sets its type.
 *
 * Both are still the client's own photography — this is a re-placement, not a
 * replacement, and no slot lost its picture.
 */
export const SOCIETY = {
  main: m('society-main', 1200, 1500, 'Table setting with roses and glassware at an elegant event'),
  wide: m('society-wide', 1800, 1200, 'Banquet hall laid for a formal dinner'),
  tall: m('society-tall', 1200, 1500, 'Place setting detail with folded napkin'),
} as const;

/**
 * The two bento tiles that were text-only by design. Management supplied images
 * for both, so they are wired in — the grid keeps its rhythm because the tiles
 * were already sized for it; only the empty backgrounds are filled.
 */
export const BENTO = {
  sportsAnnouncing: m('bento-sports', 1200, 900, 'Announcer interviewing an athlete at a sports event'),
  hostingEmcee: m('bento-emcee', 1200, 900, 'Performer hosting on stage in front of a crowd'),
} as const;

/** Additional portfolio frames supplied separately from the scene set. */
export const PORTFOLIO_FRAMES = [
  m('portfolio-02', 1600, 1200, 'DJ performing under red stage lighting'),
  m('portfolio-03', 1600, 1200, 'Crowd lit by stage wash at a live show'),
] as const;

export const HERO_BG = m(
  'hero-bg',
  1600,
  900,
  'Stage rigging, lighting truss and flight cases before an event',
);

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

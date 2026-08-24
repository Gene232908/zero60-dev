/**
 * Motion tokens — the single source of the site's motion grammar.
 * TypeScript mirror of the --dur-* / --ease-* / --stagger-* tokens in
 * styles/tokens.css, so JS-driven and CSS-driven motion never drift apart.
 *
 * docs/plan.md §2.4 · design brief §22 (timing) and §23 (motion hierarchy).
 * Nothing in components/ should hardcode a duration or an easing curve.
 */

export type Bezier = [number, number, number, number];

/** Seconds. Micro 0.15–0.3 · UI 0.3–0.6 · Large 0.6–1.2 (design brief §22). */
export const DUR = {
  micro: 0.2,
  fast: 0.32,
  base: 0.52,
  slow: 0.82,
  cinematic: 1.2,
} as const;

/**
 * The first four are the easeOut/easeQuint family every starter kit ships —
 * correct, and anonymous. The last three are the house voice; see the
 * `--ease-signature` block in styles/tokens.css for what each one is for.
 * These values MUST stay identical to their CSS counterparts (gate check B3).
 */
export const EASE: Record<
  'out' | 'inOut' | 'entrance' | 'exit' | 'signature' | 'anticipate' | 'overshoot' | 'refined',
  Bezier
> = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.55, 0, 1, 0.45],
  signature: [0.33, 1.12, 0.24, 1],
  anticipate: [0.62, -0.28, 0.24, 1],
  overshoot: [0.18, 1.34, 0.42, 1],
  refined: [0.34, 0.02, 0.14, 1],
};

/** Seconds between staggered siblings. */
export const STAGGER = {
  tight: 0.06,
  base: 0.11,
  loose: 0.18,
} as const;

/**
 * Motion hierarchy (design brief §23) — not everything moves equally.
 *   primary   hero type, major images, section transitions
 *   secondary supporting text, metadata blocks, nav, buttons
 *   tertiary  small labels, decoration
 */
export const TRAVEL = {
  primary: 64,
  secondary: 32,
  tertiary: 14,
} as const;

/** Parallax strength in px of total drift across the scroll range. */
export const PARALLAX = {
  subtle: 40,
  medium: 90,
  strong: 150,
} as const;

/** Shared whileInView config — fire once, slightly before the element is centred. */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/** Standard transitions composed from the tokens above. */
export const TRANSITION = {
  micro: { duration: DUR.micro, ease: EASE.out },
  ui: { duration: DUR.fast, ease: EASE.out },
  base: { duration: DUR.base, ease: EASE.entrance },
  large: { duration: DUR.slow, ease: EASE.entrance },
  cinematic: { duration: DUR.cinematic, ease: EASE.entrance },
} as const;

/** Clip-path keyframes for mask reveals (design brief §11). */
export const CLIP = {
  hiddenUp: 'inset(100% 0% 0% 0%)',
  hiddenDown: 'inset(0% 0% 100% 0%)',
  /** Collapsed to the left edge — for rules and hairlines that draw across. */
  hiddenRight: 'inset(0% 100% 0% 0%)',
  visible: 'inset(0% 0% 0% 0%)',
} as const;

'use client';

import { useMinWidth, useReducedMotionSafe } from './use-reduced-motion';
import { cn } from '@/lib/utils/cn';

/**
 * NoiseOverlay — film grain across the whole canvas (docs/plan.md §2.5).
 *
 * Part of what makes the Productions mood read as rugged rather than merely
 * dark. Opacity comes from the `--grain-opacity` brand token, which means the
 * Society mode switches it off automatically (society sets it to 0) — the
 * component itself has no idea which brand it is in.
 *
 * The grain is a static inline SVG turbulence data-URI: no image request, no
 * animation, no main-thread cost. Reduced motion removes it entirely, as does
 * the CSS backstop in globals.css.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export interface NoiseOverlayProps {
  className?: string;
  /** Render inside a section instead of fixed over the viewport. */
  contained?: boolean;
}

export function NoiseOverlay({ className, contained = false }: NoiseOverlayProps) {
  const reduced = useReducedMotionSafe();
  // 48rem = the `md` breakpoint from globals.css's @theme block.
  const wide = useMinWidth('48rem');

  if (reduced) return null;

  /*
    PHONES DO NOT GET THE GRAIN (performance — reported scroll lag).

    The header above is right that the grain costs nothing to FETCH — it is an
    inline data-URI, no request, no animation. The cost is not the image, it is
    `mix-blend-overlay` on a `fixed inset-0` element.

    A blended layer has to be composited against whatever is behind it. This one
    is fixed and the page scrolls underneath it, so "whatever is behind it" is
    different on every single frame of every scroll — the browser re-blends the
    entire viewport, continuously, for as long as the page is moving. It is the
    one effect on the site whose cost is a function of viewport AREA rather than
    of how many elements are on screen, which is why the lag shows up at both
    ends of the range at once.

    Dropping it below `md` costs almost nothing visually, and that is a property
    of the blend mode rather than a judgement call: `overlay` resolves to
    2 x backdrop x source where the backdrop is dark, so on this site's black
    ground the grain already contributes almost exactly zero. It reads only over
    photographs and over Society's paper — both of which are small, few, and
    scaled down on a phone in the first place.

    Desktop keeps it untouched: the effect is part of the Productions mood, and
    a desktop GPU can afford the blend.
  */
  if (!wide) return null;

  return (
    <div
      data-motion="grain"
      aria-hidden="true"
      className={cn(
        'pointer-events-none z-[60] mix-blend-overlay',
        contained ? 'absolute inset-0' : 'fixed inset-0',
        className,
      )}
      style={{
        backgroundImage: GRAIN,
        opacity: 'var(--grain-opacity, 0)',
      }}
    />
  );
}

export default NoiseOverlay;

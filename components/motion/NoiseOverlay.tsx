'use client';

import { useReducedMotionSafe } from './use-reduced-motion';
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
  if (reduced) return null;

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

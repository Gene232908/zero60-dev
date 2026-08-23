'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotionSafe } from '@/components/motion/use-reduced-motion';

/**
 * SmoothScroll — Lenis (docs/plan.md §2.4).
 *
 * Provides the premium scroll feel and, because Lenis drives real native scroll
 * position, every scroll-linked effect on the site (Framer's useScroll, GSAP
 * ScrollTrigger) stays in sync with no scroller proxy needed.
 *
 * ACCESSIBILITY: smooth scroll is scroll hijacking. When the user has asked for
 * reduced motion we never instantiate Lenis at all and the browser's own
 * scrolling is left completely untouched. This is checked by the acceptance
 * gate (check D5).
 */

export function SmoothScroll() {
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    // prefers-reduced-motion: hand scrolling back to the browser entirely.
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}

export default SmoothScroll;

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
 *
 * SCROLL RESET ON NAVIGATION.
 * Next resets scroll on a route change, but Lenis keeps its own internal scroll
 * value and re-applies it on the next frame — so landing halfway down a freshly
 * opened page was Lenis restoring a position the browser had already cleared.
 * Lenis owns the scroll position, so the reset has to be told to Lenis, which is
 * why it lives here rather than in a separate component.
 *
 * An in-page anchor (/portfolio#reel, /contact#enquiry) is deliberately exempt:
 * those links are *supposed* to land on a section, and forcing the top would
 * break them.
 */

export function SmoothScroll() {
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

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
    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    // Let an anchored link reach its section.
    if (window.location.hash) return;

    const lenis = lenisRef.current;
    if (lenis) {
      // `immediate` jumps rather than animating: a new page should already be at
      // the top when it appears, not scroll up in front of the reader.
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default SmoothScroll;

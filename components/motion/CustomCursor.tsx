'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE } from './motion-tokens';

/**
 * CustomCursor — context label, not a gimmick (design brief §18).
 *
 * A small dot trails the pointer. When it enters anything carrying a
 * `data-cursor="LABEL"` attribute the dot expands and shows that label, so the
 * cursor communicates affordance ("VIEW", "OPEN") instead of just decorating.
 *
 * Never interferes with navigation: pointer-events are off and the native cursor
 * is left alone. Fully disabled on touch devices and under reduced motion —
 * both here in JS and as a CSS backstop in globals.css.
 */

export function CustomCursor() {
  const reduced = useReducedMotionSafe();
  const fine = useFinePointer();
  const enabled = !reduced && fine;

  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.25 });
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.25 });

  useEffect(() => {
    if (!enabled) return;

    /*
      PERFORMANCE — this handler used to do a DOM tree walk on every single
      pointermove event.

      `pointermove` fires at the pointer's sampling rate, which on a 120Hz
      trackpad or a gaming mouse is well past 120 events per second, and each
      one ran `closest('[data-cursor]')` — a walk up the ancestor chain from
      whatever element is under the pointer, matching a selector at every step.
      On the deeply nested sections (the portfolio collage, the Two Houses
      panels) that is a real amount of work, repeated hundreds of times a
      second, on the main thread, competing with Lenis and every scroll-linked
      spring on the page. It is worst on a large desktop display, where there is
      more to point at and the pointer travels further.

      The fix is to separate the two jobs the handler was doing:

        · the POSITION has to stay per-event. It feeds two motion values, which
          write straight to the compositor and never touch React, so it is
          already cheap — and throttling it is what makes a custom cursor feel
          like it is lagging behind the real one.

        · the LABEL only has to be correct once per painted frame. Nothing can
          observe it changing faster than the screen refreshes. So the tree walk
          is deferred into a single rAF callback, and a pending flag collapses
          every event that arrives before that frame runs into one lookup.

      That takes the per-second cost from "one tree walk per pointer sample" to
      "one tree walk per frame" — on a 120Hz mouse at 60fps, half the work; on a
      high-rate mouse during a fast sweep, considerably less than that.
    */
    let frame = 0;
    let pending: Element | null = null;

    function readLabel() {
      frame = 0;
      const hit = pending?.closest?.('[data-cursor]') as HTMLElement | null;
      // React bails out of a re-render when the next state is identical, so
      // passing the same string back is free — no need to compare by hand.
      setLabel(hit ? hit.dataset.cursor || '' : null);
    }

    function onMove(e: PointerEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);

      pending = e.target as Element | null;
      if (!frame) frame = requestAnimationFrame(readLabel);
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
    // `visible` is deliberately NOT a dependency any more. It was one only
    // because the old handler read it (`if (!visible) setVisible(true)`), which
    // meant the very first pointer movement tore down both listeners and
    // registered them again. setVisible(true) on an already-true state is a
    // no-op React bails out of, so the read — and the re-subscription with it —
    // is gone.
  }, [enabled, mx, my]);

  if (!enabled) return null;

  const expanded = label !== null && label !== '';

  return (
    <motion.div
      data-motion="cursor"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x, y }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-accent text-accent-fg"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: expanded ? 88 : 10,
          height: expanded ? 88 : 10,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: DUR.fast, ease: EASE.out }}
      >
        {expanded ? (
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em]">{label}</span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

export default CustomCursor;

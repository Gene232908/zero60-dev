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

    function onMove(e: PointerEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as Element | null;
      const hit = target?.closest?.('[data-cursor]') as HTMLElement | null;
      if (hit) {
        setLabel(hit.dataset.cursor || '');
      } else {
        setLabel(null);
      }
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, mx, my, visible]);

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

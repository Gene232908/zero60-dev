'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE } from './motion-tokens';

/**
 * ImageHoverPreview — cursor-following preview for editorial lists
 * (design brief §19–§20).
 *
 * This is why the work index can be a numbered list instead of a card grid: the
 * imagery arrives on hover, so the resting layout stays typographic and calm.
 *
 * The parent owns the hover state and passes `activeIndex`; this primitive only
 * positions and cross-fades. Disabled on touch and under reduced motion, where
 * the list simply stays a list.
 *
 * APPEARANCE IS INSTANT, ON PURPOSE. Three things used to stand between the
 * pointer entering a row and the image being visible, and all three are gone:
 *
 *   1. `AnimatePresence mode="wait"` held the incoming image until the outgoing
 *      one had finished exiting, so moving between rows cost exit + enter in
 *      series. The default (sync) mode cross-fades them concurrently instead.
 *   2. The follow spring was seeded at 0,0, so the FIRST hover flew the preview
 *      in from the top-left corner. While idle it is now pinned straight to the
 *      cursor, so activation starts already in place — see onMove below.
 *   3. The enter ran at DUR.fast. It runs at DUR.micro; the exit stays slower so
 *      the outgoing frame recedes under the incoming one rather than blinking.
 *
 * What is deliberately NOT instant: the blur/scale entrance and the follow
 * spring itself. Those are the smoothness, not the delay.
 */

export type PreviewImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export interface ImageHoverPreviewProps {
  images: PreviewImage[];
  activeIndex: number | null;
  /** Preview box width in px. */
  width?: number;
}

/**
 * Follow spring. Stiffer and lighter than the original 260/30/0.4: the preview
 * still trails the cursor smoothly, but it arrives rather than being dragged.
 */
const SPRING = { stiffness: 520, damping: 34, mass: 0.28 } as const;

export function ImageHoverPreview({ images, activeIndex, width = 300 }: ImageHoverPreviewProps) {
  const reduced = useReducedMotionSafe();
  const fine = useFinePointer();
  const enabled = !reduced && fine;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  /** Mirrors `activeIndex` for the pointermove handler, which is not re-bound. */
  const activeRef = useRef(false);
  useEffect(() => {
    activeRef.current = activeIndex !== null;
  }, [activeIndex]);

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: PointerEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
      // While nothing is hovered the preview is invisible, so there is no reason
      // to ease toward the cursor — pin it there outright. That way the moment a
      // row activates, the frame is already in the right place and only has to
      // fade in. Springing from the last parked position (0,0 on the very first
      // hover) is what used to read as a delay.
      if (!activeRef.current) {
        x.jump(e.clientX);
        y.jump(e.clientY);
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, mx, my, x, y]);

  if (!enabled) return null;

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      style={{ x, y }}
    >
      {/* Grid, so the concurrent in/out frames stack instead of pushing each other. */}
      <div className="grid" style={{ transform: 'translate(-50%, -50%)' }}>
        {/* No mode="wait" — the incoming frame must not queue behind the outgoing one. */}
        <AnimatePresence>
          {active ? (
            <motion.div
              key={active.src + String(activeIndex)}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
              transition={{ duration: DUR.micro, ease: EASE.out }}
              style={{ width, gridArea: '1 / 1' }}
              className="overflow-hidden"
            >
              <Image
                src={active.src}
                alt=""
                width={active.width}
                height={active.height}
                className="h-auto w-full object-cover"
                sizes="300px"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ImageHoverPreview;

'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
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

export function ImageHoverPreview({ images, activeIndex, width = 300 }: ImageHoverPreviewProps) {
  const reduced = useReducedMotionSafe();
  const fine = useFinePointer();
  const enabled = !reduced && fine;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: PointerEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, mx, my]);

  if (!enabled) return null;

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      style={{ x, y }}
    >
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.src + String(activeIndex)}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
              transition={{ duration: DUR.fast, ease: EASE.out }}
              style={{ width }}
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

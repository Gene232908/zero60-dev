'use client';

import { motion } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { DUR } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * StickerSpin — slow rotating badge (docs/plan.md §2.4).
 *
 * A tertiary-weight device: it turns continuously but slowly, so it reads as a
 * seal on the composition rather than something demanding attention.
 *
 * NOTE (BLOCKER B1): the client's own sparkle mark has not been supplied yet.
 * The inline glyph below is a labelled stand-in — swap `<SparkleGlyph/>` for the
 * client asset once the logo pack arrives.
 *
 * Reduced motion: renders the badge stationary, fully legible.
 */

export interface StickerSpinProps {
  /** Text placed around the ring. Repeated to fill the circle. */
  text?: string;
  /** Seconds per full rotation. */
  duration?: number;
  size?: number;
  className?: string;
  reverse?: boolean;
}

function SparkleGlyph({ className }: { className?: string }) {
  // PLACEHOLDER mark — replace with the client's sparkle SVG (BLOCKER B1).
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z" />
    </svg>
  );
}

export function StickerSpin({
  text,
  duration = 24,
  size = 132,
  className,
  reverse = false,
}: StickerSpinProps) {
  const reduced = useReducedMotionSafe();

  const ring = text ? Array.from({ length: 1 }, () => text).join('') : null;
  const chars = ring ? ring.split('') : [];

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { rotate: reverse ? -360 : 360 }}
        transition={
          reduced ? undefined : { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
        }
      >
        {chars.map((char, i) => {
          const angle = (360 / chars.length) * i;
          return (
            <span
              key={`${char}-${i}`}
              className="absolute left-1/2 top-1/2 text-[0.58rem] font-medium uppercase tracking-[0.1em] text-fg-muted"
              style={{
                transform: `rotate(${angle}deg) translateY(-${size / 2 - 12}px)`,
                transformOrigin: '0 0',
              }}
            >
              {char}
            </span>
          );
        })}
      </motion.div>

      <motion.div
        animate={reduced ? undefined : { rotate: reverse ? 360 : -360, scale: [1, 1.08, 1] }}
        transition={
          reduced
            ? undefined
            : {
                rotate: { duration: duration * 0.75, ease: 'linear', repeat: Infinity },
                scale: { duration: DUR.cinematic * 4, ease: 'easeInOut', repeat: Infinity },
              }
        }
      >
        <SparkleGlyph className="h-6 w-6 text-accent" />
      </motion.div>
    </div>
  );
}

export default StickerSpin;

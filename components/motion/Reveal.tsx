'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { CLIP, DUR, EASE, STAGGER, TRAVEL, VIEWPORT } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * Reveal — the site's standard scroll-entry primitive (design brief §16).
 *
 * One reveal system for all ordinary content, so the whole site enters with the
 * same grammar. Developer 2 composes with this rather than hand-rolling per-page
 * animations (Task Division Rev 2, M1/M2).
 *
 * Reduced motion: renders the final state immediately — no travel, no clip, no
 * opacity ramp. Content is never gated behind an animation.
 */

export type RevealVariant = 'fade' | 'rise' | 'mask' | 'clip';
export type MotionWeight = 'primary' | 'secondary' | 'tertiary';

export interface RevealProps {
  children: ReactNode;
  /** Which reveal treatment to use. */
  variant?: RevealVariant;
  /** Motion hierarchy — how far this element travels (design brief §23). */
  weight?: MotionWeight;
  /** Extra delay in seconds before this element enters. */
  delay?: number;
  /** Stagger direct children instead of animating this element as one block. */
  stagger?: boolean | 'tight' | 'loose';
  className?: string;
  /** Re-fire every time it scrolls into view instead of once. */
  repeat?: boolean;
}

function buildVariants(variant: RevealVariant, distance: number, delay: number): Variants {
  const transition = { duration: DUR.base, ease: EASE.entrance, delay };
  const slow = { duration: DUR.slow, ease: EASE.entrance, delay };

  switch (variant) {
    case 'fade':
      return {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition },
      };
    case 'mask':
      return {
        hidden: { opacity: 0, clipPath: CLIP.hiddenUp, y: distance * 0.35 },
        shown: { opacity: 1, clipPath: CLIP.visible, y: 0, transition: slow },
      };
    case 'clip':
      return {
        hidden: { clipPath: CLIP.hiddenDown },
        shown: { clipPath: CLIP.visible, transition: slow },
      };
    case 'rise':
    default:
      return {
        hidden: { opacity: 0, y: distance },
        shown: { opacity: 1, y: 0, transition },
      };
  }
}

export function Reveal({
  children,
  variant = 'rise',
  weight = 'secondary',
  delay = 0,
  stagger = false,
  className,
  repeat = false,
}: RevealProps) {
  const reduced = useReducedMotionSafe();

  // Reduced motion: hand back plain, fully-visible markup.
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const distance = TRAVEL[weight];
  const viewport = repeat ? { ...VIEWPORT, once: false } : VIEWPORT;

  if (stagger) {
    const gap = stagger === 'tight' ? STAGGER.tight : stagger === 'loose' ? STAGGER.loose : STAGGER.base;
    const container: Variants = {
      hidden: {},
      shown: { transition: { staggerChildren: gap, delayChildren: delay } },
    };
    const item = buildVariants(variant, distance, 0);

    return (
      <motion.div
        className={cn(className)}
        variants={container}
        initial="hidden"
        whileInView="shown"
        viewport={viewport}
      >
        {Children.map(children, (child, i) =>
          isValidElement(child) ? (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ) : (
            child
          ),
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      variants={buildVariants(variant, distance, delay)}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;

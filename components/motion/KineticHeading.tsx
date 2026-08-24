'use client';

import { useRef, type ElementType } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { CLIP, DUR, EASE, STAGGER } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * KineticHeading — oversized display type as a compositional element
 * (design brief §2, §10).
 *
 * Words reveal from behind a mask on enter, then the whole line drifts as the
 * user scrolls, so the heading reads as part of the artwork rather than a label
 * sitting on top of it. Sizes are vw-based with a rem floor and ceiling, so the
 * type stays dramatic on desktop and usable on a phone.
 *
 * Accessibility: the split words are aria-hidden and the real string is exposed
 * once via aria-label, so a screen reader hears a sentence, not a word list.
 * Reduced motion: renders as static type at the same size.
 */

export type KineticSize = 'sm' | 'md' | 'lg' | 'xl' | 'mega';

const SIZE: Record<KineticSize, string> = {
  sm: 'text-[clamp(1.75rem,4vw,3rem)]',
  md: 'text-[clamp(2.5rem,6.5vw,5.5rem)]',
  lg: 'text-[clamp(3rem,9vw,8rem)]',
  xl: 'text-[clamp(3.5rem,12vw,12rem)]',
  mega: 'text-[clamp(4rem,16vw,18rem)]',
};

export interface KineticHeadingProps {
  /** One string per visual line. Readonly so `as const` content arrays fit. */
  lines: readonly string[];
  as?: ElementType;
  size?: KineticSize;
  /** Scroll-linked horizontal drift in px (0 disables). */
  drift?: number;
  /** Delay before the first word enters, in seconds. */
  delay?: number;
  className?: string;
  lineClassName?: string;
}

export function KineticHeading({
  lines,
  as: Tag = 'h2',
  size = 'lg',
  drift = 0,
  delay = 0,
  className,
  lineClassName,
}: KineticHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const label = lines.join(' ');

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  const Heading = Tag as ElementType;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        <Heading className={cn('display', SIZE[size])}>
          {lines.map((line) => (
            <span key={line} className={cn('block', lineClassName)}>
              {line}
            </span>
          ))}
        </Heading>
      </div>
    );
  }

  // The word stagger runs continuously across lines, so line 2 keeps counting
  // from where line 1 stopped. Computed purely — nothing is mutated mid-render.
  const wordsPerLine = lines.map((line) => line.split(' '));
  const lineStartIndex = wordsPerLine.map((_, i) =>
    wordsPerLine.slice(0, i).reduce((total, words) => total + words.length, 0),
  );

  return (
    <div ref={ref} className={className}>
      <Heading className={cn('display', SIZE[size])} aria-label={label}>
        {wordsPerLine.map((words, li) => (
          <motion.span
            key={`${lines[li]}-${li}`}
            className={cn('block', lineClassName)}
            style={drift ? { x } : undefined}
            aria-hidden="true"
          >
            {words.map((word, wi) => (
              // The observer MUST sit on this outer clip box, not on the inner span.
              // The inner span starts translated 110% down, which puts it entirely
              // outside this overflow-hidden parent — and IntersectionObserver clips
              // a target against its ancestors' overflow before measuring. Observing
              // the inner span therefore reported zero intersection forever: it could
              // not come into view because it was hidden, and could not unhide because
              // it had not come into view. Every heading on the site stayed invisible.
              //
              // This wrapper is never transformed, so it is always measurable. The
              // inner span inherits `shown` through variants.
              <motion.span
                key={`${word}-${wi}`}
                className="inline-block overflow-hidden align-bottom"
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              >
                <motion.span
                  className="inline-block will-change-transform"
                  variants={{
                    hidden: { y: '110%', clipPath: CLIP.hiddenUp },
                    shown: { y: '0%', clipPath: CLIP.visible },
                  }}
                  transition={{
                    duration: DUR.slow,
                    ease: EASE.entrance,
                    delay: delay + (lineStartIndex[li] + wi) * STAGGER.tight,
                  }}
                >
                  {word}
                  {wi < words.length - 1 ? ' ' : ''}
                </motion.span>
              </motion.span>
            ))}
          </motion.span>
        ))}
      </Heading>
    </div>
  );
}

export default KineticHeading;

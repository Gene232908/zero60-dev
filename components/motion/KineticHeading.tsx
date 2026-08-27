'use client';

import { useRef, useState, type ElementType, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE, STAGGER } from './motion-tokens';
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

/**
 * One masked word of a heading.
 *
 * THE MASK HAS TO BE A STATIC EDGE, which is why it lives on this outer span
 * and not on the moving one: a clip-path that travels with the text wipes
 * rather than masks, and the whole effect is that the word rises from behind a
 * fixed line.
 *
 * WHAT THAT EDGE WAS CUTTING — measured, not guessed. Archivo is 1000upm with
 * ascent 878 / descent 210, so its content area is 1.088em. Headings run at
 * --display-leading 0.82em, giving half-leading of -0.134em and putting the
 * baseline 0.744em down. That leaves 0.076em of room below the baseline inside
 * the mask.
 *
 *   · The LETTERFORMS fit. Cap height is 686 and every uppercase glyph we set
 *     has yMin = 0 — the Y of SIXTY sits exactly on the baseline, with 0.076em
 *     to spare beneath it. It was never the thing being clipped.
 *   · The .text-halo SHADOW does not fit, and is. Its widest layer is
 *     0 8px 44px, so it reaches 52px below the baseline; at hero size there are
 *     about 10px of room. The remaining ~42px is sliced off flat, drawing a
 *     hard horizontal edge immediately under the type. Under a Y — narrow stem,
 *     open space either side — that edge is the most exposed, which is why the
 *     Y looked cut when its neighbours did not.
 *
 * So the fix is not to enlarge the mask (that would force the word to start
 * ~0.45em lower and, at 0.82 leading, emerge into the line below it). It is to
 * keep the halo OUT of the mask: the shadow is suppressed for exactly as long
 * as the clip is in place, then fades in over --dur-fast once the word lands
 * and the clip is released. During the reveal nothing overflows the mask, so
 * there is nothing to cut; afterwards nothing clips, so the halo is whole.
 *
 * `align-bottom` stays on both states — an inline-block takes its baseline from
 * the bottom margin edge when it clips and from its last line box when it does
 * not, so without it, releasing the clip would shift the word.
 */
function Word({ children, delay }: { children: ReactNode; delay: number }) {
  const [landed, setLanded] = useState(false);

  return (
    // The observer MUST sit on this outer box, not on the inner span. The inner
    // span starts translated 110% down, which puts it entirely outside this
    // overflow-hidden parent — and IntersectionObserver clips a target against
    // its ancestors' overflow before measuring. Observing the inner span
    // therefore reported zero intersection forever: it could not come into view
    // because it was hidden, and could not unhide because it had not come into
    // view. Every heading on the site stayed invisible.
    //
    // This wrapper is never transformed, so it is always measurable.
    <motion.span
      className={cn('inline-block align-bottom', landed ? 'overflow-visible' : 'overflow-hidden')}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        className={cn(
          'inline-block transition-[text-shadow] duration-[var(--dur-fast)] ease-out',
          // No clip-path here. The outer box is the mask; a second clip riding
          // along with the text only added another edge to be cut by.
          !landed && 'will-change-transform [text-shadow:none]',
        )}
        variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
        transition={{ duration: DUR.slow, ease: EASE.entrance, delay }}
        onAnimationComplete={() => setLanded(true)}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export type KineticSize = 'sm' | 'md' | 'lg' | 'xl' | 'mega';

const SIZE: Record<KineticSize, string> = {
  sm: 'text-[clamp(1.75rem,4vw,3rem)]',
  md: 'text-[clamp(2.5rem,6.5vw,5.5rem)]',
  lg: 'text-[clamp(2.75rem,7vw,6rem)]',
  xl: 'text-[clamp(3rem,8.5vw,8.5rem)]',
  mega: 'text-[clamp(3.25rem,10.5vw,11rem)]',
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
              <Word
                key={`${word}-${wi}`}
                delay={delay + (lineStartIndex[li] + wi) * STAGGER.tight}
              >
                {word}
                {wi < words.length - 1 ? ' ' : ''}
              </Word>
            ))}
          </motion.span>
        ))}
      </Heading>
    </div>
  );
}

export default KineticHeading;

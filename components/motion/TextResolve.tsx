'use client';

import { motion } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * TextResolve — a paragraph whose words come into focus as you read down to it.
 *
 * REFERENCE STUDY (063 Society, 2026-08-25): lafleur.framer.website scrolls a
 * body paragraph from a dim grey to full ink as it enters view, word by word.
 * That is the principle borrowed here — not the site's colours, copy, or markup.
 *
 * The mechanism is deliberately colour-blind: each word animates OPACITY only,
 * never `color`. Framer Motion cannot tween between two CSS custom properties
 * (`var(--fg-muted)` → `var(--fg)`), and hardcoding literal RGB values would
 * break the one property this codebase is built around — "one component, two
 * voices" (see SocietyHero's docblock). A low-opacity run of whatever colour
 * the caller already set reads as "dim" in both Society's ink-on-paper and
 * Productions' white-on-black, with zero brand-specific code in here.
 *
 * No position or clip travel — SocietyStatement is explicit that stillness is
 * the register ("the restraint of *not* moving is what separates the two
 * moods"). Resolving into focus in place respects that; sliding words in would
 * not have.
 *
 * Reduced motion: renders plain, fully-opaque text — same rule as every other
 * primitive in this library.
 */
export interface TextResolveProps {
  children: string;
  className?: string;
  /** Delay before the first word starts resolving, in seconds. */
  delay?: number;
}

export function TextResolve({ children, className, delay = 0 }: TextResolveProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <p className={className}>{children}</p>;
  }

  const words = children.split(' ');

  return (
    <motion.p
      className={cn(className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.022, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0.32 },
            shown: { opacity: 1, transition: { duration: DUR.fast, ease: EASE.out } },
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default TextResolve;

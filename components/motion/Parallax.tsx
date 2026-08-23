'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { DUR, PARALLAX } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * Parallax — scroll-linked drift (design brief §11).
 *
 * Deliberately restrained: even `strong` only drifts 150px across a full pass,
 * because extreme parallax makes a site uncomfortable to read. The value is
 * spring-smoothed so it stays fluid when Lenis is driving the scroll.
 *
 * Reduced motion: the element is rendered completely static.
 */

export interface ParallaxProps {
  children: ReactNode;
  /** Drift distance in px across the scroll range. */
  strength?: keyof typeof PARALLAX | number;
  /** Drift on the X axis instead of Y. */
  axis?: 'x' | 'y';
  /** Invert the drift direction. */
  invert?: boolean;
  className?: string;
}

export function Parallax({
  children,
  strength = 'medium',
  axis = 'y',
  invert = false,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const distance = typeof strength === 'number' ? strength : PARALLAX[strength];
  const sign = invert ? -1 : 1;

  const raw = useTransform(scrollYProgress, [0, 1], [distance * sign, -distance * sign]);
  const smooth = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.5 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        style={axis === 'y' ? { y: smooth } : { x: smooth }}
        className="will-change-transform"
        transition={{ duration: DUR.base }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Parallax;

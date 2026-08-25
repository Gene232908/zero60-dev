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
      {/*
        h-full is load-bearing, not decoration.

        `will-change: transform` makes this div a containing block for absolutely
        positioned descendants — the same way a real transform does. A next/image
        with `fill` therefore resolves its height against THIS div rather than
        the sized wrapper outside, and with only an absolutely positioned child
        this div collapses to 0. The image then computed to height:0 and vanished
        while still being present, correctly sourced and fully opaque.

        That silently broke every Parallax that wraps a fill image directly:
        the Two Houses panels and the Services closing band had never once shown
        their photograph.

        h-full is a no-op when the wrapper is content-sized (percentage height
        against an auto-height parent resolves to auto), so this only takes
        effect exactly where it is needed.
      */}
      <motion.div
        style={axis === 'y' ? { y: smooth } : { x: smooth }}
        className="h-full will-change-transform"
        transition={{ duration: DUR.base }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Parallax;

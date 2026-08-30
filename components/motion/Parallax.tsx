'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMinWidth, useReducedMotionSafe } from './use-reduced-motion';
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
 *
 * ---------------------------------------------------------------------------
 * DESKTOP ONLY (performance — reported scroll lag).
 *
 * This primitive is the most-instanced thing on the site: the portfolio collage
 * alone mounts one per frame, AboutPreview three more, and the Two Houses
 * panels, the services band and the society sections each add theirs. Every
 * instance carries a `useScroll` (a scroll listener plus a ResizeObserver) AND
 * a `useSpring`, and a spring driven by scroll is not a settle-once animation —
 * it re-integrates on every frame for as long as the page is moving. A dozen on
 * one page is a dozen springs per frame, on top of Lenis already driving its own
 * rAF loop.
 *
 * On a phone that is most of the frame budget, and it buys almost nothing: the
 * drift is 60–150px across a FULL scroll pass, which on a short viewport is a
 * few pixels of travel per screen. Nobody has ever seen it.
 *
 * Below `lg` the drift is therefore pinned to zero. Note HOW — the tree is
 * identical on both paths and only the transform's output range changes, which
 * is what keeps this from remounting every gallery on the page one frame after
 * hydration. The reasoning is written out at the switch itself.
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
  // 64rem = the `lg` breakpoint declared in globals.css's @theme block, so this
  // agrees with every `lg:` utility about where a big screen starts.
  const wide = useMinWidth('64rem');
  const active = wide && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /*
    THE OUTPUT RANGE IS THE SWITCH — not an early return.

    An earlier version of this gated the whole thing with `if (!active) return
    <div>…</div>`, which was wrong in a way worth recording. React reconciles by
    element type at a given position, and `div` and `motion.div` are different
    types, so flipping between those two branches UNMOUNTS and remounts the
    entire subtree. Since `active` starts false on the server and corrects on
    the first client commit, every desktop visitor would have remounted every
    Parallax on the page one frame after hydration — re-running each Reveal
    inside and re-mounting each image, on the first impression of the site. A
    performance fix that costs a visible flash is not a performance fix.

    Collapsing the output range to [0, 0] gets the saving without ever changing
    the tree. `raw` becomes a constant, so the spring has nothing to chase: it
    settles once and then does no per-frame integration at all, which is the
    expensive part — a scroll-driven spring is not a settle-once animation, it
    re-integrates on every frame for as long as the page moves, and this
    primitive is the most-instanced thing on the site. The portfolio collage
    alone mounts one per frame, AboutPreview three more, and the Two Houses
    panels, the services band and every Society section add theirs.

    What that buys, per instance, below `lg`: no spring integration, no
    transform written to the compositor, and no promoted layer (see the
    className below). What it deliberately does NOT buy is unsubscribing from
    `useScroll` — that is a shared listener and a resize measurement, it is
    cheap, and reclaiming it is what would have forced the remount.

    Why below `lg` at all: the drift is 60–150px across a FULL scroll pass, so
    on a short viewport it amounts to a few pixels of travel per screen. It has
    never been visible on a phone, and it was costing the most there.
  */
  const distance = typeof strength === 'number' ? strength : PARALLAX[strength];
  const sign = invert ? -1 : 1;
  const travel = active ? distance * sign : 0;

  const raw = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smooth = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.5 });

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

        `will-change-transform` is now conditional, and it has to be: it is a
        standing instruction to keep this element on its own compositor layer,
        which is worth paying for exactly while something is going to move and
        is pure GPU memory otherwise. On a phone rendering a dozen of these,
        that is a dozen layers held open for a transform that is pinned at 0.

        Removing it does NOT cost the containing block described above — the
        element keeps `h-full` either way, and on the static path there is no
        transform for a `fill` child to resolve against in the first place.
      */}
      <motion.div
        style={axis === 'y' ? { y: smooth } : { x: smooth }}
        className={cn('h-full', active && 'will-change-transform')}
        transition={{ duration: DUR.base }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Parallax;

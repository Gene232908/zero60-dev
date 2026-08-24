'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * MagneticButton — restrained magnetic hover (design brief §17).
 *
 * The control drifts a few px toward the pointer while it is inside the element
 * and springs home on leave. Deliberately small: hover states should feel
 * responsive, not theatrical.
 *
 * Renders a next/link when `href` is present, otherwise a real <button>, so
 * keyboard and screen-reader semantics stay correct either way.
 * Disabled on touch devices and under reduced motion — it degrades to an
 * ordinary, fully-functional control.
 */

export interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Max drift in px. */
  strength?: number;
  className?: string;
  ariaLabel?: string;
  /** Label the custom cursor shows while hovering this control. */
  cursorLabel?: string;
  /**
   * Inert control: no magnet, no fill, no press. Renders a real `disabled`
   * button when there is no href, and an aria-disabled link when there is —
   * an anchor cannot be natively disabled.
   */
  disabled?: boolean;
}

export function MagneticButton({
  children,
  href,
  onClick,
  strength = 14,
  className,
  ariaLabel,
  cursorLabel,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const fine = useFinePointer();
  const active = !reduced && fine && !disabled;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.3 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.3 });

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    mx.set((relX / (rect.width / 2)) * strength);
    my.set((relY / (rect.height / 2)) * strength);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const classes = cn(
    // Same silhouette as before — hairline border, wide tracking, generous pad.
    // Everything added below is state, not shape.
    'group relative isolate inline-flex items-center justify-center gap-3 border border-line-strong px-7 py-4',
    'text-[0.7rem] font-medium uppercase tracking-[0.22em] text-fg',
    'overflow-hidden',
    // Colour and border settle on the brand curve; transform gets its own,
    // faster channel so a press reads instantly even mid-hover.
    'transition-[color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
    !disabled && [
      'hover:text-accent-fg hover:border-accent',
      // Press: the whole control takes the hit and drops a hair. Productions
      // pops (overshoot), Society settles (see --ease-press per brand mode).
      'active:scale-[var(--press-scale)] active:translate-y-[var(--press-shift)]',
      'active:duration-[var(--dur-micro)] active:ease-[var(--ease-press)]',
      // Keyboard focus gets the accent frame rather than the global outline,
      // so it sits on the border the control already has.
      'focus-visible:outline-none focus-visible:border-accent',
      'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      'focus-visible:ring-offset-bg',
    ],
    disabled && 'disabled:cursor-not-allowed cursor-not-allowed opacity-40 saturate-0',
    className,
  );

  /**
   * The fill used to be a flat background swap on hover. It is now a wipe that
   * enters from the pointer's side — the one detail that tells you a person
   * chose this control rather than a utility class. Sits behind the label via
   * -z-10 and never intercepts the pointer.
   */
  const fill = !disabled && (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-accent',
        'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
        'group-hover:scale-x-100 group-focus-visible:scale-x-100',
      )}
    />
  );

  const inner = (
    <motion.span
      style={active ? { x, y } : undefined}
      className="pointer-events-none inline-flex items-center gap-3 will-change-transform"
      transition={{ duration: DUR.micro, ease: EASE.signature }}
    >
      {children}
    </motion.span>
  );

  const shared = {
    className: classes,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    'aria-label': ariaLabel,
    'data-cursor': disabled ? undefined : (cursorLabel ?? undefined),
  };

  if (href) {
    // An anchor has no native disabled state. Drop the href so it stops being a
    // link at all, and say so to assistive tech rather than only looking dimmed.
    if (disabled) {
      return (
        <span {...shared} role="link" aria-disabled="true">
          {inner}
        </span>
      );
    }
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...shared}>
        {fill}
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...shared}
    >
      {fill}
      {inner}
    </button>
  );
}

export default MagneticButton;

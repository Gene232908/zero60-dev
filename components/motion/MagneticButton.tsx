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
}

export function MagneticButton({
  children,
  href,
  onClick,
  strength = 14,
  className,
  ariaLabel,
  cursorLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const fine = useFinePointer();
  const active = !reduced && fine;

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
    'relative inline-flex items-center justify-center gap-3 border border-line-strong px-7 py-4',
    'text-[0.7rem] font-medium uppercase tracking-[0.22em] text-fg',
    'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
    'hover:bg-accent hover:text-accent-fg hover:border-accent',
    className,
  );

  const inner = (
    <motion.span
      style={active ? { x, y } : undefined}
      className="pointer-events-none inline-flex items-center gap-3 will-change-transform"
      transition={{ duration: DUR.micro, ease: EASE.out }}
    >
      {children}
    </motion.span>
  );

  const shared = {
    className: classes,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    'aria-label': ariaLabel,
    'data-cursor': cursorLabel ?? undefined,
  };

  if (href) {
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...shared}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} ref={ref as React.Ref<HTMLButtonElement>} {...shared}>
      {inner}
    </button>
  );
}

export default MagneticButton;

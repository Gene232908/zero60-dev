import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

/**
 * Button — the shared control atom.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (EASY: shared small
 * components on the tokens).
 *
 * Every colour, radius and duration comes from Developer 1's tokens, so a
 * button inside `data-brand="society"` becomes the elegant version with no
 * extra component and no override — the dual-brand system doing its job.
 *
 * Renders a next/link when `href` is set and a real <button> otherwise, so the
 * semantics stay correct either way. `.zs-tap` guarantees the WCAG target size
 * on touch without inflating the control on desktop.
 *
 * Note: this is the plain atom. `MagneticButton` in components/motion is the
 * motion-primitive version used for hero and CTA moments; this one is for the
 * ordinary controls that should not steal attention.
 */

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  /** Renders a next/link instead of a <button>. */
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Opens an external destination safely. */
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}

const VARIANT: Record<ButtonVariant, string> = {
  solid: 'border-accent bg-accent text-accent-fg hover:bg-transparent hover:text-accent',
  outline: 'border-line-strong bg-transparent text-fg hover:border-accent hover:text-accent',
  ghost: 'border-transparent bg-transparent text-fg-muted hover:text-accent',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[length:var(--text-xs)]',
  md: 'px-6 py-3 text-[length:var(--text-sm)] md:px-7',
  lg: 'px-8 py-4 text-[length:var(--text-base)] md:px-10',
};

const BASE =
  'zs-tap inline-flex items-center justify-center gap-2 border font-medium uppercase ' +
  'tracking-[0.16em] rounded-[var(--radius)] transition-colors ' +
  'duration-[var(--dur-fast)] ease-[var(--ease-out)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

export function Button({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  type = 'button',
  disabled = false,
  external = false,
  ariaLabel,
  className,
}: ButtonProps) {
  const classes = cn(
    BASE,
    VARIANT[variant],
    SIZE[size],
    disabled && 'pointer-events-none opacity-40',
    className,
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={classes}
    >
      {children}
    </button>
  );
}

export default Button;

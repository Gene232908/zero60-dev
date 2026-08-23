'use client';

import { type ReactNode } from 'react';
import { useReducedMotionSafe } from './use-reduced-motion';
import { cn } from '@/lib/utils/cn';

/**
 * Marquee — seamless infinite ticker (design brief §15).
 *
 * Branding / transition device, not decoration. The track holds two identical
 * copies of the content and translates by exactly -50%, so the loop closes with
 * no visible jump at any viewport width.
 *
 * Driven by a CSS keyframe on `transform` (compositor-only, no layout thrash)
 * rather than a JS rAF loop, so it costs nothing on the main thread.
 *
 * Reduced motion: the track stops and renders one static, readable copy.
 * The duplicate is aria-hidden so screen readers never hear the content twice.
 */

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  direction?: 'left' | 'right';
  /** Pause while the pointer is over the ticker. */
  pauseOnHover?: boolean;
  className?: string;
  /** Visual separator rendered between repeats. */
  separator?: ReactNode;
}

export function Marquee({
  children,
  duration = 32,
  direction = 'left',
  pauseOnHover = false,
  className,
  separator = null,
}: MarqueeProps) {
  const reduced = useReducedMotionSafe();

  const content = (
    <>
      {children}
      {separator}
    </>
  );

  if (reduced) {
    return (
      <div data-motion="marquee" className={cn('w-full overflow-hidden', className)}>
        <div className="flex w-max items-center">{content}</div>
      </div>
    );
  }

  return (
    <div
      data-motion="marquee"
      className={cn('group w-full overflow-hidden', className)}
      style={
        {
          '--marquee-duration': `${duration}s`,
          '--marquee-direction': direction === 'left' ? 'normal' : 'reverse',
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'zs-marquee-track flex w-max items-center will-change-transform',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
      >
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Marquee;

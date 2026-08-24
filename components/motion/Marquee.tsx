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
 *
 * ⚠️ ONE COPY MUST BE AT LEAST AS WIDE AS THE CONTAINER.
 * The loop works by holding two identical copies and translating exactly -50%,
 * i.e. precisely one copy width. If a copy is NARROWER than the viewport, that
 * translation walks the content off one side before the second copy has reached
 * the other, and the ticker shows a moving hole instead of a seamless band.
 *
 * `repeat` is the fix: it multiplies the content inside each copy, so short
 * content (a handful of short labels) still produces a copy wider than any
 * realistic screen. Set it high enough that
 *   (content width x repeat) > widest viewport you care about.
 * It costs only DOM, and the duplicate copy stays aria-hidden either way, so a
 * screen reader still hears the content exactly once.
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
  /**
   * How many times to repeat the content inside EACH copy. Raise it when the
   * content is narrower than the viewport, or the loop shows a gap. See the
   * note above.
   */
  repeat?: number;
}

export function Marquee({
  children,
  duration = 32,
  direction = 'left',
  pauseOnHover = false,
  className,
  separator = null,
  repeat = 1,
}: MarqueeProps) {
  const reduced = useReducedMotionSafe();

  const content = (
    <>
      {Array.from({ length: Math.max(1, repeat) }).map((_, i) => (
        <span key={i} className="contents">
          {children}
          {separator}
        </span>
      ))}
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

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotionSafe } from './use-reduced-motion';
import { loadGsap } from './gsap-loader';
import { cn } from '@/lib/utils/cn';

/**
 * StickySection — pinned storytelling section (design brief §13).
 *
 * The one place GSAP earns its weight: ScrollTrigger's `pin` is materially
 * better than a CSS sticky hack once you need scrub-linked progress. GSAP is
 * pulled in through the dynamic loader, so the ~70kb only lands for visitors who
 * actually reach a pinned section — and only once, memoised.
 *
 * Used sparingly. Pinning the whole site would be exhausting (design brief §13).
 *
 * Reduced motion: no pin, no scrub — the section renders as ordinary flow
 * content and every child stays readable.
 */

export interface StickySectionProps {
  children: ReactNode;
  /** How long the section stays pinned, as a multiple of viewport height. */
  scrollLength?: number;
  className?: string;
  /** Receives scrub progress 0→1 while pinned. */
  onProgress?: (progress: number) => void;
}

export function StickySection({
  children,
  scrollLength = 1.5,
  className,
  onProgress,
}: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced || !ref.current) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadGsap()
      .then(({ ScrollTrigger }) => {
        if (cancelled || !ref.current) return;
        const trigger = ScrollTrigger.create({
          trigger: ref.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * scrollLength}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => onProgress?.(self.progress),
        });
        cleanup = () => trigger.kill();
      })
      .catch(() => {
        // GSAP failed to load — the section stays static rather than breaking.
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced, scrollLength, onProgress]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}
    </div>
  );
}

export default StickySection;

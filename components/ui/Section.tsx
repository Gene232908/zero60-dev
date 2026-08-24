import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Section — the vertical unit of the page.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (responsive layout system).
 *
 * Container handles the horizontal shell; this handles the vertical rhythm and
 * the seam between one section and the next. Every landing section sits in one,
 * so the spacing between them comes from the fluid scale in
 * styles/responsive.css rather than being re-guessed per component.
 *
 * `brand` lets a single section switch mood without a new component — that is
 * the whole point of Developer 1's data-brand system (docs/plan.md §2.2).
 */

export interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  /** Vertical rhythm. `flush` is for sections that own their own spacing. */
  space?: 'flush' | 'tight' | 'default' | 'loose';
  /** Full-bleed sections opt out of the shell so they can run edge to edge. */
  bleed?: boolean;
  /** Hairline seam above the section. */
  divided?: boolean;
  /** Switch this section's brand mood (productions / society). */
  brand?: 'productions' | 'society';
  /** Anchor id, used by the in-page navigation. */
  id?: string;
  className?: string;
}

const SPACE: Record<NonNullable<SectionProps['space']>, string> = {
  flush: '',
  tight: 'py-[var(--space-lg)]',
  default: 'py-[var(--space-xl)]',
  loose: 'py-[var(--section-y)]',
};

export function Section({
  children,
  as: Tag = 'section',
  space = 'default',
  bleed = false,
  divided = false,
  brand,
  id,
  className,
}: SectionProps) {
  const Element = Tag as ElementType;
  return (
    <Element
      id={id}
      data-brand={brand}
      className={cn(
        'relative w-full',
        SPACE[space],
        divided && 'border-t border-line',
        brand && 'bg-bg text-fg',
        className,
      )}
    >
      {bleed ? children : <div className="shell">{children}</div>}
    </Element>
  );
}

export default Section;

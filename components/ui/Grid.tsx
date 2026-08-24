import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Grid + Col — the editorial 12-column system.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (responsive layout system).
 *
 * The column count steps 4 → 8 → 12 (see `.zs-grid` in styles/responsive.css),
 * so an asymmetric desktop composition degrades to a readable tablet layout and
 * then to a single readable column on a phone, instead of collapsing into a
 * stack of squashed cells.
 *
 * `Col` takes spans per breakpoint. The classes are written out in full rather
 * than composed from a template string because Tailwind only ships classes it
 * can see in the source — a dynamically built `col-span-${n}` would be purged.
 */

export interface GridProps {
  children: ReactNode;
  as?: ElementType;
  /** Align every column on a shared baseline instead of stretching. */
  align?: 'start' | 'end' | 'center' | 'stretch';
  className?: string;
}

const ALIGN = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
} as const;

export function Grid({ children, as: Tag = 'div', align = 'stretch', className }: GridProps) {
  const Element = Tag as ElementType;
  return <Element className={cn('zs-grid', ALIGN[align], className)}>{children}</Element>;
}

/** Spans, per breakpoint. Base = the 4-col phone grid, md = 8-col, lg = 12-col. */
export interface ColProps {
  children: ReactNode;
  as?: ElementType;
  /** Columns on phone (of 4). */
  span?: 1 | 2 | 3 | 4;
  /** Columns from md up (of 8). */
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Columns from lg up (of 12). */
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Start column from lg up — this is what makes a layout asymmetric. */
  lgStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  className?: string;
}

const SPAN = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
} as const;

const MD_SPAN = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
} as const;

const LG_SPAN = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
} as const;

const LG_START = {
  1: 'lg:col-start-1',
  2: 'lg:col-start-2',
  3: 'lg:col-start-3',
  4: 'lg:col-start-4',
  5: 'lg:col-start-5',
  6: 'lg:col-start-6',
  7: 'lg:col-start-7',
  8: 'lg:col-start-8',
  9: 'lg:col-start-9',
  10: 'lg:col-start-10',
  11: 'lg:col-start-11',
  12: 'lg:col-start-12',
} as const;

export function Col({ children, as: Tag = 'div', span = 4, md, lg, lgStart, className }: ColProps) {
  const Element = Tag as ElementType;
  return (
    <Element
      className={cn(
        SPAN[span],
        md && MD_SPAN[md],
        lg && LG_SPAN[lg],
        lgStart && LG_START[lgStart],
        className,
      )}
    >
      {children}
    </Element>
  );
}

export default Grid;

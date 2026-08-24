import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Divider — the hairline that structures an editorial page.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (EASY: shared small
 * components on the tokens).
 *
 * Exposed grid lines are part of the rugged art direction (docs/plan.md §2.2),
 * so a rule here is a compositional element rather than filler. It reads its
 * colour from --line, which means it inverts correctly the moment a section
 * switches to Society mode.
 *
 * With a `label` it becomes a titled seam — a rule with a small caption sitting
 * on it, which is how the denser sections are subdivided.
 */

export interface DividerProps {
  /** Caption sitting on the rule. */
  label?: ReactNode;
  /** Right-hand caption, e.g. a count or a year. */
  meta?: ReactNode;
  /** `strong` uses the higher-contrast line token. */
  weight?: 'hairline' | 'strong';
  /** Vertical space around the rule. */
  space?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SPACE = {
  none: '',
  sm: 'my-[var(--space-sm)]',
  md: 'my-[var(--space-md)]',
  lg: 'my-[var(--space-lg)]',
} as const;

export function Divider({ label, meta, weight = 'hairline', space = 'md', className }: DividerProps) {
  const line = weight === 'strong' ? 'border-line-strong' : 'border-line';

  if (!label && !meta) {
    return <hr aria-hidden className={cn('w-full border-0 border-t', line, SPACE[space], className)} />;
  }

  return (
    <div
      className={cn(
        'flex w-full items-baseline justify-between gap-4 border-t pt-2 md:pt-3',
        line,
        SPACE[space],
        className,
      )}
    >
      {label ? <span className="eyebrow">{label}</span> : <span />}
      {meta ? <span className="eyebrow">{meta}</span> : null}
    </div>
  );
}

export default Divider;

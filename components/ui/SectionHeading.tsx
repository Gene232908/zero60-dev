import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils/cn';

/**
 * SectionHeading — the standard way a section introduces itself.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (EASY: shared small
 * components on the tokens).
 *
 * The site's sections are deliberately not uniform (design brief §3), but their
 * *labelling* is: an index, an eyebrow, a title, and an optional lead. Keeping
 * that in one component is what stops seven sections from inventing seven
 * slightly different heading treatments.
 *
 * Motion is composed from Reveal — the shared primitive — so reduced motion is
 * handled without this component knowing anything about it (Rev 2: compose from
 * Developer 1's primitives, never a second animation approach).
 */

export interface SectionHeadingProps {
  /** Editorial index, e.g. "02". */
  index?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: ReactNode;
  /** Supporting sentence under the title. */
  lead?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  /** Right-aligned metadata on the rule, e.g. a count. */
  meta?: ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  meta,
  align = 'start',
  className,
}: SectionHeadingProps) {
  const label = [index, eyebrow].filter(Boolean).join(' — ');

  return (
    <div className={cn('w-full', align === 'end' && 'text-right', className)}>
      {(label || meta) && (
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 md:pb-4">
            {label ? <p className="eyebrow">{label}</p> : <span />}
            {meta ? <p className="eyebrow">{meta}</p> : null}
          </div>
        </Reveal>
      )}

      <Reveal variant="mask" weight="primary" delay={0.08}>
        <Tag
          className={cn(
            'display mt-[var(--space-md)] text-[clamp(1.75rem,5vw,3.5rem)]',
            align === 'end' && 'ml-auto',
          )}
        >
          {title}
        </Tag>
      </Reveal>

      {lead ? (
        <Reveal variant="rise" weight="secondary" delay={0.16}>
          <p
            className={cn(
              'zs-measure mt-[var(--space-sm)] text-[length:var(--text-base)] leading-relaxed text-fg-muted',
              align === 'end' && 'ml-auto',
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export default SectionHeading;

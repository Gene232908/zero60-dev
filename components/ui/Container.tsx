import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Container — the editorial shell.
 *
 * Wide by default and happy to be broken out of: oversized display type is
 * meant to escape the container (design brief §2), so this only sets the gutter
 * and a generous max width rather than boxing content in.
 */

export interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  /** `bleed` removes the max width for full-bleed compositions. */
  width?: 'default' | 'narrow' | 'bleed';
  className?: string;
}

export function Container({ children, as: Tag = 'div', width = 'default', className }: ContainerProps) {
  const Element = Tag as ElementType;
  return (
    <Element
      className={cn(
        'w-full px-[var(--gutter)]',
        width === 'default' && 'mx-auto max-w-[96rem]',
        width === 'narrow' && 'mx-auto max-w-[68rem]',
        className,
      )}
    >
      {children}
    </Element>
  );
}

export default Container;

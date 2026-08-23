'use client';

import { createContext, useContext, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * BrandProvider — the dual-brand mechanism (docs/plan.md §2.2).
 *
 * Sets `data-brand` on a wrapper, which re-maps the CSS custom properties in
 * styles/tokens.css for everything inside it. Because the swap happens in CSS,
 * ANY page or ANY individual section can change mood without a single new
 * component — one component library, two token sets, one accent colour.
 *
 *   <BrandProvider brand="society">  → elegant: serif display, paper ground,
 *                                      lime as hairline only, motion scaled down
 *   <BrandProvider brand="productions"> → rugged: heavy grotesque, black ground,
 *                                      grain on, bold lime, full-strength motion
 *
 * The React context is there so JS-driven motion can also read the current mood
 * (e.g. scaling durations by --motion-scale) — the CSS does not depend on it.
 */

export type Brand = 'productions' | 'society';
export type Surface = 'default' | 'dark';

const BrandContext = createContext<Brand>('productions');

export function useBrand(): Brand {
  return useContext(BrandContext);
}

export interface BrandProviderProps {
  brand?: Brand;
  /** Society on a dark stage — see the [data-surface="dark"] map in tokens.css. */
  surface?: Surface;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function BrandProvider({
  brand = 'productions',
  surface = 'default',
  as: Tag = 'div',
  className,
  children,
}: BrandProviderProps) {
  const Element = Tag as ElementType;
  return (
    <BrandContext.Provider value={brand}>
      <Element
        data-brand={brand}
        data-surface={surface === 'dark' ? 'dark' : undefined}
        className={cn('bg-bg text-fg', className)}
      >
        {children}
      </Element>
    </BrandContext.Provider>
  );
}

export default BrandProvider;

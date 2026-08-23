'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageHoverPreview, Reveal } from '@/components/motion';
import { WORK_INDEX_PLACEHOLDER } from '@/content/placeholders';
import { cn } from '@/lib/utils/cn';

/**
 * WorkIndex — editorial list, not a card grid (design brief §19, §20).
 *
 * At rest this is pure typography: index, title, year, hairline. The imagery
 * only arrives on hover, following the cursor, which keeps the resting page calm
 * and makes the interaction feel considered rather than decorative.
 *
 * Row hover shifts the title a few px and fades the non-hovered rows back, so
 * attention follows the pointer. On touch and under reduced motion the preview
 * never mounts and this degrades to a clean, perfectly usable list of links.
 *
 * NOTE: the full Portfolio page is Developer 2's Milestone 2 task. This is only
 * the landing-page index that links into it.
 */

export function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const items = WORK_INDEX_PLACEHOLDER;

  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <div className="mb-12 flex items-baseline justify-between border-b border-line pb-4 md:mb-16">
          <p className="eyebrow">Selected work</p>
          <Link
            href="/portfolio"
            className="eyebrow text-fg-muted transition-colors hover:text-accent"
          >
            All projects &#8594;
          </Link>
        </div>
      </Reveal>

      <ul onMouseLeave={() => setActive(null)}>
        {items.map((item, i) => (
          <li key={item.index}>
            <Link
              href="/portfolio"
              data-cursor="View"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                'group flex items-baseline gap-5 border-b border-line py-6 md:gap-10 md:py-9',
                'transition-opacity duration-[var(--dur-fast)]',
                active !== null && active !== i ? 'opacity-35' : 'opacity-100',
              )}
            >
              <span className="eyebrow w-8 shrink-0">{item.index}</span>

              <span
                className={cn(
                  'display flex-1 text-[clamp(1.5rem,5.5vw,4rem)] text-fg',
                  'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                  'group-hover:translate-x-2 md:group-hover:translate-x-4',
                )}
              >
                {item.title}
              </span>

              <span className="eyebrow shrink-0">{item.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview — desktop, motion-allowed only. */}
      <ImageHoverPreview
        images={items.map((i) => ({
          src: i.image.src,
          alt: i.image.alt,
          width: i.image.width,
          height: i.image.height,
        }))}
        activeIndex={active}
      />
    </section>
  );
}

export default WorkIndex;

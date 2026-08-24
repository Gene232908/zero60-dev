'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageHoverPreview, Reveal } from '@/components/motion';
import { EVENT_TYPES } from '@/content/site';
import { EVENT_MEDIA } from '@/content/media';
import { cn } from '@/lib/utils/cn';

/**
 * EventIndex — "We cater to these events" as an editorial list, not a card grid
 * (design brief §19, §20).
 *
 * The live site renders this as six boxes of bullet points. Here the six event
 * types become a numbered index: at rest it is pure typography, and the imagery
 * only arrives on hover, following the cursor.
 *
 * The right-hand tags are derived from the client's own bullet copy — each
 * provision is written "Service: detail", so the part before the colon is the
 * service name. Nothing is invented; it is the same data, re-set.
 *
 * On touch and under reduced motion the preview never mounts and this degrades
 * to a clean, perfectly usable list.
 */

/**
 * EVENT_MEDIA maps 1:1 onto EVENT_TYPES — the live site pairs exactly these
 * photographs with exactly these six categories, so the hover preview shows the
 * right image for the right event with no guesswork.
 */
const PREVIEWS = EVENT_MEDIA;

/** "Audio rental: high-quality microphones" -> "Audio rental" */
function serviceTags(provisions: string[]) {
  return provisions
    .map((p) => p.split(':')[0].trim())
    .filter(Boolean)
    .slice(0, 2);
}

export function EventIndex() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <div className="mb-12 flex items-baseline justify-between border-b border-line pb-4 md:mb-16">
          <p className="eyebrow">We cater to these events</p>
          <Link
            href="/services"
            className={cn(
              'eyebrow group relative text-fg-muted',
              'transition-[color,transform] duration-[var(--dur-micro)] ease-[var(--ease-brand)]',
              'hover:text-accent focus-visible:text-accent focus-visible:outline-none',
              'active:scale-[var(--press-scale)] active:ease-[var(--ease-press)]',
            )}
          >
            All services &#8594;
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-[var(--dur-fast)] ease-[var(--ease-signature)] group-focus-visible:origin-left group-focus-visible:scale-x-100 group-hover:origin-left group-hover:scale-x-100"
            />
          </Link>
        </div>
      </Reveal>

      <ul onMouseLeave={() => setActive(null)}>
        {EVENT_TYPES.map((event, i) => (
          // The index used to arrive as one block. Each row now enters on its
          // own beat, so the list assembles top-down the way you read it.
          // Reveal sits INSIDE the <li>: a div between <ul> and <li> is invalid
          // markup and costs the list its semantics in a screen reader.
          <li key={event.index}>
            <Reveal variant="settle" weight="tertiary" delay={i * 0.055}>
              <Link
                href="/services"
                data-cursor="View"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group relative flex items-baseline gap-5 border-b border-line py-6 md:gap-10 md:py-8',
                  'transition-opacity duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
                  'focus-visible:outline-none',
                  active !== null && active !== i ? 'opacity-35' : 'opacity-100',
                )}
              >
                {/* The row's own rule, drawn in accent under the one you are on.
                    A list this typographic should answer with a line, not a
                    colour wash. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-signature)] group-focus-visible:scale-x-100 group-hover:scale-x-100"
                />

                {/* The number steps aside as the title advances — the two move
                    against each other rather than sliding as one block. */}
                <span className="eyebrow w-8 shrink-0 transition-[transform,color] duration-[var(--dur-fast)] ease-[var(--ease-signature)] group-focus-visible:-translate-x-1 group-focus-visible:text-accent group-hover:-translate-x-1 group-hover:text-accent">
                  {event.index}
                </span>

                <span
                  className={cn(
                    'display flex-1 text-[clamp(1.35rem,4.5vw,3.25rem)] text-fg',
                    'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-signature)]',
                    'group-hover:translate-x-2 group-focus-visible:translate-x-2 md:group-hover:translate-x-4 md:group-focus-visible:translate-x-4',
                  )}
                >
                  {event.title}
                </span>

                <span className="hidden shrink-0 text-right lg:block">
                  {serviceTags(event.provisions).map((tag) => (
                    <span
                      key={tag}
                      className="eyebrow ml-4 inline-block transition-colors duration-[var(--dur-fast)] group-hover:text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview — desktop, motion-allowed only. */}
      <ImageHoverPreview
        images={PREVIEWS.map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }))}
        activeIndex={active}
      />
    </section>
  );
}

export default EventIndex;

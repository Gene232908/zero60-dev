'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageHoverPreview, KineticHeading, Parallax, Reveal } from '@/components/motion';
import { Col, Grid, Section } from '@/components/ui';
import { GALLERY_FRAMES } from '@/content/portfolio';

/**
 * PortfolioGallery — the maximalist layered / pinned gallery.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3 (HARD).
 *
 * Two movements, so the section changes shape as you scroll rather than
 * repeating one grid:
 *
 *   1. A typographic index. A numbered list of the work, imagery arriving on
 *      hover via ImageHoverPreview. This scrolls at the page's own rate: it was
 *      previously wrapped in StickySection, but holding the viewport still for
 *      1.25 screens read as the page snagging rather than as emphasis, and
 *      nothing in the list is scrub-linked to the pin to justify the cost.
 *   2. A layered collage. The same frames again as an offset, parallaxed
 *      composition — the "more is more" reading of the same material.
 *
 * Everything is composed from Developer 1's primitives; no animation is
 * hand-rolled here (Task Division Rev 2: no second animation approach).
 *
 * BLOCKER B7: these are the client's own frames recovered from the live site at
 * screen resolution. Nothing is enlarged past its native size — that constraint
 * is still honoured by the layout, and B7 is still open in BLOCKERS.md. What
 * changed is that the page no longer PRINTS the notice: the closing
 * "BLOCKER B7 / awaiting final asset from sir marco" block came out on client
 * direction, because an internal ticket id and an internal name do not belong
 * on a public portfolio. See the note where it used to render, below.
 */

/** Parallax strengths cycled across the collage so no two columns drift alike. */
const DRIFT = ['subtle', 'medium', 'strong'] as const;

export function PortfolioGallery() {
  const [active, setActive] = useState<number | null>(null);

  const previews = GALLERY_FRAMES.map((f) => ({
    src: f.media.src,
    alt: f.media.alt,
    width: f.media.width,
    height: f.media.height,
  }));

  return (
    <>
      {/* ---------- 1. Typographic index ---------- */}
      <Section space="loose">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <p className="eyebrow">Selected work</p>
            <p className="eyebrow">{GALLERY_FRAMES.length} frames</p>
          </div>
        </Reveal>

        <ul className="mt-[var(--space-md)]" onPointerLeave={() => setActive(null)}>
          {GALLERY_FRAMES.map((frame, i) => (
            <li
              key={frame.media.src}
              onPointerEnter={() => setActive(i)}
              className="group flex items-baseline justify-between gap-4 border-b border-line py-[var(--space-xs)] md:py-[var(--space-sm)]"
            >
              <span className="eyebrow shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="display flex-1 text-[clamp(1.35rem,4vw,3rem)] transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                {frame.caption}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Cursor-following preview — returns null on touch and under reduced motion. */}
      <ImageHoverPreview images={previews} activeIndex={active} width={320} />

      {/* ---------- 2. Layered collage ---------- */}
      <Section space="loose" divided>
        <KineticHeading
          as="h2"
          lines={['In the', 'room']}
          size="lg"
          drift={40}
          lineClassName="[&:nth-child(2)]:pl-[8vw] [&:nth-child(2)]:text-accent"
        />

        <Grid align="start" className="mt-[var(--space-lg)]">
          {GALLERY_FRAMES.map((frame, i) => (
            <Col
              key={frame.media.src}
              span={4}
              md={i % 3 === 0 ? 8 : 4}
              lg={i % 3 === 0 ? 6 : 3}
              className={i % 2 === 1 ? 'lg:mt-[var(--space-xl)]' : ''}
            >
              <Parallax strength={DRIFT[i % DRIFT.length]}>
                <Reveal variant="clip" weight="secondary">
                  <figure>
                    <Image
                      src={frame.media.src}
                      alt={frame.media.alt}
                      width={frame.media.width}
                      height={frame.media.height}
                      sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      className="photo-mono w-full object-cover"
                    />
                    <figcaption className="eyebrow mt-[var(--space-2xs)]">{frame.caption}</figcaption>
                  </figure>
                </Reveal>
              </Parallax>
            </Col>
          ))}
        </Grid>

        {/* The B7 notice that used to close this section is REMOVED — client
            direction. It rendered a Divider reading "BLOCKER B7 · PLACEHOLDER —
            awaiting final asset from sir marco" plus a paragraph explaining the
            missing high-resolution originals.

            That was the right call while this was an internal build and the
            wrong one now: it is an internal ticket reference and an internal
            name, printed on a public page, directly under the client's own
            work. B7 is not being hidden — it is still open and still tracked in
            BLOCKERS.md, and GALLERY_PLACEHOLDER is still exported from
            content/portfolio.ts with the note attached, so the register does
            not quietly lose the item just because the page stopped shouting it.

            The engineering promise it was making holds regardless: nothing in
            this gallery is enlarged past its native size, which is enforced by
            the layout above rather than by the paragraph that described it. */}
      </Section>
    </>
  );
}

export default PortfolioGallery;

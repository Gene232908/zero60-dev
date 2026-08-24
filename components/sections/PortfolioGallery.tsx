'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageHoverPreview, KineticHeading, Parallax, Reveal, StickySection } from '@/components/motion';
import { Col, Divider, Grid, Section } from '@/components/ui';
import { GALLERY_FRAMES, GALLERY_PLACEHOLDER } from '@/content/portfolio';

/**
 * PortfolioGallery — the maximalist layered / pinned gallery.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3 (HARD).
 *
 * Two movements, so the section changes shape as you scroll rather than
 * repeating one grid:
 *
 *   1. A pinned index. The section holds still while a typographic list of the
 *      work scrubs past, imagery arriving on hover via ImageHoverPreview. This
 *      is the one place GSAP earns its weight, and StickySection loads it
 *      dynamically so the cost lands only here.
 *   2. A layered collage. The same frames again as an offset, parallaxed
 *      composition — the "more is more" reading of the same material.
 *
 * Everything is composed from Developer 1's primitives; no animation is
 * hand-rolled here (Task Division Rev 2: no second animation approach).
 *
 * BLOCKER B7: these are the client's own frames recovered from the live site at
 * screen resolution. Nothing is enlarged past its native size, and the shortfall
 * is stated on the page rather than hidden.
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
      {/* ---------- 1. Pinned typographic index ---------- */}
      <StickySection scrollLength={1.25}>
        <Section space="loose" className="flex min-h-[92svh] flex-col justify-center">
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
      </StickySection>

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
                      className="w-full object-cover grayscale transition-[filter] duration-[var(--dur-base)] hover:grayscale-0"
                    />
                    <figcaption className="eyebrow mt-[var(--space-2xs)]">{frame.caption}</figcaption>
                  </figure>
                </Reveal>
              </Parallax>
            </Col>
          ))}
        </Grid>

        {/* The shortfall is stated, not hidden — BLOCKER B7. */}
        <Divider label={GALLERY_PLACEHOLDER.blocker} meta={GALLERY_PLACEHOLDER.notice} space="lg" />
        <Reveal variant="fade" weight="tertiary">
          <p className="zs-measure-wide text-[length:var(--text-sm)] leading-relaxed text-fg-faint">
            {GALLERY_PLACEHOLDER.body}
          </p>
        </Reveal>
      </Section>
    </>
  );
}

export default PortfolioGallery;

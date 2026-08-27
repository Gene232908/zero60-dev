import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { KineticHeading, Reveal } from '@/components/motion';
import { Button, Divider, Section } from '@/components/ui';
import { PortfolioGallery } from '@/components/sections/PortfolioGallery';
import { PortfolioVideos } from '@/components/sections/PortfolioVideos';
import { Testimonials } from '@/components/sections/Testimonials';
import { BRAND } from '@/content/site';
import { GALLERY_FRAMES } from '@/content/portfolio';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.portfolio);

/**
 * Portfolio / Testimonials — Milestone 2, Developer 2 (HARD).
 *
 * Task Division Rev 2, p.3: "the maximalist photo gallery (layered / pinned) and
 * the YouTube video sections using performant lite-YouTube embeds, composed from
 * Developer 1's motion primitives."
 *
 * Runs in `productions` mode (the site default) — Society is only /society.
 *
 * Order is deliberate: the work first, the reel second, the words about the work
 * last. Testimonials land after the evidence rather than before it.
 */

export default function PortfolioPage() {
  return (
    <>
      <Section space="flush" className="pb-[var(--space-lg)] pt-32 md:pt-44">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <p className="eyebrow">04 — Portfolio</p>
            <p className="eyebrow">{BRAND.suffix}</p>
          </div>
        </Reveal>

        <div className="pt-[var(--space-lg)]">
          <KineticHeading
            as="h1"
            lines={['Portfolio']}
            size="mega"
            delay={0.15}
            lineClassName="text-fg"
          />
        </div>

        <Reveal variant="rise" weight="secondary" delay={0.24}>
          <p className="zs-measure mt-[var(--space-md)] text-[length:var(--text-lg)] leading-relaxed text-fg-muted">
            {BRAND.tagline}
          </p>
          <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-xs)]">
            <Button href="#reel" variant="outline" size="sm">
              Jump to the reel
            </Button>
            <Button href="#testimonials" variant="ghost" size="sm">
              Read the testimonials
            </Button>
          </div>
        </Reveal>

        <Divider label="Selected work" meta={`${GALLERY_FRAMES.length} frames`} space="lg" />
      </Section>

      <PortfolioGallery />
      <PortfolioVideos />
      <Testimonials />
    </>
  );
}

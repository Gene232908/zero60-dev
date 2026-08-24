import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { Button, Col, Divider, Grid, Section } from '@/components/ui';
import { BRAND } from '@/content/site';
import { TILES } from '@/content/media';

/**
 * AboutPreview — the lower landing "who we are" block.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2.
 *
 * The client's own welcome copy (BRAND.intro, verbatim) set against a small
 * offset collage. The tiles drift at different parallax strengths so the group
 * reads as layered depth rather than a row of thumbnails — the maximalist
 * treatment the brief asks for, composed entirely from Developer 1's Parallax
 * primitive.
 *
 * ⚠️ BLOCKER B2: the supplied imagery is cropped from 1366px-wide screenshots
 * and goes soft when enlarged, so this layout deliberately keeps every frame
 * small and never leans on one hero image. Swap in the originals when they
 * arrive — the layout will not need changing.
 */

/** Three tiles, each with its own drift, so the group never moves as one slab. */
const COLLAGE = [
  { media: TILES.mixer, strength: 'subtle' as const, offset: 'lg:mt-[var(--space-xl)]' },
  { media: TILES.stage, strength: 'medium' as const, offset: '' },
  { media: TILES.cameraOp, strength: 'strong' as const, offset: 'lg:mt-[var(--space-lg)]' },
];

export function AboutPreview() {
  return (
    <Section id="about-preview" divided space="loose">
      <Grid align="start">
        {/* ---- Copy ---- */}
        <Col span={4} md={8} lg={5}>
          <Reveal variant="fade" weight="tertiary">
            <p className="eyebrow">03 — Who we are</p>
          </Reveal>

          <Reveal variant="mask" weight="primary" delay={0.08}>
            <h2 className="display mt-[var(--space-sm)] text-[clamp(2rem,6vw,4.25rem)]">
              {BRAND.wordmark.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal variant="rise" weight="secondary" delay={0.16}>
            <p className="zs-measure mt-[var(--space-md)] text-[length:var(--text-lg)] leading-relaxed text-fg">
              {BRAND.tagline}
            </p>
            <p className="zs-measure mt-[var(--space-sm)] text-[length:var(--text-sm)] leading-relaxed text-fg-muted">
              {BRAND.intro}
            </p>
          </Reveal>

          <Reveal variant="rise" weight="tertiary" delay={0.24}>
            <div className="mt-[var(--space-md)]">
              <Button href="/about" variant="outline">
                More about us
              </Button>
            </div>
          </Reveal>
        </Col>

        {/* ---- Layered collage ---- */}
        <Col span={4} md={8} lg={6} lgStart={7}>
          <div className="grid grid-cols-3 gap-[var(--grid-gap-x)]">
            {COLLAGE.map(({ media, strength, offset }) => (
              <Parallax key={media.src} strength={strength} className={offset}>
                <Reveal variant="clip" weight="secondary">
                  <Image
                    src={media.src}
                    alt={media.alt}
                    width={media.width}
                    height={media.height}
                    sizes="(max-width: 48rem) 30vw, (max-width: 64rem) 22vw, 16vw"
                    className="h-full w-full object-cover grayscale"
                  />
                </Reveal>
              </Parallax>
            ))}
          </div>
        </Col>
      </Grid>

      <Divider label={BRAND.full} meta={BRAND.suffix} space="lg" weight="strong" />
    </Section>
  );
}

export default AboutPreview;

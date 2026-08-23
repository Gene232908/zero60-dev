import Image from 'next/image';
import { KineticHeading, MagneticButton, Parallax, Reveal, StickerSpin } from '@/components/motion';
import { HERO_PLACEHOLDER, PLACEHOLDER_IMAGES } from '@/content/placeholders';

/**
 * Hero — the opening visual composition (design brief §7, §8).
 *
 * Not a centred headline over a CTA. The wordmark is set at mega scale and
 * deliberately runs past the right edge of the type column, the image slot
 * overlaps it, and the bottom rail carries the small supporting facts. The
 * empty upper-right quadrant is intentional — the composition needs the air.
 *
 * Entrance is choreographed, not simultaneous (§8):
 *   0.05s  meta rail
 *   0.15s  image mask reveal
 *   0.25s  wordmark, word by word
 *   0.55s  strapline
 *   0.70s  CTA + scroll cue settle
 */

export function Hero() {
  const image = PLACEHOLDER_IMAGES.heroPrimary;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-28 md:pt-36">
      {/* --- top meta rail --- */}
      <Reveal variant="fade" weight="tertiary" delay={0.05} className="shell">
        <div className="flex items-start justify-between gap-6 border-b border-line pb-4">
          <p className="eyebrow max-w-[16ch]">{HERO_PLACEHOLDER.location}</p>
          <p className="eyebrow hidden max-w-[24ch] text-right sm:block">{HERO_PLACEHOLDER.meta}</p>
          <p className="eyebrow text-right">{HERO_PLACEHOLDER.since}</p>
        </div>
      </Reveal>

      {/* --- main composition: type column + overlapping image --- */}
      <div className="shell relative grid flex-1 grid-cols-12 items-center gap-y-10 py-10">
        {/* Wordmark. Breaks out of the grid on wide screens by design. */}
        <div className="col-span-12 lg:col-span-8">
          <KineticHeading
            as="h1"
            lines={HERO_PLACEHOLDER.wordmark}
            size="mega"
            delay={0.25}
            className="relative z-10 -ml-[0.06em]"
            lineClassName="text-fg"
          />
        </div>

        {/* Image slot — overlaps the type on desktop, sits below it on mobile. */}
        <div className="col-span-12 sm:col-span-8 sm:col-start-5 lg:absolute lg:right-0 lg:top-1/2 lg:z-0 lg:w-[34%] lg:-translate-y-1/2">
          <Parallax strength="subtle">
            <Reveal variant="mask" weight="primary" delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 34vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>

        {/* Rotating seal, tucked into the negative space. */}
        <div className="pointer-events-none absolute bottom-0 right-[38%] hidden lg:block">
          <StickerSpin text="063 · ZEROSIXTYTHREE · 063 · ZEROSIXTYTHREE · " size={124} />
        </div>
      </div>

      {/* --- bottom rail: strapline, CTA, scroll cue --- */}
      <div className="shell">
        <div className="flex flex-col gap-8 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant="rise" weight="secondary" delay={0.55} className="max-w-[46ch]">
            <p className="text-sm leading-relaxed text-fg-muted">{HERO_PLACEHOLDER.strapline}</p>
          </Reveal>

          <Reveal variant="rise" weight="tertiary" delay={0.7} stagger="tight" className="flex flex-wrap items-center gap-4">
            <MagneticButton href="/contact" cursorLabel="Enquire">
              Start a conversation
            </MagneticButton>
            <MagneticButton href="/portfolio" cursorLabel="View" className="border-line">
              View portfolio
            </MagneticButton>
          </Reveal>

          <Reveal variant="fade" weight="tertiary" delay={0.8}>
            <p className="eyebrow hidden lg:block">Scroll &#8595;</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Hero;

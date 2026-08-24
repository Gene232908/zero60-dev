import Image from 'next/image';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { SOCIETY_BRAND } from '@/content/society';
import { PLACEHOLDER_IMAGES } from '@/content/placeholders';

/**
 * SocietyHero — the elegant counterpart to the Productions hero.
 *
 * Same primitives, opposite register. Where Productions fills the viewport with
 * a mega-scale grotesque and a grain overlay, Society opens with air: a single
 * hairline, a serif wordmark at a calmer size, and a long column of whitespace
 * before anything else happens.
 *
 * The serif comes from the token map, not from this file — `data-brand="society"`
 * on the route layout re-points `--display-family`, so KineticHeading renders in
 * Fraunces here and Archivo on every other page. One component, two voices.
 *
 * Copy is PLACEHOLDER: no Society wording has been supplied (BLOCKER B4).
 */

export function SocietyHero() {
  const image = PLACEHOLDER_IMAGES.society;

  return (
    <section className="shell pb-[var(--section-y)] pt-36 md:pt-48">
      <Reveal variant="fade" weight="tertiary">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="eyebrow">{SOCIETY_BRAND.mood}</p>
          <p className="eyebrow">Est. 063</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-12 items-end gap-y-16 pt-16 md:pt-24">
        {/* Type column — deliberately narrow, left-weighted, lots of air to its right */}
        <div className="col-span-12 lg:col-span-7">
          <KineticHeading
            as="h1"
            lines={SOCIETY_BRAND.wordmark}
            size="xl"
            delay={0.15}
            lineClassName="text-fg [&:last-child]:italic"
          />

          <Reveal variant="settle" weight="tertiary" delay={0.55} className="mt-10 max-w-[46ch]">
            {/* Society's one gesture. The rule is drawn slowly and late, well
                after the wordmark has settled — in a register built on air, a
                single line arriving on its own is the whole entrance. */}
            <Reveal variant="draw" delay={0.85}>
              <span aria-hidden="true" className="block h-px w-full bg-line" />
            </Reveal>
            <p className="pt-5 text-sm leading-relaxed text-fg-muted">{SOCIETY_BRAND.tagline}</p>
          </Reveal>
        </div>

        {/* A single restrained portrait, revealed slowly through a mask. */}
        <div className="col-span-12 sm:col-span-7 sm:col-start-6 lg:col-span-4 lg:col-start-9">
          <Parallax strength="subtle">
            <Reveal variant="mask" weight="primary" delay={0.3}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

export default SocietyHero;

import Image from 'next/image';
import { KineticHeading, MagneticButton, Parallax, Reveal } from '@/components/motion';
import { PLACEHOLDER_IMAGES } from '@/content/placeholders';

/**
 * 063 Society — elegant mode (data-brand="society", set in ./layout.tsx).
 *
 * Milestone 1 scope: prove the second mood exists and reads as a different world
 * while staying obviously the same brand family. The full Society page — service
 * categories, its own content layout, the complete section set — is Developer 1's
 * Milestone 2 HARD task, and it will be shown to management early for alignment.
 *
 * Note what is NOT here: no grain (the society token sets --grain-opacity to 0),
 * no heavy grotesque, no aggressive marquee. Same components, restrained subset.
 */

export default function SocietyPage() {
  const image = PLACEHOLDER_IMAGES.society;

  return (
    <section className="shell flex min-h-[92svh] flex-col justify-between pb-20 pt-36 md:pt-44">
      <Reveal variant="fade" weight="tertiary">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="eyebrow">06</p>
          <p className="eyebrow">Elegant mode &#183; data-brand=&quot;society&quot;</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-12 items-center gap-y-14 py-16">
        <div className="col-span-12 lg:col-span-7">
          {/* Same KineticHeading component — the serif comes from the token map. */}
          <KineticHeading as="h1" lines={['063', 'Society']} size="xl" className="mb-10" />

          <div className="max-w-[46ch]">
            <Reveal variant="rise" weight="secondary">
              <p className="border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
                PLACEHOLDER — 063 Society introduction. Final copy, service categories
                (weddings, corporate, event programme support, music &amp; entertainment,
                AV/production) and photography arrive in Milestone 2 (BLOCKERS B2, B4).
              </p>
            </Reveal>

            <Reveal variant="rise" weight="tertiary" delay={0.1} className="mt-10">
              <MagneticButton href="/contact" cursorLabel="Enquire">
                Enquire
              </MagneticButton>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <Parallax strength="subtle">
            <Reveal variant="mask" weight="primary">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>
      </div>

      <Reveal variant="fade" weight="tertiary">
        <p className="border-t border-line pt-5 text-xs leading-relaxed text-fg-faint">
          <span className="text-accent">Status:</span> Milestone 1 delivers the elegant token
          mode and this route. The full 063 Society page is Developer 1&apos;s Milestone 2 build.
        </p>
      </Reveal>
    </section>
  );
}

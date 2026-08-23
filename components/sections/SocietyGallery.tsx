import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { PLACEHOLDER_IMAGES } from '@/content/placeholders';

/**
 * SocietyGallery — an asymmetric two-image composition.
 *
 * Two frames at different sizes, on different vertical offsets, drifting at
 * different rates. That offset is doing the work here; there is no grid of
 * equal tiles because an equal grid would read as a catalogue rather than an
 * art-directed page.
 *
 * All imagery is PLACEHOLDER — no Society photography exists (BLOCKER B4).
 * The frames are paper-toned rather than black so the elegant composition can
 * still be judged before the real pictures arrive.
 */

export function SocietyGallery() {
  const wide = PLACEHOLDER_IMAGES.societyWide;
  const tall = PLACEHOLDER_IMAGES.societyTall;

  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* Larger frame, sitting low */}
        <div className="col-span-12 lg:col-span-7 lg:mt-24">
          <Parallax strength="subtle">
            <Reveal variant="mask" weight="primary">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={wide.src}
                  alt={wide.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
          <Reveal variant="fade" weight="tertiary" delay={0.2}>
            <p className="eyebrow mt-4">PLACEHOLDER — caption</p>
          </Reveal>
        </div>

        {/* Smaller frame, sitting high — the offset is the composition */}
        <div className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <Parallax strength="medium" invert>
            <Reveal variant="mask" weight="secondary" delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={tall.src}
                  alt={tall.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
          <Reveal variant="fade" weight="tertiary" delay={0.3}>
            <p className="eyebrow mt-4">PLACEHOLDER — caption</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyGallery;

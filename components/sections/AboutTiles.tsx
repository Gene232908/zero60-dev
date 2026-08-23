import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { TILES } from '@/content/media';

/**
 * AboutTiles — the five editorial frames.
 *
 * The live site opens About with five images in a flat, evenly-spaced row. Same
 * five subjects here, but the row is broken: each frame sits at a different
 * vertical offset and drifts at a different rate, so the group reads as a
 * composition instead of a filmstrip.
 *
 * Offsets alternate rather than escalate — an escalating stagger turns into a
 * diagonal, which would read as a decorative flourish rather than an edit.
 *
 * These are the client's own photographs (see content/media.ts for provenance),
 * though still cropped from screenshots pending the originals (BLOCKER B2).
 */

const FRAMES = [
  { media: TILES.guitar, offset: 'lg:mt-0', strength: 'subtle' as const },
  { media: TILES.mixer, offset: 'lg:mt-20', strength: 'medium' as const },
  { media: TILES.stage, offset: 'lg:mt-4', strength: 'subtle' as const },
  { media: TILES.cameraOp, offset: 'lg:mt-28', strength: 'medium' as const },
  { media: TILES.camera, offset: 'lg:mt-8', strength: 'subtle' as const },
];

export function AboutTiles() {
  return (
    <section aria-label="The work" className="shell pb-[var(--section-y)]">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
        {FRAMES.map(({ media, offset, strength }, i) => (
          <div key={media.src} className={offset}>
            <Parallax strength={strength}>
              <Reveal variant="mask" weight="secondary" delay={i * 0.08}>
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </Parallax>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutTiles;

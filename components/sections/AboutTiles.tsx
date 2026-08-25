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
              {/* The centre frame leads and the outer four settle in around it,
                  so the group resolves from the middle out rather than sweeping
                  left to right. Matches how the offsets are set: alternating,
                  not escalating. */}
              <Reveal
                variant={i === 2 ? 'lead' : 'settle'}
                weight={i === 2 ? 'primary' : 'secondary'}
                delay={Math.abs(i - 2) * 0.09}
              >
                <div className="group relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    // Held a touch desaturated so the row reads as one edit, and
                    // restored on approach — the frame you are looking at is the
                    // only one at full strength.
                    className="photo-mono scale-[1.03] object-cover group-hover:scale-100"
                  />
                  {/* Hairline that draws down the leading edge on approach. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-signature)] group-hover:scale-y-100"
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

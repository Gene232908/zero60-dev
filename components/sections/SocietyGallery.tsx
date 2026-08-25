import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { SOCIETY } from '@/content/media';

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
 *
 * REFERENCE STUDY (2026-08-25, round 1): madremia.framer.website sets its photo
 * captions as small rotated type running up the side of the frame rather than
 * flat text underneath — this site already owns that exact device (the margin
 * rail in Hero.tsx), so this borrows from a sibling component more than from
 * the reference, and ties Society's gallery back to the same motif Home opens
 * with. Laid out as a CSS grid column rather than absolute positioning, so the
 * caption rail always stretches to the image's own height with no measuring.
 * Falls back to a plain caption below the frame under `lg`, where a vertical
 * label would be cramped.
 *
 * REFERENCE STUDY (round 2): lightfall.framer.website's images arrive on scroll
 * with real conviction, not a slow fade. `mask` (a clip-reveal) is swapped for
 * `snap` — Reveal's overshoot-curve variant — on both frames. This changes the
 * ENTRANCE only. The hover behaviour immediately below (no scale, no bounce; the
 * change is in the picture's tone, not its geometry) is untouched — restraint
 * once a photograph has arrived is still the register, only how it gets there
 * has more presence now.
 */

export function SocietyGallery() {
  const wide = SOCIETY.wide;
  const tall = SOCIETY.tall;

  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* Larger frame, sitting low */}
        <div className="col-span-12 lg:col-span-7 lg:mt-24">
          <div className="lg:grid lg:grid-cols-[1fr_2rem] lg:items-stretch lg:gap-4">
            <Parallax strength="subtle">
              <Reveal variant="snap" weight="primary">
                <div className="group relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={wide.src}
                    alt={wide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    // HOVER (not the scroll-entrance above): the pointer approaching
                    // never scales or bounces the frame. It settles in tone instead —
                    // held slightly flat, restored as you look at it. The change is in
                    // the picture, not in its geometry.
                    className="photo-mono object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-cinematic)] ease-[var(--ease-brand)] group-hover:scale-x-100"
                  />
                </div>
              </Reveal>
            </Parallax>
            <div className="mt-4 lg:mt-0 lg:flex lg:items-center lg:justify-center">
              <Reveal variant="settle" weight="tertiary" delay={0.25}>
                <p className="eyebrow lg:origin-center lg:-rotate-90 lg:whitespace-nowrap">
                  PLACEHOLDER — caption
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Smaller frame, sitting high — the offset is the composition */}
        <div className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <div className="lg:grid lg:grid-cols-[1fr_2rem] lg:items-stretch lg:gap-4">
            <Parallax strength="medium" invert>
              <Reveal variant="snap" weight="secondary" delay={0.15}>
                <div className="group relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={tall.src}
                    alt={tall.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                    // HOVER (not the scroll-entrance above): the pointer approaching
                    // never scales or bounces the frame. It settles in tone instead —
                    // held slightly flat, restored as you look at it. The change is in
                    // the picture, not in its geometry.
                    className="photo-mono object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-cinematic)] ease-[var(--ease-brand)] group-hover:scale-x-100"
                  />
                </div>
              </Reveal>
            </Parallax>
            <div className="mt-4 lg:mt-0 lg:flex lg:items-center lg:justify-center">
              <Reveal variant="settle" weight="tertiary" delay={0.4}>
                <p className="eyebrow lg:origin-center lg:-rotate-90 lg:whitespace-nowrap">
                  PLACEHOLDER — caption
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocietyGallery;

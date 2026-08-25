import Image from 'next/image';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { SOCIETY } from '@/content/media';

/**
 * SocietyGallery — the visual story.
 *
 * REDESIGN (2026-08-25). Previously two frames with rotated captions. The brief
 * asked this section to carry an emotional beat rather than present a pair of
 * pictures: "large photography, cropped images, portrait images, wide images,
 * overlapping images, subtle parallax… let the images breathe."
 *
 * WHAT CHANGED
 *
 * 1. A HEADING NOW OPENS IT. Previously the section began cold with a photo.
 *    Between the asymmetric experiences composition above and the enquiry below,
 *    an unheaded pair of images read as a continuation of the previous section
 *    rather than as its own beat. The heading is the section's entry point and
 *    it is set in the serif display at `md` — large enough to reset the reader,
 *    small enough not to compete with the manifesto or the closing statement,
 *    which are the page's two `lg` moments. Type hierarchy across the whole
 *    page is the reason for that restraint, not this section in isolation.
 *
 * 2. THE FULL-BLEED FRAME. The wide image now breaks the shell and runs edge to
 *    edge. This is the only full-bleed PHOTOGRAPH on the page, and it is placed
 *    at the emotional peak deliberately — the brief's "let the images breathe".
 *    It sits at aspect 21/9 on desktop so it reads as a cinematic band rather
 *    than a big rectangle, and relaxes to 3/2 on mobile where 21/9 would be a
 *    letterbox slit.
 *
 * 3. THE OFFSET PAIR BELOW IT. Portrait and wide, on different vertical
 *    offsets, drifting in opposite directions — the same asymmetry logic as
 *    SocietyExperiences, kept consistent so the two sections read as one
 *    art direction rather than two ideas.
 *
 * WHAT DID NOT CHANGE, deliberately: the rotated margin caption (this site
 * already owns that device in Hero.tsx, and reusing it ties Society back to the
 * motif Home opens with), the `snap` entrance on photography, and the
 * tone-only hover. Restraint once a photograph has arrived is still the
 * register — the frames never scale or lift under the pointer; only their
 * colour resolves, via .photo-mono.
 *
 * All imagery is the three supplied Society frames (BLOCKER B2 — the sources
 * are low-resolution and will look soft at the full-bleed size; replace before
 * launch). Captions are PLACEHOLDER (BLOCKER B4).
 */

export function SocietyGallery() {
  const wide = SOCIETY.wide;
  const tall = SOCIETY.tall;
  const main = SOCIETY.main;

  return (
    <section className="py-[var(--section-y)]">
      {/* ---------- heading ---------- */}
      <div className="shell">
        <div className="grid grid-cols-12">
          <Reveal variant="fade" weight="tertiary" className="col-span-12 mb-10 md:col-span-3 md:mb-14">
            <p className="eyebrow">Selected Work</p>
          </Reveal>

          <div className="col-span-12 md:col-span-9">
            <KineticHeading
              lines={['Moments worth', 'keeping.']}
              size="md"
              lineClassName="text-fg [&:last-child]:pl-[6vw] [&:last-child]:italic"
            />
          </div>
        </div>
      </div>

      {/* ---------- the full-bleed band ---------- */}
      {/* Deliberately outside .shell. This is the page's widest moment. */}
      <div className="mt-16 md:mt-24">
        <Parallax strength="subtle">
          <Reveal variant="snap" weight="primary">
            <div className="group relative aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
              <Image
                src={wide.src}
                alt={wide.alt}
                fill
                sizes="100vw"
                className="photo-mono object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-cinematic)] ease-[var(--ease-brand)] group-hover:scale-x-100"
              />
            </div>
          </Reveal>
        </Parallax>
      </div>

      {/* ---------- the offset pair ---------- */}
      <div className="shell mt-16 md:mt-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          {/* Portrait, sitting high */}
          <div className="col-span-12 sm:col-span-8 lg:col-span-4">
            <div className="lg:grid lg:grid-cols-[1fr_2rem] lg:items-stretch lg:gap-4">
              <Parallax strength="medium" invert>
                <Reveal variant="snap" weight="secondary">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={tall.src}
                      alt={tall.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
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

          {/* Wider frame, sitting low — the offset is the composition */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:mt-32">
            <div className="lg:grid lg:grid-cols-[1fr_2rem] lg:items-stretch lg:gap-4">
              <Parallax strength="subtle">
                <Reveal variant="snap" weight="primary" delay={0.15}>
                  <div className="group relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={main.src}
                      alt={main.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
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
      </div>
    </section>
  );
}

export default SocietyGallery;

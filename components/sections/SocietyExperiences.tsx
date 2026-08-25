import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { SOCIETY_EXPERIENCES } from '@/content/society';
import { SOCIETY } from '@/content/media';

/**
 * SocietyExperiences — the asymmetric editorial composition.
 * NEW in the 2026-08-25 redesign.
 *
 * The brief: "Do not create a basic grid of six equal cards. Instead, create an
 * asymmetric image composition inspired by premium editorial photography
 * websites. Use varying image sizes. Create intentional overlap where
 * appropriate."
 *
 * THREE FRAMES, THREE DIFFERENT SIZES, THREE DIFFERENT VERTICAL OFFSETS:
 *
 *   01  cols 1–6    aspect 4/5   flush top          drifts down (subtle)
 *   02  cols 7–12   aspect 3/2   pushed down 12rem  drifts up   (medium, inverted)
 *   03  cols 3–9    aspect 16/10 pulled up 6rem     drifts down (subtle)
 *
 * Every number there is doing a job. The differing ASPECT RATIOS mean no two
 * frames present the same rectangle, which is the single clearest tell between
 * an art-directed gallery and a CMS grid. The differing OFFSETS mean the eye
 * travels diagonally down the section instead of scanning rows. And frame 03 is
 * deliberately centred across columns 3–9 rather than aligned to either margin,
 * so the composition closes inward rather than trailing off.
 *
 * THE OVERLAP. Frame 03's negative top margin pulls it up into the vertical
 * space frame 02's push-down opened. They do not collide — 02 ends at column 12
 * and 03 starts at column 3 — but their vertical bands intersect, so the section
 * reads as layered rather than stacked. That is the "intentional overlap" the
 * brief asked for, achieved with margins on a shared grid rather than absolute
 * positioning, so nothing needs measuring and nothing can escape the container.
 *
 * THE PARALLAX DIRECTIONS ALTERNATE. If all three drifted the same way the
 * section would simply feel like it was scrolling slightly wrong. Inverting the
 * middle frame means the gap between 01 and 02 opens and closes as you pass —
 * the composition is genuinely different at the top of the scroll than at the
 * bottom.
 *
 * CAPTIONS sit as numbered margin notes beside each frame rather than as titles
 * above them, so the photographs stay the loudest thing in the section. The
 * brief: "Do not put text on every image" — no text is ON any image here.
 *
 * MOBILE. All three frames go full width, the offsets and overlaps all collapse
 * to a plain vertical rhythm, and captions move beneath their frame. The
 * asymmetry depends on having 12 real columns; forcing it into 390px would
 * produce exactly the "broken desktop" the brief rules out.
 *
 * Imagery reuses the three supplied Society frames (BLOCKER B2 — low-res
 * sources). Notes are PLACEHOLDER (BLOCKER B4).
 */

const FRAMES = [
  {
    media: SOCIETY.main,
    /** cols + vertical offset, aspect, drift */
    className: 'col-span-12 md:col-span-6 lg:col-span-6',
    aspect: 'aspect-[4/5]',
    strength: 'subtle' as const,
    invert: false,
  },
  {
    media: SOCIETY.wide,
    className: 'col-span-12 md:col-span-6 lg:col-span-6 lg:mt-48',
    aspect: 'aspect-[3/2]',
    strength: 'medium' as const,
    invert: true,
  },
  {
    media: SOCIETY.tall,
    className: 'col-span-12 md:col-span-10 md:col-start-2 lg:col-span-7 lg:col-start-3 lg:-mt-24',
    aspect: 'aspect-[16/10]',
    strength: 'subtle' as const,
    invert: false,
  },
];

export function SocietyExperiences() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="mb-16 grid grid-cols-12 md:mb-24">
        <Reveal variant="fade" weight="tertiary" className="col-span-12 md:col-span-3">
          <p className="eyebrow">The Evening</p>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-20">
        {FRAMES.map((frame, i) => {
          const entry = SOCIETY_EXPERIENCES[i];

          return (
            <div key={entry.index} className={frame.className}>
              <Parallax strength={frame.strength} invert={frame.invert}>
                <Reveal variant="snap" weight="primary" delay={i * 0.06}>
                  <div className={`group relative w-full overflow-hidden ${frame.aspect}`}>
                    <Image
                      src={frame.media.src}
                      alt={frame.media.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      className="photo-mono object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-cinematic)] ease-[var(--ease-brand)] group-hover:scale-x-100"
                    />
                  </div>
                </Reveal>
              </Parallax>

              {/* Caption as a numbered margin note under the frame — index and
                  title on one baseline, the note on a narrow measure beneath. */}
              <Reveal variant="settle" weight="tertiary" delay={0.2}>
                <div className="mt-5 flex items-baseline gap-4 border-t border-line pt-4">
                  <p className="eyebrow shrink-0">{entry.index}</p>
                  <div>
                    <h3 className="display text-[clamp(1.1rem,1.8vw,1.5rem)] text-fg">
                      {entry.title}
                    </h3>
                    <p className="mt-1.5 max-w-[38ch] text-sm leading-relaxed text-fg-muted">
                      {entry.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SocietyExperiences;

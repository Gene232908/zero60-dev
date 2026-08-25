import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { SOCIETY_PILLARS } from '@/content/society';
import { SOCIETY } from '@/content/media';

/**
 * SocietyPillars — the approach. NEW in the 2026-08-25 redesign.
 *
 * The brief was explicit: "Do NOT simply create four boring cards." So this is
 * not a card row. It is a STAGGERED VERTICAL LADDER — three entries, each on a
 * different horizontal offset, with a photograph occupying the space the
 * offsets open up.
 *
 * THE COMPOSITION, and why it is built this way:
 *
 *   entry 01  starts at column 1   ─┐
 *   entry 02  starts at column 3    │  the type staircases right and down
 *   entry 03  starts at column 5   ─┘
 *   photo     columns 8–12, spanning all three rows, drifting on parallax
 *
 * The step is 2 columns per entry, which is large enough to read as deliberate
 * at a glance and small enough that the numerals still form a legible left
 * edge. Three equal cards side by side would have given every entry the same
 * emphasis and the same entrance — the ladder gives the section a reading
 * ORDER and a diagonal, which is what the references use instead of a grid.
 *
 * THE PHOTOGRAPH IS THE POINT OF THE ASYMMETRY. Without it the right side of
 * the section is dead space and the staircase just looks like broken
 * alignment. It spans the full row group so it reads as one continuous
 * surface the type is stepping across, and it drifts on `Parallax` so the
 * relationship between type and image changes as you scroll — the
 * "relationship between typography and imagery" the brief asked to study.
 *
 * HOVER. The row's numeral takes the accent and the hairline under the row
 * draws in from the left. That is the same restrained hover the category index
 * uses, deliberately — one hover vocabulary for the whole page, not a new
 * gesture per section. No lift, no scale, no shadow.
 *
 * MOBILE. The ladder flattens entirely (every entry to column 1) and the photo
 * moves above the list. An indent staircase inside a 390px viewport eats the
 * measure and reads as an accident rather than a composition, so below `lg`
 * the section becomes a clean stack — "intentionally designed", not a shrunk
 * desktop.
 *
 * Descriptions are PLACEHOLDER (BLOCKER B4).
 */

/**
 * The ladder placement, indexed by position: horizontal offset AND explicit row.
 *
 * ⚠️ THE ROW MUST BE EXPLICIT. The photograph beside this ladder is placed at
 * `lg:row-start-1 lg:row-span-3`, i.e. it occupies rows 1–3 of the right-hand
 * columns. Once ANY item in a grid carries an explicit column position, the
 * auto-placement algorithm will not back-fill around an already-occupied span
 * the way you would expect: entries 2 and 3 got pushed below the photograph
 * into rows 4 and 5, which left a tall empty gap beside it and broke the whole
 * composition. Pinning each entry to its own row is what actually produces the
 * three-rows-of-type-beside-one-tall-photo layout this section is.
 *
 * Kept as whole class strings because Tailwind cannot see interpolated class
 * names at build time — `lg:col-start-${i}` would simply not be generated.
 */
const PLACEMENT = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-3 lg:row-start-2',
  'lg:col-start-5 lg:row-start-3',
];

export function SocietyPillars() {
  const photo = SOCIETY.tall;

  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <p className="eyebrow mb-14 md:mb-20">Approach</p>
      </Reveal>

      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        {/* -- the photograph: above the ladder on mobile, beside it on lg -- */}
        {/* Placed FIRST in source order so it appears above the list on small
            screens without needing an order-* override; on lg it is pulled into
            the right-hand columns and the rows it shares. */}
        {/* `self-center` because the frame is aspect-sized rather than stretched:
            it still RESERVES rows 1–3 (so the ladder cannot flow underneath it),
            but it sits centred against the staircase instead of being pinned to
            the top of the group, which is what makes it read as one surface the
            type steps across rather than a picture parked at the top right. */}
        <div className="col-span-12 self-center sm:col-span-8 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1">
          <Parallax strength="medium">
            <Reveal variant="snap" weight="primary">
              {/* Sized by ASPECT RATIO, not by h-full. `h-full` would have to
                  resolve through two intermediate divs that Parallax renders
                  (neither of which has a height), so it silently does nothing
                  and the frame collapses. A fixed 4/5 ratio is also the more
                  robust choice: the photograph keeps its intended crop
                  regardless of how much text ends up in the three entries
                  beside it, which matters because that copy is still
                  placeholder and will change length when the real words land. */}
              <div className="group relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
                  className="photo-mono object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/70"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>

        {/* -- the ladder -- */}
        {SOCIETY_PILLARS.map((pillar, i) => (
          <article
            key={pillar.index}
            className={`group col-span-12 lg:col-span-6 ${PLACEMENT[i]}`}
          >
            <Reveal variant="settle" weight="secondary" delay={i * 0.08}>
              <div className="relative border-t border-line pt-6 md:pt-8">
                <div className="flex items-baseline gap-5">
                  <p className="eyebrow transition-colors duration-[var(--dur-base)] ease-[var(--ease-brand)] group-hover:text-accent">
                    {pillar.index}
                  </p>
                  <h3 className="display text-[clamp(1.9rem,4.4vw,3.1rem)] text-fg">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-4 max-w-[44ch] pl-[calc(2ch+1.25rem)] text-sm leading-relaxed text-fg-muted transition-colors duration-[var(--dur-base)] ease-[var(--ease-brand)] group-hover:text-fg">
                  {pillar.description}
                </p>

                {/* Same hairline gesture as the category index — one hover
                    vocabulary across the page. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-brand)] group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SocietyPillars;

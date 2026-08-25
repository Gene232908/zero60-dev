import { Marquee, Reveal } from '@/components/motion';
import { SOCIETY_MARQUEE } from '@/content/society';

/**
 * SocietyMarquee — the horizontal band. NEW in the 2026-08-25 redesign.
 *
 * ⚠️ THIS SECTION OVERRIDES A STANDING RULE. SOCIETY_NOTES.avoid has said "no
 * marquees" since Milestone 1. The redesign brief requires one, so the rule was
 * AMENDED rather than quietly broken — see content/society.ts, which now permits
 * a marquee only at the elegant register and states the conditions. Every one of
 * those conditions is met here:
 *
 *   serif, mixed case      → `display` class + no uppercase transform (Society's
 *                            --display-transform is already `none`)
 *   ≥60s per pass          → 78s and 92s below, vs Productions' 32s default
 *   hairline separators    → a 1px rule, not a bullet, dot or accent block
 *   never accent-filled    → text-fg-muted; the accent appears only as the two
 *                            hairline rules bounding the band
 *
 * WHY IT EARNS ITS PLACE. The brief asked for section-to-section transitions
 * that avoid hard breaks, and this is the page's bridge: it sits between the
 * approach and the category index, is the only full-bleed element on the page,
 * and carries no new information — it is a breath between two dense sections,
 * which is exactly what a marquee is good for and what a card grid is not.
 *
 * TWO ROWS, OPPOSITE DIRECTIONS, DIFFERENT SPEEDS. The brief asked for
 * alternating direction. Equal-and-opposite speeds would visually cancel and
 * read as a mistake, so row 2 is slower (92s vs 78s) and set at a smaller size
 * in muted tone — it reads as a shadow of row 1 rather than a competing band.
 *
 * CONTENT is the five REAL category names (plan.md §4 M2), so the band states
 * nothing the signed plan does not already state.
 *
 * NO HORIZONTAL OVERFLOW. Marquee clips internally (`overflow-hidden`) and the
 * section is `overflow-hidden` too, so the full-bleed band cannot produce a
 * scrollbar at any width — the brief's explicit mobile requirement. `repeat`
 * is set high enough that one copy always exceeds the widest viewport; see the
 * warning in Marquee.tsx about short content leaving a moving gap.
 *
 * REDUCED MOTION is handled inside Marquee: the track stops and renders one
 * static, readable copy.
 */

const Separator = () => (
  <span aria-hidden="true" className="mx-8 inline-block h-px w-10 bg-line-strong align-middle md:mx-12 md:w-16" />
);

export function SocietyMarquee() {
  return (
    <section className="relative overflow-hidden py-[clamp(3.5rem,8vh,7rem)]">
      {/* The band is bounded top and bottom by a hairline — this is the one
          place lime is allowed to run the full width of the page, because it is
          literally a hairline, which is Society's stated accent rule. */}
      <Reveal variant="draw">
        <span aria-hidden="true" className="block h-px w-full bg-accent/40" />
      </Reveal>

      <div className="py-[clamp(2rem,5vh,3.5rem)]">
        <Marquee duration={78} direction="left" repeat={3} separator={<Separator />}>
          {SOCIETY_MARQUEE.map((label) => (
            <span
              key={label}
              className="display whitespace-nowrap text-[clamp(1.75rem,5vw,4rem)] text-fg"
            >
              {label}
            </span>
          ))}
        </Marquee>

        {/* Row two: opposite direction, slower, quieter. The offset between the
            two rates is what stops the pair reading as one static texture. */}
        <div className="mt-6 md:mt-9">
          <Marquee duration={92} direction="right" repeat={3} separator={<Separator />}>
            {SOCIETY_MARQUEE.map((label) => (
              <span
                key={label}
                className="display whitespace-nowrap text-[clamp(1.2rem,3vw,2.25rem)] italic text-fg-muted"
              >
                {label}
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      <Reveal variant="draw">
        <span aria-hidden="true" className="block h-px w-full bg-accent/40" />
      </Reveal>
    </section>
  );
}

export default SocietyMarquee;

import { Reveal } from '@/components/motion';
import { SOCIETY_CATEGORIES } from '@/content/society';

/**
 * SocietyCategories — the five service categories as an elegant index.
 *
 * The category NAMES are real: they are specified in plan.md §4 M2 and
 * Task Division Rev 2 p.3. The descriptions are PLACEHOLDER — none were
 * supplied (BLOCKER B4).
 *
 * Deliberately the same editorial-list idea as the Productions event index, but
 * played quietly: no cursor-following image preview, no translate on hover, no
 * opacity dimming of the other rows. Just a hairline that draws itself in under
 * the row you are pointing at. That restraint is the whole argument for the
 * elegant register — same structure, less noise.
 */

export function SocietyCategories() {
  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <p className="eyebrow mb-14 md:mb-20">Services</p>
      </Reveal>

      <Reveal stagger="loose" variant="settle" weight="tertiary">
        {SOCIETY_CATEGORIES.map((category) => (
          <article key={category.index} className="group relative border-t border-line py-9 md:py-12">
            <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3">
              {/* The index takes on the accent as you arrive. It is the smallest
                  mark on the row, which is exactly why it can carry the colour
                  without the row raising its voice. */}
              <p className="eyebrow col-span-12 transition-colors duration-[var(--dur-base)] ease-[var(--ease-brand)] group-hover:text-accent sm:col-span-1">
                {category.index}
              </p>

              <h3 className="display col-span-12 text-[clamp(1.6rem,3.6vw,2.6rem)] sm:col-span-5">
                {category.title}
              </h3>

              <p className="col-span-12 text-sm leading-relaxed text-fg-muted transition-colors duration-[var(--dur-base)] ease-[var(--ease-brand)] group-hover:text-fg sm:col-span-6">
                {category.description}
              </p>
            </div>

            {/* Hairline draws in from the left on hover — the elegant equivalent
                of the Productions row shift. It rides --ease-brand, which
                resolves to Society's restrained curve here and would resolve to
                the Productions snap if this index were ever dropped into that
                register. The curve is part of the mood, not a constant. */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-brand)] group-hover:scale-x-100"
            />
          </article>
        ))}
      </Reveal>

      <div className="border-t border-line" />
    </section>
  );
}

export default SocietyCategories;

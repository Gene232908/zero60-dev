import Image from 'next/image';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { SOCIETY_BRAND, SOCIETY_CATEGORIES } from '@/content/society';
import { SOCIETY } from '@/content/media';
import { NAV_ITEMS } from '@/content/nav';

/**
 * SocietyHero — the elegant counterpart to the Productions hero.
 *
 * REFACTOR (2026-08-25). The brief asked to study lightfall.framer.website's
 * hero and scroll motion specifically and push Society further. What is
 * borrowed is the STRUCTURE — a full-bleed photograph, a wordmark with real
 * scale, an inset frame, small facts at the foot of the composition — not its
 * copy, its exact spacing, or its layout file. This section is built from
 * scratch against that structure, in Society's own materials.
 *
 * Same primitives Productions uses, opposite register:
 *   - the plate lightens toward paper under the type (.hero-scrim-society),
 *     the mirror image of Productions' scrim, because dark serif type needs a
 *     LIGHT ground, not a dark one
 *   - the wordmark is set at real scale, but stays inside the gutter rather
 *     than bleeding off both edges — grand, not loud
 *   - the inset frame arrives on `snap` (Reveal's overshoot-curve variant):
 *     a decisive, felt arrival for the PHOTOGRAPH specifically. Society's
 *     restraint is a rule about TYPE, not about photography sitting still —
 *     SOCIETY_NOTES rules out "aggressive kinetic type", not a confident image
 *   - the category strip at the foot uses the five REAL names from plan.md,
 *     not invented stats — lightfall's "10+ Years" has no equivalent here we
 *     are allowed to state
 *
 * `data-brand="society"` on the route layout re-points every token this file
 * reads (`--display-family`, `--fg`, `--ease-brand`...), so nothing here is
 * hardcoded to the elegant mood — it is the same component family Productions
 * uses, reading the other half of the token map. One system, two voices.
 *
 * Copy is PLACEHOLDER: no Society wording has been supplied (BLOCKER B4).
 */

const SOCIETY_NAV = NAV_ITEMS.find((item) => item.href === '/society');

export function SocietyHero() {
  const plate = SOCIETY.wide;
  const portrait = SOCIETY.main;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-8 md:pt-12">
      {/* ---------- the plate ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={plate.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="photo-mono object-cover"
        />
        {/* Lightens toward --paper under the wordmark. See globals.css — this is
            .hero-scrim's mirror image, built for dark type on a light ground. */}
        <div className="absolute inset-0 hero-scrim-society" />
      </div>

      {/* ---------- top meta rail ---------- */}
      <Reveal variant="fade" weight="tertiary" delay={0.05} className="hero-bleed relative z-30">
        <div className="flex items-baseline justify-between border-b border-line-strong pb-4">
          <p className="eyebrow hero-label text-halo-paper">
            {SOCIETY_NAV ? `${SOCIETY_NAV.index} — ${SOCIETY_NAV.label}` : SOCIETY_BRAND.name}
          </p>
          {/* NOT hero-label-accent. Lime as a block of filled text is a bigger
              use of the accent than "a hairline", which is Society's own
              stated rule (content/society.ts SOCIETY_NOTES). Measured under
              3:1 against this photo once the scrim above was corrected for the
              other label's contrast — lime and paper sit too close in
              luminance for lime-as-text to ever be reliably legible here. */}
          <p className="eyebrow hero-label text-halo-paper hidden sm:block">
            {SOCIETY_BRAND.mood}
          </p>
          <p className="eyebrow hero-label text-halo-paper">Est. 063</p>
        </div>
      </Reveal>

      {/* ---------- inset frame ---------- */}
      {/* One considered photograph, not a cluster — "Society earns its impact
          by emptying it" still holds. `snap` gives it a felt arrival; nothing
          else about the composition raises its voice. */}
      <div className="hero-bleed relative z-20 flex flex-1 items-center justify-end">
        <div className="w-full max-w-[17rem] sm:max-w-[19rem]">
          <Parallax strength="subtle">
            <Reveal variant="snap" weight="primary" delay={0.25}>
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-line-strong shadow-[0_28px_70px_-18px_rgb(0_0_0/0.25)]">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 19rem"
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
      </div>

      {/* ---------- wordmark + tagline ---------- */}
      <div className="hero-bleed relative z-30">
        {/* xl, not mega. The Productions hero hit this exact wall earlier in
            this project: mega on a 2-line wordmark reads as a solid block rather
            than a focal point, and here it also pushed total hero height past
            100svh (measured 1186px against a 900px viewport before this fix). */}
        <KineticHeading
          as="h1"
          lines={SOCIETY_BRAND.wordmark}
          size="xl"
          delay={0.4}
          className="text-halo-paper"
          lineClassName="text-fg [&:last-child]:italic"
        />

        <div className="mt-8 grid grid-cols-12 gap-y-6 border-t border-line-strong pt-6 md:mt-10">
          <Reveal variant="settle" weight="tertiary" delay={0.75} className="col-span-12 md:col-span-6">
            <p className="text-halo-paper max-w-[42ch] text-sm leading-relaxed text-fg-muted">
              {SOCIETY_BRAND.tagline}
            </p>
          </Reveal>

          {/* Real category names, not invented stats — the honest equivalent of
              a reference hero's small fact-strip along the bottom edge. */}
          <Reveal
            variant="fade"
            weight="tertiary"
            delay={0.95}
            className="col-span-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:col-span-6 md:justify-end"
          >
            {SOCIETY_CATEGORIES.slice(0, 3).map((category) => (
              <span key={category.index} className="eyebrow text-halo-paper text-fg-muted">
                {category.title}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyHero;

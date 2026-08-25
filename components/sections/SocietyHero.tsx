import Image from 'next/image';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { SOCIETY_BRAND, SOCIETY_CATEGORIES } from '@/content/society';
import { SOCIETY } from '@/content/media';
import { NAV_ITEMS } from '@/content/nav';

/**
 * SocietyHero — the cinematic opening.
 *
 * REDESIGN (2026-08-25). The brief asked for a hero built the way
 * planfest/lightfall build theirs: full viewport, one photograph with real
 * presence, type at genuine scale, and an entrance that arrives in stages
 * rather than all at once. The previous version had the right materials but
 * spent its height on a three-part flex column (meta rail / inset frame /
 * wordmark) that left the wordmark cramped at the foot of the frame.
 *
 * WHAT CHANGED AND WHY
 *
 * 1. COMPOSITION. The wordmark now sits on the optical third rather than
 *    flush at the bottom, and the inset photograph overlaps it from the right.
 *    Overlap is the single biggest reason the references read as art-directed
 *    rather than stacked — elements share a horizon instead of queueing.
 *
 * 2. ENTRANCE ORDER. The brief specified: plate → eyebrow → headline lines →
 *    supporting copy → CTA, staggered, never simultaneous. Delays below run
 *    0.05 → 0.18 → 0.32 (headline) → 0.72 → 0.88 → 1.05, which lands the whole
 *    sequence inside the 800–1400ms "hero entrance" band the brief set. Note
 *    these are Reveal `delay` values in seconds and KineticHeading adds its own
 *    per-word stagger on top, so the headline is still resolving as the
 *    supporting copy begins — deliberately overlapping, not sequential-with-gaps.
 *
 * 3. `immediate` ON EVERYTHING. This is a correctness fix, not a style one.
 *    Reveal's default is scroll-triggered with a viewport margin that shrinks
 *    the detection box 12% at the bottom — so above-the-fold content never
 *    fires until the user scrolls. Every Reveal in this hero is above the fold
 *    by definition. Without `immediate` the hero would load blank. (The prop
 *    exists precisely for this; see Reveal.tsx.)
 *
 * 4. SCROLL CUE. The brief asked for one. `zs-scroll-cue` already existed in
 *    globals.css, was written for exactly this, and had no caller.
 *
 * WHAT DELIBERATELY DID NOT CHANGE: the light-scrim treatment. Society's fg is
 * ink-900, so a photo plate under dark serif type has to lighten toward paper,
 * not darken — .hero-scrim-society is the mirror of Productions' .hero-scrim
 * and its contrast was already measured. The type stays `xl`, not `mega`: mega
 * on a 2-line wordmark reads as a solid block and previously pushed hero height
 * past 100svh.
 *
 * Copy is PLACEHOLDER (BLOCKER B4).
 */

const SOCIETY_NAV = NAV_ITEMS.find((item) => item.href === '/society');

export function SocietyHero() {
  const plate = SOCIETY.wide;
  const portrait = SOCIETY.main;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-12 pt-8 md:pt-12">
      {/* ---------- the plate ---------- */}
      {/* Scales down from 1.06 over 1.6s: the "subtle image movement continues
          after entrance" the brief called for. transform only, and it settles
          rather than looping, so nothing is animating once the hero is read. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="zs-hero-plate absolute inset-0">
          <Image
            src={plate.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="photo-mono object-cover"
          />
        </div>
        <div className="absolute inset-0 hero-scrim-society" />
      </div>

      {/* ---------- top meta rail ---------- */}
      <Reveal
        variant="fade"
        weight="tertiary"
        delay={0.05}
        immediate
        className="hero-bleed relative z-30"
      >
        <div className="flex items-baseline justify-between border-b border-line-strong pb-4">
          <p className="eyebrow hero-label text-halo-paper">
            {SOCIETY_NAV ? `${SOCIETY_NAV.index} — ${SOCIETY_NAV.label}` : SOCIETY_BRAND.name}
          </p>
          {/* NOT hero-label-accent. Lime as a block of filled text is a bigger
              use of the accent than "a hairline", which is Society's own stated
              rule (content/society.ts SOCIETY_NOTES). Lime and paper also sit
              too close in luminance for lime-as-text to clear 3:1 here. */}
          <p className="eyebrow hero-label text-halo-paper hidden sm:block">
            {SOCIETY_BRAND.mood}
          </p>
          <p className="eyebrow hero-label text-halo-paper">Est. 063</p>
        </div>
      </Reveal>

      {/* ---------- the composition ---------- */}
      {/* One 12-column grid holding BOTH the wordmark and the photograph, so
          they can overlap on a shared row rather than being stacked by a flex
          column. The frame starts at column 8 and the wordmark runs to column
          9 — that one-column bite is the overlap, and it only engages at lg
          where there is width to spare. */}
      <div className="hero-bleed relative z-20 flex flex-1 items-center">
        <div className="grid w-full grid-cols-12 items-center gap-y-12">
          {/* -- wordmark + supporting copy -- */}
          <div className="col-span-12 lg:col-span-9 lg:row-start-1">
            <KineticHeading
              as="h1"
              lines={SOCIETY_BRAND.wordmark}
              size="xl"
              delay={0.32}
              className="text-halo-paper"
              lineClassName="text-fg [&:last-child]:italic [&:last-child]:pl-[8vw]"
            />

            <div className="mt-10 grid grid-cols-12 gap-y-6 md:mt-14">
              <Reveal
                variant="settle"
                weight="tertiary"
                delay={0.72}
                immediate
                className="col-span-12 md:col-span-7"
              >
                <div>
                  {/* The rule draws itself in before the copy resolves under
                      it — the same "made, not placed" idea the rest of the
                      site uses for hairlines. */}
                  <Reveal variant="draw" delay={0.62} immediate>
                    <span aria-hidden="true" className="block h-px w-full bg-line-strong" />
                  </Reveal>
                  <p className="text-halo-paper max-w-[42ch] pt-5 text-sm leading-relaxed text-fg-muted">
                    {SOCIETY_BRAND.tagline}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* -- inset frame -- */}
          {/* Sits in the SAME grid row from lg up, starting one column left of
              where the wordmark ends, so it reads as overlapping the type
              rather than sitting beside it. Below lg it drops to its own row
              at a modest width — the overlap needs horizontal room to be
              elegant rather than cramped. */}
          <div className="col-span-8 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:justify-self-end">
            <Parallax strength="subtle">
              <Reveal variant="snap" weight="primary" delay={0.45} immediate>
                <div className="group relative aspect-[4/5] w-full overflow-hidden border border-line-strong shadow-[0_28px_70px_-18px_rgb(0_0_0/0.25)]">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 66vw, (max-width: 1024px) 50vw, 32vw"
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
      </div>

      {/* ---------- foot rail: categories + scroll cue ---------- */}
      <Reveal
        variant="fade"
        weight="tertiary"
        delay={1.05}
        immediate
        className="hero-bleed relative z-30"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line-strong pt-5">
          {/* Real category names, not invented stats. A reference hero's
              fact-strip has no honest equivalent here — "10+ years" is not
              something this project is allowed to claim (B4). */}
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {SOCIETY_CATEGORIES.slice(0, 3).map((category) => (
              <span key={category.index} className="eyebrow text-halo-paper text-fg-muted">
                {category.title}
              </span>
            ))}
          </div>

          <span className="eyebrow text-halo-paper hidden items-center gap-2 text-fg-muted sm:flex">
            Scroll
            <span
              aria-hidden="true"
              className="inline-block h-3 w-px bg-fg-faint [animation:zs-scroll-cue_2.8s_var(--ease-in-out)_infinite]"
            />
          </span>
        </div>
      </Reveal>
    </section>
  );
}

export default SocietyHero;

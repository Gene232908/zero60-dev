import Image from 'next/image';
import { KineticHeading, Reveal } from '@/components/motion';
import { BRAND, CONTACT } from '@/content/site';
import { SCENES } from '@/content/media';

/**
 * AboutHero — the page opening.
 *
 * REBUILT. The previous version was a flat black section with static white
 * type: the same visual weight as a body paragraph, on a page whose entire job
 * is introducing the brand's real name. It read as a placeholder rather than an
 * opening.
 *
 * Two things now carry the section:
 *
 *   the plate      a full-bleed stage photo behind the type (see .about-scrim
 *                  in globals.css) — presence and depth instead of flat black.
 *                  Left-weighted and beam-free on purpose: NOT a copy of the
 *                  hero's centred, beamed composition. This page should not
 *                  look like the hero playing twice.
 *   the ignite      the signature title runs the same edge-first neon build
 *                  every other non-home hero uses — see .neon-ignite in
 *                  globals.css.
 *
 * SHOWTIME — signature system (see globals.css). Brought into line with every
 * other non-home hero: the brand name (ZERO SIXTY THREE) moved to the eyebrow
 * row, where the client's own name belongs as a label rather than the thing
 * that ignites, and the headline is now this page's own showtime title —
 * "This is where it begins", the same pattern as Services' "Showtime starts
 * here" or Portfolio's "The story so far". The cue-dot arms on the eyebrow,
 * then the title runs the three-pass build (outline → fill → full neon,
 * holds) exactly like every other page, rather than About being a special
 * case with its own staggered per-word ignition.
 */

export function AboutHero() {
  const plate = SCENES.stageTruss;

  return (
    <section className="relative isolate flex min-h-[86svh] flex-col justify-center overflow-hidden border-b border-line pb-[var(--section-y)] pt-32 md:pt-44">
      {/* ---------- the plate ----------
          Strengthened after the first pass: at the original opacities the
          photo was barely readable as atmosphere and the section still looked
          close to flat black. The vignette is lighter here so more of the
          stage is actually visible, and a lime wash was added — the same
          soft-light trick .hero-duotone uses — so the plate itself starts to
          hint at the colour the title is about to ignite into. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={plate.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%] grayscale"
        />
        <div className="absolute inset-0 about-duotone" />
        <div className="absolute inset-0 about-scrim" />
        {/* Close the frame so the composition sits IN the section rather than
            running out of it, same device the hero uses at its own foot. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* `.shell` wraps the content from here down — the section itself has to
          stay unclipped (`overflow-hidden` on the OUTER element is what keeps
          the plate contained), but every earlier version of this content block
          had no horizontal gutter of its own, so the mega-scale heading ran
          flush against the viewport edge instead of sitting in from it like
          every other page's opening. */}
      <div className="shell">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="cue-dot" />
              <p className="eyebrow text-halo hero-label">02 — About</p>
            </span>
            <p className="eyebrow text-halo hero-label-accent hidden text-center sm:block">
              {BRAND.wordmark.join(' ')}
            </p>
            <p className="eyebrow text-halo hero-label">{CONTACT.region}</p>
          </div>
        </Reveal>

        <div className="pt-16 md:pt-24">
          <KineticHeading
            as="h1"
            lines={['This is where', 'it begins']}
            size="mega"
            delay={0.15}
            // Above the fold — same reasoning as every `immediate` Reveal in the
            // hero. On the scroll trigger the line would never animate on first
            // paint.
            immediate
            lineClassName="text-halo text-fg leading-[0.94]"
            lineClassNames={[undefined, 'neon-ignite']}
          />
        </div>

        <div className="grid grid-cols-12 pt-16 md:pt-24">
          <Reveal
            variant="settle"
            weight="secondary"
            delay={0.4}
            className="col-span-12 md:col-span-6 md:col-start-7"
          >
            {/* The rule is drawn rather than simply present, arriving a beat after
                the wordmark has landed — the page states its name, then underlines
                the claim. */}
            <Reveal variant="draw" delay={0.62}>
              <span aria-hidden="true" className="block h-px w-full bg-line-strong" />
            </Reveal>
            <p className="display text-halo pt-6 text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.15] text-fg">
              {BRAND.tagline}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;

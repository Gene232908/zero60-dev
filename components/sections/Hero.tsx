import Image from 'next/image';
import { KineticHeading, MagneticButton, Reveal } from '@/components/motion';
import { BRAND, CONTACT } from '@/content/site';
import { HERO_BG } from '@/content/media';
import { cn } from '@/lib/utils/cn';

/**
 * Hero — the opening visual composition (design brief §7, §8).
 *
 * CENTRED CINEMATIC REFACTOR (client direction). The previous version hung the
 * wordmark down the left and a two-frame image cluster on the right. That was
 * the maximalist pass, and it worked, but it split the viewer's attention in
 * two: the type competed with the photographs instead of being the thing you
 * looked at.
 *
 * The brief now is a single showcase — put the name in the middle of the frame,
 * make it the whole event, and let the room around it do the work. So:
 *
 *   · the image cluster is GONE. Not moved, removed. Removing it is what buys
 *     the wordmark the room to run at `mega` and be centred, and the background
 *     plate is already a photograph — the section was carrying three competing
 *     images at once.
 *   · the wordmark is dead centre, at `mega`, and it is INTERACTIVE: each word
 *     lifts and catches the accent under the pointer (see .kinetic-word). It is
 *     the centrepiece, so it is the thing that responds to you.
 *   · PRODUCTIONS is realigned — centred directly beneath, on a rule that opens
 *     out either side of it, so the two elements read as one locked-up mark
 *     rather than a heading with a caption under it.
 *   · everything else moves to the EDGES: meta rail top, spec + CTAs bottom,
 *     rotated rails in the side margins. The centre is left to the type.
 *
 * The intensity is lighting, not clutter — .hero-scrim is now a vignette that
 * closes the corners, .hero-spotlight puts a soft pool behind the type, and the
 * two beams are mirrored so they converge on the wordmark like a rig aimed at a
 * performer. Which is, literally, what this company does.
 *
 * This section runs FULL BLEED (`.hero-bleed`, not `.shell`). The 96rem measured
 * column is right for reading and wrong for the opening composition, which
 * should own the whole viewport.
 *
 * All of it collapses to a single readable column under `lg`, every moving part
 * is a Reveal (which renders its finished state under reduced motion), and the
 * hover is pointer-only so touch never gets a stuck state.
 */

/**
 * The spec plate. Every value here is confirmed material — region, phone and
 * website come from content/site.ts, and the two divisions are the same pair
 * DualBrandSplit renders further down the page. No invented statistics: a
 * fabricated "500+ events" would be the fastest way to make a real company look
 * like a template.
 */
const SPEC = [
  // Region and website are already stated in the top meta rail. Repeating them
  // here was the same mistake as the duplicated service rail: repetition reads
  // as an oversight, not as density. Only what is NOT already on screen.
  //
  // Two entries exactly: they bracket the scroll cue in the bottom rail, and a
  // third would unbalance a composition whose whole point is symmetry.
  { label: 'Divisions', value: '063 Productions / 063 Society' },
  { label: 'Direct', value: CONTACT.phoneDisplay },
] as const;

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-28 md:pt-36">
      {/* ---------- the plate ----------
          A photograph behind display type is the fastest way to make both
          illegible, so this is built as layers rather than one flat wash. See
          the HERO PLATE block in globals.css for what each one is doing.

          Recentred with the composition: the plate is now framed at 50% rather
          than 58% so the rig sits behind the wordmark, and the scrim is a
          vignette rather than a left-weighted wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={HERO_BG.src}
          alt=""
          fill
          priority
          // No explicit quality: Next 16 validates against images.qualities,
          // which this project leaves at the default [75]. An unlisted 82 warns
          // at runtime and is not honoured, so it bought nothing.
          sizes="100vw"
          className="scale-105 object-cover object-[50%_40%]"
        />
        {/* Tint the grayscale plate toward the confirmed brand colour. */}
        <div className="absolute inset-0 hero-duotone-shadows" />
        <div className="absolute inset-0 hero-duotone" />
        {/* Guarantee the contrast the type needs, without flattening the rig. */}
        <div className="absolute inset-0 hero-scrim" />
        {/* The pool of light the wordmark stands in — sits ABOVE the scrim so it
            reopens the centre the vignette just closed down. */}
        <div className="absolute inset-0 hero-spotlight" />
        {/* The beams the rig in the photo would be throwing, mirrored so the
            pair converges on the centred wordmark. */}
        <div className="hero-beams absolute inset-0 overflow-hidden mix-blend-screen" />
        {/* Close the frame so the composition sits IN the section rather than
            running out of it — the hero is full-bleed, not unbounded. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* ---------- top meta rail ---------- */}
      <Reveal variant="fade" weight="tertiary" delay={0.05} className="hero-bleed relative z-30"
            immediate>
        <div className="flex items-start justify-between gap-6 border-b border-line-strong pb-4">
          {/* .eyebrow is --fg-faint (32% white). That is correct on a flat black
              ground and invisible over a photograph, so every small label in the
              hero is lifted to --fg-muted and carries the halo. */}
          <p className="eyebrow text-halo hero-label max-w-[16ch]">{CONTACT.region}</p>
          <p className="eyebrow text-halo hero-label-accent hidden text-center sm:block">{BRAND.suffix}</p>
          <p className="eyebrow text-halo hero-label text-right">{CONTACT.website}</p>
        </div>
      </Reveal>

      {/* ---------- main centred composition ---------- */}
      {/* One column, centred, nothing beside it. The image cluster that used to
          sit on the right is gone — see the header note. */}
      <div className="hero-bleed relative flex flex-1 flex-col items-center justify-center py-10 text-center">
        {/* --- the lockup: 063 · wordmark · PRODUCTIONS --- */}
        <div className="relative z-20 flex w-full flex-col items-center">
          {/* Small accent numeral above the mark. It gives the eye somewhere to
              land before the type opens up, and ties the wordmark back to the
              063 shorthand used everywhere else on the site. */}
          <Reveal variant="fade" weight="tertiary" delay={0.15} immediate>
            {/* Just the numeral. It first read "063 · Est. United Arab Emirates",
                which put the region on screen twice within two lines — the meta
                rail directly above already states it. Repetition that close
                together reads as a mistake, not as density. */}
            <p className="eyebrow text-halo hero-label-accent mb-4 md:mb-6">{BRAND.short}</p>
          </Reveal>

          <KineticHeading
            as="h1"
            lines={BRAND.wordmark}
            // `mega` is affordable again now the cluster is gone. The earlier
            // note against it still stands — three lines at this scale is a lot
            // of letterform — which is why the leading is opened up below and
            // the frame around it is kept deliberately empty. A wall of type
            // with nothing beside it is a monument; the same wall crowded up
            // against photographs is just noise.
            size="mega"
            delay={0.28}
            interactive
            // Graduated line sizes + a scale-push entrance, instead of the house
            // masked word slide. Hero only: the wordmark is the one thing on the
            // page that should stop you, and it cannot do that wearing the same
            // entrance as every section heading below it.
            cinematic="push"
            // Above the fold — same reason every Reveal in this section passes
            // it. On the scroll trigger the lines never animate on first paint.
            immediate
            className="relative z-20 w-full"
            // Centred, and every line takes the same treatment — the old layout
            // stepped the last line right and gave only that one the accent, to
            // push the block across the frame. A centred lockup wants symmetry,
            // so the accent moves to the hover state instead: the type is white
            // at rest and lights up lime under the pointer, line by line.
            //
            // `hero-sweep` runs the follow-spot band across the letterforms once,
            // timed to land just after the entrance settles.
            //
            // Leading is 0.9 rather than 0.86: the three lines are now different
            // sizes, and em-based leading on the SMALL line resolves to fewer
            // pixels than on the large one, so a value tuned for uniform type
            // closed the top of the stack up too tightly.
            lineClassName="text-halo block text-fg leading-[0.9]"
            // Per line, indexed — NOT a `[&:nth-child(3)]:` variant. That syntax
            // composes Tailwind utilities and does nothing for a hand-written
            // class, which is exactly how the first attempt failed: the line
            // rendered with the class string present but no rule behind it.
            //
            // ZERO and SIXTY take the follow-spot sweep. THREE takes the neon
            // activation sequence instead and must NOT take the sweep — the
            // sweep paints through background-clip with `color: transparent`,
            // which would swallow the neon's fill entirely.
            lineClassNames={['hero-sweep', 'hero-sweep', 'neon-activate']}
          />

          {/* --- PRODUCTIONS, realigned --- */}
          {/* Centred under the mark on a rule that opens out either side, so the
              two lock together instead of reading as heading-plus-caption. The
              rules are flex-1 and the word is shrink-0, which keeps the word
              optically centred at every width without a fixed measurement. */}
          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.58}
            className="mt-5 w-full max-w-[46rem] md:mt-7"
            immediate
          >
            <div className="flex items-center gap-4 md:gap-6">
              <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-line-strong" />
              {/* `hero-haze` sits it back into the plate — see globals.css. The
                  wordmark above is the subject; this is atmosphere behind it. */}
              <p className="display hero-haze shrink-0 text-[clamp(0.8rem,1.9vw,1.5rem)] tracking-[0.42em]">
                {BRAND.suffix}
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-line-strong" />
            </div>
          </Reveal>

          {/* Tagline, centred and measured. Sits inside the lockup rather than
              down in the bottom rail, where it used to compete with the CTAs. */}
          <Reveal variant="settle" weight="secondary" delay={0.68} className="mt-7 md:mt-9" immediate>
            <p className="text-halo mx-auto max-w-[52ch] text-balance text-sm leading-relaxed text-fg-muted">
              {BRAND.tagline}
            </p>
          </Reveal>

          {/* CTAs, centred under the lockup — the natural next step once the
              name has landed. */}
          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.78}
            stagger="tight"
            className="mt-9 flex flex-wrap items-center justify-center gap-4 md:mt-11"
            immediate
          >
            <MagneticButton href="/contact" cursorLabel="Enquire">
              Get in touch
            </MagneticButton>
            <MagneticButton href="/portfolio" cursorLabel="View" className="border-line">
              View portfolio
            </MagneticButton>
          </Reveal>
        </div>

        {/* --- z-30 · edge furniture --- */}
        {/* Mirrored rails in BOTH margins now. With a centred composition a rail
            on one side only would tilt the frame; the pair brackets it. Desktop
            only — at narrow widths there is no margin to hang them in. */}
        <p
          aria-hidden="true"
          className="eyebrow text-halo hero-label-muted pointer-events-none absolute left-0 top-1/2 z-30 hidden origin-left -translate-y-1/2 -rotate-90 whitespace-nowrap xl:block"
        >
          {BRAND.full}
        </p>
        <p
          aria-hidden="true"
          className="eyebrow text-halo hero-label-muted pointer-events-none absolute right-0 top-1/2 z-30 hidden origin-right -translate-y-1/2 rotate-90 whitespace-nowrap xl:block"
        >
          Audio &#183; Visual &#183; Performance
        </p>

      </div>

      {/* NOTE: a separate "spec line" block used to sit here, rendering the same
          SPEC array as its own two-column plate. The bottom rail below now folds
          those two pairs in around the scroll cue, so keeping both printed
          Divisions/Direct on screen twice. One rail, one copy. */}

      {/* ---------- bottom rail ---------- */}
      {/* The tagline and the CTAs used to live here; both moved up into the
          centred lockup, where they belong to the mark rather than trailing off
          the bottom of the frame. What is left is the quiet supporting rail:
          confirmed spec either side, scroll cue centred between them. */}
      <div className="hero-bleed relative z-30 pt-6">
        <Reveal
          variant="settle"
          weight="tertiary"
          delay={0.88}
          stagger="tight"
          className="flex flex-col items-center gap-4 border-t border-line pt-5 md:flex-row md:justify-between"
          immediate
        >
          {SPEC.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                'group flex items-baseline gap-3',
                // The cue sits between the two on desktop, so the second pair
                // has to be pushed to the far edge.
                i === 1 && 'md:order-3',
              )}
            >
              <span className="eyebrow text-halo hero-label-muted shrink-0 transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                {row.label}
              </span>
              <span className="text-halo text-[0.78rem] leading-snug text-fg transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                {row.value}
              </span>
            </div>
          ))}

          {/* The cue drifts down on the house curve — the one moving thing in
              an otherwise settled rail, stilled by the reduced-motion rule. */}
          <p className="eyebrow text-halo hero-label-muted hidden items-center gap-2 md:order-2 lg:flex">
            Scroll
            <span
              aria-hidden="true"
              className="inline-block animate-[zs-scroll-cue_var(--dur-cinematic)_var(--ease-signature)_infinite]"
            >
              &#8595;
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;

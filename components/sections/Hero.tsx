import Image from 'next/image';
import { KineticHeading, MagneticButton, Parallax, Reveal, StickerSpin } from '@/components/motion';
import { BRAND, CONTACT } from '@/content/site';
import { HERO, HERO_BG } from '@/content/media';

/**
 * Hero — the opening visual composition (design brief §7, §8).
 *
 * MAXIMALIST REFACTOR. The previous version was a restrained two-column layout:
 * one wordmark, one image, air in the upper right. Correct, and quiet — which is
 * the opposite of what the client asked for. plan.md §0 records his direction
 * verbatim: the site is maximalist, more-is-more, "bold type, layered
 * compositions, heavy but purposeful motion".
 *
 * So the composition is stacked rather than divided. Reading back to front:
 *
 *   z-10  image cluster — two frames at different sizes, offsets and drift rates
 *   z-20  the wordmark, deliberately OVERLAPPING the cluster
 *   z-30  edge furniture: rotated margin rail and the rotating seal
 *
 * The overlap is the point: layers that intersect read as a composition, layers
 * that sit side by side read as a grid. Depth comes from parallax separation
 * between those layers, not from sheer count.
 *
 * Two things were tried and removed, both for the same reason — they competed
 * rather than contributed. A full-bleed outlined "063" sat directly behind the
 * wordmark, and two mega type layers in one optical centre made each other
 * harder to read. And the wordmark itself ran at `mega`: three lines at 16vw is
 * ~40svh of solid letterform, which is a wall, not a focal point. Maximalism is
 * a contrast of scale — one confident large element with dense small detail
 * around it — not everything shouting at once.
 *
 * This section runs FULL BLEED (`.hero-bleed`, not `.shell`). The 96rem measured
 * column is right for reading and wrong for the opening composition, which
 * should own the whole viewport.
 *
 * All of it collapses to a single readable column under `lg`, and every moving
 * part is a Reveal or Parallax, both of which render their finished state under
 * reduced motion.
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
  { label: 'Divisions', value: '063 Productions / 063 Society' },
  { label: 'Direct', value: CONTACT.phoneDisplay },
] as const;

export function Hero() {
  const portrait = HERO.main;
  const secondary = HERO.detail;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-28 md:pt-36">
      {/* ---------- the plate ----------
          A photograph behind display type is the fastest way to make both
          illegible, so this is built as layers rather than one flat wash. See
          the HERO PLATE block in globals.css for what each one is doing and
          why the scrim is anisotropic instead of uniform. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={HERO_BG.src}
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[58%_38%]"
        />
        {/* Tint the grayscale plate toward the confirmed brand colour. */}
        <div className="absolute inset-0 hero-duotone-shadows" />
        <div className="absolute inset-0 hero-duotone" />
        {/* Guarantee the contrast the type needs, without flattening the rig. */}
        <div className="absolute inset-0 hero-scrim" />
        {/* The beams the lighting rig in the photo would actually be throwing. */}
        <div className="hero-beams absolute inset-0 overflow-hidden mix-blend-screen" />
        {/* Close the frame so the composition sits IN the section rather than
            running out of it — the hero is full-bleed, not unbounded. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* NOTE: there was a full-bleed outlined "063" behind this composition.
          It came out. Two mega type layers occupying the same optical centre
          meant the wordmark and the ghost each made the other harder to read —
          the wordmark IS the bold type statement here, and it does not need a
          second one arguing with it. Density belongs where there is room for
          it: the image cluster and the margins, not underneath the headline. */}

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

      {/* ---------- main stacked composition ---------- */}
      <div className="hero-bleed relative grid flex-1 grid-cols-12 items-center gap-y-10 py-10">
        {/* --- z-10 · image cluster --- */}
        {/* Two frames instead of one, overlapping, at different drift rates. The
            offset between them is what creates depth; an evenly spaced pair
            would just read as two pictures. */}
        <div className="col-span-12 sm:col-span-8 sm:col-start-5 lg:absolute lg:right-0 lg:top-1/2 lg:z-10 lg:w-[38%] lg:-translate-y-1/2">
          <div className="relative">
            <Parallax strength="subtle">
              <Reveal variant="mask" weight="primary" delay={0.15}
            immediate>
                <div className="group relative aspect-[4/5] w-full overflow-hidden border border-line-strong shadow-[0_28px_70px_-18px_rgb(0_0_0/0.9)]">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 38vw"
                    className="photo-mono object-cover group-hover:scale-[1.03]"
                  />
                  {/* A hairline of the accent along the top edge, so the frame
                      is tied to the brand rather than just pasted on. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/70"
                  />
                </div>
              </Reveal>
            </Parallax>

            {/* Secondary frame, hung off the lower-left corner and drifting
                against the portrait so the pair separates as you scroll. */}
            <div className="absolute -bottom-10 -left-10 w-[46%] max-w-[190px] lg:-left-16">
              <Parallax strength="medium" invert>
                <Reveal variant="settle" weight="secondary" delay={0.42}
            immediate>
                  <div className="group relative aspect-[5/4] w-full overflow-hidden border border-line-strong shadow-[0_20px_50px_-14px_rgb(0_0_0/0.95)]">
                    <Image
                      src={secondary.src}
                      alt={secondary.alt}
                      fill
                      sizes="(max-width: 1024px) 45vw, 16vw"
                      className="photo-mono object-cover group-hover:scale-[1.04]"
                    />
                  </div>
                </Reveal>
              </Parallax>
            </div>
          </div>
        </div>

        {/* --- z-20 · wordmark, over the cluster --- */}
        <div className="relative z-20 col-span-12 lg:col-span-9">
          <KineticHeading
            as="h1"
            lines={BRAND.wordmark}
            // `xl`, not `mega`. Three lines at 16vw with 0.82 leading is close
            // to 40svh of solid letterform — at that size the wordmark stops
            // being a focal point and becomes a wall, and the eye has nowhere
            // to rest. Maximalism is a contrast of scale: ONE confident large
            // element with dense small detail around it. Everything shouting at
            // once is not maximalism, it is noise.
            size="xl"
            delay={0.25}
            className="relative z-20 -ml-[0.06em]"
            // The third line still steps right and takes the accent so the block
            // moves across the composition — but 4vw, not 8vw. The wider push
            // dragged the wordmark edge to edge and left it nowhere to breathe.
            lineClassName="text-halo text-fg [&:last-child]:text-halo-accent [&:last-child]:text-accent [&:last-child]:pl-[4vw]"
          />
          <Reveal variant="settle" weight="tertiary" delay={0.5}
            immediate>
            <p className="display text-halo mt-2 text-[clamp(0.9rem,2.2vw,1.9rem)] tracking-[0.34em] text-fg">
              {BRAND.suffix}
            </p>
          </Reveal>
        </div>

        {/* --- z-30 · edge furniture --- */}
        {/* Rotated rail down the left margin. Desktop only: at narrow widths
            there is no margin to hang it in. */}
        <p
          aria-hidden="true"
          className="eyebrow text-halo pointer-events-none absolute left-0 top-1/2 z-30 hidden origin-left -translate-y-1/2 -rotate-90 whitespace-nowrap hero-label-muted xl:block"
        >
          {BRAND.full} &#183; Est. {BRAND.short}
        </p>

        {/* Rotating seal, tucked into the negative space. */}
        <div className="pointer-events-none absolute bottom-0 right-[42%] z-30 hidden lg:block">
          <StickerSpin text="ZERO-SIXTY-THREE &#183; PRODUCTIONS &#183; " size={124} />
        </div>
      </div>

      {/* ---------- spec line ---------- */}
      {/* Deliberately NOT a service rail: ServiceTicker renders immediately
          below off the same SERVICE_RAIL array, and stating it twice would read
          as a bug rather than as density.

          Started as a four-column plate with accent numerals and was cut back to
          two quiet pairs. At this size the numerals were decoration on two rows
          of text, and half the content repeated the meta rail at the top of the
          section. Both values are confirmed material: the divisions are the pair
          DualBrandSplit renders further down, the number is from
          content/site.ts. Nothing invented. */}
      <Reveal
        variant="settle"
        weight="tertiary"
        delay={0.62}
        stagger="tight"
        className="hero-bleed relative z-30 grid grid-cols-1 border-t border-line sm:grid-cols-2"
            immediate
      >
        {SPEC.map((row) => (
          <div
            key={row.label}
            // One rule between the two cells rather than a boxed grid — at two
            // columns a full set of borders reads as a table, which is heavier
            // than the information warrants.
            className="group flex items-baseline gap-3 py-3 sm:[&:first-child]:pr-6 sm:[&:last-child]:border-l sm:[&:last-child]:border-line sm:[&:last-child]:pl-6"
          >
            <span className="eyebrow text-halo hero-label-muted shrink-0 transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
              {row.label}
            </span>
            <span className="text-halo text-[0.78rem] leading-snug text-fg transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
              {row.value}
            </span>
          </div>
        ))}
      </Reveal>

      {/* ---------- bottom rail ---------- */}
      <div className="hero-bleed relative z-30 pt-6">
        <div className="flex flex-col gap-8 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant="settle" weight="secondary" delay={0.55} className="max-w-[42ch]"
            immediate>
            <p className="text-halo text-sm leading-relaxed text-fg-muted">{BRAND.tagline}</p>
          </Reveal>

          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.7}
            stagger="tight"
            className="flex flex-wrap items-center gap-4"
            immediate
          >
            <MagneticButton href="/contact" cursorLabel="Enquire">
              Get in touch
            </MagneticButton>
            <MagneticButton href="/portfolio" cursorLabel="View" className="border-line">
              View portfolio
            </MagneticButton>
          </Reveal>

          <Reveal variant="fade" weight="tertiary" delay={0.8}
            immediate>
            {/* The cue drifts down on the house curve — the one moving thing in
                an otherwise settled rail, stilled by the reduced-motion rule. */}
            <p className="eyebrow text-halo hero-label-muted hidden items-center gap-2 lg:flex">
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
      </div>
    </section>
  );
}

export default Hero;

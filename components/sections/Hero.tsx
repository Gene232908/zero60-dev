import Image from 'next/image';
import { KineticHeading, MagneticButton, Parallax, Reveal, StickerSpin } from '@/components/motion';
import { BRAND, CONTACT } from '@/content/site';
import { TILES, SCENES } from '@/content/media';

/**
 * Hero — the opening visual composition (design brief §7, §8).
 *
 * MAXIMALIST REFACTOR. The previous version was a restrained two-column layout:
 * one wordmark, one image, air in the upper right. Correct, and quiet — which is
 * the opposite of what the client asked for. plan.md §0 records his direction
 * verbatim: the site is maximalist, more-is-more, "bold type, layered
 * compositions, heavy but purposeful motion".
 *
 * So the composition is now stacked rather than divided. Reading back to front:
 *
 *   z-0   ghost "063" at mega scale, outlined, drifting slowest
 *   z-10  image cluster — two frames at different sizes, offsets and drift rates
 *   z-20  the wordmark, deliberately OVERLAPPING the cluster
 *   z-30  edge furniture: rotated rail, technical metadata, rotating seal
 *
 * The overlap is the whole point: layers that intersect read as a composition,
 * layers that sit side by side read as a grid. Every element was already in the
 * old hero except the second frame and the ghost — this is denser, not busier,
 * and nothing new is being said.
 *
 * Purposeful, not noisy — each layer drifts at its own rate, so depth comes from
 * parallax separation rather than from adding more things. All of it collapses
 * to a single readable column under `lg`, and every moving part is a Reveal or
 * Parallax, both of which render their finished state under reduced motion.
 */

/**
 * The spec plate. Every value here is confirmed material — region, phone and
 * website come from content/site.ts, and the two divisions are the same pair
 * DualBrandSplit renders further down the page. No invented statistics: a
 * fabricated "500+ events" would be the fastest way to make a real company look
 * like a template.
 */
const SPEC = [
  { label: 'Location', value: CONTACT.region },
  { label: 'Divisions', value: '063 Productions / 063 Society' },
  { label: 'Direct', value: CONTACT.phoneDisplay },
  { label: 'Online', value: CONTACT.website },
] as const;

export function Hero() {
  const portrait = TILES.cameraOp;
  const secondary = SCENES.drums;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-28 md:pt-36">
      {/* ---------- z-0 · ghost layer ---------- */}
      {/* Outlined 063 at absurd scale, drifting slower than everything in front
          of it. Purely textural, hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 select-none"
      >
        <Parallax strength="subtle">
          <p className="display display-ghost text-center text-[clamp(12rem,42vw,44rem)] leading-[0.8] opacity-70">
            {BRAND.short}
          </p>
        </Parallax>
      </div>

      {/* ---------- top meta rail ---------- */}
      <Reveal variant="fade" weight="tertiary" delay={0.05} className="shell relative z-30">
        <div className="flex items-start justify-between gap-6 border-b border-line pb-4">
          <p className="eyebrow max-w-[16ch]">{CONTACT.region}</p>
          <p className="eyebrow hidden text-center sm:block">{BRAND.suffix}</p>
          <p className="eyebrow text-right">{CONTACT.website}</p>
        </div>
      </Reveal>

      {/* ---------- main stacked composition ---------- */}
      <div className="shell relative grid flex-1 grid-cols-12 items-center gap-y-10 py-10">
        {/* --- z-10 · image cluster --- */}
        {/* Two frames instead of one, overlapping, at different drift rates. The
            offset between them is what creates depth; an evenly spaced pair
            would just read as two pictures. */}
        <div className="col-span-12 sm:col-span-8 sm:col-start-5 lg:absolute lg:right-0 lg:top-1/2 lg:z-10 lg:w-[38%] lg:-translate-y-1/2">
          <div className="relative">
            <Parallax strength="subtle">
              <Reveal variant="mask" weight="primary" delay={0.15}>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 38vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </Parallax>

            {/* Secondary frame, hung off the lower-left corner and drifting
                against the portrait so the pair separates as you scroll. */}
            <div className="absolute -bottom-10 -left-10 w-[46%] max-w-[190px] lg:-left-16">
              <Parallax strength="medium" invert>
                <Reveal variant="settle" weight="secondary" delay={0.42}>
                  <div className="relative aspect-[5/4] w-full overflow-hidden border border-line">
                    <Image
                      src={secondary.src}
                      alt={secondary.alt}
                      fill
                      sizes="(max-width: 1024px) 45vw, 16vw"
                      className="object-cover"
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
            size="mega"
            delay={0.25}
            className="relative z-20 -ml-[0.06em]"
            // The third line pushes right and takes the accent, so the block
            // steps across the image rather than sitting squarely beside it.
            lineClassName="text-fg [&:last-child]:text-accent [&:last-child]:pl-[8vw]"
          />
          <Reveal variant="settle" weight="tertiary" delay={0.5}>
            <p className="display mt-2 text-[clamp(0.9rem,2.2vw,1.9rem)] tracking-[0.34em] text-fg-muted">
              {BRAND.suffix}
            </p>
          </Reveal>
        </div>

        {/* --- z-30 · edge furniture --- */}
        {/* Rotated rail down the left margin. Desktop only: at narrow widths
            there is no margin to hang it in. */}
        <p
          aria-hidden="true"
          className="eyebrow pointer-events-none absolute left-0 top-1/2 z-30 hidden origin-left -translate-y-1/2 -rotate-90 whitespace-nowrap text-fg-faint xl:block"
        >
          {BRAND.full} &#183; Est. {BRAND.short}
        </p>

        {/* Rotating seal, tucked into the negative space. */}
        <div className="pointer-events-none absolute bottom-0 right-[42%] z-30 hidden lg:block">
          <StickerSpin text="ZERO-SIXTY-THREE &#183; PRODUCTIONS &#183; " size={124} />
        </div>
      </div>

      {/* ---------- spec block ---------- */}
      {/* Deliberately NOT a service rail: ServiceTicker renders immediately
          below off the same SERVICE_RAIL array, and stating it twice would read
          as a bug rather than as density.

          This is the other kind of maximalism — a dense technical index, the
          plate on the back of a piece of equipment. Four columns, hairline
          divided, numerals in accent. Every value is confirmed: region and
          contact from content/site.ts, the two divisions from the dual-brand
          structure the next sections build on. Nothing invented. */}
      <Reveal
        variant="settle"
        weight="tertiary"
        delay={0.62}
        stagger="tight"
        className="shell relative z-30 grid grid-cols-2 border-y border-line md:grid-cols-4"
      >
        {SPEC.map((row, i) => (
          <div
            key={row.label}
            // Every cell carries its own right rule, including the last, so the
            // plate closes at the shell edge instead of trailing off. Simpler
            // than nth-child juggling across two column counts, and it survives
            // the 2-col to 4-col switch without competing variants.
            className="group flex flex-col gap-1.5 border-r border-line px-3 py-4 first:pl-0"
          >
            <span className="flex items-baseline gap-2">
              <span className="eyebrow text-accent transition-transform duration-[var(--dur-fast)] ease-[var(--ease-signature)] group-hover:-translate-y-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow text-fg-faint">{row.label}</span>
            </span>
            <span className="text-[0.78rem] leading-snug text-fg-muted transition-colors duration-[var(--dur-fast)] group-hover:text-fg">
              {row.value}
            </span>
          </div>
        ))}
      </Reveal>

      {/* ---------- bottom rail ---------- */}
      <div className="shell relative z-30 pt-6">
        <div className="flex flex-col gap-8 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant="settle" weight="secondary" delay={0.55} className="max-w-[42ch]">
            <p className="text-sm leading-relaxed text-fg-muted">{BRAND.tagline}</p>
          </Reveal>

          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.7}
            stagger="tight"
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/contact" cursorLabel="Enquire">
              Get in touch
            </MagneticButton>
            <MagneticButton href="/portfolio" cursorLabel="View" className="border-line">
              View portfolio
            </MagneticButton>
          </Reveal>

          <Reveal variant="fade" weight="tertiary" delay={0.8}>
            {/* The cue drifts down on the house curve — the one moving thing in
                an otherwise settled rail, stilled by the reduced-motion rule. */}
            <p className="eyebrow hidden items-center gap-2 lg:flex">
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

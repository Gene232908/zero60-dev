import Image from 'next/image';
import Link from 'next/link';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { BrandProvider } from '@/components/layout/BrandProvider';
import { BRAND } from '@/content/site';
import { SCENES } from '@/content/media';
import { SOCIETY_PLACEHOLDER } from '@/content/placeholders';
import { SOCIETY as SOCIETY_MEDIA } from '@/content/media';
import { cn } from '@/lib/utils/cn';

/**
 * DualBrandSplit — the signature section of the landing page.
 *
 * This is where "two moods under one roof" stops being a claim and becomes
 * visible: the two halves render the SAME markup, and the only difference is the
 * data-brand attribute each one sits under (docs/plan.md §2.2).
 *
 *   left  → data-brand="productions"              heavy grotesque, grain, loud lime
 *   right → data-brand="society" data-surface="dark"  high-contrast serif, air, hairline lime
 *
 * The Society half runs on the DARK stage here rather than on its usual paper
 * ground — client direction, reasoned about at the BrandProvider below. The
 * demonstration still holds, and arguably holds better: identical markup, one
 * attribute apart, and the two halves still read as two different houses on
 * type, rhythm and motion rather than on background colour alone.
 *
 * Aligned, but distinct — proving the token system works before Milestone 2
 * builds the full 063 Society page on top of it.
 *
 * Note the content asymmetry: the Productions copy is the client's own, from the
 * live site. Nothing about 063 Society exists in the supplied material, so that
 * half is honestly labelled placeholder (BLOCKER B4).
 */

type Panel = {
  name: string;
  mood: string;
  blurb: string;
  href: string;
  image: { src: string; alt: string };
  /**
   * Same "visible, not reachable" treatment as the 063 Society nav item — see
   * the disabled doc on NavItem in content/nav.ts. Client direction: the
   * Society panel stays on screen (photo, name, blurb) but is not a link.
   */
  disabled?: boolean;
};

const PRODUCTIONS: Panel = {
  name: '063 Productions',
  mood: 'Rugged',
  blurb: BRAND.intro,
  href: '/services',
  image: SCENES.soundEngineer,
};

const SOCIETY: Panel = {
  name: SOCIETY_PLACEHOLDER.name,
  mood: SOCIETY_PLACEHOLDER.mood,
  blurb: SOCIETY_PLACEHOLDER.blurb,
  href: '/society',
  // Was SOCIETY_MEDIA.main — the wedding table setting. Client direction: that
  // frame did not belong on this page. It is lit warm and bright, and its
  // subject is pink roses, gold vases and candlelight on white linen, so
  // dropping it into a black landing page put the single lightest, most
  // saturated object on the site directly beside the black Productions panel.
  // It read as a different website showing through a window.
  //
  // `tall` is the cinematic one of the three supplied Society frames: a single
  // hard side light, deep falloff, most of the frame in shadow, and — the part
  // that matters for the layout — its dark mass sits at the TOP, which is
  // where the eyebrow row lands. Same client photography, same elegant
  // subject, graded like the rest of the page instead of against it.
  image: SOCIETY_MEDIA.tall,
  disabled: true,
};

function BrandPanel({ panel, index }: { panel: Panel; index: string }) {
  const className = cn(
    // `isolate` is load-bearing. BrandProvider paints a solid bg-bg, and this
    // Link was only `relative` — which does NOT create a stacking context on
    // its own — so the -z-10 image layer below rendered BEHIND that
    // background and was invisible. The panels have never actually shown
    // their photograph. isolate scopes the negative z-index to this Link.
    'group relative isolate flex min-h-[70svh] flex-col justify-between overflow-hidden p-[var(--gutter)] lg:min-h-[92svh]',
    !panel.disabled && [
      'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
      'hover:translate-y-[var(--hover-lift)]',
      'active:scale-[var(--press-scale)] active:ease-[var(--ease-press)]',
      'focus-visible:outline-none',
    ],
  );

  const content = (
    <>
      {/* Keyboard focus gets the panel's own accent frame — a blanket outline
          on a full-bleed panel reads as a browser artefact, not as design. */}
      {!panel.disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-20 border border-accent opacity-0 transition-opacity duration-[var(--dur-micro)] group-focus-visible:opacity-100"
        />
      )}
      {/* Image sits behind the type and drifts on scroll.
          NO HOVER TREATMENT — client direction. The opacity used to lift
          60 → 80 under the pointer and .photo-mono desaturated back to full
          colour alongside it, so the panel brightened twice at once and the
          type sitting on it lost contrast at exactly the moment someone was
          reading it. Both are gone: one held grade, hovered or not. */}
      <div className="absolute inset-0 -z-10 opacity-90">
        <Parallax strength="subtle" className="h-full">
          <Image
            src={panel.image.src}
            alt={panel.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="photo-still object-cover"
          />
        </Parallax>
      </div>

      {/* Shapes the darkness toward the top and bottom edges, where the words
          are. Outside the Parallax on purpose — a scrim that drifts with the
          photograph stops covering the thing it was put there to cover. */}
      <div aria-hidden="true" className="panel-scrim pointer-events-none absolute inset-0 -z-10" />

      <div className="flex items-start justify-between">
        <span className="eyebrow text-halo panel-label">{index}</span>
        <span className="eyebrow text-halo panel-label-accent">{panel.mood}</span>
      </div>

      <div className="pt-24">
        <KineticHeading
          lines={[panel.name]}
          size="md"
          className="mb-6"
          lineClassName="text-halo"
        />
        <p className="text-halo max-w-[42ch] text-sm leading-relaxed text-fg-muted">{panel.blurb}</p>

        {/* The arrow nudge is the most-copied hover on the web. Here the rule
            draws out from under the label and the arrow rides its full length —
            one connected gesture instead of a 6px twitch, and it travels on the
            panel's own brand curve. Dropped entirely on the disabled panel —
            an "Enter" affordance on something that doesn't go anywhere is
            worse than no affordance at all. */}
        {!panel.disabled && (
          <span className="relative mt-8 inline-flex items-center gap-3 overflow-hidden pr-10 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-fg">
            Enter
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-brand)] group-focus-visible:scale-x-100 group-hover:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-[var(--dur-base)] ease-[var(--ease-brand)] group-focus-visible:translate-x-6 group-hover:translate-x-6"
            >
              &#8594;
            </span>
          </span>
        )}
      </div>
    </>
  );

  // Same "visible, not reachable" treatment as the nav — a plain div instead
  // of a Link when disabled, so the panel is neither a link nor focusable.
  if (panel.disabled) {
    return (
      <div aria-disabled="true" className={className}>
        {content}
      </div>
    );
  }

  return (
    <Link href={panel.href} data-cursor="Open" className={className}>
      {content}
    </Link>
  );
}

export function DualBrandSplit() {
  return (
    <section aria-label="The two houses" className="relative">
      <Reveal variant="fade" weight="tertiary" className="shell py-10">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="eyebrow">Two houses</p>
          <p className="eyebrow">One standard</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Same component, same markup — only the brand token map differs.
            Productions leads and Society follows a beat later: the loud house
            speaks first, which is the same order the copy reads in. */}
        <BrandProvider brand="productions" className="border-b border-line lg:border-b-0 lg:border-r">
          <Reveal variant="lead" weight="primary" className="h-full">
            <BrandPanel panel={PRODUCTIONS} index="01" />
          </Reveal>
        </BrandProvider>

        {/* `surface="dark"` — see the [data-brand="society"][data-surface="dark"]
            map in styles/tokens.css, which exists for exactly this case: an
            elegant section sitting inside a dark page.

            Society's default ground is --paper with near-black ink type, and
            that is right on /society, which is a light page. Here it was
            wrong twice over. It put a bright panel in the middle of a black
            landing page, and it made the client's own instruction impossible
            to carry out — "darken the picture so the text becomes visible"
            inverts on a light panel, where darkening the photograph is what
            makes dark type disappear.

            On the dark stage the same instruction resolves cleanly: paper type
            over a darkened photograph, contrast rising as the image goes down.
            The two houses stay plainly distinct — serif against grotesque,
            restrained motion against the snap, --motion-scale still 0.62 —
            they now differ in voice rather than in wattage. */}
        <BrandProvider brand="society" surface="dark">
          <Reveal variant="settle" weight="primary" delay={0.18} className="h-full">
            <BrandPanel panel={SOCIETY} index="02" />
          </Reveal>
        </BrandProvider>
      </div>
    </section>
  );
}

export default DualBrandSplit;

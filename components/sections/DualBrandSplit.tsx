import Image from 'next/image';
import Link from 'next/link';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { BrandProvider } from '@/components/layout/BrandProvider';
import { BRAND } from '@/content/site';
import { SCENES } from '@/content/media';
import { PLACEHOLDER_IMAGES, SOCIETY_PLACEHOLDER } from '@/content/placeholders';
import { cn } from '@/lib/utils/cn';

/**
 * DualBrandSplit — the signature section of the landing page.
 *
 * This is where "two moods under one roof" stops being a claim and becomes
 * visible: the two halves render the SAME markup, and the only difference is the
 * data-brand attribute each one sits under (docs/plan.md §2.2).
 *
 *   left  → data-brand="productions"  black ground, heavy grotesque, grain, loud lime
 *   right → data-brand="society"      paper ground, high-contrast serif, air, hairline lime
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
  image: PLACEHOLDER_IMAGES.society,
};

function BrandPanel({ panel, index }: { panel: Panel; index: string }) {
  return (
    <Link
      href={panel.href}
      data-cursor="Open"
      // Every motion value here resolves through the brand token map this panel
      // sits under, so the SAME markup moves rugged on the left and restrained
      // on the right. --ease-brand, --press-scale and --hover-lift each differ
      // per data-brand; nothing below is hardcoded to one mood.
      className={cn(
        'group relative flex min-h-[70svh] flex-col justify-between overflow-hidden p-[var(--gutter)] lg:min-h-[92svh]',
        'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
        'hover:translate-y-[var(--hover-lift)]',
        'active:scale-[var(--press-scale)] active:ease-[var(--ease-press)]',
        'focus-visible:outline-none',
      )}
    >
      {/* Keyboard focus gets the panel's own accent frame — a blanket outline
          on a full-bleed panel reads as a browser artefact, not as design. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 z-20 border border-accent opacity-0 transition-opacity duration-[var(--dur-micro)] group-focus-visible:opacity-100"
      />
      {/* Image sits behind the type and drifts on scroll. */}
      <div className="absolute inset-0 -z-10 opacity-30 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-brand)] group-hover:opacity-45">
        <Parallax strength="subtle" className="h-full">
          <Image
            src={panel.image.src}
            alt={panel.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Parallax>
      </div>

      <div className="flex items-start justify-between">
        <span className="eyebrow">{index}</span>
        <span className="eyebrow text-accent">{panel.mood}</span>
      </div>

      <div className="pt-24">
        <KineticHeading lines={[panel.name]} size="md" className="mb-6" />
        <p className="max-w-[42ch] text-sm leading-relaxed text-fg-muted">{panel.blurb}</p>

        {/* The arrow nudge is the most-copied hover on the web. Here the rule
            draws out from under the label and the arrow rides its full length —
            one connected gesture instead of a 6px twitch, and it travels on the
            panel's own brand curve. */}
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
      </div>
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

        <BrandProvider brand="society">
          <Reveal variant="settle" weight="primary" delay={0.18} className="h-full">
            <BrandPanel panel={SOCIETY} index="02" />
          </Reveal>
        </BrandProvider>
      </div>
    </section>
  );
}

export default DualBrandSplit;

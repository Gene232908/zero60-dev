import { KineticHeading, Reveal } from '@/components/motion';
import { BRAND, CONTACT } from '@/content/site';

/**
 * AboutHero — the page opening.
 *
 * Productions register: oversized grotesque, hard hairlines, the headline
 * running wider than its column. Sets "ABOUT" at mega scale with the real
 * positioning line beneath, so the page states the brand before it explains it.
 *
 * All copy here is the client's own, from the live site.
 */

export function AboutHero() {
  return (
    <section className="shell pb-[var(--section-y)] pt-32 md:pt-44">
      <Reveal variant="fade" weight="tertiary">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="eyebrow">02 — About</p>
          <p className="eyebrow">{CONTACT.region}</p>
        </div>
      </Reveal>

      <div className="pt-14 md:pt-20">
        <KineticHeading
          as="h1"
          lines={['About', BRAND.short]}
          size="mega"
          delay={0.15}
          lineClassName="text-fg [&:last-child]:text-accent"
        />
      </div>

      <div className="grid grid-cols-12 pt-14 md:pt-20">
        <Reveal
          variant="rise"
          weight="secondary"
          delay={0.4}
          className="col-span-12 md:col-span-6 md:col-start-7"
        >
          <p className="display border-t border-line pt-6 text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.15] text-fg">
            {BRAND.tagline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default AboutHero;

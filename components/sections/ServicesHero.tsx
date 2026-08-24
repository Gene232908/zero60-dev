import { KineticHeading, Marquee, Reveal } from '@/components/motion';
import { SERVICE_RAIL } from '@/content/site';

/**
 * ServicesHero — opening for the Services page.
 *
 * The ticker returns here as a header device rather than a section seam: it
 * states the full capability list once, at speed, before the bento breaks it
 * down properly underneath.
 */

export function ServicesHero() {
  return (
    <section className="pt-32 md:pt-44">
      <div className="shell">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <p className="eyebrow">03 — Services</p>
            <p className="eyebrow">Eight disciplines</p>
          </div>
        </Reveal>

        <div className="py-14 md:py-20">
          <KineticHeading
            as="h1"
            lines={['What', 'we do']}
            size="mega"
            delay={0.15}
            lineClassName="text-fg [&:last-child]:text-accent"
          />
        </div>
      </div>

      {/* The rail arrives after the wordmark has landed rather than with it, so
          the page reads its title before the capability list starts moving. */}
      <Reveal variant="settle" weight="secondary" delay={0.45}>
        <Marquee duration={44} className="border-y border-line py-4" pauseOnHover>
          {SERVICE_RAIL.map((item) => (
            <span key={item} className="group/item flex items-center">
              <span className="mx-7 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-fg-muted transition-colors duration-[var(--dur-fast)] group-hover/item:text-fg">
                {item}
              </span>
              <span
                className="text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-overshoot)] group-hover/item:rotate-90"
                aria-hidden="true"
              >
                &#9670;
              </span>
            </span>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}

export default ServicesHero;

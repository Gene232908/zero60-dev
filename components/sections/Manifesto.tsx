import { KineticHeading, Reveal } from '@/components/motion';
import { BRAND } from '@/content/site';

/**
 * Manifesto — the large editorial statement (design brief §3 "Section D", §4).
 *
 * Almost empty on purpose. After the density of the ticker this section gives
 * the eye a long pause, holds the client's own positioning line at mega scale,
 * and tucks the welcome paragraph into the lower-right rather than centring it.
 * The whitespace is the design, not an absence of one.
 *
 * The statement drifts horizontally as it passes through the viewport (§10), so
 * the type is doing something rather than sitting still.
 */

export function Manifesto() {
  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <p className="eyebrow mb-16 md:mb-24">What we do</p>
      </Reveal>

      <KineticHeading
        lines={['Complete', 'event', 'mastery']}
        size="xl"
        drift={40}
        className="mb-16 md:mb-24"
        lineClassName="text-fg [&:nth-child(2)]:pl-[8vw] [&:nth-child(3)]:pl-[18vw] [&:nth-child(3)]:text-accent"
      />

      <div className="grid grid-cols-12">
        <Reveal
          variant="rise"
          weight="secondary"
          className="col-span-12 md:col-span-5 md:col-start-8"
        >
          <p className="border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
            {BRAND.intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default Manifesto;

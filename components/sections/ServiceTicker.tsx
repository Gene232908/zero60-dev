import { Marquee, Reveal } from '@/components/motion';
import { SERVICE_RAIL } from '@/content/site';

/**
 * ServiceTicker — full-bleed branding seam (design brief §15).
 *
 * The live site lists its services as a static rail across the top of the hero.
 * Here that same list becomes a moving ticker: it states what the company does
 * at a glance and separates two very different compositions.
 *
 * Two tracks running in opposite directions at different speeds — the contrast
 * is what stops it reading as a generic scrolling banner.
 */

export function ServiceTicker() {
  return (
    <section aria-label="Services overview" className="border-y border-line py-8 md:py-10">
      {/* The two tracks used to switch on together, which read as one banner
          fading in. The loud track now arrives first and the fine one follows
          half a beat behind — the seam assembles rather than appears.

          Measured: track 1 lands ~0.7s and track 2 ~0.9s, which is a good
          sequence. What it lacked was WEIGHT — both simply faded up, so between
          the hero's slam and the manifesto's wipe this seam was the one flat
          moment on the page. `snap` gives the loud track an actual arrival, and
          the fine track is pushed to 0.34s so the gap between them is felt
          rather than merely present. */}
      <Reveal variant="snap" weight="secondary">
        <Marquee duration={38} pauseOnHover>
          {SERVICE_RAIL.map((item) => (
            <span key={`a-${item}`} className="group/item flex items-center">
              <span className="display mx-8 text-[clamp(1.75rem,4.5vw,3.5rem)] text-fg">{item}</span>
              {/* The diamond turns as the rail passes under the pointer — a
                  detail you only catch if you stop, which is the point. */}
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

      <Reveal variant="settle" weight="tertiary" delay={0.34}>
        <Marquee duration={52} direction="right" repeat={3} className="mt-3 opacity-45">
          {SERVICE_RAIL.map((item) => (
            <span key={`b-${item}`} className="flex items-center">
              <span className="mx-8 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-fg-muted">
                {item}
              </span>
              <span className="text-accent" aria-hidden="true">
                &#47;&#47;
              </span>
            </span>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}

export default ServiceTicker;

import { Marquee } from '@/components/motion';
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
      <Marquee duration={38} pauseOnHover>
        {SERVICE_RAIL.map((item) => (
          <span key={`a-${item}`} className="flex items-center">
            <span className="display mx-8 text-[clamp(1.75rem,4.5vw,3.5rem)] text-fg">{item}</span>
            <span className="text-accent" aria-hidden="true">
              &#9670;
            </span>
          </span>
        ))}
      </Marquee>

      <Marquee duration={52} direction="right" className="mt-3 opacity-45">
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
    </section>
  );
}

export default ServiceTicker;

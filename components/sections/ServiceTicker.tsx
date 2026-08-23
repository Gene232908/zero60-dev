import { Marquee } from '@/components/motion';
import { TICKER_PLACEHOLDER } from '@/content/placeholders';

/**
 * ServiceTicker — full-bleed branding seam (design brief §15).
 *
 * Sits between the hero and the manifesto as a transition device rather than
 * decoration: it states what the company does at a glance, and it visually
 * separates two very different compositions.
 *
 * Two tracks running in opposite directions at different speeds — the contrast
 * is what stops it reading as a generic scrolling banner.
 */

export function ServiceTicker() {
  return (
    <section aria-label="Services overview" className="border-y border-line py-8 md:py-10">
      <Marquee duration={38} pauseOnHover>
        {TICKER_PLACEHOLDER.map((item, i) => (
          <span key={`a-${i}`} className="flex items-center">
            <span className="display mx-8 text-[clamp(1.75rem,4.5vw,3.5rem)] text-fg">{item}</span>
            <span className="text-accent" aria-hidden="true">
              &#9670;
            </span>
          </span>
        ))}
      </Marquee>

      <Marquee duration={52} direction="right" className="mt-3 opacity-45">
        {TICKER_PLACEHOLDER.map((item, i) => (
          <span key={`b-${i}`} className="flex items-center">
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

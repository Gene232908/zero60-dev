import Image from 'next/image';
import { Parallax, Reveal } from '@/components/motion';
import { SERVICES } from '@/content/site';
import { PLACEHOLDER_IMAGES } from '@/content/placeholders';

/**
 * ServicesLedger — structured information (design brief §3 "Section C").
 *
 * The rhythm counterweight: after two very open sections this one is dense and
 * ordered. A sticky heading column holds position on the left while the eight
 * service lines scroll past on the right — cheap, CSS-only pinning, no GSAP
 * needed for something this simple.
 *
 * All eight descriptions are the client's own copy, verbatim from the live site.
 * Rendered as a definition list rather than cards, which keeps the semantics
 * honest and the visual language editorial.
 *
 * The full Services page (animated bento layout) is Developer 1's Milestone 2
 * task; this is the landing-page ledger that links into it.
 */

export function ServicesLedger() {
  const image = PLACEHOLDER_IMAGES.heroSecondary;

  return (
    <section className="border-t border-line">
      <div className="shell grid grid-cols-12 gap-y-12 py-[var(--section-y)]">
        {/* Sticky heading column */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal variant="fade" weight="tertiary">
              <p className="eyebrow mb-6">Our services</p>
            </Reveal>
            <Reveal variant="rise" weight="secondary">
              <h2 className="display text-[clamp(2rem,5vw,3.5rem)]">
                <span className="block">Everything</span>
                <span className="block">your event</span>
                <span className="block text-accent">needs</span>
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Ledger rows */}
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Reveal stagger variant="rise" weight="tertiary">
            {SERVICES.map((service, i) => (
              <dl
                key={service.id}
                className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-line py-6 first:border-t"
              >
                <dt className="eyebrow col-span-2 sm:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </dt>
                <dd className="col-span-10 sm:col-span-4">
                  <span className="display text-base tracking-normal text-fg transition-colors duration-[var(--dur-micro)] group-hover:text-accent">
                    {service.label}
                  </span>
                </dd>
                <dd className="col-span-12 sm:col-span-7">
                  <span className="text-sm leading-relaxed text-fg-muted">
                    {service.description}
                  </span>
                </dd>
              </dl>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Full-bleed visual closes the section (design brief §3 "Section E"). */}
      <Reveal variant="clip" weight="primary">
        <div className="relative h-[45svh] w-full overflow-hidden md:h-[70svh]">
          <Parallax strength="medium" className="h-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="scale-110 object-cover"
            />
          </Parallax>
        </div>
      </Reveal>
    </section>
  );
}

export default ServicesLedger;

import Image from 'next/image';
import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { BRAND, SERVICE_RAIL } from '@/content/site';
import { SCENES } from '@/content/media';

/**
 * AboutStory — the brand story, told as a sticky column against a moving image.
 *
 * The narrow text column holds while a full-height frame drifts beside it, so
 * the reading position stays put and the picture does the moving. It is the
 * inverse of the landing page's sticky-heading ledger, which keeps the two
 * pages from feeling like the same layout twice.
 *
 * The service list beneath is set as a plain typographic index — no icons, no
 * cards. Copy and service names are the client's own.
 */

export function AboutStory() {
  const image = SCENES.videoCamera;

  return (
    <section className="border-t border-line">
      <div className="shell grid grid-cols-12 gap-x-8 gap-y-16 py-[var(--section-y)]">
        {/* Drifting frame */}
        <div className="col-span-12 lg:col-span-5">
          <Parallax strength="medium">
            <Reveal variant="clip" weight="primary">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Parallax>
        </div>

        {/* Sticky story column */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="lg:sticky lg:top-32">
            <Reveal variant="fade" weight="tertiary">
              <p className="eyebrow mb-8">What we do</p>
            </Reveal>

            <KineticHeading
              lines={['Events,', 'end to end.']}
              size="md"
              className="mb-8"
              lineClassName="text-fg [&:last-child]:text-accent"
            />

            <Reveal variant="rise" weight="secondary" delay={0.15}>
              <p className="max-w-[52ch] border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
                {BRAND.intro}
              </p>
            </Reveal>

            {/* Capability index — typographic, not iconographic. */}
            <Reveal variant="fade" weight="tertiary" delay={0.3} className="mt-12">
              <ul className="grid grid-cols-2 gap-x-6">
                {SERVICE_RAIL.map((service, i) => (
                  <li
                    key={service}
                    className="flex items-baseline gap-3 border-b border-line py-3 text-sm text-fg-muted"
                  >
                    <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutStory;

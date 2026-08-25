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
              <div className="group relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="photo-mono object-cover group-hover:scale-[1.02]"
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

            <Reveal variant="settle" weight="secondary" delay={0.15}>
              <Reveal variant="draw" delay={0.3}>
                <span aria-hidden="true" className="block h-px w-full max-w-[52ch] bg-line" />
              </Reveal>
              <p className="max-w-[52ch] pt-5 text-sm leading-relaxed text-fg-muted">
                {BRAND.intro}
              </p>
            </Reveal>

            {/* Capability index — typographic, not iconographic. Each entry now
                arrives on its own beat and answers the pointer with its number
                and its rule, so a list of nine services rewards reading down it
                instead of sitting there as a block of grey. */}
            <ul className="mt-12 grid grid-cols-2 gap-x-6">
              {SERVICE_RAIL.map((service, i) => (
                // Reveal sits inside the <li> so the list keeps its semantics —
                // a motion div between <ul> and <li> is invalid markup.
                <li key={service}>
                  <Reveal variant="settle" weight="tertiary" delay={0.3 + i * 0.045}>
                    <div className="group relative flex items-baseline gap-3 border-b border-line py-3 text-sm text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-brand)] hover:text-fg">
                      <span className="eyebrow transition-[color,transform] duration-[var(--dur-fast)] ease-[var(--ease-signature)] group-hover:-translate-y-0.5 group-hover:text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{service}</span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-signature)] group-hover:scale-x-100"
                      />
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutStory;

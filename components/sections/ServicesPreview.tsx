import { Marquee, Reveal } from '@/components/motion';
import { Col, Divider, Grid, Section, SectionHeading } from '@/components/ui';
import { SERVICES, SERVICE_RAIL } from '@/content/site';

/**
 * ServicesPreview — the lower landing services block.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2
 * ("lower landing sections: services preview, about preview, call to action").
 *
 * A preview, not the Services page: it shows the shape of the offer and sends
 * the reader onward. The full bento treatment is Developer 1's /services build.
 *
 * Composition: a full-bleed rail of every service line (the client's own
 * ordering from the live hero), then the first four services as numbered
 * editorial rows. On a phone the rows stack into a single readable column; from
 * md they split index / title / description across the grid.
 *
 * All copy is the client's own, from content/site.ts.
 */

/** The preview shows the first four lines; the rest live on /services. */
const PREVIEW_COUNT = 4;

export function ServicesPreview() {
  const preview = SERVICES.slice(0, PREVIEW_COUNT);

  return (
    <Section id="services-preview" divided space="loose">
      <SectionHeading
        index="02"
        eyebrow="What we do"
        title="Every part of the show, handled"
        lead="One team for sound, stage and story — so nothing falls between suppliers on the day."
        meta={`${SERVICES.length} services`}
      />

      {/* Full-bleed rail: the service list as a branding device, not a nav. */}
      <div className="mt-[var(--space-lg)]">
        <Marquee duration={38} pauseOnHover className="border-y border-line py-3 md:py-4">
          {SERVICE_RAIL.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="display mx-[var(--space-md)] text-[clamp(1rem,2.2vw,1.75rem)] text-fg-muted"
            >
              {label}
              <span className="ml-[var(--space-md)] text-accent">&#9670;</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Reveal variant="rise" weight="secondary" stagger className="mt-[var(--space-lg)] block">
        {preview.map((service, i) => (
          <Grid key={service.id} align="start" className="group border-b border-line py-[var(--space-md)]">
            <Col span={4} md={1} lg={1}>
              <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
            </Col>

            <Col span={4} md={3} lg={4}>
              <h3 className="display text-[clamp(1.5rem,3.5vw,2.5rem)] transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                {service.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h3>
            </Col>

            <Col span={4} md={4} lg={6} lgStart={7}>
              <p className="zs-measure text-[length:var(--text-sm)] leading-relaxed text-fg-muted md:mt-1">
                {service.description}
              </p>
            </Col>
          </Grid>
        ))}
      </Reveal>

      <Divider
        label={`Showing ${preview.length} of ${SERVICES.length}`}
        meta="Full list on /services"
        space="md"
      />
    </Section>
  );
}

export default ServicesPreview;

import { Reveal } from '@/components/motion';
import { Button, Col, Divider, Grid, Section } from '@/components/ui';
import { TESTIMONIALS } from '@/content/site';

/**
 * TestimonialsTeaser — the landing page's proof section.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3
 * ("Build the Home page final sections with the real content").
 *
 * One testimonial at display scale rather than all three: the landing page's job
 * is to make the reader want the evidence, and the full set lives on
 * /portfolio. Copy is the client's own, read from content/site.ts — never
 * duplicated into a component.
 */

export function TestimonialsTeaser() {
  const [lead] = TESTIMONIALS;
  if (!lead) return null;

  return (
    <Section id="proof" space="loose" divided>
      <Grid align="end">
        <Col span={4} md={8} lg={8}>
          <Reveal variant="fade" weight="tertiary">
            <p className="eyebrow">05 — In their words</p>
          </Reveal>

          <Reveal variant="mask" weight="primary" delay={0.08}>
            <figure className="mt-[var(--space-md)]">
              <blockquote>
                <p className="display text-[clamp(1.35rem,4vw,3rem)] leading-snug text-fg">
                  &ldquo;{lead.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-[var(--space-md)] flex flex-wrap items-baseline gap-x-3">
                <span className="text-[length:var(--text-base)] text-accent">{lead.author}</span>
                {lead.organisation ? <span className="eyebrow">{lead.organisation}</span> : null}
              </figcaption>
            </figure>
          </Reveal>
        </Col>

        <Col span={4} md={8} lg={3} lgStart={10}>
          <Reveal variant="rise" weight="tertiary" delay={0.2}>
            <div className="md:flex md:justify-end lg:justify-start">
              <Button href="/portfolio" variant="outline">
                See the work
              </Button>
            </div>
          </Reveal>
        </Col>
      </Grid>

      <Divider
        label={`${TESTIMONIALS.length} testimonials`}
        meta="Read them all on /portfolio"
        space="lg"
      />
    </Section>
  );
}

export default TestimonialsTeaser;

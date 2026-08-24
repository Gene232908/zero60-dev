import { KineticHeading, Parallax, Reveal } from '@/components/motion';
import { Col, Divider, Grid, Section } from '@/components/ui';
import { TESTIMONIALS } from '@/content/site';

/**
 * Testimonials — the client's own three testimonials, verbatim.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3
 * (the "Portfolio/Testimonials" page).
 *
 * Copy comes from content/site.ts, transcribed word for word from the live site
 * by Developer 1 and handed over (docs/HANDOFF-DEV2.md §2). Nothing is
 * paraphrased, trimmed or invented — the gate checks that no testimonial string
 * is hardcoded in a component.
 *
 * Treatment: quotes set at display scale rather than in cards, staggered on
 * alternating sides and drifting at different parallax strengths, so three
 * testimonials read as a composition instead of a review widget.
 */

export function Testimonials() {
  return (
    <Section id="testimonials" space="loose" divided>
      <KineticHeading
        as="h2"
        lines={['What they', 'said']}
        size="lg"
        drift={30}
        lineClassName="[&:nth-child(2)]:pl-[10vw] [&:nth-child(2)]:text-accent"
      />

      <Grid align="start" className="mt-[var(--space-xl)]">
        {TESTIMONIALS.map((testimonial, i) => (
          <Col
            key={testimonial.author}
            span={4}
            md={8}
            lg={7}
            lgStart={i % 2 === 0 ? 1 : 6}
            className={i > 0 ? 'lg:mt-[var(--space-xl)]' : ''}
          >
            <Parallax strength={i === 1 ? 'medium' : 'subtle'}>
              <Reveal variant="mask" weight="primary" delay={0.06 * i}>
                <figure className="border-t border-line-strong pt-[var(--space-md)]">
                  <blockquote>
                    <p className="display text-[clamp(1.25rem,3.2vw,2.25rem)] leading-snug text-fg">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="mt-[var(--space-md)] flex flex-wrap items-baseline gap-x-3">
                    <span className="text-[length:var(--text-base)] text-accent">
                      {testimonial.author}
                    </span>
                    {testimonial.organisation ? (
                      <span className="eyebrow">{testimonial.organisation}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            </Parallax>
          </Col>
        ))}
      </Grid>

      <Divider
        label={`${TESTIMONIALS.length} testimonials`}
        meta="Transcribed verbatim from the client's live site"
        space="lg"
      />
    </Section>
  );
}

export default Testimonials;

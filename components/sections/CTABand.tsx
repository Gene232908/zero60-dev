import { MagneticButton, Reveal, StickerSpin } from '@/components/motion';
import { Button, Col, Grid, Section } from '@/components/ui';
import { CONTACT, EVENT_TYPES } from '@/content/site';

/**
 * CTABand — the mid-page conversion band.
 *
 * Milestone 1 · Developer 2 · Task Division Rev 2, p.2 (lower landing sections).
 *
 * OWNERSHIP NOTE: Developer 1 already ships `FinalCTA`, the full-viewport
 * closing climax at the very bottom of the page. Rev 2 p.6 says not to rebuild
 * another developer's task, so this is deliberately the *other* kind of CTA — a
 * compact band that catches the reader halfway down, once the services and the
 * brand story have landed but before the page ends. It states the event
 * categories and offers the two next steps.
 *
 * Runs in Society mode: a calm, pale interruption between two black sections,
 * which is also the clearest on-page proof that the dual-brand token system
 * works at section level rather than only per page (docs/plan.md §2.2).
 */

export function CTABand() {
  return (
    <Section id="cta-band" brand="society" space="default" divided className="overflow-hidden">
      <Grid align="center">
        <Col span={4} md={5} lg={7}>
          <Reveal variant="fade" weight="tertiary">
            <p className="eyebrow">04 — We cater to</p>
          </Reveal>

          <Reveal variant="mask" weight="primary" delay={0.08}>
            <h2 className="display mt-[var(--space-sm)] text-[clamp(1.75rem,4.5vw,3.25rem)]">
              Whatever the occasion,
              <span className="block text-fg-muted">we have run one like it.</span>
            </h2>
          </Reveal>

          <Reveal variant="rise" weight="secondary" delay={0.16} stagger className="mt-[var(--space-md)] block">
            <ul className="flex flex-wrap gap-x-[var(--space-sm)] gap-y-[var(--space-2xs)]">
              {EVENT_TYPES.map((event) => (
                <li
                  key={event.index}
                  className="border-b border-line pb-1 text-[length:var(--text-sm)] text-fg-muted"
                >
                  {event.title}
                </li>
              ))}
            </ul>
          </Reveal>
        </Col>

        <Col span={4} md={3} lg={4} lgStart={9}>
          <Reveal variant="rise" weight="secondary" delay={0.2}>
            <div className="flex flex-col items-start gap-[var(--space-sm)] md:items-end lg:items-start">
              <MagneticButton
                href="/contact"
                cursorLabel="Enquire"
                className="border-accent bg-accent text-accent-fg"
              >
                Plan your event
              </MagneticButton>

              <Button href="/services" variant="outline" size="sm">
                Browse services
              </Button>

              <a
                href={CONTACT.phoneHref}
                className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-fg-muted transition-colors duration-[var(--dur-micro)] hover:text-fg"
              >
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </Reveal>

          <StickerSpin
            text="063 SOCIETY &#183; 063 PRODUCTIONS &#183; "
            size={104}
            className="mt-[var(--space-md)] hidden lg:grid"
          />
        </Col>
      </Grid>
    </Section>
  );
}

export default CTABand;

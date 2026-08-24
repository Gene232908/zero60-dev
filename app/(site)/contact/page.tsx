import { KineticHeading, Reveal } from '@/components/motion';
import { Button, Col, Grid, Section } from '@/components/ui';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { CLOSING, CONTACT } from '@/content/site';

/**
 * Contact — Milestone 2, Developer 2 (EASY: page layout + contact-details block).
 *
 * OWNERSHIP SEAM — read before editing.
 *
 * Task Division Rev 2, p.3 assigns Developer 2 "the Contact page layout and the
 * contact-details block in the correct brand mode (the booking form comes in
 * Milestone 3)".
 *
 * So this milestone delivers the layout and the details, and deliberately does
 * NOT build a form: the booking/inquiry form, its Firestore write and the
 * Nodemailer notification are Developer 1's Milestone 3 task. In Milestone 3
 * their <BookingSection /> mounts into the #enquiry slot below — the layout is
 * already composed around it, so nothing here changes when it lands.
 *
 * Runs in productions mode. Order: who to talk to, then how to reach us, then
 * (from M3) the form — so a visitor who only wants a phone number never has to
 * scroll past a form to find one.
 */

export default function ContactPage() {
  return (
    <>
      <Section space="flush" className="pb-[var(--space-md)] pt-32 md:pt-44">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <p className="eyebrow">07 — Contact</p>
            <p className="eyebrow">{CONTACT.region}</p>
          </div>
        </Reveal>

        <div className="pt-[var(--space-lg)]">
          <KineticHeading
            as="h1"
            lines={CLOSING.lines}
            size="xl"
            delay={0.15}
            lineClassName="text-fg [&:last-child]:text-accent"
          />
        </div>

        <Grid align="end" className="mt-[var(--space-lg)]">
          <Col span={4} md={5} lg={6}>
            <Reveal variant="rise" weight="secondary" delay={0.22}>
              <p className="zs-measure text-[length:var(--text-lg)] leading-relaxed text-fg-muted">
                {CLOSING.supporting}
              </p>
            </Reveal>
          </Col>

          <Col span={4} md={3} lg={4} lgStart={9}>
            <Reveal variant="rise" weight="tertiary" delay={0.3}>
              <div className="flex flex-wrap gap-[var(--space-xs)] md:justify-end">
                <Button href={CONTACT.phoneHref} variant="outline" size="sm">
                  Call us
                </Button>
                <Button href={CONTACT.emailHref} variant="solid" size="sm">
                  Email us
                </Button>
              </div>
            </Reveal>
          </Col>
        </Grid>
      </Section>

      <ContactDetails />

      {/* Developer 1's Milestone 3 booking form mounts here. */}
      <div id="enquiry" />
    </>
  );
}

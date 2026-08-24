import { Reveal } from '@/components/motion';
import { Col, Divider, Grid, Section } from '@/components/ui';
import { BOOKABLE_SERVICES, CONTACT } from '@/content/site';

/**
 * ContactDetails — the contact-details block.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3 (EASY):
 * "Build the Contact page layout and the contact-details block in the correct
 *  brand mode (the booking form comes in Milestone 3)."
 *
 * Details are the client's own, from content/site.ts.
 *
 * BLOCKER B5 — the live site shows Facebook and Instagram icons but exposes no
 * URLs. They render as inert labels here. Never invent a destination: a wrong
 * social link on a client site is worse than no link.
 *
 * BLOCKER B6 — only the +971 dialling code is evidenced, so the location says
 * "United Arab Emirates" rather than naming a city we cannot verify.
 */

export function ContactDetails() {
  return (
    <Section id="details" space="default" divided>
      <Grid align="start">
        {/* ---- Reach us ---- */}
        <Col span={4} md={4} lg={4}>
          <Divider label="Reach us" space="none" />
          <Reveal variant="rise" weight="secondary" className="mt-[var(--space-sm)] block">
            <ul className="space-y-[var(--space-2xs)]">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="display text-[clamp(1.1rem,2.4vw,1.6rem)] text-fg transition-colors duration-[var(--dur-micro)] hover:text-accent"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  className="text-[length:var(--text-base)] text-fg-muted transition-colors duration-[var(--dur-micro)] hover:text-accent"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-[length:var(--text-sm)] text-fg-faint">{CONTACT.website}</li>
            </ul>
          </Reveal>
        </Col>

        {/* ---- Where ---- */}
        <Col span={4} md={4} lg={3}>
          <Divider label="Where" space="none" />
          <Reveal variant="rise" weight="secondary" delay={0.06} className="mt-[var(--space-sm)] block">
            <p className="text-[length:var(--text-base)] text-fg-muted">{CONTACT.region}</p>
            <p className="mt-[var(--space-2xs)] text-[length:var(--text-xs)] leading-relaxed text-fg-faint">
              We travel for events across the region.
            </p>
          </Reveal>

          <Divider label="Follow" space="md" />
          <Reveal variant="fade" weight="tertiary" delay={0.12}>
            <ul className="flex flex-wrap gap-x-[var(--space-sm)] gap-y-1">
              {CONTACT.socials.map((social) => (
                <li key={social.label}>
                  {social.href ? (
                    <a
                      href={social.href}
                      className="text-[length:var(--text-sm)] text-fg-muted transition-colors duration-[var(--dur-micro)] hover:text-accent"
                    >
                      {social.label}
                    </a>
                  ) : (
                    /* Inert until the client supplies the URL — BLOCKER B5. */
                    <span
                      className="cursor-default text-[length:var(--text-sm)] text-fg-faint"
                      title="Profile URL not yet supplied by the client"
                    >
                      {social.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </Col>

        {/* ---- What you can book ---- */}
        <Col span={4} md={8} lg={4} lgStart={9}>
          <Divider label="What you can book" meta={`${BOOKABLE_SERVICES.length}`} space="none" />
          <Reveal variant="rise" weight="secondary" delay={0.1} className="mt-[var(--space-sm)] block">
            <ul className="flex flex-wrap gap-x-[var(--space-sm)] gap-y-[var(--space-3xs)]">
              {BOOKABLE_SERVICES.map((service) => (
                <li
                  key={service}
                  className="border-b border-line pb-1 text-[length:var(--text-sm)] text-fg-muted"
                >
                  {service}
                </li>
              ))}
            </ul>
          </Reveal>
        </Col>
      </Grid>
    </Section>
  );
}

export default ContactDetails;

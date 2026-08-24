import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { KineticHeading, Reveal } from '@/components/motion';
import { Button, Col, Grid, Section } from '@/components/ui';
import { BookingSection } from '@/components/sections/BookingSection';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { CLOSING, CONTACT } from '@/content/site';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.contact);

/**
 * Contact — Milestone 2, Developer 2 (EASY: page layout + contact-details block).
 *
 * ⚠️ OWNERSHIP SEAM — read before editing.
 *
 * The page LAYOUT and the contact-details block are Developer 2's Milestone 2
 * task. The booking form inside <BookingSection /> is Developer 1's Milestone 3
 * deliverable (Task Division Rev 2, p.3: "the booking form comes in Milestone
 * 3"), and it is left exactly as they built it — self-contained, taking its
 * colours from the brand tokens. The layout is composed *around* it.
 *
 * Runs in productions mode. Order: who to talk to, then how to reach us, then
 * the form — so a visitor who only wants a phone number never has to scroll past
 * a form to find one.
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
                <Button href="#enquiry" variant="solid" size="sm">
                  Send an enquiry
                </Button>
              </div>
            </Reveal>
          </Col>
        </Grid>
      </Section>

      <ContactDetails />

      {/* Developer 1's Milestone 3 booking form — untouched. */}
      <div id="enquiry">
        <BookingSection />
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { KineticHeading, Reveal } from '@/components/motion';
import { Button, Col, Grid, Section } from '@/components/ui';
import { BookingSection } from '@/components/sections/BookingSection';
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
 * Runs in productions mode. Order: who to talk to, then the form — direct to
 * the point, no repeated contact block in between.
 *
 * SHOWTIME — signature system (see globals.css). The headline itself stays
 * CLOSING.lines verbatim — the client's own copy, shared with FinalCTA on the
 * (locked) home page, so it is not reworded here — but the eyebrow arms with a
 * cue-dot and the second line runs the three-pass neon warm-up, so the page
 * still opens on the same arm-then-ignite beat as every other hero, without
 * touching the actual wording.
 *
 * SIMPLIFIED (client direction): the phone/email/region used to appear THREE
 * times on this page — the hero's "Call us" button, a full "Reach us / Where /
 * Follow / What you can book" block (ContactDetails), and again beside the
 * booking form. That block is removed entirely: the hero's "Call us" button
 * covers the quick-glance case, and BookingSection's own "Or reach us
 * directly" column covers it again right where the form is being filled in —
 * two placements, not three, and nothing printed twice back-to-back. The
 * headline and supporting copy are also sized up (`xl` → `mega`, `text-lg` →
 * `text-xl`) since the page now has fewer competing blocks and can afford a
 * bigger opening statement.
 */

export default function ContactPage() {
  return (
    <>
      <Section space="flush" className="pb-[var(--space-md)] pt-32 md:pt-44">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="cue-dot" />
              <p className="eyebrow">07 — Contact</p>
            </span>
            <p className="eyebrow">{CONTACT.region}</p>
          </div>
        </Reveal>

        <div className="pt-[var(--space-lg)]">
          <KineticHeading
            as="h1"
            lines={CLOSING.lines}
            size="mega"
            delay={0.15}
            lineClassName="text-fg"
            lineClassNames={[undefined, 'neon-ignite']}
          />
        </div>

        <Grid align="end" className="mt-[var(--space-lg)]">
          <Col span={4} md={5} lg={6}>
            <Reveal variant="rise" weight="secondary" delay={0.22}>
              <p className="zs-measure text-[length:var(--text-xl)] leading-relaxed text-fg-muted">
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

      {/* Developer 1's Milestone 3 booking form — untouched. */}
      <div id="enquiry">
        <BookingSection />
      </div>
    </>
  );
}

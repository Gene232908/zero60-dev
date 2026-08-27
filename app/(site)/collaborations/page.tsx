import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { KineticHeading, Reveal } from '@/components/motion';
import { Button, Col, Divider, Grid, Section } from '@/components/ui';
import { PartnerBoard } from '@/components/sections/PartnerBoard';
import { BRAND, SERVICES } from '@/content/site';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.collaborations);

/**
 * Collaborations — Milestone 2, Developer 2 (MEDIUM).
 *
 * Task Division Rev 2, p.3: "partner-logo marquee and the linked project photos
 * (bulletin-board feel)". Runs in productions mode.
 *
 * The page is honest about its current state: the partner board is built but
 * empty pending BLOCKER B8, so the page leads with what collaboration actually
 * means here — the disciplines 063 brings to a job — and routes the reader on to
 * the work and the enquiry form rather than dead-ending on a blank section.
 *
 * SHOWTIME — signature system (see globals.css). "Better, together": a
 * partnership is separate crews landing on the same cue, so the arm-then-
 * ignite device still reads naturally here. Cue-dot on the eyebrow, "together"
 * runs the three-pass neon warm-up once the line settles (default
 * --signal-delay ≈ 1.1s already matches a 0.15s base + tight stagger).
 */

export default function CollaborationsPage() {
  return (
    <>
      <Section space="flush" className="pb-[var(--space-lg)] pt-32 md:pt-44">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="cue-dot" />
              <p className="eyebrow">05 — Collaborations</p>
            </span>
            <p className="eyebrow">{BRAND.short}</p>
          </div>
        </Reveal>

        <div className="pt-[var(--space-lg)]">
          <KineticHeading
            as="h1"
            lines={['Better,', 'together']}
            size="xl"
            delay={0.15}
            lineClassName="text-fg"
            lineClassNames={[undefined, 'neon-ignite']}
          />
        </div>

        <Grid align="end" className="mt-[var(--space-lg)]">
          <Col span={4} md={5} lg={6}>
            <Reveal variant="rise" weight="secondary" delay={0.22}>
              <p className="zs-measure text-[length:var(--text-lg)] leading-relaxed text-fg-muted">
                Most events are built by more than one team. These are the disciplines we bring to
                the table — and the partners we bring them alongside.
              </p>
            </Reveal>
          </Col>

          <Col span={4} md={3} lg={4} lgStart={9}>
            <Reveal variant="rise" weight="tertiary" delay={0.3}>
              <div className="flex flex-wrap gap-[var(--space-xs)] md:justify-end">
                <Button href="/portfolio" variant="outline" size="sm">
                  See the work
                </Button>
                <Button href="/contact" variant="solid" size="sm">
                  Work with us
                </Button>
              </div>
            </Reveal>
          </Col>
        </Grid>
      </Section>

      {/* What we bring — real client content, so the page stands up while B8 is open. */}
      <Section space="loose" divided>
        <Divider label="What we bring" meta={`${SERVICES.length} disciplines`} space="none" />
        <Reveal variant="rise" weight="secondary" stagger className="mt-[var(--space-md)] block">
          <ul className="flex flex-wrap gap-x-[var(--space-md)] gap-y-[var(--space-2xs)]">
            {SERVICES.map((service) => (
              <li
                key={service.id}
                className="display text-[clamp(1.1rem,2.8vw,2rem)] text-fg-muted transition-colors duration-[var(--dur-fast)] hover:text-accent"
              >
                {service.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <PartnerBoard />
    </>
  );
}

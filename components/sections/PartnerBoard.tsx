import Image from 'next/image';
import { Marquee, Reveal } from '@/components/motion';
import { Col, Divider, Grid, Section, SectionHeading } from '@/components/ui';
import { PARTNERS, PARTNERS_PLACEHOLDER, SAMPLE_PARTNERS } from '@/content/collaborations';

/**
 * PartnerBoard — the collaborations marquee and project board.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3:
 * "partner-logo marquee and the linked project photos (bulletin-board feel)".
 *
 * Built complete and driven entirely by PARTNERS, currently wired to
 * SAMPLE_PARTNERS (see content/collaborations.ts) — generic "Partner One /
 * Two / Three" placeholders using the client's own event photography, so the
 * client can review the marquee + project-board LAYOUT while BLOCKER B8
 * (real logos, project mapping, written display permission) stays open.
 * Rendering an invented REAL collaborator would put a third party's name on
 * the client's site without consent; a clearly labelled sample avoids that
 * while still answering "what will this look like".
 *
 * A partner without `displayPermission` is deliberately excluded even once the
 * list is populated: permission is per partner, not blanket.
 */

export function PartnerBoard() {
  const displayable = PARTNERS.filter((p) => p.displayPermission);
  const hasPartners = displayable.length > 0;
  const isSample = PARTNERS === SAMPLE_PARTNERS;

  return (
    <Section id="partners" space="loose" divided>
      <SectionHeading
        index="01"
        eyebrow="Collaborators"
        title={PARTNERS_PLACEHOLDER.heading}
        lead={hasPartners ? 'The people and companies we build events with.' : undefined}
        meta={hasPartners ? `${displayable.length} partners` : PARTNERS_PLACEHOLDER.blocker}
      />

      {hasPartners ? (
        <>
          {isSample ? (
            <Reveal variant="fade" weight="tertiary" className="mt-[var(--space-md)] block">
              <div className="border border-dashed border-line-strong px-[var(--space-sm)] py-[var(--space-xs)]">
                <p className="eyebrow text-accent">Sample preview — not real partners</p>
                <p className="mt-1 text-[length:var(--text-sm)] leading-relaxed text-fg-muted">
                  Names and logos below are placeholders (generic labels, no invented
                  companies) so you can review the layout. Real partner names, logos and
                  written display permission are still needed — see {PARTNERS_PLACEHOLDER.blocker}.
                </p>
              </div>
            </Reveal>
          ) : null}

          {/* Logo ticker — the bulletin-board seam. */}
          <div className="mt-[var(--space-lg)]">
            <Marquee duration={40} repeat={3} pauseOnHover className="border-y border-line py-[var(--space-sm)]">
              {displayable.map((partner) => (
                <span key={partner.name} className="mx-[var(--space-lg)] inline-flex items-center">
                  {partner.logo ? (
                    <Image
                      src={partner.logo.src}
                      alt={partner.logo.alt}
                      width={partner.logo.width}
                      height={partner.logo.height}
                      sizes="(max-width: 48rem) 30vw, 12vw"
                      className="h-10 w-auto object-contain opacity-70 md:h-12"
                    />
                  ) : (
                    <span className="display text-[clamp(1rem,2vw,1.5rem)] text-fg-muted">
                      {partner.name}
                    </span>
                  )}
                </span>
              ))}
            </Marquee>
          </div>

          {/* Pinned-photo board: projects grouped under their partner. */}
          <Grid align="start" className="mt-[var(--space-xl)]">
            {displayable.map((partner, i) => (
              <Col key={partner.name} span={4} md={4} lg={i % 2 === 0 ? 7 : 5} className="">
                <Reveal variant="rise" weight="secondary">
                  <Divider label={partner.name} meta={`${partner.projects.length} projects`} space="none" />
                  <ul className="mt-[var(--space-sm)] grid grid-cols-2 gap-[var(--grid-gap-x)] md:grid-cols-3">
                    {partner.projects.map((project) => (
                      <li key={project.title}>
                        {project.image ? (
                          <Image
                            src={project.image.src}
                            alt={project.image.alt}
                            width={project.image.width}
                            height={project.image.height}
                            sizes="(max-width: 48rem) 45vw, 20vw"
                            className="w-full object-cover grayscale"
                          />
                        ) : null}
                        <span className="eyebrow mt-[var(--space-3xs)] block">{project.title}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </Col>
            ))}
          </Grid>
        </>
      ) : (
        /* ---- Labelled empty slot — BLOCKER B8 ---- */
        <Reveal variant="rise" weight="secondary" className="mt-[var(--space-lg)] block">
          <div className="border border-dashed border-line-strong p-[var(--space-md)] md:p-[var(--space-lg)]">
            <Divider label={PARTNERS_PLACEHOLDER.notice} meta={PARTNERS_PLACEHOLDER.blocker} space="none" />

            <p className="zs-measure-wide mt-[var(--space-md)] text-[length:var(--text-base)] leading-relaxed text-fg-muted">
              {PARTNERS_PLACEHOLDER.body}
            </p>

            <p className="eyebrow mt-[var(--space-md)]">Awaiting from management</p>
            <ul className="mt-[var(--space-2xs)] space-y-1">
              {PARTNERS_PLACEHOLDER.awaiting.map((item) => (
                <li
                  key={item}
                  className="border-b border-line pb-1 text-[length:var(--text-sm)] text-fg-faint"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

export default PartnerBoard;

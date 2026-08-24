import { Reveal } from '@/components/motion';
import { Col, Divider, Grid, Section, SectionHeading } from '@/components/ui';
import { LiteYouTube } from '@/components/media/LiteYouTube';
import { PORTFOLIO_VIDEOS, VIDEO_PLACEHOLDER } from '@/content/portfolio';

/**
 * PortfolioVideos — the video reel.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3 (HARD, video half).
 *
 * Fully built and driven entirely by PORTFOLIO_VIDEOS. That list is empty today
 * because BLOCKER B9 (the YouTube upload session) has not happened, so the
 * section renders a labelled empty slot instead of pretending. The moment the
 * ids arrive, they go in content/portfolio.ts and this section fills itself —
 * no edit here.
 *
 * Every video uses LiteYouTube, never the standard iframe player: on a page that
 * will eventually carry several videos, eager embeds would cost more than the
 * rest of the site put together (Task Division Rev 2, p.3; docs/plan.md R-1).
 */

export function PortfolioVideos() {
  const hasVideos = PORTFOLIO_VIDEOS.length > 0;

  return (
    <Section id="reel" space="loose" divided>
      <SectionHeading
        index="02"
        eyebrow="Reel"
        title={VIDEO_PLACEHOLDER.heading}
        lead={
          hasVideos
            ? 'Selected event films — sound, stage and story in motion.'
            : undefined
        }
        meta={hasVideos ? `${PORTFOLIO_VIDEOS.length} films` : VIDEO_PLACEHOLDER.blocker}
      />

      {hasVideos ? (
        <Grid className="mt-[var(--space-lg)]">
          {PORTFOLIO_VIDEOS.map((video) => (
            <Col key={video.videoId} span={4} md={4} lg={6}>
              <Reveal variant="rise" weight="secondary">
                <LiteYouTube videoId={video.videoId} title={video.title} poster={video.poster} />
              </Reveal>
            </Col>
          ))}
        </Grid>
      ) : (
        /* ---- Labelled empty slot. Never invented filler. ---- */
        <Reveal variant="rise" weight="secondary" className="mt-[var(--space-lg)] block">
          <div className="border border-dashed border-line-strong p-[var(--space-md)] md:p-[var(--space-lg)]">
            <Divider label={VIDEO_PLACEHOLDER.notice} meta={VIDEO_PLACEHOLDER.blocker} space="none" />
            <p className="zs-measure-wide mt-[var(--space-md)] text-[length:var(--text-base)] leading-relaxed text-fg-muted">
              {VIDEO_PLACEHOLDER.body}
            </p>
            <p className="mt-[var(--space-sm)] text-[length:var(--text-xs)] leading-relaxed text-fg-faint">
              The player itself is built and tested: a poster facade that loads nothing from YouTube
              until the visitor presses play.
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

export default PortfolioVideos;

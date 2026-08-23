import { KineticHeading, MagneticButton, Reveal } from '@/components/motion';

/**
 * RouteStub — a real, navigable page for a destination whose content is not
 * this milestone's work.
 *
 * Milestone 1 delivers the six-page navigation, so every link must resolve to
 * something legitimate rather than a 404. It must NOT, however, pre-empt the
 * page builds that belong to Milestone 2 or to Developer 2 — so each stub states
 * plainly which milestone and which owner the real page belongs to.
 *
 * Built from the shared primitives so the stubs already move in the site's
 * motion language.
 */

export interface RouteStubProps {
  index: string;
  title: string[];
  /** Which milestone delivers the real page. */
  milestone: string;
  /** Who owns the build, per Task Division Rev 2. */
  owner: string;
  /** What the finished page will contain. */
  scope: string;
}

export function RouteStub({ index, title, milestone, owner, scope }: RouteStubProps) {
  return (
    <section className="shell flex min-h-[92svh] flex-col justify-between pb-20 pt-36 md:pt-44">
      <Reveal variant="fade" weight="tertiary">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="eyebrow">{index}</p>
          <p className="eyebrow">{milestone}</p>
        </div>
      </Reveal>

      <div className="py-16">
        <KineticHeading as="h1" lines={title} size="xl" className="mb-12" />

        <div className="grid grid-cols-12">
          <Reveal
            variant="rise"
            weight="secondary"
            className="col-span-12 md:col-span-6 md:col-start-7"
          >
            <div className="border-t border-line pt-5">
              <p className="mb-4 text-sm leading-relaxed text-fg-muted">{scope}</p>
              <p className="text-xs leading-relaxed text-fg-faint">
                <span className="text-accent">Status:</span> placeholder route. Delivered in{' '}
                {milestone} by {owner}. Milestone 1 ships the navigation and the shared
                foundation, so this destination resolves correctly today.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal variant="rise" weight="tertiary" className="flex flex-wrap gap-4">
        <MagneticButton href="/" cursorLabel="Home">
          Back to home
        </MagneticButton>
      </Reveal>
    </section>
  );
}

export default RouteStub;

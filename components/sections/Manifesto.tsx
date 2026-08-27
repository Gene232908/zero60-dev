import { KineticHeading, Reveal } from '@/components/motion';
import { BRAND } from '@/content/site';

/**
 * Manifesto — the large editorial statement (design brief §3 "Section D", §4).
 *
 * Almost empty on purpose. After the density of the ticker this section gives
 * the eye a long pause, holds the client's own positioning line at mega scale,
 * and tucks the welcome paragraph into the lower-right rather than centring it.
 * The whitespace is the design, not an absence of one.
 *
 * The statement drifts horizontally as it passes through the viewport (§10), so
 * the type is doing something rather than sitting still.
 */

export function Manifesto() {
  return (
    <section className="shell py-[var(--section-y)]">
      <Reveal variant="fade" weight="tertiary">
        <p className="eyebrow mb-16 md:mb-24">What we do</p>
      </Reveal>

      <KineticHeading
        lines={['Complete', 'event', 'mastery']}
        size="xl"
        // `lateral`, deliberately NOT the hero's `push`.
        //
        // The hero rises and scales back — a camera moving toward you, frontal
        // and monumental. Repeating that here would make the second big moment
        // on the page feel like the first one again, which is how a site starts
        // reading as a template.
        //
        // This one wipes in sideways instead: each line is masked by its own box
        // and slides in from the left, one at a time, like a title card racking
        // across frame. It suits this heading specifically because the lines are
        // already stepped in from the left below — the motion runs along the
        // same axis as the indent, so the stagger and the layout agree.
        cinematic="lateral"
        // `drift` is dropped here. It moves the outer line span on `x` while the
        // entrance moves the inner span on `x` too — nested rather than
        // conflicting, so nothing breaks, but two horizontal motions on the same
        // axis blur the wipe into general sideways drifting. The stepped indent
        // below already gives this heading its horizontal life.
        className="mb-16 md:mb-24"
        lineClassName="text-fg [&:nth-child(2)]:pl-[8vw] [&:nth-child(3)]:pl-[18vw] [&:nth-child(3)]:text-accent"
      />

      <div className="grid grid-cols-12">
        {/* Re-timed against `lateral`, then MEASURED rather than guessed.
            It first arrived at 0.18s — before even the first word had landed —
            so the statement and its footnote raced each other. Pushing it to
            1.55s fixed that and introduced the opposite fault: sampling the real
            page showed the words settling by ~1.3s and this not starting until
            ~1.6s, a 300ms hole where the section sat completely still.

            1.15s overlaps the last word's tail instead. The paragraph begins
            while "mastery" is still settling, so the section hands off in one
            continuous movement rather than stopping and starting again. */}
        <Reveal
          variant="settle"
          weight="secondary"
          delay={1.15}
          className="col-span-12 md:col-span-5 md:col-start-8"
        >
          {/* The rule above this paragraph was a static border. It now draws
              itself across as the block settles — in a section this quiet, the
              one line that moves is the whole point. Reveal's `draw` variant
              handles the reduced-motion case by rendering the finished rule. */}
          <div>
            <Reveal variant="draw" delay={1.32}>
              <span aria-hidden="true" className="block h-px w-full bg-line" />
            </Reveal>
            <p className="pt-5 text-sm leading-relaxed text-fg-muted">{BRAND.intro}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Manifesto;

import { KineticHeading, MagneticButton, Reveal, StickerSpin } from '@/components/motion';
import { CLOSING, CONTACT } from '@/content/site';
import { ContactLink } from '@/components/ui/ContactLink';

/**
 * FinalCTA — the visual climax (design brief §21).
 *
 * Not "Contact us" over a list of details. The page ends on the client's own
 * closing line — "Get in touch with us" — at display scale, and only once you
 * have read it do the practical details appear beneath.
 *
 * The line break is deliberate: "GET IN TOUCH" reads as the instruction and
 * "WITH US" as the accent answer, so the pair carries a beat the old three-line
 * split did not. The second line indents so the block reads as a descending
 * staircase rather than a centred slab.
 */

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      {/* ---------- closing plate ----------
          The section was flat black, which is correct for a quiet outro and
          wrong for a climax — the page ends on its single most important ask and
          it was the least lit thing on it.

          Same vocabulary as the hero so the page closes on the note it opened
          with, but dimmer and centred low: a spotlight pooling on an empty stage
          after the show rather than a rig mid-performance. Two gradients and one
          slow drift, no images, no filters on large areas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="cta-glow absolute inset-0" />
        <div className="cta-vignette absolute inset-0" />
      </div>

      <div className="shell relative flex min-h-[92svh] flex-col justify-center py-[var(--section-y)]">
        <KineticHeading
          as="h2"
          lines={CLOSING.lines}
          size="mega"
          // `slam` — the third entrance, and the heaviest.
          //
          // The hero pushes toward you and the manifesto wipes sideways; this one
          // drops from ABOVE and is stopped hard by `overshoot`, crossing the mark
          // before it settles. It is the only mode that arrives rather than
          // glides, which is the right gesture for the end of the page: a closing
          // request should land, not fade up.
          cinematic="slam"
          // CENTRED, and bigger than `mega`.
          //
          // This used to be left-aligned with the second line pushed in 10vw —
          // a descending staircase. That reads as editorial, and the close of the
          // page should not read as editorial; it should read as a title card.
          // Centring the pair and letting `slam`'s size ramp carry the hierarchy
          // (0.66 / 1) makes "WITH US" the thing you see first, which is correct:
          // it is the accent line and the answer.
          //
          // Bigger than the `mega` step, which tops out at 11rem — at this width
          // the centred pair can carry more. It has to go through sizeClassName
          // rather than className: SIZE[size] sets font-size on the heading
          // element itself, and the per-line `em` ramp resolves against that, so
          // a size on the wrapper would simply be overridden.
          sizeClassName="text-[clamp(3rem,13vw,15rem)]"
          className="mb-14 text-center"
          lineClassName="text-fg [&:nth-child(2)]:text-accent"
        />

        <div className="grid grid-cols-12 items-end gap-y-10">
          {/* MEASURED, not guessed. `slam` is fast — the second line starts at
              0.19s and runs 0.86s, so the heading is fully settled by ~0.7s on
              the real page. A first pass at 0.95s left a ~600ms hole after the
              impact where the section sat still, which is exactly what kills the
              momentum a slam is supposed to create.

              0.62s catches the tail of the impact instead: the details start
              moving while the headline is still coming to rest. */}
          <Reveal variant="settle" weight="secondary" delay={0.62} className="col-span-12 md:col-span-5">
            <div className="border-t border-line pt-5">
              <p className="mb-6 text-sm leading-relaxed text-fg-muted">{CLOSING.supporting}</p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <ContactLink href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</ContactLink>
                </li>
                <li>
                  <ContactLink href={CONTACT.emailHref}>{CONTACT.email}</ContactLink>
                </li>
              </ul>
            </div>
          </Reveal>

          <div className="col-span-12 flex items-end justify-between gap-6 md:col-span-6 md:col-start-7">
            {/* Last thing in — the button is the point of the section, so it
                arrives after everything that argues for it.

                0.86s, a clear 0.24s behind the details block. Measuring showed
                the two moving in lockstep at the previous values, which wasted
                the sequence: if they land together they read as one block
                fading in, and the button stops being the final beat. */}
            <Reveal variant="lead" weight="tertiary" delay={0.86}>
              <MagneticButton
                href={CLOSING.contactHref}
                cursorLabel="Enquire"
                className="border-accent bg-accent text-accent-fg"
              >
                {CLOSING.contactLabel}
              </MagneticButton>
            </Reveal>

            <StickerSpin
              text="GET IN TOUCH &#183; GET IN TOUCH &#183; "
              size={110}
              reverse
              className="hidden sm:grid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;

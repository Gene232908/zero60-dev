import { KineticHeading, MagneticButton, Reveal, StickerSpin } from '@/components/motion';
import { FINAL_CTA_PLACEHOLDER } from '@/content/placeholders';

/**
 * FinalCTA — the visual climax (design brief §21).
 *
 * Not "Contact us" over a list of details. The page ends on one enormous
 * statement that fills the viewport, and only once you have read it do the
 * practical next steps appear beneath. The footer then carries the facts.
 *
 * Each line indents further than the last so the block reads as a descending
 * staircase rather than a centred slab.
 */

export function FinalCTA() {
  const cta = FINAL_CTA_PLACEHOLDER;

  return (
    <section className="relative overflow-hidden border-t border-line">
      <div className="shell flex min-h-[92svh] flex-col justify-center py-[var(--section-y)]">
        <KineticHeading
          as="h2"
          lines={cta.lines}
          size="mega"
          className="mb-14"
          lineClassName="text-fg [&:nth-child(2)]:pl-[6vw] [&:nth-child(3)]:pl-[14vw]"
        />

        <div className="grid grid-cols-12 items-end gap-y-10">
          <Reveal variant="rise" weight="secondary" className="col-span-12 md:col-span-5">
            <p className="border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
              {cta.supporting}
            </p>
          </Reveal>

          <div className="col-span-12 flex items-end justify-between gap-6 md:col-span-6 md:col-start-7">
            <Reveal variant="rise" weight="tertiary" delay={0.1}>
              <MagneticButton
                href={cta.contactHref}
                cursorLabel="Enquire"
                className="border-accent bg-accent text-accent-fg"
              >
                {cta.contactLabel}
              </MagneticButton>
            </Reveal>

            <StickerSpin
              text="GET IN TOUCH · GET IN TOUCH · "
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

import { KineticHeading, MagneticButton, Reveal, StickerSpin } from '@/components/motion';
import { CLOSING, CONTACT } from '@/content/site';
import { ContactLink } from '@/components/ui/ContactLink';

/**
 * FinalCTA — the visual climax (design brief §21).
 *
 * Not "Contact us" over a list of details. The page ends on the client's own
 * closing line — "Get in touch with us" — at mega scale filling the viewport,
 * and only once you have read it do the practical details appear beneath.
 *
 * Each line indents further than the last so the block reads as a descending
 * staircase rather than a centred slab.
 */

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div className="shell flex min-h-[92svh] flex-col justify-center py-[var(--section-y)]">
        <KineticHeading
          as="h2"
          lines={CLOSING.lines}
          size="mega"
          className="mb-14"
          lineClassName="text-fg [&:nth-child(2)]:pl-[6vw] [&:nth-child(3)]:pl-[14vw] [&:nth-child(3)]:text-accent"
        />

        <div className="grid grid-cols-12 items-end gap-y-10">
          <Reveal variant="settle" weight="secondary" delay={0.25} className="col-span-12 md:col-span-5">
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
            <Reveal variant="lead" weight="tertiary" delay={0.35}>
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

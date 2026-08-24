import { KineticHeading, MagneticButton, Reveal, StickerSpin } from '@/components/motion';
import { CLOSING, CONTACT } from '@/content/site';
import { cn } from '@/lib/utils/cn';

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

/**
 * A phone number and an email address are the two things on this page someone
 * actually reaches for, and they were plain text that changed colour. Now the
 * accent hairline draws under the label on approach and retracts to the other
 * side on leave, the whole thing takes the press, and keyboard focus gets the
 * same treatment as hover rather than the blanket outline.
 */
function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        'group relative inline-block text-fg',
        'transition-[color,transform] duration-[var(--dur-micro)] ease-[var(--ease-brand)]',
        'hover:text-accent focus-visible:text-accent',
        'active:scale-[var(--press-scale)] active:ease-[var(--ease-press)]',
        'focus-visible:outline-none',
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent',
          'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-signature)]',
          'group-hover:origin-left group-hover:scale-x-100',
          'group-focus-visible:origin-left group-focus-visible:scale-x-100',
        )}
      />
    </a>
  );
}

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

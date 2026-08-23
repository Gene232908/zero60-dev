import { KineticHeading, MagneticButton, Reveal } from '@/components/motion';
import { CONTACT } from '@/content/site';

/**
 * SocietyCTA — the quiet close.
 *
 * The Productions page ends on a mega-scale shout with a filled lime button.
 * Society ends on the same structural idea — big statement, then the practical
 * details — but one size down, in serif, with an outlined control instead of a
 * filled one.
 *
 * Contact details are real (from the live site); the invitation line is
 * PLACEHOLDER because no Society wording has been supplied (BLOCKER B4).
 */

export function SocietyCTA() {
  return (
    <section className="border-t border-line">
      <div className="shell flex min-h-[70svh] flex-col justify-center py-[var(--section-y)]">
        <KineticHeading
          as="h2"
          lines={['An occasion', 'worth the', 'detail.']}
          size="lg"
          lineClassName="text-fg [&:nth-child(2)]:pl-[5vw] [&:nth-child(3)]:pl-[11vw] [&:nth-child(3)]:italic"
        />

        <div className="mt-16 grid grid-cols-12 items-end gap-y-10 md:mt-24">
          <Reveal variant="fade" weight="tertiary" className="col-span-12 md:col-span-5">
            <div className="border-t border-line pt-5">
              <p className="mb-6 text-sm leading-relaxed text-fg-muted">
                PLACEHOLDER — 063 Society invitation line, to be supplied by client.
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a
                    href={CONTACT.emailHref}
                    className="text-fg transition-colors duration-[var(--dur-micro)] hover:text-accent"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.phoneHref}
                    className="text-fg transition-colors duration-[var(--dur-micro)] hover:text-accent"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal
            variant="fade"
            weight="tertiary"
            delay={0.15}
            className="col-span-12 md:col-span-5 md:col-start-8"
          >
            {/* Outlined, not filled — lime stays a hairline in this register. */}
            <MagneticButton href="/contact" cursorLabel="Enquire" strength={8}>
              Make an enquiry
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyCTA;

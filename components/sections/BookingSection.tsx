import { KineticHeading, Reveal } from '@/components/motion';
import { BookingForm } from '@/components/forms/BookingForm';
import { CONTACT } from '@/content/site';

/**
 * BookingSection — the editorial wrapper around Developer 1's inquiry form.
 *
 * The form is deliberately the *only* thing in the right-hand column: an enquiry
 * form competing with marketing copy is a form that does not get filled in. The
 * left column stays a quiet, sticky contact block for people who would rather
 * phone.
 *
 * SEAM NOTE: the Contact page layout and the contact-details block are
 * Developer 2's Milestone 2 task (Task Division Rev 2, p.3). This section is
 * Developer 1's Milestone 3 deliverable and is designed to be dropped into
 * whatever they build — it is self-contained and takes its colours from the
 * brand tokens.
 */

export function BookingSection() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12 gap-x-8 gap-y-14">
        {/* Direct contact — for people who would rather not fill in a form */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal variant="fade" weight="tertiary">
              <p className="eyebrow mb-6">Or reach us directly</p>
            </Reveal>

            <Reveal variant="rise" weight="secondary" delay={0.1}>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href={CONTACT.phoneHref}
                    className="text-fg transition-colors duration-[var(--dur-micro)] hover:text-accent"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.emailHref}
                    className="text-fg transition-colors duration-[var(--dur-micro)] hover:text-accent"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li className="pt-2 text-fg-faint">{CONTACT.region}</li>
              </ul>
            </Reveal>

            <Reveal variant="fade" weight="tertiary" delay={0.25}>
              <p className="mt-10 max-w-[34ch] border-t border-line pt-5 text-xs leading-relaxed text-fg-faint">
                Tell us the date, the place and roughly how many people, and we can come back with a
                realistic quote rather than a guess.
              </p>
            </Reveal>
          </div>
        </div>

        {/* The form itself */}
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Reveal variant="fade" weight="tertiary">
            <KineticHeading lines={['Make an', 'enquiry']} size="md" className="mb-12" />
          </Reveal>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

export default BookingSection;

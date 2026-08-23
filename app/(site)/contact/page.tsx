import { KineticHeading, Reveal } from '@/components/motion';
import { BookingSection } from '@/components/sections/BookingSection';
import { CONTACT } from '@/content/site';

/**
 * Contact — hosts Developer 1's Milestone 3 booking form.
 *
 * ⚠️ OWNERSHIP SEAM — read before editing.
 *
 * The Contact page LAYOUT and the contact-details block are Developer 2's
 * Milestone 2 EASY task (Task Division Rev 2, p.3), which explicitly notes
 * "the booking form comes in Milestone 3".
 *
 * That form is Developer 1's Milestone 3 deliverable, and the milestone's
 * definition of done requires a live submission landing in Firestore and firing
 * an email — which needs the form to be reachable on a route. So this page is
 * the minimum shell needed to host it, not a finished Contact page.
 *
 * Developer 2: build your Contact layout around <BookingSection />. It is
 * self-contained and takes its colours from the brand tokens, so it will drop
 * into whatever composition you design without modification.
 */

export default function ContactPage() {
  return (
    <>
      <section className="shell pb-4 pt-32 md:pt-44">
        <Reveal variant="fade" weight="tertiary">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <p className="eyebrow">07 — Contact</p>
            <p className="eyebrow">{CONTACT.region}</p>
          </div>
        </Reveal>

        <div className="pt-14 md:pt-20">
          <KineticHeading
            as="h1"
            lines={['Get in touch', 'with us']}
            size="xl"
            delay={0.15}
            lineClassName="text-fg [&:last-child]:text-accent"
          />
        </div>
      </section>

      <BookingSection />
    </>
  );
}

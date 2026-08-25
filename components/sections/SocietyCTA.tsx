import Image from 'next/image';
import { KineticHeading, MagneticButton, Parallax, Reveal } from '@/components/motion';
import { CONTACT } from '@/content/site';
import { SOCIETY_ENQUIRY } from '@/content/society';
import { SOCIETY } from '@/content/media';
import { ContactLink } from '@/components/ui/ContactLink';

/**
 * SocietyCTA — the close.
 *
 * REDESIGN (2026-08-25). The brief asked for a dramatic ending: oversized
 * typography, strong whitespace, subtle background motion, minimal UI, one
 * clear CTA, transitioning naturally into the footer.
 *
 * WHAT CHANGED
 *
 * 1. THE STATEMENT IS NOW THE PAGE'S LARGEST TYPE. It moves from `lg` to `xl`,
 *    matching the hero wordmark. That is the point: the page opens and closes
 *    at the same scale, so the ending reads as the answer to the opening rather
 *    than as one more section. Nothing between them is set at `xl`, which is
 *    what makes the two ends of the page feel like a pair.
 *
 * 2. A PHOTOGRAPHIC GROUND, at very low presence. The brief asked for "subtle
 *    background motion". It is a single frame at 12% opacity behind the type,
 *    drifting on Parallax — enough that the section is not a flat rectangle,
 *    far too faint to compete with the serif. Contrast is unaffected at that
 *    opacity over paper, so the type keeps its full ink-900 legibility and
 *    needs no halo treatment.
 *
 * 3. ONE CTA, AND THE DETAILS DEMOTED BENEATH IT. Previously the button and the
 *    contact list sat in two columns of equal weight, which gave the section
 *    two focal points and no clear action. Now the button is alone on its row
 *    and the email/phone sit under a hairline below it as reference
 *    information. "CTA hierarchy" in the brief's QA list is precisely this.
 *
 * 4. MIN-HEIGHT RAISED to 88svh from 70svh. A closing statement needs the page
 *    to empty out around it; at 70svh the footer crowded into the frame.
 *
 * The control stays OUTLINED rather than filled — lime remains a hairline in
 * this register, which is Society's own stated rule (SOCIETY_NOTES).
 *
 * Contact details are REAL (from the live site). The heading and invitation
 * line are PLACEHOLDER (BLOCKER B4).
 */

export function SocietyCTA() {
  const ground = SOCIETY.wide;

  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      {/* ---------- the ground ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Parallax strength="subtle">
          <div className="relative h-[120%] w-full opacity-[0.12]">
            <Image
              src={ground.src}
              alt=""
              fill
              sizes="100vw"
              className="photo-mono object-cover"
            />
          </div>
        </Parallax>
        {/* Keeps the top and bottom edges reading as paper so the section melts
            into the sections either side of it rather than starting abruptly. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="shell flex min-h-[88svh] flex-col justify-center py-[var(--section-y)]">
        <Reveal variant="fade" weight="tertiary" className="mb-10 md:mb-16">
          <p className="eyebrow">Enquiries</p>
        </Reveal>

        <KineticHeading
          as="h2"
          lines={SOCIETY_ENQUIRY.heading}
          size="xl"
          lineClassName="text-fg [&:nth-child(2)]:pl-[5vw] [&:nth-child(3)]:pl-[11vw] [&:nth-child(3)]:italic"
        />

        <div className="mt-16 grid grid-cols-12 gap-y-12 md:mt-24">
          {/* -- the invitation + the one control -- */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <Reveal variant="settle" weight="tertiary" delay={0.2}>
              <div>
                <Reveal variant="draw" delay={0.45}>
                  <span aria-hidden="true" className="block h-px w-full bg-line-strong" />
                </Reveal>
                <p className="max-w-[46ch] pt-5 text-sm leading-relaxed text-fg-muted">
                  {SOCIETY_ENQUIRY.invitation}
                </p>
              </div>
            </Reveal>

            <Reveal variant="settle" weight="secondary" delay={0.4} className="mt-10">
              <MagneticButton href="/contact" cursorLabel="Enquire" strength={8}>
                {SOCIETY_ENQUIRY.cta}
              </MagneticButton>
            </Reveal>
          </div>

          {/* -- reference details, demoted -- */}
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <Reveal variant="settle" weight="tertiary" delay={0.55}>
              <div className="border-t border-line pt-5">
                <p className="eyebrow mb-4">Direct</p>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <ContactLink href={CONTACT.emailHref}>{CONTACT.email}</ContactLink>
                  </li>
                  <li>
                    <ContactLink href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</ContactLink>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocietyCTA;

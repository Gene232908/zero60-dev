import { KineticHeading, Reveal } from '@/components/motion';
import { SOCIETY_BRAND } from '@/content/society';

/**
 * SocietyStatement — the pause.
 *
 * Productions earns its impact by filling the frame; Society earns its impact by
 * emptying it. This section is almost entirely whitespace, holding one serif
 * statement and a single narrow paragraph well below it.
 *
 * No scroll drift on the heading here — Productions' Manifesto uses horizontal
 * drift, and the restraint of *not* moving is what separates the two moods.
 *
 * Copy is PLACEHOLDER (BLOCKER B4).
 */

export function SocietyStatement() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-9 md:col-start-3 lg:col-span-8 lg:col-start-4">
          <KineticHeading
            lines={SOCIETY_BRAND.closing}
            size="lg"
            delay={0.1}
            lineClassName="text-fg [&:nth-child(2)]:pl-[6vw] [&:nth-child(3)]:pl-[12vw] [&:nth-child(3)]:italic"
          />

          <Reveal variant="fade" weight="tertiary" delay={0.35} className="mt-16 max-w-[52ch] md:mt-24">
            <p className="border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
              {SOCIETY_BRAND.intro}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyStatement;

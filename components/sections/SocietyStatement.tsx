import { KineticHeading, Reveal, TextResolve } from '@/components/motion';
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
 * REFERENCE STUDY (2026-08-25): lafleur.framer.website resolves its body copy
 * from dim to full ink as it scrolls into view, word by word. Borrowed as
 * TextResolve (components/motion/TextResolve.tsx) — opacity only, no position
 * or clip travel, so it adds engagement without adding the movement this
 * section is explicitly built to avoid. "The pause is the point" gains a
 * second meaning: the words themselves seem to arrive at the reader's pace.
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

          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.35}
            className="mt-16 max-w-[52ch] md:mt-24"
          >
            {/* The pause is the point, so the rule takes its time getting here —
                it lands after the statement has been read, not alongside it. */}
            <Reveal variant="draw" delay={0.6}>
              <span aria-hidden="true" className="block h-px w-full bg-line" />
            </Reveal>
            <TextResolve className="pt-5 text-sm leading-relaxed text-fg-muted" delay={0.15}>
              {SOCIETY_BRAND.intro}
            </TextResolve>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyStatement;

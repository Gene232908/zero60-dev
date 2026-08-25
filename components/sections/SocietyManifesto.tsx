import { KineticHeading, Reveal, TextResolve } from '@/components/motion';
import { SOCIETY_MANIFESTO } from '@/content/society';

/**
 * SocietyManifesto — the pause. NEW in the 2026-08-25 redesign.
 *
 * The brief asked for a powerful editorial statement immediately after the
 * hero, set in oversized type, broken across visual lines, revealed on scroll,
 * with "enough whitespace to feel expensive".
 *
 * This is a RENAME AND REFOCUS of what used to be SocietyStatement. That
 * component was doing two jobs at once — carrying the big statement AND
 * introducing the brand in a paragraph underneath. The redesign splits them:
 * the statement is this section, and the introduction became its own editorial
 * spread (SocietyAbout). Splitting them is what buys the page its pacing;
 * a statement with an explanatory paragraph bolted underneath is a header,
 * not a pause.
 *
 * WHY NO SCROLL DRIFT. Productions' Manifesto drifts its heading horizontally
 * as you scroll. The restraint of NOT moving is precisely what separates the
 * two registers, so `drift` is left at 0 here. The engagement instead comes
 * from TextResolve on the footnote — a word-by-word opacity resolve, no
 * position or clip travel, so it adds life without adding the movement this
 * section exists to avoid.
 *
 * THE INDENT LADDER. Lines 2 and 3 step right by 6vw and 12vw, and line 3 goes
 * italic. That staircase is the composition — it is why three centred lines
 * would be a worse section than three offset ones. It is vw-based so the
 * stagger scales with the viewport instead of collapsing on a phone.
 *
 * Copy is PLACEHOLDER (BLOCKER B4).
 */

export function SocietyManifesto() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12">
        {/* Indented from the left edge rather than centred: the statement should
            sit in the page like a pull-quote in a magazine, off the spine. */}
        <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-3">
          <Reveal variant="fade" weight="tertiary" className="mb-12 md:mb-16">
            <p className="eyebrow">Statement</p>
          </Reveal>

          <KineticHeading
            lines={SOCIETY_MANIFESTO.lines}
            size="lg"
            delay={0.1}
            lineClassName="text-fg [&:nth-child(2)]:pl-[6vw] [&:nth-child(3)]:pl-[12vw] [&:nth-child(3)]:italic"
          />

          {/* The rule takes its time getting here — it lands after the statement
              has been read, not alongside it. The pause is the point. */}
          <Reveal
            variant="settle"
            weight="tertiary"
            delay={0.35}
            className="mt-20 max-w-[46ch] md:mt-28 lg:ml-[12vw]"
          >
            <div>
              <Reveal variant="draw" delay={0.6}>
                <span aria-hidden="true" className="block h-px w-full bg-line" />
              </Reveal>
              <TextResolve className="pt-5 text-sm leading-relaxed text-fg-muted" delay={0.15}>
                {SOCIETY_MANIFESTO.footnote}
              </TextResolve>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyManifesto;

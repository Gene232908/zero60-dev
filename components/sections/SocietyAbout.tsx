import { Reveal, TextResolve } from '@/components/motion';
import { SOCIETY_ABOUT } from '@/content/society';

/**
 * SocietyAbout — the editorial spread. NEW in the 2026-08-25 redesign.
 *
 * The brief: a two-column editorial layout, small label left, large paragraph
 * right, explicitly NOT looking like a typical "About Us" block — a magazine
 * spread instead.
 *
 * WHAT MAKES IT A SPREAD RATHER THAN A TWO-COLUMN ABOUT BLOCK
 *
 * 1. THE LABEL IS A MARGIN NOTE, NOT A HEADING. It sits in a narrow left rail
 *    (2 of 12 columns) at eyebrow size, top-aligned against a lead paragraph
 *    many times its size. A conventional About section makes the label a
 *    heading of comparable weight to the copy; the size DISPARITY is what reads
 *    as editorial. The hairline above it ties it to the text block's baseline.
 *
 * 2. THE LEAD IS SET AT DISPLAY SCALE, NOT BODY SCALE. clamp(1.35rem, 2.4vw,
 *    2.15rem) puts it between body copy and a section heading — the "large
 *    paragraph" the brief asked for. It carries the section, so it gets the
 *    serif display face rather than the body face.
 *
 * 3. THE SUPPORT PARAGRAPH IS INDENTED AND NARROWER. It starts at column 8 of
 *    12 while the lead starts at column 4, so the block steps inward as it gets
 *    smaller. Two paragraphs at the same measure and the same left edge would
 *    read as a wall; the step is the second beat.
 *
 * MOTION. TextResolve on the lead — word-by-word opacity, no travel. At this
 * size a clip or rise reveal on a full paragraph is heavy and slightly
 * seasick; resolving in place suits a paragraph you are meant to read rather
 * than watch. The support paragraph gets a plain settle, later, so the two do
 * not compete.
 *
 * Copy is PLACEHOLDER (BLOCKER B4).
 */

export function SocietyAbout() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        {/* -- the margin note -- */}
        <div className="col-span-12 md:col-span-2">
          <Reveal variant="settle" weight="tertiary">
            <div>
              <Reveal variant="draw">
                <span aria-hidden="true" className="mb-4 block h-px w-full bg-line-strong" />
              </Reveal>
              <p className="eyebrow">{SOCIETY_ABOUT.label}</p>
            </div>
          </Reveal>
        </div>

        {/* -- the lead -- */}
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <TextResolve
            className="display text-[clamp(1.35rem,2.4vw,2.15rem)] leading-[1.34] text-fg"
            delay={0.1}
          >
            {SOCIETY_ABOUT.lead}
          </TextResolve>
        </div>

        {/* -- the second beat: narrower, indented further, smaller -- */}
        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Reveal variant="settle" weight="tertiary" delay={0.25}>
            <p className="max-w-[52ch] text-sm leading-relaxed text-fg-muted">
              {SOCIETY_ABOUT.support}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SocietyAbout;

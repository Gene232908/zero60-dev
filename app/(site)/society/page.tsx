import { SocietyHero } from '@/components/sections/SocietyHero';
import { SocietyManifesto } from '@/components/sections/SocietyManifesto';
import { SocietyAbout } from '@/components/sections/SocietyAbout';
import { SocietyPillars } from '@/components/sections/SocietyPillars';
import { SocietyMarquee } from '@/components/sections/SocietyMarquee';
import { SocietyCategories } from '@/components/sections/SocietyCategories';
import { SocietyExperiences } from '@/components/sections/SocietyExperiences';
import { SocietyGallery } from '@/components/sections/SocietyGallery';
import { SocietyCTA } from '@/components/sections/SocietyCTA';

/**
 * 063 Society — Milestone 2, Developer 1 (HARD).
 *
 * Elegant mode. `data-brand="society"` is set once on ./layout.tsx and every
 * token beneath it re-maps: paper ground, Fraunces serif display, lime demoted
 * to a hairline, `--motion-scale` down to 0.62, `--grain-opacity` to 0.
 *
 * This is the milestone's real argument: not one component here is
 * Society-specific in its BEHAVIOUR. The same KineticHeading, Reveal, Parallax,
 * Marquee and MagneticButton that build the rugged Productions pages build this
 * one — they simply read the other token set. Aligned, but distinct.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * REDESIGN (2026-08-25) — five sections to nine.
 *
 * The brief asked for the page to be rebuilt at the pacing of
 * planfest.framer.website and lightfall.framer.website: a narrative that runs
 * attention → curiosity → immersion → information → emotion → desire → action,
 * rather than a hero followed by four blocks.
 *
 * THE ARC, and what each section is FOR:
 *
 *   SocietyHero         attention.  Full viewport, staggered cinematic entrance,
 *                                   wordmark and photograph overlapping.
 *   SocietyManifesto    curiosity.  The pause. Almost entirely whitespace.
 *   SocietyAbout        orientation. The editorial spread — what this is.
 *   SocietyPillars      immersion.  The approach, as a staggered ladder against
 *                                   a full-height photograph.
 *   SocietyMarquee      the bridge. The page's only full-bleed band; carries no
 *                                   new information, exists to reset the reader.
 *   SocietyCategories   information. The five real service categories.
 *   SocietyExperiences  emotion.    Asymmetric three-frame composition.
 *   SocietyGallery      emotion.    The visual peak — the one full-bleed photo.
 *   SocietyCTA          action.     One control, at the scale of the hero.
 *
 * WHY THE ORDER IS THIS ORDER. Information (Categories) sits in the MIDDLE,
 * flanked by two emotional passages, because a list of services is the least
 * persuasive thing on the page and the most necessary — it needs the marquee to
 * introduce it and the photography to recover from it. Putting it last, which is
 * the conventional services-page shape, would end the page on its flattest note.
 *
 * TYPE HIERARCHY ACROSS THE PAGE, deliberately rationed:
 *   xl   hero wordmark, closing statement          — the two ends, a matched pair
 *   lg   the manifesto                             — the single loudest middle beat
 *   md   gallery, categories headings              — section entry points
 * Nothing else competes. That rationing is what keeps nine sections from
 * reading as nine equally-shouting blocks.
 *
 * WHAT WAS DELIBERATELY NOT TAKEN FROM THE BRIEF: its "private membership
 * society / request access / limited membership" framing, and a members/people
 * section. 063 Society is the elegant EVENTS arm of ZeroSixtyThree — weddings,
 * corporate, event program support, music & entertainment, AV — per plan.md §4
 * M2 and Task Division Rev 2 p.3. Inventing a membership programme, or naming
 * people who work there, would put fabricated commercial claims on a client
 * site. The reference's DESIGN logic is applied in full; its subject matter is
 * not. See content/society.ts.
 *
 * ⚠️ CONTENT: every word and every image on this page is a labelled
 * PLACEHOLDER except the five category names and the contact details. The
 * client has supplied no Society copy — see BLOCKERS.md B4. The architecture and
 * art direction are reviewable now; the content drops in without touching a
 * component.
 * ────────────────────────────────────────────────────────────────────────────
 */

export default function SocietyPage() {
  return (
    <>
      <SocietyHero />
      <SocietyManifesto />
      <SocietyAbout />
      <SocietyPillars />
      <SocietyMarquee />
      <SocietyCategories />
      <SocietyExperiences />
      <SocietyGallery />
      <SocietyCTA />
    </>
  );
}

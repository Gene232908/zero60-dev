import { SocietyHero } from '@/components/sections/SocietyHero';
import { SocietyStatement } from '@/components/sections/SocietyStatement';
import { SocietyCategories } from '@/components/sections/SocietyCategories';
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
 * Society-specific in its behaviour. The same KineticHeading, Reveal, Parallax
 * and MagneticButton that build the rugged Productions pages build this one —
 * they simply read the other token set. Aligned, but distinct.
 *
 * Composition, deliberately paced against the Productions landing:
 *   SocietyHero        opens with air rather than impact
 *   SocietyStatement   the pause — mostly whitespace
 *   SocietyCategories  the five named categories as a quiet index
 *   SocietyGallery     asymmetric two-frame composition
 *   SocietyCTA         the quiet close
 *
 * ⚠️ CONTENT: every word and every image on this page is a labelled
 * PLACEHOLDER. The client has supplied nothing for 063 Society — the only real
 * facts are the brand name, the elegant mood, and the five category names from
 * plan.md §4 M2. See BLOCKERS.md B4. The architecture and art direction are
 * reviewable now; the content drops in without touching a component.
 */

export default function SocietyPage() {
  return (
    <>
      <SocietyHero />
      <SocietyStatement />
      <SocietyCategories />
      <SocietyGallery />
      <SocietyCTA />
    </>
  );
}

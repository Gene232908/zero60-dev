import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { AboutHero } from '@/components/sections/AboutHero';
import { AboutTiles } from '@/components/sections/AboutTiles';
import { AboutStory } from '@/components/sections/AboutStory';
import { FinalCTA } from '@/components/sections/FinalCTA';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.about);

/**
 * About — Milestone 2, Developer 1 (MEDIUM).
 *
 * Productions mode (inherited from the root layout). Maximalist but readable:
 * the oversized type and layered composition carry the brand, while the actual
 * story sits in a narrow, comfortable measure.
 *
 * Every word is the client's own, transcribed from the live site into
 * content/site.ts. Photography is the client's own too, though still cropped
 * from the supplied screenshots pending originals (BLOCKER B2).
 *
 *   AboutHero    "About 063" at mega scale + the real positioning line
 *   AboutTiles   the five editorial frames, broken out of a flat row
 *   AboutStory   sticky story column against a drifting frame
 *   FinalCTA     shared closing section, same as the landing page
 */

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTiles />
      <AboutStory />
      <FinalCTA />
    </>
  );
}

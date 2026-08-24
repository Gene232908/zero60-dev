import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { ServicesHero } from '@/components/sections/ServicesHero';
import { ServicesBento } from '@/components/sections/ServicesBento';
import { EventIndex } from '@/components/sections/EventIndex';
import { FinalCTA } from '@/components/sections/FinalCTA';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.services);

/**
 * Services — Milestone 2, Developer 1 (MEDIUM).
 *
 * Productions mode. All eight service lines, with the client's own descriptions,
 * as an animated bento — varied tile sizes rather than eight equal cards.
 *
 * EventIndex reappears here from the landing page, and that is deliberate: the
 * bento answers "what can you do", the event index answers "what is that like
 * for my kind of event". The two questions are different and the client's own
 * site separates them the same way.
 *
 * NOTE ON SCOPE: Task Division Rev 2 p.3 lists this page's contents as
 * "weddings, corporate events, event program support, music & entertainment,
 * AV/production" — but plan.md §4 M2 assigns those five to the 063 Society page
 * and describes this one as a "bento-grid of the service lines". The two
 * documents disagree. This page follows plan.md and uses the eight service
 * lines the client actually publishes; the five categories are on /society.
 * Flagged in BLOCKERS.md for management to confirm.
 */

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesBento />
      <EventIndex />
      <FinalCTA />
    </>
  );
}

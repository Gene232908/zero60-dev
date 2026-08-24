import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';

import { Hero } from '@/components/sections/Hero';
import { ServiceTicker } from '@/components/sections/ServiceTicker';
import { Manifesto } from '@/components/sections/Manifesto';
import { DualBrandSplit } from '@/components/sections/DualBrandSplit';
import { EventIndex } from '@/components/sections/EventIndex';
import { ServicesLedger } from '@/components/sections/ServicesLedger';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { CTABand } from '@/components/sections/CTABand';
import { TestimonialsTeaser } from '@/components/sections/TestimonialsTeaser';

/** SEO — Milestone 4, Developer 2. Copy lives in lib/seo/pages.ts. */
export const metadata: Metadata = pageMetadata(PAGE_SEO.home);

/**
 * Landing page — Milestone 1, Developer 1.
 *
 * Composition order is chosen for rhythm, not convenience (design brief §3):
 * every section changes the shape of the page rather than repeating
 * image → title → paragraph → button.
 *
 *   Hero            opening composition, oversized type, asymmetric
 *   ServiceTicker   dense full-bleed seam
 *   Manifesto       near-empty, one huge statement
 *   DualBrandSplit  the two moods side by side — the signature section
 *   EventIndex      structured editorial list, imagery on hover
 *   ServicesLedger  sticky heading + dense rows, closing full-bleed visual
 *   FinalCTA        the climax
 *
 * All copy is the client's own, transcribed from the live site into
 * content/site.ts. Imagery is still labelled placeholder (BLOCKER B2).
 *
 * ---------------------------------------------------------------------------
 * Milestone 1 · Developer 2 (Task Division Rev 2, p.2)
 *
 * The lower landing sections and the scroll choreography that carries them are
 * Developer 2's, composed from components/motion rather than a second animation
 * approach:
 *
 *   ServicesPreview  what we do — full-bleed service rail, then editorial rows
 *   AboutPreview     who we are — layered parallax collage against the real copy
 *   CTABand          the mid-page conversion band, in Society mode
 *   TestimonialsTeaser  the lead testimonial, routing on to /portfolio (M2)
 *
 * They are interleaved rather than appended: each one lands between two of
 * Developer 1's sections so the page alternates dense → open → dense all the way
 * down, and the reader meets a next step (CTABand) before the closing climax.
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceTicker />
      <Manifesto />
      <ServicesPreview />
      <DualBrandSplit />
      <AboutPreview />
      <EventIndex />
      <CTABand />
      <TestimonialsTeaser />
      <ServicesLedger />
      <FinalCTA />
    </>
  );
}

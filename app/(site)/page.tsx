import { Hero } from '@/components/sections/Hero';
import { ServiceTicker } from '@/components/sections/ServiceTicker';
import { Manifesto } from '@/components/sections/Manifesto';
import { DualBrandSplit } from '@/components/sections/DualBrandSplit';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { CapabilitiesLedger } from '@/components/sections/CapabilitiesLedger';
import { FinalCTA } from '@/components/sections/FinalCTA';

/**
 * Landing page — Milestone 1, Developer 1.
 *
 * Composition order is chosen for rhythm, not convenience (design brief §3):
 * every section changes the shape of the page rather than repeating
 * image → title → paragraph → button.
 *
 *   Hero                opening composition, oversized type, asymmetric
 *   ServiceTicker       dense full-bleed seam
 *   Manifesto           near-empty, one huge statement
 *   DualBrandSplit      the two moods side by side — the signature section
 *   WorkIndex           structured editorial list, imagery on hover
 *   CapabilitiesLedger  sticky heading + dense rows, closing full-bleed visual
 *   FinalCTA            the climax
 *
 * The lower landing sections (services preview, about preview, CTA block,
 * footer content) and the composed landing scroll choreography are Developer 2's
 * Milestone 1 tasks — they compose from components/motion, not a second
 * animation approach (Task Division Rev 2, p.2).
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceTicker />
      <Manifesto />
      <DualBrandSplit />
      <WorkIndex />
      <CapabilitiesLedger />
      <FinalCTA />
    </>
  );
}

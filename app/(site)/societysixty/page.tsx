import { SocietySixtyHero } from '@/components/societysixty/SocietySixtyHero';
import { SocietySixtyIntro } from '@/components/societysixty/SocietySixtyIntro';

/**
 * /societysixty — a genuinely new page, independent of /society.
 *
 * Scoped to exactly what the client supplied: the 063 Society flyer (Hero)
 * and the caption description (Intro/"063 Society meaning"). No marquee,
 * gallery, stats, people, or FAQ — nothing beyond the two real sources.
 *
 * Navbar and Footer are inherited from app/(site)/layout.tsx — nothing here
 * duplicates site chrome.
 */
export default function SocietySixtyPage() {
  return (
    <>
      <SocietySixtyHero />
      <SocietySixtyIntro />
    </>
  );
}

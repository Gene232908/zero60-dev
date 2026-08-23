import { BrandProvider } from '@/components/layout/BrandProvider';

/**
 * 063 Society runs the whole route in elegant mode.
 *
 * Setting data-brand="society" here re-maps every token beneath it — paper
 * ground, high-contrast serif display, thin lime hairlines, motion scaled down —
 * without a single Society-specific component. The Navbar, Footer and every
 * motion primitive inside simply inherit the new mood.
 *
 * Task Division Rev 2, p.6: "Use the correct data-brand mode per page —
 * society (elegant) for the 063 Society page, productions elsewhere."
 *
 * The full Society page build is Developer 1's Milestone 2 HARD task.
 */

export default function SocietyLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider brand="society" className="min-h-screen">
      {children}
    </BrandProvider>
  );
}

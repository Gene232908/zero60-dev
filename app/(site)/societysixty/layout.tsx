import type { Metadata } from 'next';
import { BrandProvider } from '@/components/layout/BrandProvider';

/**
 * SOCIETYSIXTY runs in the site's elegant `data-brand="society"` mode — paper
 * ground, serif display, restrained motion — the same token set /society uses,
 * kept independent as its own route per the build spec (§0.1, §1).
 */
export const metadata: Metadata = {
  title: 'SOCIETYSIXTY — ZERO-SIXTY-THREE',
  description:
    'Curated event production for weddings, brands, and private occasions — SocietySixty by ZeroSixtyThree.',
  alternates: { canonical: '/societysixty' },
};

export default function SocietySixtyLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider
      brand="society"
      className="min-h-screen"
      style={{ '--bg': '#D7CEBD', '--bg-raised': '#E2DACB' } as React.CSSProperties}
    >
      {children}
    </BrandProvider>
  );
}

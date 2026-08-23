import type { Metadata } from 'next';
import './globals.css';
import { bodyFont, displayFont, serifFont } from '@/lib/fonts';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor, NoiseOverlay } from '@/components/motion';

/**
 * Root layout.
 *
 * `data-brand="productions"` is the site-wide default mood; any route or section
 * overrides it with BrandProvider (063 Society runs in elegant mode).
 *
 * The three font variables are attached here so every brand map in tokens.css
 * can resolve --display-family regardless of which mode is active.
 *
 * NOTE: full SEO — page titles/descriptions, sitemap, robots, page-speed — is
 * Developer 2's Milestone 4 task (Task Division Rev 2, p.5). The minimal title
 * below exists only so the document is valid; it is not the SEO pass.
 */

export const metadata: Metadata = {
  title: 'ZeroSixtyThree',
  description: 'PLACEHOLDER — site description pending client copy (see BLOCKERS.md).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-brand="productions"
      className={`${displayFont.variable} ${serifFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Lenis — self-disables under prefers-reduced-motion. */}
        <SmoothScroll />

        {children}

        {/* Decoration only: both remove themselves on touch / reduced motion. */}
        <NoiseOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}

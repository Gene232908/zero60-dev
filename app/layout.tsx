import type { Metadata } from 'next';
import './globals.css';
import { SITE_NAME, SITE_URL, TITLE_SUFFIX } from '@/lib/seo/metadata';
import { PAGE_SEO } from '@/lib/seo/pages';
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
 * SEO (Milestone 4, Developer 2): this layout carries only what is genuinely
 * site-wide — metadataBase, the title template, and the shared OpenGraph
 * defaults. Each page supplies its own title, description and canonical through
 * lib/seo, so no two pages can end up sharing them.
 *
 * `metadataBase` must be absolute or Next cannot resolve canonical and
 * OpenGraph URLs. It reads NEXT_PUBLIC_SITE_URL and falls back to the client's
 * confirmed domain — never to localhost, which would ship broken absolute URLs.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_SUFFIX,
    /** Page titles arrive pre-composed from lib/seo, so this passes them through. */
    template: '%s',
  },
  description: PAGE_SEO.home.description,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: TITLE_SUFFIX,
    description: PAGE_SEO.home.description,
    url: SITE_URL,
    locale: 'en_AE',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
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

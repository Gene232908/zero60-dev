import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminGuard } from './_components/AdminGuard';

/**
 * Admin shell — Milestone 3, Developer 2.
 *
 * Task Division Rev 2, p.4: "the secure admin login and the separate admin link
 * that is not shown on the public website".
 *
 * SEPARATE AND UNLINKED. /admin is deliberately absent from content/nav.ts, the
 * Navbar, the Footer and every public page — the gate fails the build if a link
 * to it ever appears in public code. Management reaches it by typing the URL.
 *
 * NOINDEX. Being unlinked is not enough on its own: a URL that leaks once can be
 * crawled forever. The robots metadata below keeps it out of search results, and
 * Milestone 4 adds the matching `Disallow: /admin` to robots.txt and excludes it
 * from the sitemap.
 *
 * The whole subtree sits outside the (site) route group, so it inherits none of
 * the public chrome — no Navbar, no Footer, no page transitions.
 */

export const metadata: Metadata = {
  title: '063 Admin',
  description: 'Private administration area for ZeroSixtyThree bookings.',
  robots: { index: false, follow: false, nocache: true },
};

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/bookings', label: 'Records' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-fg" data-brand="productions">
      <header className="border-b border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-[var(--space-sm)] py-[var(--space-sm)]">
          <Link href="/admin" className="display text-[clamp(1rem,2vw,1.35rem)]">
            063 <span className="text-accent">ADMIN</span>
          </Link>
          <nav aria-label="Admin sections" className="flex gap-[var(--space-md)]">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="eyebrow transition-colors duration-[var(--dur-micro)] hover:text-accent"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}

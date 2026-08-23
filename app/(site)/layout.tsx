import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/motion';

/**
 * Public site chrome — shared by all seven routes.
 *
 * Navbar and Footer read their links from content/nav.ts, so the six
 * destinations stay in sync everywhere. PageTransition wipes between routes so
 * splitting the old long-scroll into pages still feels like one world.
 */

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <Navbar />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}

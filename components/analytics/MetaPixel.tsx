'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, trackPixelPageView } from '@/lib/analytics/meta-pixel';

/**
 * Mounts the Meta Pixel and keeps PageView accurate across client-side
 * navigation — Developer 1, Milestone 4 (Task Division Rev 2 p.5).
 *
 * Why the manual PageView: the App Router navigates without a document load, so
 * the snippet's own initial PageView is the ONLY one Meta would ever see. Every
 * route change after that has to be reported by hand or the whole funnel looks
 * like a one-page site.
 *
 * `usePathname` alone (not `useSearchParams`) is deliberate — useSearchParams
 * forces every page that renders this into client-side bailout, and query
 * strings are not distinct pages on this site.
 *
 * ⚠️ BLOCKER B15: renders nothing at all until NEXT_PUBLIC_META_PIXEL_ID is set.
 * Nothing is loaded, no requests to Meta, no console noise.
 *
 * There is deliberately no <noscript> beacon, though Meta's copy-paste snippet
 * ships one. A visitor without JavaScript cannot use the booking form (it
 * submits via fetch), so they can never become a lead — the beacon would be an
 * unconditional third-party request that could never record a conversion.
 */
export function MetaPixel() {
  const pathname = usePathname();

  /**
   * The snippet fires PageView itself on init. Skipping the first effect run
   * stops the landing page being counted twice.
   */
  const initialised = useRef(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    trackPixelPageView();
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        // Meta's standard loader snippet. `fbq` queues calls until the library
        // lands, so init/track are safe to call on the next line.
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(META_PIXEL_ID)});
fbq('track', 'PageView');`,
        }}
      />
    </>
  );
}

export default MetaPixel;

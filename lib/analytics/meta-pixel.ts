/**
 * Meta Pixel — Developer 1, Milestone 4 MEDIUM
 * ("Set up the Meta Pixel and confirm that page-view and form-submit events are
 * recorded", Task Division Rev 2 p.5).
 *
 * This is Marco's lead tracking, so the two events that matter are:
 *   PageView  — fired on first load and on every client-side route change
 *   Lead      — fired when an inquiry is actually accepted by the server
 *
 * ⚠️ BLOCKER B15: the Pixel ID needs Meta Business access, which the client has
 * not granted yet. Everything here is therefore env-driven and inert until
 * NEXT_PUBLIC_META_PIXEL_ID is set — exactly like the Milestone 3 flow. No code
 * change is needed when the ID arrives; set the Vercel env var and it starts
 * reporting.
 *
 * PRIVACY: never pass customer details to Meta. The Lead event carries which
 * brand the enquiry came from and nothing else — no name, email, phone, or
 * location. The customer's data belongs in Firestore, not in an ad platform.
 */

/** Meta's global queue function, injected by the pixel snippet. */
type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] };

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/**
 * The configured Pixel ID, or null when unset.
 *
 * Read via the full `process.env.NEXT_PUBLIC_*` expression rather than a
 * destructure — Next inlines these at build time by literal match.
 */
export const META_PIXEL_ID: string | null =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;

/** True when the pixel is configured. Nothing renders or fires without it. */
export const isPixelEnabled = (): boolean => META_PIXEL_ID !== null;

/**
 * Fire a Meta standard event.
 *
 * Safe to call anywhere: no-ops during SSR, when the pixel is unconfigured, and
 * when the script is blocked by an ad blocker. Analytics must never be able to
 * break a booking.
 */
export function trackPixelEvent(event: string, params?: Record<string, string | number>): void {
  if (typeof window === 'undefined' || !isPixelEnabled()) return;
  try {
    window.fbq?.('track', event, params);
  } catch {
    // A tracking failure is not worth surfacing to a customer mid-enquiry.
  }
}

/** Page view — used by MetaPixel on route changes. */
export const trackPixelPageView = (): void => trackPixelEvent('PageView');

/**
 * Form submit — a completed enquiry. `source` is the brand the enquiry came
 * from ('productions' | 'society'), which is the only field Meta receives.
 */
export const trackInquirySubmitted = (source: string): void =>
  trackPixelEvent('Lead', { content_category: source });

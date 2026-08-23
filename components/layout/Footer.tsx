import Image from 'next/image';
import Link from 'next/link';
import { NAV_ITEMS } from '@/content/nav';
import { BRAND, CONTACT } from '@/content/site';
import { LOGO } from '@/content/media';
import { FOOTER_CREDIT_PLACEHOLDER } from '@/content/placeholders';
import { Marquee } from '@/components/motion';

/**
 * Footer — practical information under the closing statement.
 *
 * The large "visual climax" CTA is its own section (FinalCTA); by the time the
 * user reaches this block they want facts, so this stays quiet and structured.
 *
 * Contact details are the client's own, from the live site. Social links are
 * still missing: the live site shows Facebook and Instagram icons but exposes no
 * URLs, so they render as inert labels rather than invented destinations.
 *
 * Includes the "Developed by" credit banner, a contracted Developer 1
 * deliverable for Milestone 1 (Task Division Rev 2, p.2). BLOCKER B3: agency
 * name, logo and URL unconfirmed, so it renders as an inert labelled slot.
 */

export function Footer() {
  const credit = FOOTER_CREDIT_PLACEHOLDER;

  return (
    <footer className="border-t border-line bg-bg text-fg">
      {/* Brand ticker doubles as the seam between the CTA and the practical block. */}
      <Marquee duration={44} className="border-b border-line py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="display mx-6 text-[0.8rem] tracking-[0.28em] text-fg-faint">
            ZERO-SIXTY-THREE <span className="text-accent">&#9670;</span> 063 SOCIETY{' '}
            <span className="text-accent">&#9670;</span>
          </span>
        ))}
      </Marquee>

      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Image
            src={LOGO.markLarge}
            alt={LOGO.alt}
            width={512}
            height={512}
            className="mb-7 h-20 w-20"
          />
          <p className="display text-[clamp(1.75rem,4vw,2.75rem)]">
            {BRAND.wordmark.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="eyebrow mt-4">{BRAND.suffix}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow mb-5">Index</h2>
          <ul className="space-y-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-fg-muted transition-colors duration-[var(--dur-micro)] hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow mb-5">Contact</h2>
          <ul className="space-y-2.5 text-sm text-fg-muted">
            <li>
              <a href={CONTACT.phoneHref} className="transition-colors hover:text-accent">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={CONTACT.emailHref} className="transition-colors hover:text-accent">
                {CONTACT.email}
              </a>
            </li>
            <li>{CONTACT.website}</li>
            <li className="pt-1 text-fg-faint">{CONTACT.region}</li>
          </ul>

          <h2 className="eyebrow mb-4 mt-8">Social</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
            {CONTACT.socials.map((s) => (
              <li key={s.label}>
                {/* No invented URLs — inert until the client supplies the links. */}
                {s.href ? (
                  <a href={s.href} className="transition-colors hover:text-accent">
                    {s.label}
                  </a>
                ) : (
                  <span title="PLACEHOLDER — profile URL not yet supplied by client">
                    {s.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- "Developed by" credit banner (Developer 1, M1 deliverable) ---- */}
      <div className="border-t border-line">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-faint">
            &copy; {new Date().getFullYear()} {BRAND.full}. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-xs text-fg-faint">
            <span>{credit.prefix}</span>
            {/* TODO / BLOCKER B3: swap for the agency logo + live link once confirmed. */}
            {credit.href ? (
              <a
                href={credit.href}
                target="_blank"
                rel="noreferrer noopener"
                className="border-b border-accent/40 text-fg transition-colors hover:text-accent"
              >
                {credit.agencyName}
              </a>
            ) : (
              <span
                className="border-b border-dashed border-accent/40 text-fg-muted"
                title="PLACEHOLDER — agency logo and destination URL awaiting confirmation (BLOCKER B3)"
              >
                {credit.agencyName}
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

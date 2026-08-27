'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { NAV_ITEMS } from '@/content/nav';
import { logoForBrand } from '@/content/media';
import { DUR, EASE } from '@/components/motion/motion-tokens';
import { useReducedMotionSafe } from '@/components/motion/use-reduced-motion';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils/cn';

/**
 * Navbar — deliberately lightweight (design brief §6).
 *
 * No solid bar, no rounded container, no shadow. Small type, hairline rule, and
 * it gets out of the way: scrolling down retracts it, scrolling up brings it
 * back. Colours come from the brand tokens, so the same component reads rugged
 * on Productions pages and elegant inside 063 Society.
 *
 * Reduced motion: the bar simply stays put and stays visible.
 *
 * BRAND MODE. The bar is `fixed`, so it lives outside the route's
 * BrandProvider and cannot inherit the mood of the page scrolling under it.
 * On 063 Society that meant white-on-paper: an invisible header. It therefore
 * re-declares `data-brand` itself, read from the destination's own `brand`
 * field in content/nav.ts — the same single source the links come from, so a
 * page added there brings its mood with it and this never needs touching.
 */

const MENU_ID = 'primary-mobile-menu';

/**
 * The mood of the route currently on screen.
 * Longest matching href wins, so a nested path resolves to its section rather
 * than falling back to "/".
 *
 * `/societysixty` runs in society mode too, but is deliberately not added to
 * NAV_ITEMS (no visible nav link yet — build spec §8 leaves that decision to
 * the client), so it is matched here directly instead.
 */
function brandForPath(pathname: string): 'productions' | 'society' {
  if (pathname === '/societysixty' || pathname.startsWith('/societysixty/')) {
    return 'society';
  }
  const match = NAV_ITEMS.filter((item) => item.href !== '/')
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.brand ?? 'productions';
}

export function Navbar() {
  const pathname = usePathname();
  const brand = brandForPath(pathname);
  const isSociety = brand === 'society';
  const isSocietySixty = pathname === '/societysixty' || pathname.startsWith('/societysixty/');
  const reduced = useReducedMotionSafe();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (reduced || menuOpen) return;
    setHidden(latest > previous && latest > 160);
  });

  return (
    <>
      <motion.header
        data-brand={brand}
        className="fixed inset-x-0 top-0 z-50 text-fg"
        initial={false}
        animate={{ y: hidden ? '-101%' : '0%' }}
        transition={{ duration: DUR.fast, ease: EASE.out }}
      >
        <div
          className={cn(
            'relative transition-colors duration-[var(--dur-base)]',
            // SocietySixty's hero sits directly under the bar with no dark
            // scrim, so the bar carries its own frosted-glass surface the
            // whole time rather than only after scrolling.
            isSocietySixty
              ? 'border-b border-white/25 bg-white/25 backdrop-blur-md backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-[#E7DDCB]/90'
              : scrolled && 'bg-bg/80 backdrop-blur-sm',
          )}
        >
          <nav
            aria-label="Primary"
            className="shell flex items-center justify-between gap-6 py-5 md:py-6"
          >
            {/* Brand mark — small by design; the hero carries the brand voice. */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label="Zero-Sixty-Three Productions — home"
            >
              {/* The white-and-lime mark vanishes on Society's paper ground, so
                  each mood loads the mark that stays legible on it. */}
              <Image
                src={logoForBrand(brand)}
                alt=""
                width={160}
                height={160}
                priority
                className="h-8 w-8 shrink-0 md:h-9 md:w-9"
              />
              <span
                className={cn(
                  'display hidden text-[0.9rem] leading-none tracking-[-0.02em] sm:inline',
                  isSocietySixty ? 'text-[#1A1714]' : 'text-fg',
                )}
              >
                ZERO-SIXTY-THREE
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                // Disabled items (currently just "063 Society") render as inert
                // text — visible in the nav, but not a link, not focusable, and
                // not marked current — per client direction: keep the label on
                // screen without it being reachable yet.
                if (item.disabled) {
                  return (
                    <li key={item.href}>
                      <span
                        aria-disabled="true"
                        className="inline-block cursor-default select-none py-1 text-[0.68rem] uppercase tracking-[0.18em] text-fg-faint"
                      >
                        {item.label}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative inline-block py-1 text-[0.68rem] uppercase tracking-[0.18em]',
                        'transition-colors duration-[var(--dur-micro)]',
                        isSocietySixty
                          ? // Real flyer palette, weighted for contrast against the
                            // frosted glass bar: dark ink at rest, dusty-rose on
                            // the active page and on hover — energetic but not loud.
                            cn(
                              'font-bold',
                              active ? 'text-[#B18A83]' : 'text-[#1A1714] hover:text-[#B18A83]',
                            )
                          : cn(
                              // Lime on the black Productions ground is the signature
                              // accent; on Society's paper it is barely legible, so the
                              // current page is marked by weight and near-black instead.
                              active && isSociety && 'font-bold text-fg',
                              active && !isSociety && 'font-medium text-accent',
                              !active && 'font-medium text-fg-muted hover:text-fg',
                            ),
                      )}
                    >
                      {item.label}
                      {/* Underline wipes in from the left — restrained hover (§17). */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-px w-full origin-left',
                          isSocietySixty ? 'bg-[#B18A83]' : isSociety ? 'bg-fg' : 'bg-accent',
                          'scale-x-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                          'group-hover:scale-x-100',
                          active && 'scale-x-100',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              className="group flex items-center gap-3 lg:hidden"
            >
              <span
                className={cn(
                  'text-[0.68rem] font-medium uppercase tracking-[0.18em]',
                  isSocietySixty ? 'text-[#1A1714]' : 'text-fg-muted',
                )}
              >
                {menuOpen ? 'Close' : 'Menu'}
              </span>
              <span aria-hidden="true" className="relative flex h-3 w-6 flex-col justify-between">
                <span
                  className={cn(
                    'block h-px w-full transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                    isSocietySixty ? 'bg-[#1A1714]' : 'bg-fg',
                    menuOpen && 'translate-y-[5.5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'block h-px w-full transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                    isSocietySixty ? 'bg-[#1A1714]' : 'bg-fg',
                    menuOpen && '-translate-y-[5.5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </nav>

          <hr className="hairline" />

          {/* Tertiary-weight scroll progress hairline. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
            style={{ scaleX: progress }}
          />
        </div>
      </motion.header>

      <MobileMenu id={MENU_ID} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Navbar;

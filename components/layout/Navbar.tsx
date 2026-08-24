'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { NAV_ITEMS } from '@/content/nav';
import { LOGO } from '@/content/media';
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
 */
function brandForPath(pathname: string): 'productions' | 'society' {
  const match = NAV_ITEMS.filter((item) => item.href !== '/')
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.brand ?? 'productions';
}

export function Navbar() {
  const pathname = usePathname();
  const brand = brandForPath(pathname);
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
            scrolled && 'bg-bg/80 backdrop-blur-sm',
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
              <Image
                src={LOGO.mark}
                alt=""
                width={160}
                height={160}
                priority
                className="h-8 w-8 shrink-0 md:h-9 md:w-9"
              />
              <span className="display hidden text-[0.9rem] leading-none tracking-[-0.02em] text-fg sm:inline">
                ZERO-SIXTY-THREE
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative inline-block py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em]',
                        'transition-colors duration-[var(--dur-micro)]',
                        active ? 'text-accent' : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      {item.label}
                      {/* Underline wipes in from the left — restrained hover (§17). */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent',
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
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-fg-muted">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
              <span aria-hidden="true" className="relative flex h-3 w-6 flex-col justify-between">
                <span
                  className={cn(
                    'block h-px w-full bg-fg transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                    menuOpen && 'translate-y-[5.5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'block h-px w-full bg-fg transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]',
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

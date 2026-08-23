'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '@/content/nav';
import { CLIP, DUR, EASE, STAGGER } from '@/components/motion/motion-tokens';
import { useReducedMotionSafe } from '@/components/motion/use-reduced-motion';
import { cn } from '@/lib/utils/cn';

/**
 * MobileMenu — full-screen editorial menu (Task Division Rev 2, M1 Developer 1).
 *
 * Not a dropdown: the menu takes the whole viewport and restates the site as a
 * numbered index, which is the same typographic language the landing page uses.
 * Links wipe in on a stagger from behind a mask.
 *
 * Accessibility: it is a labelled dialog, Escape closes it, background scroll is
 * locked while open, focus moves to the first link on open and returns to the
 * trigger on close. Reduced motion: it appears and disappears with no travel.
 */

export interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ id, open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Escape to close.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock background scroll while the menu owns the viewport.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus in on open, hand it back on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const first = panelRef.current?.querySelector<HTMLElement>('a[href]');
      first?.focus();
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  const duration = reduced ? 0.01 : DUR.base;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col bg-bg lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: CLIP.hiddenDown }}
          animate={reduced ? { opacity: 1 } : { clipPath: CLIP.visible }}
          exit={reduced ? { opacity: 0 } : { clipPath: CLIP.hiddenDown }}
          transition={{ duration, ease: EASE.entrance }}
        >
          <div className="shell flex flex-1 flex-col justify-center pb-16 pt-24">
            <ul>
              {NAV_ITEMS.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href} className="border-b border-line">
                    <span className="block overflow-hidden">
                      <motion.span
                        className="block"
                        initial={reduced ? { opacity: 0 } : { y: '110%' }}
                        animate={reduced ? { opacity: 1 } : { y: '0%' }}
                        transition={{
                          duration: reduced ? 0.01 : DUR.slow,
                          ease: EASE.entrance,
                          delay: reduced ? 0 : 0.12 + i * STAGGER.tight,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          aria-current={active ? 'page' : undefined}
                          className="flex items-baseline gap-4 py-4"
                        >
                          <span className="eyebrow w-8 shrink-0">{item.index}</span>
                          <span
                            className={cn(
                              'display text-[clamp(2rem,10vw,3.5rem)]',
                              active ? 'text-accent' : 'text-fg',
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </motion.span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <motion.p
              className="eyebrow mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.base, delay: reduced ? 0 : 0.5 }}
            >
              PLACEHOLDER — contact line
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileMenu;

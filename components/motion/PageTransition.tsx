'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { CLIP, DUR, EASE } from './motion-tokens';

/**
 * PageTransition — continuity between routes (design brief §12).
 *
 * Breaking the old long-scroll into six pages only feels like one world if the
 * seams are choreographed. Each route enters with a short mask wipe rather than
 * a hard cut, keyed on the pathname.
 *
 * Kept deliberately brief (~0.5s) so navigation never feels gated behind an
 * animation. Reduced motion: content is handed through untouched.
 */

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, clipPath: CLIP.hiddenUp }}
      animate={{ opacity: 1, clipPath: CLIP.visible }}
      transition={{ duration: DUR.base, ease: EASE.entrance }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

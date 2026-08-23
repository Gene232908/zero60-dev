import { Archivo, Fraunces, Inter } from 'next/font/google';

/**
 * Typography — docs/plan.md §2.3
 *
 * Three faces, all self-hosted through next/font so Developer 2 never fights
 * FOUT or CLS. Each exposes a CSS variable that styles/tokens.css maps onto
 * --display-family per brand mode.
 *
 *   --font-display  Productions voice: heavy grotesque, variable weight so
 *                   KineticHeading can animate weight rather than size.
 *   --font-serif    Society voice: high-contrast serif for elegance.
 *   --font-body     Shared reading face across both moods.
 */

export const displayFont = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['wdth'],
});

export const serifFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const fontVariables = [displayFont.variable, serifFont.variable, bodyFont.variable].join(' ');

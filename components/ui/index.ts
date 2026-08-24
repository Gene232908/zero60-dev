/**
 * Shared UI atoms — Milestone 1, Developer 2 (Task Division Rev 2, p.2).
 *
 * Everything here is built on Developer 1's tokens (styles/tokens.css) and the
 * responsive layer (styles/responsive.css). Nothing in this folder hardcodes a
 * colour, a font or a duration, which is what lets a single `data-brand` switch
 * restyle the entire site.
 *
 *   Container       editorial shell (Developer 1)
 *   Section         vertical rhythm + per-section brand mood
 *   Grid / Col      responsive 12-column editorial grid (4 → 8 → 12)
 *   Button          the plain control atom, three variants, link or button
 *   SectionHeading  the standard section introduction, revealed via Reveal
 *   Divider         hairline seam, optionally titled
 *
 * Motion is always composed from components/motion — this folder never imports
 * framer-motion or gsap directly (Task Division Rev 2: no second animation
 * approach).
 */

export { Container, type ContainerProps } from './Container';
export { Section, type SectionProps } from './Section';
export { Grid, Col, type GridProps, type ColProps } from './Grid';
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { SectionHeading, type SectionHeadingProps } from './SectionHeading';
export { Divider, type DividerProps } from './Divider';

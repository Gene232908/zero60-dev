/**
 * Shared motion library — docs/plan.md §2.4.
 *
 * Developer 2 composes page choreography FROM these primitives and does not
 * introduce a parallel animation approach (Task Division Rev 2, M1 + M2).
 * Every primitive honours prefers-reduced-motion internally, so composing them
 * is automatically accessible.
 *
 *   Reveal             standard scroll-entry (fade / rise / mask / clip, staggered)
 *   Marquee            seamless infinite ticker
 *   Parallax           restrained scroll-linked drift
 *   KineticHeading     oversized display type, masked word reveal + scroll drift
 *   MagneticButton     magnetic hover control (link or button)
 *   CustomCursor       context-label cursor, fine-pointer only
 *   StickerSpin        slow rotating badge
 *   NoiseOverlay       film grain, opacity driven by the brand token
 *   PageTransition     route-change mask wipe
 *   ImageHoverPreview  cursor-following preview for editorial lists
 *   StickySection      GSAP ScrollTrigger pin (GSAP is dynamically imported)
 */

export { Reveal, type RevealProps, type RevealVariant, type MotionWeight } from './Reveal';
export { Marquee, type MarqueeProps } from './Marquee';
export { Parallax, type ParallaxProps } from './Parallax';
export { KineticHeading, type KineticHeadingProps, type KineticSize } from './KineticHeading';
export { MagneticButton, type MagneticButtonProps } from './MagneticButton';
export { CustomCursor } from './CustomCursor';
export { StickerSpin, type StickerSpinProps } from './StickerSpin';
export { NoiseOverlay, type NoiseOverlayProps } from './NoiseOverlay';
export { PageTransition } from './PageTransition';
export { ImageHoverPreview, type ImageHoverPreviewProps, type PreviewImage } from './ImageHoverPreview';
export { StickySection, type StickySectionProps } from './StickySection';

export { useReducedMotionSafe, useFinePointer, useMotionAllowed } from './use-reduced-motion';
export { loadGsap } from './gsap-loader';
export * from './motion-tokens';

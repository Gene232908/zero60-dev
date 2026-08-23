/**
 * GSAP is reserved for pinned / kinetic sequences only (docs/plan.md §2.4).
 *
 * It is NEVER imported statically anywhere else in the codebase — that would put
 * ~70kb of animation engine into the first load for every visitor, including the
 * ones who scroll past the pinned sections entirely. This loader is the single
 * dynamic-import chokepoint, and the acceptance gate (check D8) fails the build
 * if any other module imports gsap directly.
 *
 * The promise is memoised, so N components pinning at once still cost one chunk.
 */

type GsapBundle = {
  gsap: typeof import('gsap')['gsap'];
  ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger'];
};

let bundle: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('loadGsap() is client-only'));
  }
  if (!bundle) {
    bundle = (async () => {
      const [core, scrollTrigger] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      const gsap = core.gsap;
      const ScrollTrigger = scrollTrigger.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }
  return bundle;
}

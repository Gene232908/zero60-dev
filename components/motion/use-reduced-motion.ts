'use client';

import { useSyncExternalStore } from 'react';

/**
 * Reduced-motion policy — docs/plan.md §2.4 (non-negotiable for a heavy-motion site).
 *
 * Every animated primitive in components/motion consults this hook and degrades
 * to a clean, static, fully-legible state. Content and functionality are never
 * gated behind an animation (design brief §26).
 *
 * Implemented with useSyncExternalStore so the correct value is available on the
 * very first client render — a useEffect-based hook would let one frame of motion
 * escape before it corrected itself.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Server render assumes motion is allowed; the client corrects on first paint. */
function getServerSnapshot() {
  return false;
}

export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True when the device has a precise pointer (mouse/trackpad).
 * Custom cursor and magnetic hover are disabled on touch (design brief §18, §25).
 */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

function subscribePointer(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(FINE_POINTER);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getPointerSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(FINE_POINTER).matches;
}

export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribePointer, getPointerSnapshot, () => false);
}

/** Convenience: motion is only allowed when the user has not opted out. */
export function useMotionAllowed(): boolean {
  return !useReducedMotionSafe();
}

/* -----------------------------------------------------------------------------
   VIEWPORT WIDTH — for motion that is only worth its cost on a big screen.

   Same useSyncExternalStore shape as the two hooks above, and for the same
   reason: a useEffect-based version renders one frame with the wrong answer,
   which for an effect this hook is used to SWITCH OFF means paying the cost
   once on every mount before disabling it.

   One matchMedia object per distinct query, cached — Parallax calls this from
   every instance on the page, and building a fresh MediaQueryList per component
   per render is exactly the kind of quiet cost this hook exists to avoid.
   -------------------------------------------------------------------------- */
const mqlCache = new Map<string, MediaQueryList>();

function mediaQuery(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  let mql = mqlCache.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    mqlCache.set(query, mql);
  }
  return mql;
}

/**
 * True when the viewport is at least `min` wide.
 *
 * Server-renders false. That is the deliberate direction: the first paint
 * assumes the SMALL screen and therefore the cheap path, and a desktop client
 * corrects to the expensive one on the first commit. Guessing the other way
 * would run the heavy version briefly on every phone, which is the device that
 * can least afford it.
 */
export function useMinWidth(min: string): boolean {
  const query = `(min-width: ${min})`;
  return useSyncExternalStore(
    (onChange) => {
      const mql = mediaQuery(query);
      if (!mql) return () => {};
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => mediaQuery(query)?.matches ?? false,
    () => false,
  );
}

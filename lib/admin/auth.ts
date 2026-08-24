'use client';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { getFirebaseApp, isFirebaseClientConfigured } from '@/lib/firebase/client';

/**
 * Admin authentication.
 *
 * Milestone 3 · Developer 2 · Task Division Rev 2, p.4
 * ("the secure admin login and the separate admin link that is not shown on the
 *  public website").
 *
 * ADMIN IS A CUSTOM CLAIM, NOT AN EMAIL ALLOWLIST.
 * docs/HANDOFF-DEV2.md §6 is explicit: firestore.rules authorises on
 * `request.auth.token.admin == true`. Checking an email address in the UI would
 * be theatre — the rules would still reject every read, and anyone who signed up
 * would see an admin shell full of permission errors. So the claim is the single
 * source of authority here too, and the UI simply reflects what the rules will
 * actually allow.
 *
 * Minting the claim is a one-off server-side operation with the Admin SDK
 * (`setCustomUserClaims(uid, { admin: true })`), run once per admin account —
 * see docs/ADMIN-GUIDE.md. It cannot be done from the browser, which is the
 * point.
 *
 * The Firebase Admin SDK is never imported here: this module runs in the
 * browser, and the gate fails the build if server credentials reach client code.
 */

export type AdminAuthState =
  | { status: 'loading' }
  /** Firebase itself has not been configured yet — BLOCKER B10a/B10b. */
  | { status: 'unconfigured' }
  | { status: 'signed-out' }
  /** Signed in, but without the admin claim: authenticated, not authorised. */
  | { status: 'not-admin'; email: string | null }
  | { status: 'admin'; email: string | null; uid: string };

export function isAdminAuthAvailable(): boolean {
  return isFirebaseClientConfigured();
}

function auth(): Auth {
  return getAuth(getFirebaseApp());
}

/**
 * Subscribe to the admin session.
 *
 * `getIdTokenResult(true)` forces a refresh so a claim minted moments ago is
 * picked up without the user having to sign out and back in.
 */
export function watchAdminAuth(onChange: (state: AdminAuthState) => void): () => void {
  if (!isAdminAuthAvailable()) {
    onChange({ status: 'unconfigured' });
    return () => {};
  }

  onChange({ status: 'loading' });

  return onAuthStateChanged(auth(), async (user: User | null) => {
    if (!user) {
      onChange({ status: 'signed-out' });
      return;
    }
    try {
      const token = await user.getIdTokenResult(true);
      if (token.claims.admin === true) {
        onChange({ status: 'admin', email: user.email, uid: user.uid });
      } else {
        onChange({ status: 'not-admin', email: user.email });
      }
    } catch {
      onChange({ status: 'not-admin', email: user.email });
    }
  });
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (!isAdminAuthAvailable()) {
    throw new Error('Firebase is not configured yet — see BLOCKERS.md B10a.');
  }
  await signInWithEmailAndPassword(auth(), email, password);
}

export async function signOutAdmin(): Promise<void> {
  if (!isAdminAuthAvailable()) return;
  await signOut(auth());
}

/** Turns a Firebase auth error code into something a human can act on. */
export function describeAuthError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/user-disabled':
      return 'That account has been disabled.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Could not reach Firebase. Check the connection.';
    default:
      return 'Sign-in failed. Please try again.';
  }
}

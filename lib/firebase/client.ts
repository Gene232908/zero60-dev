import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase client (browser) initialisation.
 *
 * Every value comes from NEXT_PUBLIC_* environment variables — never a literal.
 * These particular values are not secret (a Firebase web config is designed to
 * ship to the browser; it identifies the project, it does not authorise access).
 * What actually protects the data is firestore.rules, not the obscurity of this
 * config. Even so, they stay in env so the same build can point at a sandbox or
 * at production without a code change.
 *
 * The public site does not currently read from Firestore at all — inquiries are
 * written server-side through /api/inquiry so we can validate before touching
 * the database. This module exists for Developer 2's admin sign-in and for any
 * future client-side read, both of which the security rules gate.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when the project has actually been configured (see BLOCKERS.md B10a). */
export function isFirebaseClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error(
      'Firebase client is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables — see .env.example.',
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

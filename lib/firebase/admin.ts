import 'server-only';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin (server) initialisation.
 *
 * `import 'server-only'` is the important line: it makes the build fail loudly
 * if this module is ever pulled into a client component. A service-account key
 * reaching the browser would hand a visitor full read/write on the database,
 * bypassing every security rule.
 *
 * The admin SDK deliberately bypasses firestore.rules — that is why the API
 * route validates with the shared Zod schema *before* writing. The rules protect
 * direct client access; the schema protects the server path. Both are needed.
 *
 * ⚠️ BLOCKER B10b: the service-account credentials have not been supplied. Until
 * they are, isAdminConfigured() returns false and /api/inquiry answers 503 with
 * a clear message rather than failing in some confusing way.
 */

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
// Vercel stores multi-line values with literal \n, so unescape before use.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

export function isAdminConfigured(): boolean {
  return Boolean(projectId && clientEmail && privateKey);
}

function getAdminApp(): App {
  if (!isAdminConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL ' +
        'and FIREBASE_ADMIN_PRIVATE_KEY — see .env.example.',
    );
  }
  if (getApps().length) return getApp();
  return initializeApp({
    credential: cert({
      projectId: projectId as string,
      clientEmail: clientEmail as string,
      privateKey: privateKey as string,
    }),
  });
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

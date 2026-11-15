/**
 * Grant the Realtime Database message-admin claim to an explicit UID allowlist.
 *
 * Required environment variables:
 *   FIREBASE_SERVICE_ACCOUNT_JSON - Firebase service-account JSON
 *   FIREBASE_ADMIN_UIDS           - comma-separated Firebase Auth UIDs
 */

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const environment = globalThis.process?.env ?? {};

const serviceAccountJson = environment.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
const adminUids = (environment.FIREBASE_ADMIN_UIDS ?? '')
  .split(',')
  .map((uid) => uid.trim())
  .filter(Boolean);

if (!serviceAccountJson) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is required.');
}

if (adminUids.length === 0) {
  throw new Error('FIREBASE_ADMIN_UIDS must contain at least one Firebase Auth UID.');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON.');
}

const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);

for (const uid of adminUids) {
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, {
    ...(user.customClaims ?? {}),
    admin: true,
  });
}

console.log(`Ensured admin claim for ${adminUids.length} configured user(s).`);

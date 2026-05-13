/**
 * Shared Firestore instance — initialised once, reused everywhere.
 */
import { getFirestore } from 'firebase/firestore';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getOptionalEnvValue } from '../utils/env';

export function getFirebaseApp() {
  const firebaseConfig = {
    apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
  };
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}

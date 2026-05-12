import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getOptionalEnvValue } from '../../utils/env';

/** Generic messages — never expose raw Firebase error strings to the UI */
const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

function getFirebaseApp() {
  const firebaseConfig = {
    apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    databaseURL: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_DATABASE_URL),
    projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
  };
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Check admin status by reading from the Firebase Realtime Database
 * allowlist at /admins/<uid>. Set the value to `true` for each admin UID.
 */
async function checkAdminStatus(uid: string): Promise<boolean> {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const snapshot = await get(ref(db, `admins/${uid}`));
    return snapshot.exists() && snapshot.val() === true;
  } catch {
    return false;
  }
}

export function AdminAuth() {
  const { state, dispatch } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore auth session on mount — handles page refresh while still logged in
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const isAdminUser = await checkAdminStatus(user.uid);
          if (isAdminUser) {
            setCurrentUser(user);
            dispatch({ type: 'SET_ADMIN', payload: true });
          } else {
            // Signed in but not admin — sign them out silently
            await signOut(auth);
            setCurrentUser(null);
            dispatch({ type: 'SET_ADMIN', payload: false });
          }
        } else {
          setCurrentUser(null);
          dispatch({ type: 'SET_ADMIN', payload: false });
        }
      });
    } catch {
      // Firebase not configured — admin panel simply stays locked
    }
    return () => unsubscribe?.();
  }, [dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const result = await signInWithEmailAndPassword(auth, email, password);

      const isAdminUser = await checkAdminStatus(result.user.uid);

      if (isAdminUser) {
        setCurrentUser(result.user);
        dispatch({ type: 'SET_ADMIN', payload: true });
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Admin login successful!' });
      } else {
        await signOut(auth);
        setCurrentUser(null);
        dispatch({
          type: 'SET_ERROR',
          payload: {
            message: 'You do not have admin privileges.',
            type: 'error',
            timestamp: Date.now(),
          },
        });
      }

      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      const message = AUTH_ERRORS[code] ?? 'Login failed. Please check your credentials.';
      dispatch({
        type: 'SET_ERROR',
        payload: { message, type: 'error', timestamp: Date.now() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await signOut(auth);
      setCurrentUser(null);
      dispatch({ type: 'SET_ADMIN', payload: false });
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Logged out successfully' });
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: 'Logout failed. Please try again.',
          type: 'error',
          timestamp: Date.now(),
        },
      });
    }
  };

  if (state.isAdmin && currentUser) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm" noValidate>
      <div>
        <label
          htmlFor="admin-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors font-medium"
      >
        {isLoading ? 'Logging in…' : 'Admin Login'}
      </button>
    </form>
  );
}

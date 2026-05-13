import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseApp, getDb } from '../../services/firebase.firestore';

/** Generic messages — never expose raw Firebase error strings to the UI */
const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups and try again.',
  'auth/cancelled-popup-request': '',
};

/**
 * Check admin status via Firestore.
 * Collection: admins / Document ID: <uid> / Field: isAdmin: true
 *
 * To grant access, create the document in Firebase Console:
 *   Collection: admins
 *   Document ID: <your-uid>
 *   Field: isAdmin  (boolean) = true
 */
async function checkAdminStatus(uid: string): Promise<boolean> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists() && snap.data()?.isAdmin === true;
  } catch {
    return false;
  }
}

/** Shared post-login handler — checks admin status and updates app state */
async function handleAuthResult(
  user: User,
  auth: ReturnType<typeof getAuth>,
  setCurrentUser: (u: User | null) => void,
  dispatch: ReturnType<typeof useAppState>['dispatch']
): Promise<boolean> {
  const isAdminUser = await checkAdminStatus(user.uid);
  if (isAdminUser) {
    setCurrentUser(user);
    dispatch({ type: 'SET_ADMIN', payload: true });
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Admin login successful!' });
    return true;
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
    return false;
  }
}

export function AdminAuth() {
  const { state, dispatch } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  /** Email + password login */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthResult(result.user, auth, setCurrentUser, dispatch);
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      const message = AUTH_ERRORS[code] ?? 'Login failed. Please check your credentials.';
      if (message) {
        dispatch({
          type: 'SET_ERROR',
          payload: { message, type: 'error', timestamp: Date.now() },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Google OAuth login */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      await handleAuthResult(result.user, auth, setCurrentUser, dispatch);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      const message = AUTH_ERRORS[code] ?? 'Google sign-in failed. Please try again.';
      if (message) {
        dispatch({
          type: 'SET_ERROR',
          payload: { message, type: 'error', timestamp: Date.now() },
        });
      }
    } finally {
      setIsGoogleLoading(false);
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
        payload: { message: 'Logout failed. Please try again.', type: 'error', timestamp: Date.now() },
      });
    }
  };

  // Logged-in state — show user info + logout button
  if (state.isAdmin && currentUser) {
    return (
      <div className="flex items-center gap-3">
        {currentUser.photoURL && (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName ?? 'Admin'}
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentUser.displayName ?? currentUser.email}
        </span>
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
    <div className="space-y-4 max-w-sm">
      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors font-medium shadow-sm"
      >
        {isGoogleLoading ? (
          <span
            className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        {isGoogleLoading ? 'Signing in…' : 'Sign in with Google'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
        <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
      </div>

      {/* Email + Password */}
      <form onSubmit={handleEmailLogin} className="space-y-3" noValidate>
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          disabled={isLoading || isGoogleLoading || !email || !password}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors font-medium"
        >
          {isLoading ? 'Logging in…' : 'Login with Email'}
        </button>
      </form>
    </div>
  );
}

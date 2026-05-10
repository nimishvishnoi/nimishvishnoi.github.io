import { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getOptionalEnvValue } from '../../utils/env';

const getTimestamp = () => Date.now();

export function AdminAuth() {
  const { state, dispatch } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
        authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
        projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
        appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
      };

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      // Check if user is admin (you would fetch this from Firestore)
      const isAdminUser = await checkAdminStatus(result.user.uid);

      if (isAdminUser) {
        dispatch({ type: 'SET_ADMIN', payload: true });
        dispatch({
          type: 'SET_SUCCESS_MESSAGE',
          payload: 'Admin login successful!',
        });
      } else {
        await signOut(auth);
        setUser(null);
        dispatch({
          type: 'SET_ERROR',
          payload: {
            message: 'You do not have admin privileges',
            type: 'error',
            timestamp: getTimestamp(),
          },
        });
      }

      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      const err = error as Error;
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: err.message || 'Login failed. Please check your credentials.',
          type: 'error',
          timestamp: getTimestamp(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const app = getApps().length ? getApp() : initializeApp({});
      const auth = getAuth(app);
      await signOut(auth);
      setUser(null);
      dispatch({ type: 'SET_ADMIN', payload: false });
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAdminStatus = async (_uid: string): Promise<boolean> => {
    // In a real app, you would query Firestore to check admin status
    // For now, using a hardcoded check
    return true;
  };

  if (state.isAdmin && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
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
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-lg transition-colors font-medium"
      >
        {isLoading ? 'Logging in...' : 'Admin Login'}
      </button>
    </form>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { getDb } from '../../services/firebase.firestore';

interface TrustedUser {
  id: string;
  email?: string;
  uid?: string;
  isAdmin?: boolean;
  addedAt?: string;
}

export function TrustedUsers() {
  const [users, setUsers] = useState<TrustedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const db = getDb();
      const snap = await getDocs(collection(db, 'admins'));
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as TrustedUser[];
      list.sort((a, b) => {
        const aDate = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const bDate = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return bDate - aDate;
      });
      setUsers(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trusted users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const addUser = async () => {
    setError('');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUid = uid.trim();

    if (!trimmedEmail && !trimmedUid) {
      setError('Provide either an email or a UID to add a trusted user.');
      return;
    }

    setSaving(true);
    try {
      const db = getDb();
      const docId = trimmedUid || `email:${encodeURIComponent(trimmedEmail)}`;
      await setDoc(doc(db, 'admins', docId), {
        email: trimmedEmail || null,
        uid: trimmedUid || null,
        isAdmin: true,
        addedAt: new Date().toISOString(),
      });
      setEmail('');
      setUid('');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add trusted user.');
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (userId: string) => {
    const confirmed = window.confirm('Remove this trusted user? This cannot be undone.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const db = getDb();
      await deleteDoc(doc(db, 'admins', userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove trusted user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trusted Users</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Add or remove trusted admin users from within the app. You can provide either a user UID
          or an email address. If you use email, the user will be recognized once they sign in with
          that email.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Trusted user email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="user@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </label>
          <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Trusted user UID</span>
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              type="text"
              placeholder="Firebase Auth UID"
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={addUser}
          disabled={saving}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Add Trusted User'}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Trusted Users</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              These users have admin privileges in the app.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading || saving}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-400 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-12 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">No trusted users found.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.email ?? user.uid ?? user.id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Doc ID: {user.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeUser(user.id)}
                    disabled={saving}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 text-xs text-gray-500 dark:text-gray-400">
                  <div>UID: {user.uid || 'Not provided'}</div>
                  <div>Admin: {user.isAdmin ? 'Yes' : 'No'}</div>
                  <div>Added: {user.addedAt ? new Date(user.addedAt).toLocaleString() : 'Unknown'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

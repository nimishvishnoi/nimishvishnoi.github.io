/**
 * MessagesViewer — reads contact form submissions from Firebase Realtime Database.
 * Messages are stored under Message/{date}/{id}.
 */
import { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getFirebaseApp } from '../../services/firebase.firestore';

interface Message {
  id: string;
  date: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  recaptchaStatus?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function MessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const db = getDatabase(getFirebaseApp());
      const snap = await get(ref(db, 'Message'));

      if (!snap.exists()) {
        setMessages([]);
        return;
      }

      const all: Message[] = [];
      snap.forEach((dateSnap) => {
        const date = dateSnap.key ?? '';
        dateSnap.forEach((msgSnap) => {
          const data = msgSnap.val() as Omit<Message, 'id' | 'date'>;
          all.push({ id: msgSnap.key ?? '', date, ...data });
        });
      });

      // Newest first
      all.sort((a, b) => {
        const ta = new Date(a.submittedAt).getTime();
        const tb = new Date(b.submittedAt).getTime();
        return tb - ta;
      });

      setMessages(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function handleDelete(msg: Message) {
    if (!confirm(`Delete message from ${msg.name}? This cannot be undone.`)) return;
    setDeleting(msg.id);
    try {
      const db = getDatabase(getFirebaseApp());
      await remove(ref(db, `Message/${msg.date}/${msg.id}`));
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Messages
            {messages.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({messages.length} total)
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Contact form submissions from visitors
          </p>
        </div>
        <button
          onClick={loadMessages}
          disabled={isLoading}
          className="text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          {isLoading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {/* Search */}
      {messages.length > 0 && (
        <input
          type="search"
          placeholder="Search by name, email, subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}

      {/* States */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No messages yet.</p>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && messages.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No messages match your search.
        </p>
      )}

      {/* Message list */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Row */}
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full text-left px-4 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {msg.name}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{msg.email}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-0.5">
                    {msg.subject}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                    {formatDate(msg.submittedAt)}
                  </span>
                  <span className="text-gray-400 text-xs">{expanded === msg.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded detail */}
              {expanded === msg.id && (
                <div className="px-4 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        From
                      </span>
                      <p className="text-gray-900 dark:text-white mt-0.5">{msg.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="block text-teal-600 dark:text-teal-400 hover:underline mt-0.5"
                      >
                        {msg.email}
                      </a>
                    </div>
                    {msg.phone && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Phone
                        </span>
                        <p className="text-gray-900 dark:text-white mt-0.5">{msg.phone}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Received
                      </span>
                      <p className="text-gray-900 dark:text-white mt-0.5">
                        {formatDate(msg.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Subject
                    </span>
                    <p className="text-gray-900 dark:text-white mt-0.5 text-sm">{msg.subject}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Message
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(msg)}
                      disabled={deleting === msg.id}
                      className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === msg.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

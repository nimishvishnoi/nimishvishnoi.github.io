/**
 * ContentEditor — full CRUD admin panel for all portfolio content.
 * Reads from and writes to Firestore.
 */
import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { getDb } from '../../services/firebase.firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentSection =
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'contact';

interface FirestoreDoc {
  id: string;
  [key: string]: unknown;
}

const SECTIONS: { key: ContentSection; label: string; icon: string }[] = [
  { key: 'about', label: 'About', icon: '👤' },
  { key: 'contact', label: 'Contact', icon: '📬' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'projects', label: 'Projects', icon: '🗂️' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
];

// Singleton sections stored under /portfolio/<key>
const SINGLETON_SECTIONS: ContentSection[] = ['about', 'contact'];

// ─── Field configs per section ────────────────────────────────────────────────

const FIELD_CONFIGS: Record<
  ContentSection,
  { key: string; label: string; type: 'text' | 'textarea' | 'array' | 'number' }[]
> = {
  about: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Short Description', type: 'textarea' },
    { key: 'fullDescription', label: 'Full Description (one paragraph per line)', type: 'array' },
  ],
  contact: [
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
  ],
  skills: [
    { key: 'name', label: 'Skill Name', type: 'text' },
    { key: 'category', label: 'Category (frontend/backend/database/tools)', type: 'text' },
    { key: 'proficiency', label: 'Proficiency (expert/advanced/intermediate)', type: 'text' },
  ],
  projects: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'category', label: 'Category (app/web/card)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'technologies', label: 'Technologies (comma-separated)', type: 'array' },
    { key: 'url', label: 'URL (optional)', type: 'text' },
  ],
  experience: [
    { key: 'title', label: 'Job Title', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'startDate', label: 'Start Date (YYYY-MM-DD)', type: 'text' },
    { key: 'endDate', label: 'End Date (YYYY-MM-DD or leave blank for current)', type: 'text' },
    { key: 'description', label: 'Responsibilities (one per line)', type: 'array' },
    { key: 'technologies', label: 'Technologies (comma-separated)', type: 'array' },
  ],
  education: [
    { key: 'degree', label: 'Degree', type: 'text' },
    { key: 'institution', label: 'Institution', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'field', label: 'Field of Study', type: 'text' },
    { key: 'periodLabel', label: 'Period (e.g. 2014 - 2018)', type: 'text' },
    { key: 'startDate', label: 'Start Date (YYYY-MM-DD)', type: 'text' },
    { key: 'endDate', label: 'End Date (YYYY-MM-DD)', type: 'text' },
  ],
  achievements: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'organization', label: 'Organization', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fieldToString(value: unknown): string {
  if (Array.isArray(value)) return value.join('\n');
  if (value === null || value === undefined) return '';
  return String(value);
}

function stringToField(value: string, type: 'text' | 'textarea' | 'array' | 'number'): unknown {
  if (type === 'array')
    return value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  if (type === 'number') return value === '' ? 0 : Number(value);
  return value;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContentEditor() {
  const { state, dispatch } = useAppState();
  const [activeSection, setActiveSection] = useState<ContentSection>('about');
  const [docs, setDocs] = useState<FirestoreDoc[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [editingDoc, setEditingDoc] = useState<FirestoreDoc | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  if (!state.isAdmin) {
    return (
      <div className="text-center py-8 text-red-600" role="alert">
        Access denied. Admin privileges required.
      </div>
    );
  }

  // ── Load docs for selected section ──────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    loadSection(activeSection);
    setEditingDoc(null);
    setFormValues({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  async function loadSection(section: ContentSection) {
    setIsLoadingDocs(true);
    try {
      const db = getDb();
      if (SINGLETON_SECTIONS.includes(section)) {
        const { getDoc, doc: firestoreDoc } = await import('firebase/firestore');
        const snap = await getDoc(firestoreDoc(db, 'portfolio', section));
        setDocs(snap.exists() ? [{ id: section, ...snap.data() }] : []);
      } else {
        const colRef = collection(db, section === 'experience' ? 'experience' : section);
        const q = query(colRef, orderBy('id'));
        const snap = await getDocs(q);
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    } catch (err) {
      console.error('Failed to load section:', err);
    } finally {
      setIsLoadingDocs(false);
    }
  }

  function startEdit(docData: FirestoreDoc) {
    setEditingDoc(docData);
    const fields = FIELD_CONFIGS[activeSection];
    const values: Record<string, string> = {};
    for (const field of fields) {
      values[field.key] = fieldToString(docData[field.key]);
    }
    setFormValues(values);
  }

  function startNew() {
    setEditingDoc({ id: '' });
    const fields = FIELD_CONFIGS[activeSection];
    const values: Record<string, string> = {};
    for (const field of fields) values[field.key] = '';
    setFormValues(values);
  }

  async function handleSave() {
    if (!editingDoc) return;
    setIsSaving(true);
    try {
      const db = getDb();
      const fields = FIELD_CONFIGS[activeSection];
      const data: Record<string, unknown> = { updatedAt: serverTimestamp() };

      for (const field of fields) {
        const raw = formValues[field.key] ?? '';
        if (field.key === 'endDate' && raw.trim() === '') {
          data[field.key] = null;
        } else {
          data[field.key] = stringToField(raw, field.type);
        }
      }

      if (SINGLETON_SECTIONS.includes(activeSection)) {
        await setDoc(doc(getDb(), 'portfolio', activeSection), data, { merge: true });
      } else if (editingDoc.id) {
        // Update existing
        data.id = editingDoc.id;
        await setDoc(doc(db, activeSection, editingDoc.id), data, { merge: true });
      } else {
        // New document — auto-generate ID
        const newRef = await addDoc(collection(db, activeSection), data);
        await setDoc(newRef, { ...data, id: newRef.id }, { merge: true });
      }

      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Saved successfully!' });
      setEditingDoc(null);
      setFormValues({});
      await loadSection(activeSection);
    } catch (err) {
      console.error('Save error:', err);
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: 'Failed to save. Please try again.',
          type: 'error',
          timestamp: Date.now(),
        },
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(getDb(), activeSection, id));
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Deleted successfully.' });
      await loadSection(activeSection);
    } catch (err) {
      console.error('Delete error:', err);
      dispatch({
        type: 'SET_ERROR',
        payload: { message: 'Failed to delete.', type: 'error', timestamp: Date.now() },
      });
    } finally {
      setIsDeleting(null);
    }
  }

  const isSingleton = SINGLETON_SECTIONS.includes(activeSection);
  const fields = FIELD_CONFIGS[activeSection];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Manager</h1>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.key
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Edit form */}
      {editingDoc ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 dark:text-white capitalize">
              {editingDoc.id ? `Edit ${activeSection}` : `New ${activeSection}`}
            </h2>
            <button
              onClick={() => {
                setEditingDoc(null);
                setFormValues({});
              }}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
              </label>
              {field.type === 'textarea' || field.type === 'array' ? (
                <textarea
                  rows={field.type === 'array' ? 4 : 3}
                  value={formValues[field.key] ?? ''}
                  onChange={(e) => setFormValues((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={formValues[field.key] ?? ''}
                  onChange={(e) => setFormValues((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditingDoc(null);
                setFormValues({});
              }}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Document list */
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white capitalize">
              {SECTIONS.find((s) => s.key === activeSection)?.icon}{' '}
              {SECTIONS.find((s) => s.key === activeSection)?.label}
            </h2>
            {!isSingleton && (
              <button
                onClick={startNew}
                className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                + Add New
              </button>
            )}
          </div>

          {isLoadingDocs ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No data yet.{' '}
              {!isSingleton && (
                <button onClick={startNew} className="text-teal-600 underline">
                  Add the first item
                </button>
              )}
            </p>
          ) : (
            <div className="space-y-2">
              {docs.map((d) => {
                const label =
                  (d.title as string) ||
                  (d.name as string) ||
                  (d.degree as string) ||
                  (d.email as string) ||
                  d.id;
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200 truncate flex-1 mr-4">
                      {label as string}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(d)}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {!isSingleton && (
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={isDeleting === d.id}
                          className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50"
                        >
                          {isDeleting === d.id ? '…' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

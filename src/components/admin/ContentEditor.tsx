import { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { getDatabase, ref, set } from 'firebase/database';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getOptionalEnvValue } from '../../utils/env';

export interface EditableContent {
  id: string;
  type: 'project' | 'skill' | 'experience' | 'education';
  title: string;
  description: string;
  metadata: Record<string, unknown>;
}

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

const CONTENT_ITEMS: EditableContent[] = [
  {
    id: 'projects',
    type: 'project',
    title: 'Projects',
    description: 'Manage your portfolio projects.',
    metadata: {},
  },
  {
    id: 'skills',
    type: 'skill',
    title: 'Skills',
    description: 'Manage your technical skills.',
    metadata: {},
  },
  {
    id: 'experience',
    type: 'experience',
    title: 'Experience',
    description: 'Manage your work experience.',
    metadata: {},
  },
  {
    id: 'education',
    type: 'education',
    title: 'Education',
    description: 'Manage your education history.',
    metadata: {},
  },
];

export function ContentEditor() {
  const { state, dispatch } = useAppState();
  const [selectedContent, setSelectedContent] = useState<EditableContent | null>(null);
  const [formData, setFormData] = useState<EditableContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  if (!state.isAdmin) {
    return (
      <div className="text-center py-8 text-red-600" role="alert">
        Access denied. Admin privileges required.
      </div>
    );
  }

  const handleEdit = (content: EditableContent) => {
    setSelectedContent(content);
    setFormData({ ...content });
    setTitleError('');
    setDescError('');
  };

  const validate = (): boolean => {
    let valid = true;
    if (!formData?.title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }
    if (!formData?.description.trim()) {
      setDescError('Description is required.');
      valid = false;
    } else {
      setDescError('');
    }
    return valid;
  };

  const handleSave = async () => {
    if (!formData || !validate()) return;

    setIsSaving(true);
    try {
      // Save to Firebase Realtime Database under /content/<type>/<id>
      const app = getFirebaseApp();
      const db = getDatabase(app);
      const contentRef = ref(db, `content/${formData.type}/${formData.id}`);
      await set(contentRef, {
        ...formData,
        updatedAt: Date.now(),
      });

      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Content updated successfully!' });

      setTimeout(() => {
        setSelectedContent(null);
        setFormData(null);
      }, 1500);
    } catch (error) {
      console.error('Error saving content:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: 'Failed to save content. Please try again.',
          type: 'error',
          timestamp: Date.now(),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Manager</h1>

      {selectedContent ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              Edit {selectedContent.type}
            </h2>
            <button
              onClick={() => {
                setSelectedContent(null);
                setFormData(null);
              }}
              aria-label="Close editor"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="content-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="content-title"
                type="text"
                value={formData?.title || ''}
                onChange={(e) => {
                  setFormData((prev) => (prev ? { ...prev, title: e.target.value } : null));
                  if (e.target.value.trim()) setTitleError('');
                }}
                aria-describedby={titleError ? 'title-error' : undefined}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {titleError && (
                <p id="title-error" className="text-red-500 text-sm mt-1">
                  {titleError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content-description"
                value={formData?.description || ''}
                onChange={(e) => {
                  setFormData((prev) => (prev ? { ...prev, description: e.target.value } : null));
                  if (e.target.value.trim()) setDescError('');
                }}
                rows={4}
                aria-describedby={descError ? 'desc-error' : undefined}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {descError && (
                <p id="desc-error" className="text-red-500 text-sm mt-1">
                  {descError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setSelectedContent(null);
                  setFormData(null);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Select Content to Edit
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Click an item to edit its content. Changes are saved to Firebase immediately.
          </p>

          <div className="space-y-2">
            {CONTENT_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEdit(item)}
                className="w-full text-left p-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-between group"
              >
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {item.title}
                </span>
                <span className="text-gray-400 group-hover:text-teal-600 transition-colors text-sm">
                  Edit →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

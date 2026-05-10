import { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';

export interface EditableContent {
  id: string;
  type: 'project' | 'skill' | 'experience' | 'education';
  title: string;
  description: string;
  metadata: Record<string, any>;
}

export function ContentEditor() {
  const { state, dispatch } = useAppState();
  const [selectedContent, setSelectedContent] = useState<EditableContent | null>(null);
  const [formData, setFormData] = useState<EditableContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!state.isAdmin) {
    return (
      <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>
    );
  }

  const handleEdit = (content: EditableContent) => {
    setSelectedContent(content);
    setFormData({ ...content });
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      // Save to Firebase
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      dispatch({
        type: 'SET_SUCCESS_MESSAGE',
        payload: 'Content updated successfully!',
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedContent(null);
        setFormData(null);
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
      }, 2000);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
      </div>

      {selectedContent ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit {selectedContent.type}
            </h2>
            <button
              onClick={() => {
                setSelectedContent(null);
                setFormData(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData?.title || ''}
                onChange={(e) =>
                  setFormData((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData?.description || ''}
                onChange={(e) =>
                  setFormData((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Select Content to Edit
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any item below to edit its content. Changes will be published immediately.
          </p>

          <div className="mt-6 space-y-2">
            <button
              onClick={() =>
                handleEdit({
                  id: '1',
                  type: 'project',
                  title: 'Sample Project',
                  description: 'Edit project details',
                  metadata: {},
                })
              }
              className="w-full text-left p-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() =>
                handleEdit({
                  id: '2',
                  type: 'skill',
                  title: 'Sample Skill',
                  description: 'Edit skill details',
                  metadata: {},
                })
              }
              className="w-full text-left p-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() =>
                handleEdit({
                  id: '3',
                  type: 'experience',
                  title: 'Work Experience',
                  description: 'Edit experience details',
                  metadata: {},
                })
              }
              className="w-full text-left p-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() =>
                handleEdit({
                  id: '4',
                  type: 'education',
                  title: 'Education',
                  description: 'Edit education details',
                  metadata: {},
                })
              }
              className="w-full text-left p-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Education
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

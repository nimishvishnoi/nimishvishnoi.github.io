import { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { AdminDashboard } from './AdminDashboard';
import { ContentEditor } from './ContentEditor';
import { AdminAuth } from './AdminAuth';

type AdminTab = 'dashboard' | 'content' | 'settings';

export function AdminPanel() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const toggleAdminPanel = () => {
    dispatch({ type: 'TOGGLE_ADMIN_PANEL' });
  };

  if (!state.adminPanelOpen) {
    return (
      <button
        onClick={toggleAdminPanel}
        className="fixed bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
        title="Toggle Admin Panel"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-auto">
      <div className="bg-white dark:bg-slate-800 m-auto my-8 max-w-4xl rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <button
            onClick={toggleAdminPanel}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Auth Section */}
        {!state.isAdmin && (
          <div className="border-b border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Login
            </h2>
            <AdminAuth />
          </div>
        )}

        {/* Tabs */}
        {state.isAdmin && (
          <>
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              {(['dashboard', 'content', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50 dark:bg-slate-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'content' && <ContentEditor />}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Admin settings and configurations would be displayed here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

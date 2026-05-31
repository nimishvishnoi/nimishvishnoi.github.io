import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { AdminDashboard } from './AdminDashboard';
import { ContentEditor } from './ContentEditor';
import { AdminAuth } from './AdminAuth';
import { SeedFirestore } from './SeedFirestore';
import { MessagesViewer } from './MessagesViewer';

type AdminTab = 'dashboard' | 'messages' | 'content' | 'settings';

/** Focusable element selector for focus-trap */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function AdminPanel() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleAdminPanel = () => {
    dispatch({ type: 'TOGGLE_ADMIN_PANEL' });
  };

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!state.adminPanelOpen) return;

      if (e.key === 'Escape') {
        toggleAdminPanel();
        return;
      }

      // Focus trap — keep Tab/Shift+Tab inside the dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => !el.closest('[aria-hidden="true"]'));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.adminPanelOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Move focus into dialog when it opens; restore when it closes
  useEffect(() => {
    if (state.adminPanelOpen) {
      // Small delay to let the DOM render
      const id = setTimeout(() => {
        const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      }, 50);
      return () => clearTimeout(id);
    } else {
      triggerRef.current?.focus();
    }
  }, [state.adminPanelOpen]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = state.adminPanelOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.adminPanelOpen]);

  if (!state.adminPanelOpen) {
    return (
      <button
        ref={triggerRef}
        onClick={toggleAdminPanel}
        className="fixed bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
        aria-label="Open admin panel"
        title="Admin Panel"
      >
        <span aria-hidden="true">⚙️</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        aria-hidden="true"
        onClick={toggleAdminPanel}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      >
        <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 p-6">
            <h1 id="admin-panel-title" className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <button
              onClick={toggleAdminPanel}
              aria-label="Close admin panel"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
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
              <div
                className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto"
                role="tablist"
              >
                {(['dashboard', 'messages', 'content', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`tabpanel-${tab}`}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 font-medium transition-colors capitalize focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 ${
                      activeTab === tab
                        ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50 dark:bg-slate-700'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="p-6"
              >
                {activeTab === 'dashboard' && <AdminDashboard />}
                {activeTab === 'messages' && <MessagesViewer />}
                {activeTab === 'content' && <ContentEditor />}
                {activeTab === 'settings' && <SeedFirestore />}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

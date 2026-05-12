import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '../../hooks/useAppState';
import analytics from '../../services/analytics';

interface AnalyticsStat {
  label: string;
  value: number;
  icon: string;
}

export function AdminDashboard() {
  const { state, dispatch } = useAppState();
  const [stats, setStats] = useState<AnalyticsStat[]>([
    { label: 'Page Views', value: 0, icon: '👁️' },
    { label: 'Form Submissions', value: 0, icon: '✉️' },
    { label: 'Project Clicks', value: 0, icon: '🖱️' },
    { label: 'Resume Downloads', value: 0, icon: '📄' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pageViews, formSubmissions, projectClicks, resumeDownloads] = await Promise.all([
        analytics.getAnalyticsData('page_view'),
        analytics.getAnalyticsData('form_submission'),
        analytics.getAnalyticsData('project_click'),
        analytics.getAnalyticsData('resume_download'),
      ]);

      const newStats = [
        { label: 'Page Views', value: pageViews.length, icon: '👁️' },
        { label: 'Form Submissions', value: formSubmissions.length, icon: '✉️' },
        { label: 'Project Clicks', value: projectClicks.length, icon: '🖱️' },
        { label: 'Resume Downloads', value: resumeDownloads.length, icon: '📄' },
      ];

      setStats(newStats);
      setHasData(newStats.some((s) => s.value > 0));
    } catch (error) {
      console.error('Failed to load analytics:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: 'Failed to load analytics data',
          type: 'error',
          timestamp: Date.now(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.isAdmin) return;
    // loadAnalytics fetches from Firebase and updates state — this is intentional
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics();
  }, [state.isAdmin, loadAnalytics]);

  if (!state.isAdmin) {
    return (
      <div className="text-center py-8 text-red-600" role="alert">
        Access denied. Admin privileges required.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <button
          onClick={loadAnalytics}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          aria-label="Refresh analytics data"
        >
          {isLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded mb-3 w-3/4" />
              <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {!isLoading && !hasData ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No analytics data yet. Activity will appear here once visitors interact with the site.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Detailed activity timeline will be displayed here as data accumulates.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: AnalyticsStat }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl" aria-hidden="true">
          {stat.icon}
        </span>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
    </div>
  );
}

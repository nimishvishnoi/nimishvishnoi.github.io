import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import analytics from '../../services/analytics';

interface AnalyticsStat {
  label: string;
  value: number;
  change?: number;
}

export function AdminDashboard() {
  const { state, dispatch } = useAppState();
  const [stats, setStats] = useState<AnalyticsStat[]>([
    { label: 'Page Views', value: 0, change: 0 },
    { label: 'Form Submissions', value: 0, change: 0 },
    { label: 'Project Clicks', value: 0, change: 0 },
    { label: 'Resume Downloads', value: 0, change: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state.isAdmin) {
      return;
    }
    loadAnalytics();
  }, [state.isAdmin]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [pageViews, formSubmissions, projectClicks, resumeDownloads] = await Promise.all([
        analytics.getAnalyticsData('page_view'),
        analytics.getAnalyticsData('form_submission'),
        analytics.getAnalyticsData('project_click'),
        analytics.getAnalyticsData('resume_download'),
      ]);

      setStats([
        { label: 'Page Views', value: pageViews.length, change: 12 },
        { label: 'Form Submissions', value: formSubmissions.length, change: 5 },
        { label: 'Project Clicks', value: projectClicks.length, change: -2 },
        { label: 'Resume Downloads', value: resumeDownloads.length, change: 8 },
      ]);
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
  };

  if (!state.isAdmin) {
    return (
      <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <button
          onClick={loadAnalytics}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Activity timeline and detailed analytics would be displayed here.
        </p>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: AnalyticsStat }) {
  const isPositive = stat.change && stat.change > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
      {stat.change !== undefined && (
        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(stat.change)}% vs last period
        </p>
      )}
    </div>
  );
}

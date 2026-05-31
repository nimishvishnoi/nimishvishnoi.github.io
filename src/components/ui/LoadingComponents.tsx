export function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center" role="status" aria-label={label}>
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function LoadingOverlay({
  isVisible,
  message = 'Loading…',
}: {
  isVisible: boolean;
  message?: string;
}) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      role="status"
      aria-busy="true"
      aria-label={message}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center shadow-xl">
        <LoadingSpinner label={message} />
        <p className="mt-4 text-gray-700 dark:text-gray-300" aria-hidden="true">
          {message}
        </p>
      </div>
    </div>
  );
}

export function SkeletonLoader({ count = 1 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading content…">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse mb-4">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-5/6" />
        </div>
      ))}
      <span className="sr-only">Loading content…</span>
    </div>
  );
}

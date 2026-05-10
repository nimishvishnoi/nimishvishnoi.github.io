export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
  );
}

export function LoadingOverlay({
  isVisible,
  message = 'Loading...',
}: {
  isVisible: boolean;
  message?: string;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonLoader({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
        </div>
      ))}
    </>
  );
}

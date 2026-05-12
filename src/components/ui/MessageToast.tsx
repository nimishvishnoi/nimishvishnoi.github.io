export function MessageToast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const styles = {
    success: {
      bg: 'bg-green-600',
      icon: '✓',
      label: 'Success',
    },
    error: {
      bg: 'bg-red-600',
      icon: '✕',
      label: 'Error',
    },
    info: {
      bg: 'bg-blue-600',
      icon: 'ℹ',
      label: 'Info',
    },
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${styles.bg} text-white px-5 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50 max-w-sm`}
      // success = polite (role="status"), error/info = assertive (role="alert")
      role={type === 'success' ? 'status' : 'alert'}
      aria-live={type === 'success' ? 'polite' : 'assertive'}
      aria-atomic="true"
    >
      <span className="text-lg font-bold shrink-0" aria-hidden="true">
        {styles.icon}
      </span>
      <span className="text-sm leading-snug">{message}</span>
      <button
        onClick={onClose}
        aria-label={`Close ${styles.label.toLowerCase()} notification`}
        className="ml-2 shrink-0 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}

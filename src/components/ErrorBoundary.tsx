import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // TODO: Replace with your error tracking service (e.g. Sentry)
    // Example: Sentry.captureException(error, { extra: errorInfo });
    if (import.meta.env.PROD) {
      // Structured payload ready for an error tracking service
      // Sentry.captureException(error, { extra: { message: error.message, stack: error.stack, componentStack: errorInfo.componentStack, timestamp: new Date().toISOString(), url: window.location.href } });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
            {/* Warning / error icon */}
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              {this.state.error?.message ||
                'An unexpected error occurred. You can try again or refresh the page.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Try Again — resets boundary state without a full page reload */}
              <button
                onClick={this.handleReset}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Try Again
              </button>
              {/* Refresh — last resort for unrecoverable errors */}
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

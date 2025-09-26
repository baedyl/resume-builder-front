import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log for monitoring; replace with your monitoring service if available
    console.error('Unhandled error captured by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              An unexpected error occurred. Please try reloading the page. If the problem persists, contact support.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Reload Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs mt-6 p-4 rounded bg-gray-100 dark:bg-gray-700 overflow-auto">
                {String(this.state.error.stack || this.state.error.message)}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;



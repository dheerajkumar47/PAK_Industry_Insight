import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-lg w-full">
            <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertCircle className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
                The application encountered an unexpected error.
            </p>

            <div className="bg-red-50 border border-red-100 p-4 rounded-lg overflow-auto mb-6">
                <code className="text-sm text-red-800 font-mono">
                    {this.state.error?.toString()}
                </code>
            </div>

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

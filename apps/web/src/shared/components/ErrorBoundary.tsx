'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[300px] p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">页面出现错误</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-md">
              {this.state.error?.message || '发生了未知错误'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              <span>重试</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorTitle?: string;
  errorDescription?: string;
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
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
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-card border border-card-border rounded-xl p-8 max-w-md w-full">
            <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-error"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              {this.props.errorTitle || "Er is iets misgegaan"}
            </h2>
            <p className="text-muted text-sm mb-6">
              {this.props.errorDescription ||
                "Er is een onverwachte fout opgetreden. Probeer het opnieuw."}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold btn-gradient transition-all"
            >
              {this.props.retryLabel || "Opnieuw proberen"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

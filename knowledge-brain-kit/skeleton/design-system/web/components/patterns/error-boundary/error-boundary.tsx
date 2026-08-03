'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Alert } from '~/components/primitives/alert';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for CompactErrorBoundary component
 */
export interface CompactErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;
  /** Optional custom fallback UI to show when error occurs */
  fallback?: ReactNode;
  /**
   * Optional callback when error is caught.
   * Useful for error logging/monitoring (e.g. Sentry).
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Custom error message to display @default "Error loading this section" */
  errorMessage?: string;
  /** Whether to show the retry button @default true */
  showRetry?: boolean;
  /** Custom className for the error container */
  className?: string;
  /** Whether to show error details toggle in development mode @default true */
  showErrorDetails?: boolean;
  /** Size variant for the error UI @default "md" */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Internal state for CompactErrorBoundary
 */
export interface CompactErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * CompactErrorBoundary - Composed Component
 *
 * A lightweight error boundary for inline error handling in cards, sections, and forms.
 * Unlike page-level error boundaries, this shows a compact inline error message
 * and allows retry without affecting sibling components.
 *
 * @example
 * ```tsx
 * <CompactErrorBoundary>
 *   <RequestListCard />
 * </CompactErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <CompactErrorBoundary
 *   errorMessage="Failed to load requests"
 *   onError={(error, errorInfo) => Sentry.captureException(error)}
 * >
 *   <CriticalComponent />
 * </CompactErrorBoundary>
 * ```
 */
export class CompactErrorBoundary extends Component<
  CompactErrorBoundaryProps,
  CompactErrorBoundaryState
> {
  constructor(props: CompactErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): CompactErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CompactErrorBoundary caught error:', error);
    console.error('Error component stack:', errorInfo.componentStack);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const {
      children,
      fallback,
      errorMessage = 'Error loading this section',
      showRetry = true,
      className = '',
      showErrorDetails = true,
      size = 'md',
    } = this.props;

    // Normal state - render children
    if (!this.state.hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Size configurations
    const sizeConfig = {
      sm: {
        alert: 'sm' as const,
        button: 'sm' as const,
        iconSize: 14,
        padding: 'p-3',
      },
      md: {
        alert: 'md' as const,
        button: 'md' as const,
        iconSize: 16,
        padding: 'p-4',
      },
      lg: {
        alert: 'lg' as const,
        button: 'md' as const,
        iconSize: 20,
        padding: 'p-5',
      },
    };

    const config = sizeConfig[size];

    return (
      <div
        className={cn('flex flex-col gap-3', className)}
        aria-live="assertive"
        data-testid="compact-error-boundary"
      >
        <Alert
          variant="error"
          size={config.alert}
          showIcon
          className="w-full"
        >
          <div className="flex flex-col gap-2">
            <p className="font-medium">{errorMessage}</p>

            {showRetry && (
              <div className="flex items-center gap-2 mt-1">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size={config.button}
                  iconLeft={<RefreshCw size={config.iconSize} />}
                  aria-label="Retry loading"
                  data-testid="retry-button"
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        </Alert>

        {/* Development-only error details */}
        {process.env.NODE_ENV === 'development' &&
          showErrorDetails &&
          this.state.error && (
            <details
              className={cn(
                'w-full rounded-[var(--radius)] border border-border bg-muted/50',
                config.padding
              )}
              data-testid="error-details"
            >
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-medium">
                Error details (dev only)
              </summary>
              <pre className="mt-3 p-3 text-xs bg-background rounded border border-border overflow-auto max-h-48 whitespace-pre-wrap break-words">
                <strong>Message:</strong>
                {'\n'}
                {this.state.error.message}
                {'\n\n'}
                <strong>Stack Trace:</strong>
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
      </div>
    );
  }
}

export default CompactErrorBoundary;

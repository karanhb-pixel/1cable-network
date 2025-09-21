import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const AsyncErrorFallback = ({ error, onRetry, retryCount }) => (
  <div className="async-error-boundary">
    <div className="error-content">
      <div className="error-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3>Failed to Load Content</h3>
      <p>There was a problem loading this content. This might be due to a network issue or server error.</p>

      {error && (
        <details className="error-details">
          <summary>Technical Details</summary>
          <small>{error.message}</small>
        </details>
      )}

      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          Try Again {retryCount > 0 && `(${retryCount}/3)`}
        </button>
      </div>
    </div>

    <style jsx>{`
      .async-error-boundary {
        padding: 2rem;
        text-align: center;
        background: #f8fafc;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .error-content {
        max-width: 400px;
        margin: 0 auto;
      }

      .error-icon {
        color: #f59e0b;
        margin-bottom: 1rem;
      }

      h3 {
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      p {
        color: #6b7280;
        margin-bottom: 1rem;
        line-height: 1.5;
      }

      .error-details {
        background: #f3f4f6;
        padding: 0.5rem;
        border-radius: 4px;
        margin: 1rem 0;
        text-align: left;
      }

      .error-details summary {
        cursor: pointer;
        font-weight: 500;
        color: #374151;
      }

      .error-details small {
        color: #6b7280;
        font-family: monospace;
        font-size: 0.75rem;
      }

      .retry-button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .retry-button:hover {
        background: #2563eb;
      }

      @media (max-width: 640px) {
        .async-error-boundary {
          padding: 1rem;
        }
      }
    `}</style>
  </div>
);

const AsyncErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary
    {...props}
    fallback={AsyncErrorFallback}
    title="Content Loading Error"
    message="Unable to load the requested content. Please check your connection and try again."
  >
    {children}
  </ErrorBoundary>
);

export default AsyncErrorBoundary;
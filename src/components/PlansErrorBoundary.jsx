import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const PlansErrorFallback = ({ error, onRetry, retryCount }) => (
  <div className="plans-error-boundary">
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
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>

      <h3>Plans Unavailable</h3>
      <p>We're having trouble loading the plans. This might be a temporary issue.</p>

      {error && (
        <details className="error-details">
          <summary>Error Details</summary>
          <small>{error.message}</small>
        </details>
      )}

      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          Refresh Plans {retryCount > 0 && `(${retryCount}/3)`}
        </button>
      </div>

      <div className="alternative-options">
        <p>You can also:</p>
        <ul>
          <li>Check your internet connection</li>
          <li>Try refreshing the page</li>
          <li>Contact support if the problem persists</li>
        </ul>
      </div>
    </div>

    <style jsx>{`
      .plans-error-boundary {
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        margin: 2rem 0;
        border: 1px solid #e2e8f0;
      }

      .error-content {
        max-width: 450px;
        margin: 0 auto;
      }

      .error-icon {
        color: #6366f1;
        margin-bottom: 1rem;
      }

      h3 {
        color: #1e293b;
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
      }

      p {
        color: #64748b;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .error-details {
        background: white;
        padding: 0.75rem;
        border-radius: 6px;
        margin: 1rem 0;
        text-align: left;
        border-left: 3px solid #6366f1;
      }

      .error-details summary {
        cursor: pointer;
        font-weight: 500;
        color: #475569;
      }

      .error-details small {
        color: #64748b;
        font-family: monospace;
        font-size: 0.8rem;
      }

      .retry-button {
        background: #6366f1;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 1rem;
      }

      .retry-button:hover {
        background: #4f46e5;
        transform: translateY(-1px);
      }

      .alternative-options {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: left;
        border-top: 3px solid #e2e8f0;
      }

      .alternative-options p {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        color: #475569;
      }

      .alternative-options ul {
        margin: 0;
        padding-left: 1.2rem;
      }

      .alternative-options li {
        color: #64748b;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
      }

      @media (max-width: 640px) {
        .plans-error-boundary {
          padding: 1rem;
          margin: 1rem 0;
        }

        .error-content {
          max-width: 100%;
        }

        .alternative-options {
          padding: 0.75rem;
        }
      }
    `}</style>
  </div>
);

const PlansErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary
    {...props}
    fallback={PlansErrorFallback}
    title="Plans Service Unavailable"
    message="Unable to load plan information. Please try again in a moment."
  >
    {children}
  </ErrorBoundary>
);

export default PlansErrorBoundary;
import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring service in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error, errorInfo) => {
    // This would typically send to an error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // For now, just log it
    console.error('Error Report:', errorReport);

    // In a real app, you would send this to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom error reporting endpoint
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            retryCount={this.state.retryCount}
          />
        );
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h2 className="error-title">
              {this.props.title || 'Oops! Something went wrong'}
            </h2>

            <p className="error-message">
              {this.props.message || 'An unexpected error occurred. Please try again.'}
            </p>

            <div className="error-actions">
              <button
                onClick={this.handleRetry}
                className="error-button retry-button"
                disabled={this.state.retryCount >= 3}
              >
                Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/3)`}
              </button>

              <button
                onClick={this.handleReload}
                className="error-button reload-button"
              >
                Reload Page
              </button>
            </div>

            {showDetails && import.meta.env.DEV && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
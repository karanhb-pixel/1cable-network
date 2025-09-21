/**
 * Error Reporting Utility
 * Handles error logging, reporting, and user notifications
 */

class ErrorReporter {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
    this.reportedErrors = new Set();
  }

  /**
   * Report an error to external services
   * @param {Error} error - The error object
   * @param {Object} context - Additional context information
   */
  reportError(error, context = {}) {
    const errorId = this.generateErrorId(error);

    // Prevent duplicate error reporting
    if (this.reportedErrors.has(errorId)) {
      return errorId;
    }

    this.reportedErrors.add(errorId);

    const errorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: {
        ...context,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }
    };

    // Console logging for development
    if (this.isDevelopment) {
      console.group('🚨 Error Report');
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Full Report:', errorReport);
      console.groupEnd();
    }

    // Send to external services in production
    if (this.isProduction) {
      this.sendToExternalServices(errorReport);
    }

    return errorId;
  }

  /**
   * Send error report to external monitoring services
   * @param {Object} errorReport - The error report object
   */
  async sendToExternalServices(errorReport) {
    const services = [
      // Add your error monitoring services here
      // this.sendToSentry(errorReport),
      // this.sendToLogRocket(errorReport),
      // this.sendToBugsnag(errorReport),
      this.sendToCustomEndpoint(errorReport)
    ];

    // Execute all services in parallel
    await Promise.allSettled(services);
  }

  /**
   * Send error to custom endpoint
   * @param {Object} errorReport - The error report
   */
  async sendToCustomEndpoint(errorReport) {
    try {
      // Replace with your actual error reporting endpoint
      const endpoint = '/api/errors';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send error to custom endpoint:', error);
    }
  }

  /**
   * Generate a unique error ID
   * @param {Error} error - The error object
   * @returns {string} - Unique error identifier
   */
  generateErrorId(error) {
    const errorString = `${error.message}-${error.stack?.substring(0, 100)}`;
    let hash = 0;

    for (let i = 0; i < errorString.length; i++) {
      const char = errorString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Log user actions for context
   * @param {string} action - User action description
   * @param {Object} metadata - Additional metadata
   */
  logUserAction(action, metadata = {}) {
    if (this.isDevelopment) {
      console.log('👤 User Action:', action, metadata);
    }

    // In production, you might want to batch these and send periodically
    // to avoid performance impact
  }

  /**
   * Create a user-friendly error message
   * @param {Error} error - The original error
   * @param {string} fallbackMessage - Fallback message if error message is not user-friendly
   * @returns {string} - User-friendly error message
   */
  getUserFriendlyMessage(error, fallbackMessage = 'An unexpected error occurred') {
    const errorMessage = error.message.toLowerCase();

    // Map technical errors to user-friendly messages
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    if (errorMessage.includes('timeout')) {
      return 'The request timed out. Please try again.';
    }

    if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
      return 'You do not have permission to perform this action.';
    }

    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return 'The requested resource was not found.';
    }

    if (errorMessage.includes('server error') || errorMessage.includes('500')) {
      return 'Server error occurred. Please try again later.';
    }

    // Return the original message if it's already user-friendly
    if (error.message.length < 100 && !error.message.match(/^[A-Z]/)) {
      return error.message;
    }

    return fallbackMessage;
  }

  /**
   * Clear reported errors (useful for testing)
   */
  clearReportedErrors() {
    this.reportedErrors.clear();
  }
}

// Create singleton instance
const errorReporter = new ErrorReporter();

export default errorReporter;

// Export individual functions for convenience
export const reportError = (error, context) => errorReporter.reportError(error, context);
export const logUserAction = (action, metadata) => errorReporter.logUserAction(action, metadata);
export const getUserFriendlyMessage = (error, fallback) =>
  errorReporter.getUserFriendlyMessage(error, fallback);
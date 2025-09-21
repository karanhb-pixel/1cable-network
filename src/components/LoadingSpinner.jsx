import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  message = 'Loading...',
  overlay = false,
  className = ''
}) => {
  const spinnerSize = {
    small: '16px',
    medium: '32px',
    large: '48px',
    xl: '64px'
  };

  const containerClasses = `
    loading-spinner-container
    ${overlay ? 'loading-spinner-overlay' : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      <div
        className="loading-spinner"
        style={{
          width: spinnerSize[size],
          height: spinnerSize[size]
        }}
      >
        <div className="loading-spinner-inner"></div>
      </div>
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
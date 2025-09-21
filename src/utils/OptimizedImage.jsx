import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  srcSet = '',
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate WebP source if not provided
  const generateWebPSrcSet = (baseSrc) => {
    if (srcSet) return srcSet;
    // This is a simple implementation - in production you might want to generate multiple sizes
    return `${baseSrc.replace(/\.[^/.]+$/, '.webp')} 1x`;
  };

  const baseSrc = src;

  return (
    <div
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="image-placeholder"
          style={{
            width: width || '100%',
            height: height || 'auto',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="image-error"
          style={{
            width: width || '100%',
            height: height || '200px',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      )}

      {/* Main image with WebP support */}
      {isInView && !hasError && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={generateWebPSrcSet(baseSrc)}
            sizes={sizes}
            type="image/webp"
          />

          {/* Fallback image */}
          <img
            src={baseSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: '100%',
              height: 'auto',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            {...props}
          />
        </picture>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
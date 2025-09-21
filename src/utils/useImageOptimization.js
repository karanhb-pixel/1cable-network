import { useState, useEffect } from 'react';

/**
 * Hook for optimizing images with WebP support and lazy loading
 * @param {string} src - Original image source
 * @param {string} alt - Alt text for accessibility
 * @param {Object} options - Additional options
 * @returns {Object} - Image optimization data and handlers
 */
export const useImageOptimization = (src, alt, options = {}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    const webpSrc = src.replace(/\.[^/.]+$/, '.webp');

    // Try WebP first
    img.onload = () => {
      setImageSrc(webpSrc);
      setIsLoading(false);
    };

    img.onerror = () => {
      // Fallback to original format
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
      };

      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
    };

    img.src = webpSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    src: imageSrc,
    isLoading,
    hasError,
    alt,
    ...options
  };
};

/**
 * Generate responsive image srcSet
 * @param {string} baseSrc - Base image source
 * @param {Array} sizes - Array of sizes (e.g., [400, 800, 1200])
 * @returns {string} - Generated srcSet string
 */
export const generateSrcSet = (baseSrc, sizes = [400, 800, 1200]) => {
  if (!baseSrc) return '';

  return sizes
    .map(size => {
      const webpSrc = baseSrc.replace(/\.[^/.]+$/, '.webp');
      return `${webpSrc} ${size}w`;
    })
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param {string} defaultSize - Default size (e.g., '100vw')
 * @param {Array} breakpoints - Array of breakpoints with sizes
 * @returns {string} - Generated sizes string
 */
export const generateSizes = (defaultSize = '100vw', breakpoints = []) => {
  if (breakpoints.length === 0) return defaultSize;

  const sizes = breakpoints.map(bp => {
    return `(max-width: ${bp.maxWidth}px) ${bp.size}`;
  });

  sizes.push(defaultSize);
  return sizes.join(', ');
};
/**
 * Enhanced API Service with interceptors, caching, and performance monitoring
 * Provides centralized HTTP client configuration for the application
 */

import axios from 'axios';
import { trackCustomMetric, startTimer } from './performanceUtils';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request cache storage
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default cache

// Cache configuration for different endpoints
const cacheConfig = {
  // Static data - long cache
  '/users': { duration: 10 * 60 * 1000 }, // 10 minutes
  '/plans': { duration: 15 * 60 * 1000 }, // 15 minutes
  '/wifi-plans': { duration: 10 * 60 * 1000 }, // 10 minutes
  '/ott-plans': { duration: 20 * 60 * 1000 }, // 20 minutes

  // Dynamic data - short cache
  '/user/profile': { duration: 2 * 60 * 1000 }, // 2 minutes
  '/dashboard/stats': { duration: 30 * 1000 }, // 30 seconds

  // No cache for these endpoints
  '/auth/login': { duration: 0 },
  '/auth/logout': { duration: 0 },
  '/user/update': { duration: 0 },
};

/**
 * Generate cache key for request
 * @param {Object} config - Axios request config
 * @returns {string} - Cache key
 */
const generateCacheKey = (config) => {
  const { method, url, params, data } = config;
  return `${method.toUpperCase()}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

/**
 * Check if request should be cached
 * @param {string} url - Request URL
 * @param {string} method - HTTP method
 * @returns {boolean} - Whether to cache
 */
const shouldCache = (url, method) => {
  if (method.toLowerCase() !== 'get') return false;

  // Check cache configuration
  for (const [pattern, config] of Object.entries(cacheConfig)) {
    if (url.includes(pattern)) {
      return config.duration > 0;
    }
  }

  return false;
};

/**
 * Get cached response if available and valid
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached response or null
 */
const getCachedResponse = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  if (!cached) return null;

  const { data, timestamp } = cached;
  const cacheDuration = getCacheDuration(cacheKey);

  if (Date.now() - timestamp > cacheDuration) {
    requestCache.delete(cacheKey);
    return null;
  }

  return data;
};

/**
 * Cache response data
 * @param {string} cacheKey - Cache key
 * @param {Object} data - Response data
 */
const setCachedResponse = (cacheKey, data) => {
  const cacheDuration = getCacheDuration(cacheKey);
  if (cacheDuration > 0) {
    requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }
};

/**
 * Get cache duration for URL
 * @param {string} cacheKey - Cache key
 * @returns {number} - Cache duration in milliseconds
 */
const getCacheDuration = (cacheKey) => {
  const url = cacheKey.split(':')[1];

  for (const [pattern, config] of Object.entries(cacheConfig)) {
    if (url.includes(pattern)) {
      return config.duration;
    }
  }

  return CACHE_DURATION;
};

/**
 * Clear cache for specific pattern
 * @param {string} pattern - URL pattern to clear
 */
export const clearCache = (pattern = '') => {
  if (!pattern) {
    requestCache.clear();
    return;
  }

  for (const [key] of requestCache) {
    if (key.includes(pattern)) {
      requestCache.delete(key);
    }
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  requestCache.clear();
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const endTimer = startTimer(`API_${config.method.toUpperCase()}_${config.url.split('/').pop()}`);

    // Add timestamp for debugging
    config.metadata = {
      startTime: Date.now(),
      endTimer,
    };

    // Add auth token if available
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check cache for GET requests
    if (shouldCache(config.url, config.method)) {
      const cacheKey = generateCacheKey(config);
      const cachedResponse = getCachedResponse(cacheKey);

      if (cachedResponse) {
        console.log('📦 Serving from cache:', config.url);
        config.adapter = () => Promise.resolve({
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        });
        return config;
      }
    }

    console.log('🌐 Making API request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    trackCustomMetric('api_request_error', 1, 'count');
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const { config } = response;
    const { startTime, endTimer } = config.metadata || {};

    // Calculate response time
    const responseTime = Date.now() - startTime;
    endTimer();

    // Track performance metrics
    trackCustomMetric(`api_response_time_${response.status}`, responseTime, 'ms');
    trackCustomMetric(`api_success_${response.status}`, 1, 'count');

    // Cache successful GET responses
    if (response.config.method.toLowerCase() === 'get' && response.status === 200) {
      const cacheKey = generateCacheKey(response.config);
      setCachedResponse(cacheKey, response.data);
    }

    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url} (${responseTime}ms)`);
    }

    return response;
  },
  (error) => {
    const { config, response } = error;
    const { startTime } = config?.metadata || {};

    // Calculate response time even for errors
    const responseTime = startTime ? Date.now() - startTime : 0;

    // Track error metrics
    trackCustomMetric('api_request_error', 1, 'count');
    if (response) {
      trackCustomMetric(`api_error_${response.status}`, 1, 'count');
    } else {
      trackCustomMetric('api_network_error', 1, 'count');
    }

    // Enhanced error logging
    console.error('❌ API Error:', {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      statusText: response?.statusText,
      responseTime: `${responseTime}ms`,
      error: error.message,
      data: response?.data,
    });

    // Handle common error cases
    if (response?.status === 401) {
      // Unauthorized - clear user session
      sessionStorage.removeItem('user');
      console.warn('🔐 Unauthorized access - user session cleared');
    }

    if (response?.status === 403) {
      console.warn('🚫 Forbidden access');
    }

    if (response?.status >= 500) {
      console.error('🔥 Server error occurred');
    }

    return Promise.reject(error);
  }
);

/**
 * Enhanced API methods with additional features
 */
export const apiService = {
  // Standard HTTP methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // Convenience methods for common operations
  create: (url, data) => apiClient.post(url, data),
  update: (url, data) => apiClient.put(url, data),
  remove: (url) => apiClient.delete(url),

  // Cache management
  clearCache,
  clearAllCache,

  // Utility methods
  setAuthToken: (token) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // Batch requests
  all: axios.all,
  spread: axios.spread,
};

// Export the configured client as default
export default apiService;

// Export the original client for advanced usage
export { apiClient };

// Request/Response logging utility (development only)
if (import.meta.env.DEV) {
  // Log cache statistics every 30 seconds
  setInterval(() => {
    const cacheSize = requestCache.size;
    const cacheKeys = Array.from(requestCache.keys());
    console.log(`📊 Cache Status: ${cacheSize} entries`, cacheKeys.slice(0, 3));
  }, 30000);
}
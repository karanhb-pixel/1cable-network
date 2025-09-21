/**
 * Performance monitoring and analytics utilities
 * Provides comprehensive performance tracking for the application
 */

// Performance metrics storage
let performanceMetrics = {
  pageLoadTime: 0,
  domContentLoaded: 0,
  firstPaint: 0,
  firstContentfulPaint: 0,
  largestContentfulPaint: 0,
  firstInputDelay: 0,
  cumulativeLayoutShift: 0,
  totalBlockingTime: 0,
  timeToInteractive: 0,
  navigationTimings: {},
  resourceTimings: [],
  paintTimings: {},
  layoutShiftEntries: [],
  longTasks: [],
  memoryUsage: {},
  customMetrics: {},
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Monitor navigation timing
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        performanceMetrics.navigationTimings = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.navigationStart,
          responseTime: navigation.responseEnd - navigation.requestStart,
          networkLatency: navigation.responseStart - navigation.requestStart,
        };

        performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.navigationStart;
        performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      }
    });

    // Monitor paint timings
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-paint') {
          performanceMetrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          performanceMetrics.firstContentfulPaint = entry.startTime;
        }
      });
    });

    if ('observe' in observer) {
      observer.observe({ entryTypes: ['paint'] });
    }

    // Monitor largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      performanceMetrics.largestContentfulPaint = lastEntry.startTime;
    });

    if ('observe' in lcpObserver) {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Monitor layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          performanceMetrics.cumulativeLayoutShift += entry.value;
          performanceMetrics.layoutShiftEntries.push({
            value: entry.value,
            timestamp: entry.startTime,
            sources: entry.sources,
          });
        }
      });
    });

    if ('observe' in layoutShiftObserver) {
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        performanceMetrics.longTasks.push({
          startTime: entry.startTime,
          duration: entry.duration,
          name: entry.name,
        });

        // Calculate total blocking time
        if (entry.duration > 50) {
          performanceMetrics.totalBlockingTime += entry.duration - 50;
        }
      });
    });

    if ('observe' in longTaskObserver) {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }

    // Monitor resource timings
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        performanceMetrics.resourceTimings.push({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType,
        });
      });
    });

    if ('observe' in resourceObserver) {
      resourceObserver.observe({ entryTypes: ['resource'] });
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = performance.memory;
        performanceMetrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now(),
        };
      };

      updateMemoryUsage();
      setInterval(updateMemoryUsage, 30000); // Update every 30 seconds
    }
  }
};

/**
 * Track custom performance metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {string} unit - Unit of measurement
 */
export const trackCustomMetric = (name, value, unit = 'ms') => {
  performanceMetrics.customMetrics[name] = {
    value,
    unit,
    timestamp: Date.now(),
  };

  if (import.meta.env.DEV) {
    console.log(`📊 Custom Metric: ${name} = ${value}${unit}`);
  }
};

/**
 * Start performance timer
 * @param {string} name - Timer name
 * @returns {Function} - Stop function
 */
export const startTimer = (name) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    trackCustomMetric(`${name}_duration`, duration, 'ms');

    if (import.meta.env.DEV) {
      console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  };
};

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} name - Measurement name
 * @returns {Function} - Wrapped function
 */
export const measureFunction = (fn, name) => {
  return async (...args) => {
    const endTimer = startTimer(name);
    try {
      const result = await fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };
};

/**
 * Get all performance metrics
 * @returns {Object} - Performance metrics object
 */
export const getPerformanceMetrics = () => {
  return { ...performanceMetrics };
};

/**
 * Log performance summary to console (development only)
 */
export const logPerformanceSummary = () => {
  if (!import.meta.env.DEV) return;

  console.group('🚀 Performance Summary');
  console.log('📄 Page Load Time:', `${performanceMetrics.pageLoadTime.toFixed(2)}ms`);
  console.log('🎨 First Paint:', `${performanceMetrics.firstPaint.toFixed(2)}ms`);
  console.log('🖼️ First Contentful Paint:', `${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log('🔍 Largest Contentful Paint:', `${performanceMetrics.largestContentfulPaint.toFixed(2)}ms`);
  console.log('📊 Cumulative Layout Shift:', performanceMetrics.cumulativeLayoutShift.toFixed(4));
  console.log('⏳ Total Blocking Time:', `${performanceMetrics.totalBlockingTime.toFixed(2)}ms`);
  console.log('🧠 Memory Usage:', performanceMetrics.memoryUsage);
  console.log('📦 Long Tasks:', performanceMetrics.longTasks.length);
  console.log('🔗 Resources Loaded:', performanceMetrics.resourceTimings.length);

  if (Object.keys(performanceMetrics.customMetrics).length > 0) {
    console.log('📈 Custom Metrics:', performanceMetrics.customMetrics);
  }

  console.groupEnd();
};

/**
 * Send performance metrics to analytics service
 * @param {string} endpoint - Analytics endpoint URL
 */
export const sendPerformanceMetrics = async (endpoint = '/api/analytics') => {
  try {
    const metrics = getPerformanceMetrics();

    // Add user agent and viewport info
    metrics.userAgent = navigator.userAgent;
    metrics.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    metrics.timestamp = Date.now();

    // Send to analytics service
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    });

    if (import.meta.env.DEV) {
      console.log('📊 Performance metrics sent to analytics');
    }
  } catch (error) {
    console.error('❌ Failed to send performance metrics:', error);
  }
};

/**
 * Performance budget checker
 * @param {Object} budgets - Performance budgets
 */
export const checkPerformanceBudget = (budgets = {}) => {
  const issues = [];

  if (budgets.maxPageLoadTime && performanceMetrics.pageLoadTime > budgets.maxPageLoadTime) {
    issues.push(`Page load time (${performanceMetrics.pageLoadTime.toFixed(2)}ms) exceeds budget (${budgets.maxPageLoadTime}ms)`);
  }

  if (budgets.maxFirstContentfulPaint && performanceMetrics.firstContentfulPaint > budgets.maxFirstContentfulPaint) {
    issues.push(`First Contentful Paint (${performanceMetrics.firstContentfulPaint.toFixed(2)}ms) exceeds budget (${budgets.maxFirstContentfulPaint}ms)`);
  }

  if (budgets.maxCumulativeLayoutShift && performanceMetrics.cumulativeLayoutShift > budgets.maxCumulativeLayoutShift) {
    issues.push(`Cumulative Layout Shift (${performanceMetrics.cumulativeLayoutShift.toFixed(4)}) exceeds budget (${budgets.maxCumulativeLayoutShift})`);
  }

  if (budgets.maxLongTasks && performanceMetrics.longTasks.length > budgets.maxLongTasks) {
    issues.push(`Long tasks count (${performanceMetrics.longTasks.length}) exceeds budget (${budgets.maxLongTasks})`);
  }

  if (issues.length > 0 && import.meta.env.DEV) {
    console.warn('⚠️ Performance Budget Issues:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
  }

  return issues;
};

// Initialize performance monitoring when module loads
if (typeof window !== 'undefined') {
  initPerformanceMonitoring();

  // Log summary on page unload (for debugging)
  window.addEventListener('beforeunload', () => {
    if (import.meta.env.DEV) {
      logPerformanceSummary();
    }
  });
}

export default {
  initPerformanceMonitoring,
  trackCustomMetric,
  startTimer,
  measureFunction,
  getPerformanceMetrics,
  logPerformanceSummary,
  sendPerformanceMetrics,
  checkPerformanceBudget,
};
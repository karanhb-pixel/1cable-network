import { lazy } from 'react';
import React from 'react';

/**
 * Enhanced lazy loading utility with preloading and error handling
 * @param {Function} importFunction - Dynamic import function
 * @param {string} componentName - Name for debugging
 * @returns {Object} - { Component, preload, isLoaded }
 */
export const createLazyComponent = (importFunction, componentName = 'Component') => {
  let isLoaded = false;
  let loadingPromise = null;

  const LazyComponent = lazy(() => {
    return importFunction()
      .then((module) => {
        isLoaded = true;
        console.log(`✅ ${componentName} loaded successfully`);
        return module;
      })
      .catch((error) => {
        console.error(`❌ Failed to load ${componentName}:`, error);
        isLoaded = false;

        // Return a fallback component
        return {
          default: () => (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              <h3>Failed to load {componentName}</h3>
              <p>There was an error loading this component. Please refresh the page.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Refresh Page
              </button>
            </div>
          )
        };
      });
  });

  const preload = () => {
    if (!loadingPromise) {
      loadingPromise = importFunction()
        .then(() => {
          isLoaded = true;
          console.log(`🔄 ${componentName} preloaded successfully`);
        })
        .catch((error) => {
          console.error(`❌ Failed to preload ${componentName}:`, error);
        });
    }
    return loadingPromise;
  };

  return {
    Component: LazyComponent,
    preload,
    isLoaded: () => isLoaded
  };
};

/**
 * Route-based code splitting utilities
 */
export const routeLoaders = {
  // User management routes
  User: () => createLazyComponent(
    () => import('../User/Users/User'),
    'User Management'
  ),

  AddUser: () => createLazyComponent(
    () => import('../User/Add_User/Add_User'),
    'Add User'
  ),

  EditUser: () => createLazyComponent(
    () => import('../User/Edit_User/Edit_User'),
    'Edit User'
  ),

  DeleteUser: () => createLazyComponent(
    () => import('../User/Delete_User/Delete_User'),
    'Delete User'
  ),

  // Plan management routes
  AddWifiPlans: () => createLazyComponent(
    () => import('../component/Wifi_plan/Add_Wifi_plans/Add_Wifi_plans'),
    'Add WiFi Plans'
  ),

  ShowWifiPlans: () => createLazyComponent(
    () => import('../component/Wifi_plan/Show_Wifi_plans/Show_Wifi_plans_2'),
    'Show WiFi Plans'
  ),

  OttPlans: () => createLazyComponent(
    () => import('../component/Ott_plan/Ott_plan'),
    'OTT Plans'
  ),

  // Main components
  Home: () => createLazyComponent(
    () => import('../component/Home'),
    'Home Page'
  ),

  Navbar: () => createLazyComponent(
    () => import('../component/Navbar/navbar'),
    'Navigation'
  ),

  Footer: () => createLazyComponent(
    () => import('../component/footer/Footer'),
    'Footer'
  ),
};

/**
 * Preload critical route components
 */
export const preloadCriticalRoutes = () => {
  const criticalRoutes = [
    routeLoaders.Home,
    routeLoaders.Navbar,
    routeLoaders.Footer
  ];

  // Preload critical components in parallel
  return Promise.all(
    criticalRoutes.map(loader => loader().preload())
  );
};

/**
 * Preload route on hover (for better UX)
 * @param {string} routePath - Route path to preload
 */
export const preloadRouteOnHover = (routePath) => {
  const routeMap = {
    '/': routeLoaders.Home,
    '/user': routeLoaders.User,
    '/add_User': routeLoaders.AddUser,
    '/show_Wifi_plans_2': routeLoaders.ShowWifiPlans,
    '/ott_plan': routeLoaders.OttPlans,
  };

  const loader = routeMap[routePath];
  if (loader) {
    return loader().preload();
  }
};

/**
 * Smart preloading based on user behavior
 */
export const smartPreloading = {
  // Preload likely next routes based on current route
  preloadLikelyRoutes: (currentRoute) => {
    const likelyRoutes = {
      '/': ['/user', '/show_Wifi_plans_2'],
      '/user': ['/add_User', '/show_Wifi_plans_2'],
      '/show_Wifi_plans_2': ['/ott_plan', '/add_Wifi_plans'],
      '/ott_plan': ['/show_Wifi_plans_2', '/user'],
    };

    const routesToPreload = likelyRoutes[currentRoute] || [];
    return Promise.all(
      routesToPreload.map(route => preloadRouteOnHover(route))
    );
  },

  // Preload on idle time
  preloadOnIdle: () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadCriticalRoutes();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        preloadCriticalRoutes();
      }, 2000);
    }
  },

  // Preload on visibility change (when tab becomes visible)
  preloadOnVisibilityChange: () => {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        preloadCriticalRoutes();
      }
    });
  }
};

/**
 * Dynamic component loader with retry logic
 * @param {Function} importFunction - Dynamic import function
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Delay between retries in ms
 */
export const loadComponentWithRetry = async (
  importFunction,
  maxRetries = 3,
  retryDelay = 1000
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const module = await importFunction();
      return module;
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }

  throw lastError;
};

/**
 * Bundle splitting utilities for large components
 */
export const bundleSplitters = {
  // Split large component libraries
  splitComponentLibrary: (components) => {
    return Object.keys(components).reduce((acc, key) => {
      acc[key] = createLazyComponent(
        () => loadComponentWithRetry(() => import(`../${components[key]}`)),
        key
      );
      return acc;
    }, {});
  },

  // Create dynamic route components
  createRouteComponent: (routePath, componentPath) => {
    return createLazyComponent(
      () => loadComponentWithRetry(() => import(`../${componentPath}`)),
      routePath
    );
  }
};

// Initialize smart preloading
if (typeof window !== 'undefined') {
  // Preload critical routes when the app starts
  smartPreloading.preloadOnIdle();

  // Setup visibility change preloading
  smartPreloading.preloadOnVisibilityChange();
}

export default {
  createLazyComponent,
  routeLoaders,
  preloadCriticalRoutes,
  preloadRouteOnHover,
  smartPreloading,
  loadComponentWithRetry,
  bundleSplitters
};
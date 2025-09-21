/**
 * Service Worker for Cable Network Application
 * Provides caching, offline functionality, and performance optimization
 */

const CACHE_NAME = 'cable-network-v1.0.0';
const STATIC_CACHE_NAME = 'cable-network-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cable-network-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Assets to cache on demand
const CACHE_STRATEGY = {
  // Cache first for static assets
  '/assets/': 'cache-first',
  '/images/': 'cache-first',
  '/fonts/': 'cache-first',

  // Network first for API calls
  '/api/': 'network-first',

  // Stale while revalidate for dynamic content
  '/': 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('cable-network-')) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine caching strategy
  const strategy = getCacheStrategy(url.pathname);

  event.respondWith(
    handleRequest(request, strategy)
  );
});

/**
 * Get caching strategy for a URL
 * @param {string} pathname - Request pathname
 * @returns {string} - Caching strategy
 */
function getCacheStrategy(pathname) {
  for (const [pattern, strategy] of Object.entries(CACHE_STRATEGY)) {
    if (pathname.includes(pattern)) {
      return strategy;
    }
  }
  return 'network-first'; // Default strategy
}

/**
 * Handle request based on caching strategy
 * @param {Request} request - Fetch request
 * @param {string} strategy - Caching strategy
 * @returns {Promise<Response>} - Response
 */
async function handleRequest(request, strategy) {
  try {
    switch (strategy) {
      case 'cache-first':
        return await cacheFirst(request);

      case 'network-first':
        return await networkFirst(request);

      case 'stale-while-revalidate':
        return await staleWhileRevalidate(request);

      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error('❌ Request handling error:', error);
    return new Response('Network error', { status: 503 });
  }
}

/**
 * Cache-first strategy - try cache, fallback to network
 * @param {Request} request - Fetch request
 * @returns {Promise<Response>} - Response
 */
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('📦 Serving from cache:', request.url);
    return cached;
  }

  console.log('🌐 Fetching from network:', request.url);
  const response = await fetch(request);

  if (response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}

/**
 * Network-first strategy - try network, fallback to cache
 * @param {Request} request - Fetch request
 * @returns {Promise<Response>} - Response
 */
async function networkFirst(request) {
  try {
    console.log('🌐 Fetching from network:', request.url);
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('📦 Serving from cache (network failed):', request.url);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

/**
 * Stale-while-revalidate strategy - serve from cache, update in background
 * @param {Request} request - Fetch request
 * @returns {Promise<Response>} - Response
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cached = await cache.match(request);

  // Start background fetch
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.log('Background fetch failed:', error);
    });

  // Return cached version immediately if available
  if (cached) {
    console.log('📦 Serving stale from cache:', request.url);
    return cached;
  }

  // Wait for network if no cache
  console.log('🌐 Waiting for network:', request.url);
  return await networkPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Perform background sync operations
 */
async function doBackgroundSync() {
  try {
    // Example: sync offline form submissions
    console.log('🔄 Performing background sync...');

    // Add your background sync logic here
    // For example, sync offline user actions, form submissions, etc.

  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icon-explore.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-close.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
  event.preventDefault();
});

console.log('🔧 Service Worker script loaded');
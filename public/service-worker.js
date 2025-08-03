// Advanced Service Worker for Quran App PWA
const CACHE_VERSION = 'v3.0.0';
const STATIC_CACHE = `quran-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `quran-dynamic-${CACHE_VERSION}`;
const API_CACHE = `quran-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `quran-images-${CACHE_VERSION}`;

// Cache timeouts (in milliseconds)
const CACHE_TIMEOUTS = {
  api: 24 * 60 * 60 * 1000, // 24 hours for API data
  images: 7 * 24 * 60 * 60 * 1000, // 7 days for images
  dynamic: 30 * 24 * 60 * 60 * 1000 // 30 days for dynamic content
};

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/surah',
  '/tajwid',
  '/doa',
  '/more',
  '/sambung-ayat',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/globals.css'
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://equran.id/api/v2/surat',
  '/api/tajwid',
  '/api/doa',
  '/api/tuntunan-sholat/adzan',
  '/api/tuntunan-sholat/doa-setelah-adzan',
  '/api/tuntunan-sholat/iqomah',
  '/api/fikih-nikah'
];

// Network timeout for cache fallback
const NETWORK_TIMEOUT = 3000;

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      
      // Preload critical API data
      caches.open(API_CACHE).then(cache => {
        console.log('[SW] Preloading critical API data');
        return Promise.allSettled(
          API_ENDPOINTS.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  const responseClone = response.clone();
                  cache.put(url, responseClone);
                  return addTimestamp(cache, url);
                }
              })
              .catch(err => console.log(`[SW] Failed to preload ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!validCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;
  
  // Only handle GET requests
  if (method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.startsWith('http')) return;
  
  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationHandler(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handler
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data?.text() || 'Ada update baru di aplikasi Quran!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'quran-notification',
    actions: [
      {
        action: 'open',
        title: 'Buka Aplikasi'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Quran App', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(payload.urls));
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(payload.cacheName));
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
  }
});

// Caching Strategies Implementation

// Cache First - for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cache, request.url)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetchWithTimeout(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      await addTimestamp(cache, request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    const cache = await caches.open(cacheName);
    return await cache.match(request) || createErrorResponse();
  }
}

// Network First - for API requests
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetchWithTimeout(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await addTimestamp(cache, request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    
    return createErrorResponse();
  }
}

// Stale While Revalidate - for dynamic content
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetchWithTimeout(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      addTimestamp(cache, request.url);
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await fetchPromise || createErrorResponse();
}

// Navigation handler with offline support
async function navigationHandler(request) {
  try {
    const networkResponse = await fetchWithTimeout(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation failed, serving offline page');
    return caches.match('/offline') || createErrorResponse();
  }
}

// Helper Functions

function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/icons/') || 
         url.endsWith('.js') || 
         url.endsWith('.css') ||
         url.endsWith('/manifest.json');
}

function isAPIRequest(url) {
  return url.includes('/api/') || 
         url.includes('equran.id/api/') ||
         url.includes('openrouter.ai/api/');
}

function isImageRequest(url) {
  return url.includes('/image') ||
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

async function fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function addTimestamp(cache, url) {
  const timestampKey = `timestamp-${url}`;
  const timestamp = Date.now();
  await cache.put(timestampKey, new Response(timestamp.toString()));
}

async function isExpired(cache, url) {
  const timestampKey = `timestamp-${url}`;
  const timestampResponse = await cache.match(timestampKey);
  
  if (!timestampResponse) return false;
  
  const timestamp = parseInt(await timestampResponse.text());
  const now = Date.now();
  const maxAge = isAPIRequest(url) ? CACHE_TIMEOUTS.api : 
                 isImageRequest(url) ? CACHE_TIMEOUTS.images : 
                 CACHE_TIMEOUTS.dynamic;
  
  return (now - timestamp) > maxAge;
}

function createErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Network error occurred',
      offline: true
    }),
    {
      status: 408,
      statusText: 'Request Timeout',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return Promise.allSettled(
    urls.map(url => 
      fetch(url).then(response => {
        if (response.ok) {
          cache.put(url, response);
          return addTimestamp(cache, url);
        }
      })
    )
  );
}

async function clearCache(cacheName) {
  if (cacheName) {
    return caches.delete(cacheName);
  } else {
    const cacheNames = await caches.keys();
    return Promise.all(cacheNames.map(name => caches.delete(name)));
  }
}

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    info[name] = {
      count: keys.length,
      urls: keys.map(request => request.url)
    };
  }
  
  return info;
}

async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  
  // Check for pending offline actions
  const offlineActions = await getOfflineActions();
  
  for (const action of offlineActions) {
    try {
      await processOfflineAction(action);
      await removeOfflineAction(action.id);
    } catch (error) {
      console.error('[SW] Failed to process offline action:', error);
    }
  }
}

async function getOfflineActions() {
  // Implementation would depend on your offline storage strategy
  // This is a placeholder for actions stored while offline
  return [];
}

async function processOfflineAction(action) {
  // Process the offline action when back online
  return fetch(action.url, action.options);
}

async function removeOfflineAction(actionId) {
  // Remove the processed action from storage
  console.log('[SW] Removed offline action:', actionId);
}

console.log('[SW] Service Worker loaded successfully');
        

          const CACHE_NAME = 'quran-app-v1';
          const OFFLINE_URL = '/offline';

          self.addEventListener('install', event => {
            event.waitUntil(
              caches.open(CACHE_NAME).then(cache => {
                return cache.addAll([
                  '/',
                  '/offline',
                  '/surah',
                  '/sambung-ayat',
                  '/manifest.json'
                ]);
              })
            );
          });

          self.addEventListener('activate', event => {
            event.waitUntil(
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                      return caches.delete(cacheName);
                    }
                  })
                );
              })
            );
          });

          self.addEventListener('fetch', event => {
            if (event.request.method !== 'GET') return;
            
            event.respondWith(
              fetch(event.request)
                .then(response => {
                  return response;
                })
                .catch(() => {
                  if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                  }
                  return Response.error();
                })
            );
          });
        
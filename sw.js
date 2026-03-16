const CACHE_NAME = 'astro-app-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // If the request is for an external image (like Wikimedia)
  if (event.request.url.includes('upload.wikimedia.org')) {
    event.respondWith(
      caches.open('astro-images-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          // Return cached image if we have it, else fetch and cache it
          return response || fetch(event.request, { mode: 'cors', credentials: 'omit' }).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => fetch(event.request)) // Fallback to basic fetch if cache fails
    );
  } else {
    // Standard local asset handling
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

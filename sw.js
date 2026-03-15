self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // A basic pass-through that satisfies Android's offline capability check
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('App is offline');
    })
  );
});

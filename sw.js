const CACHE_NAME = 'danielchali-site-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './portfolio.html',
  './contact.html',
  './css/style.css',
  './js/main.js',
  './js/three-scene.js',
  './js/water-effect.js',
  './assets/Me/DanielChali.png',
  './assets/Me/DredLabs_logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const refresh = fetch(request)
        .then(networkResponse => {
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      // Show cached content immediately, then refresh it silently for the next visit.
      return cachedResponse || refresh;
    })
  );
});

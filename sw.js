const CACHE_NAME = 'pos-system-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './data/item.yml',
  './data/serverlink.yml',
  './library/tailwind.min.css',
  './library/fonts.css',
  './library/js-yaml.min.js',
  './library/dexie.js',
  './fonts/inter-v20-latin-regular.woff2',
  './fonts/inter-v20-latin-500.woff2',
  './fonts/inter-v20-latin-600.woff2',
  './fonts/inter-v20-latin-700.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request).then(res => {
      if (res && res.status === 200 && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return res;
    }))
  );
});

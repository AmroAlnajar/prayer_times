const CACHE_NAME = 'prayer-times-v1'
const urlsToCache = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Always fetch JSON files fresh
      if (event.request.url.includes('.json')) {
        return fetch(event.request)
      }
      // For other files, return cached or fetch
      return response || fetch(event.request)
    })
  )
})

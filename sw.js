const CACHE_NAME = 'prayer-times-v1'

self.addEventListener('install', (event) => {
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Delete any existing caches and take control immediately
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName)
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', (event) => {
  // Always fetch from network, never from cache
  event.respondWith(fetch(event.request))
})

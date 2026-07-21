const CACHE_NAME = 'ta-visto-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/manifest.json'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Network-first para TMDB API e imagens
  if (url.hostname.includes('themoviedb.org') || url.hostname.includes('tmdb.org')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
    return
  }

  // Cache-first para assets estáticos
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached
      return fetch(e.request).then((response) => {
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
        }
        return response
      })
    })
  )
})

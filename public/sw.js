const CACHE_NAME = 'ta-visto-v4'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/manifest.json'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(async (keys) => {
      const stale = keys.filter((k) => k !== CACHE_NAME)
      await Promise.all(stale.map((k) => caches.delete(k)))
      await self.clients.claim()
      // Atualização de um SW antigo: recarrega as abas abertas para sair da versão em cache
      if (stale.length > 0) {
        const windows = await self.clients.matchAll({ type: 'window' })
        windows.forEach((client) => client.navigate(client.url).catch(() => {}))
      }
    })
  )
})

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
      }
      return response
    })
    .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Network-first para TMDB API e imagens
  if (url.hostname.includes('themoviedb.org') || url.hostname.includes('tmdb.org')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
    return
  }

  if (url.origin !== self.location.origin) return

  // Cache-first apenas para bundles com hash (imutáveis entre deploys)
  if (url.pathname.startsWith('/_expo/static/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Network-first para HTML e demais arquivos — garante que novos deploys apareçam
  e.respondWith(networkFirst(e.request))
})

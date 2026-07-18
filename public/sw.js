/* Travel app service worker — cache-everything for offline use.
 * After the first visit, all assets are cached and the app works
 * fully offline (including via Add-to-Home-Screen on iOS/Android).
 */
const CACHE = 'travel-v2'
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)

      if (req.mode === 'navigate') {
        try {
          const fresh = await fetch(req)
          cache.put(req, fresh.clone())
          return fresh
        } catch {
          const cached = await cache.match(req)
          return (
            cached ||
            (await cache.match('./index.html')) ||
            (await cache.match('./')) ||
            Response.error()
          )
        }
      }

      const cached = await cache.match(req)
      if (cached) {
        event.waitUntil(
          fetch(req)
            .then((fresh) => fresh.ok && cache.put(req, fresh))
            .catch(() => {}),
        )
        return cached
      }

      try {
        const fresh = await fetch(req)
        if (fresh.ok) cache.put(req, fresh.clone())
        return fresh
      } catch {
        return Response.error()
      }
    })(),
  )
})

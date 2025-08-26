import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

if ('navigationPreload' in self.registration) {
  self.registration.navigationPreload.enable()
}

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

const navigationHandler = new NetworkFirst({
  cacheName: 'pages',
  networkTimeoutSeconds: 3,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24 * 7,
    }),
  ],
})

const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [/^\/_/, /^\/api/, /\.(?:css|js|png|jpg|svg)$/],
})

registerRoute(navigationRoute)

const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', {
  maxRetentionTime: 24 * 60
})

registerRoute(
  /^https:\/\/cloud\.appwrite\.io\/v1\/.*/i,
  new NetworkFirst({
    cacheName: 'appwrite-api',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24,
      }),
      bgSyncPlugin,
    ],
  })
)

registerRoute(
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
)

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
)

registerRoute(
  /\.(?:css|js)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
)

setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match('/') || caches.match('/index.html')

    case 'image':
      return new Response(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#ddd"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em">Offline</text>
        </svg>
      `, {
        headers: { 'content-type': 'image/svg+xml' }
      })

    default:
      return Response.error()
  }
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})


/* global workbox */
/* global importScripts */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js'
);

if (workbox) {
  workbox.precaching.cleanupOutdatedCaches();
  workbox.core.clientsClaim();
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
  ]);

  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'document' ||
      request.destination === 'manifest' ||
      request.destination === 'x-icon',
    new workbox.strategies.CacheFirst({
      cacheName: 'documents-sa-ios-test-v1',
      plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 7,
              maxEntries: 20
          }),
      ],
  })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-sa-ios-test-v1',
      plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 7,
              maxEntries: 20
          }),
      ],
  })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'fonts-sa-ios-test-v1',
      plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 7,
              maxEntries: 2
          }),
      ],
  })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.CacheFirst({
      cacheName: 'navigates-sa-ios-test-v1',
      plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 7,
              maxEntries: 20
          }),
      ],
  })
  );
  
  workbox.routing.setCatchHandler(async () => {
    return caches.match('/');
  });
} else {
  // eslint-disable-next-line no-console
  console.error(`Workbox didn't load`);
}
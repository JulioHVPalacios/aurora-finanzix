/* ==========================================================================
   VALO OS - ROCK-SOLID PRODUCTION SERVICE WORKER (v1.0.19)
   Zero-Hang Guarantee: Safe Static Caching & Dynamic Asset Caching
   ========================================================================== */

const CACHE_VERSION = 'valo-os-v30-markets-fixed-20260818';

// Only cache essential root assets that exist unconditionally in both dev and production
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/privacy.html'
];


// Install: Skip Waiting and cache only available root assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      for (const asset of STATIC_ASSETS) {
        try {
          const res = await fetch(asset, { cache: 'no-cache' });
          if (res.ok) {
            await cache.put(asset, res);
          }
        } catch (err) {
          console.warn('[VALO SW] Skipped non-critical asset:', asset);
        }
      }
    })
  );
});

// Activate: Clean old caches and claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Notification Click Handler: Focus or Open App Window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});

// Push Notification Listener (Android & Chrome WebPush)
self.addEventListener('push', (event) => {
  let payload = { 
    title: '💎 VALO OS Actualizado', 
    body: 'Nueva versión disponible. Toca para ver tus finanzas.' 
  };
  
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    if (event.data) payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || '💎 VALO OS Actualizado', {
      body: payload.body || 'Nueva versión lista.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      tag: 'valo-push-alert',
      renotify: true,
      data: { url: payload.url || '/' }
    })
  );
});

// Fetch Handler: Bulletproof Network-First with Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for HTML navigation, manifest, and version checks
  if (
    event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.endsWith('version.json') ||
    url.pathname === '/sw.js'
  ) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/')))
    );
    return;
  }

  // Stale-While-Revalidate for JS, CSS, Fonts, Images & Icons
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

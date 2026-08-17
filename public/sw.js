/* ==========================================================================
   AURORA FINANZIX - AUTO-UPDATE & ANDROID SYSTEM PUSH NOTIFICATIONS
   Version: 1.0.6 (2026-08-17)
   ========================================================================== */

const CACHE_VERSION = 'aurora-finanzix-v6-pearl-clarity-20260817-1728';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json',
  '/icon.svg'
];

// Install: Cache core assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches, claim clients, and send native Android notification
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_VERSION) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Send Native Notification to Android Status Bar if permission is granted
      if (self.Notification && self.Notification.permission === 'granted') {
        self.registration.showNotification('✨ Aurora Finanzix Actualizada', {
          body: 'Se ha instalado la última versión con diseño blanco perla y alta legibilidad.',
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200],
          tag: 'finanzix-auto-update',
          renotify: true,
          data: { url: '/' }
        });
      }
    })
  );
});

// Notification Click Handler (opens app when tapped in Android notification bar)
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

// Network-First for HTML, Manifest & Version.json; Stale-While-Revalidate for other assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // HTML, Manifest and Version: Always Network-First
  if (
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
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Other assets (CSS, JS, SVGs, Fonts): Stale-While-Revalidate
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
});

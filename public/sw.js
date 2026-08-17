/* ==========================================================================
   VALO OS - SERVICE WORKER (v1.0.18 PRODUCTION)
   Ultra-Fast Offline Cache, Instant Background Notifications & Updates
   ========================================================================== */

const CACHE_VERSION = 'valo-os-v18-production-20260817';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json',
  '/icon.svg',
  '/src/main.js',
  '/src/styles/design-tokens.css',
  '/src/styles/app.css',
  '/src/services/storage.js',
  '/src/services/i18n.js',
  '/src/services/analytics.js',
  '/src/services/costCalculator.js',
  '/src/components/Navbar.js',
  '/src/components/BottomNav.js',
  '/src/components/DashboardView.js',
  '/src/components/TransactionsView.js',
  '/src/components/SubscriptionsView.js',
  '/src/components/DebtsView.js',
  '/src/components/AnalyticsView.js',
  '/src/components/BudgetsView.js',
  '/src/components/ToolsView.js',
  '/src/components/TransactionModal.js',
  '/src/components/ConnectMobileModal.js',
  '/src/components/ExportImportModal.js'
];

// Install: Cache Core Assets & Skip Waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[VALO SW] Non-fatal cache item warning:', err);
      });
    })
  );
});

// Activate: Claim Clients, Flush Outdated Caches & Send Instant System Notification
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
    }).then(() => {
      // Trigger instant background notification if permission is granted
      if (self.Notification && self.Notification.permission === 'granted') {
        return self.registration.showNotification('💎 VALO OS Actualizado', {
          body: 'Nueva versión v1.0.18 lista con mejoras visuales y bilingües.',
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200],
          tag: 'valo-system-update',
          renotify: true,
          data: { url: '/' }
        });
      }
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

// Background Periodic Sync (checks for updates in Android background without opening app)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-app-updates') {
    event.waitUntil(checkBackgroundUpdate());
  }
});

// Push Notification Listener (triggered via WebPush / Serverless Push)
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

async function checkBackgroundUpdate() {
  try {
    const res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (self.Notification && self.Notification.permission === 'granted') {
        self.registration.showNotification('💎 VALO OS Actualizado', {
          body: `Versión v${data.version} lista. Toca para abrir.`,
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200],
          tag: 'valo-version-alert',
          renotify: true,
          data: { url: '/' }
        });
      }
    }
  } catch (e) {}
}

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
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-While-Revalidate for local assets
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

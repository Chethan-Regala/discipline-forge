// Service Worker for Discipline OS 2026
const CACHE_NAME = 'discipline-os-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Service Worker: Cache failed', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both fail, return offline page (optional)
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for notifications (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(
      self.registration.showNotification('Time to Track Your Habits! 📊', {
        body: 'Don\'t forget to log your daily habits and reflection.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-reminder',
      })
    );
  }
});


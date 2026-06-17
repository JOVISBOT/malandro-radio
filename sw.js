// Malandro Radio (public PWA) service worker -- caches only the app shell so it installs
// and opens instantly. NEVER caches the YouTube player/stream (always live from the network).
const SHELL = 'malandro-public-v1';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==SHELL).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = e.request.url;
  // anything YouTube / google = always network (the live audio+video); only cache our own shell
  if (u.includes('youtube.com') || u.includes('ytimg.com') || u.includes('google')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)).catch(()=>fetch(e.request)));
});

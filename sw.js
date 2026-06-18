// Malandro Radio (public PWA) service worker -- caches only the app shell so it installs
// and opens instantly. NEVER caches the YouTube player/stream (always live from the network).
const SHELL = 'malandro-public-v2';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==SHELL).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = e.request.url;
  // the live stream AND stream.json (current relay URL) must ALWAYS hit the network, never cache
  if (u.includes('trycloudflare.com') || u.includes('/malandro') || u.includes('stream.json')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)).catch(()=>fetch(e.request)));
});

/* Quiet Hours offline support: the app shell is cached on first visit,
   each sound is cached the first time it plays. */
const V = 'qh-4e3484daf3', SHELL = ["./", "css/quiet-hours.css", "js/quiet-hours.js", "manifest.webmanifest", "favicon.svg", "favicon.ico", "icons/icon-192.png", "fonts/fraunces-300.woff2", "fonts/fraunces-400-italic.woff2", "fonts/fraunces-500.woff2", "fonts/instrument-sans-400.woff2", "fonts/instrument-sans-500.woff2", "fonts/instrument-sans-700.woff2"];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('qh-') && k !== V && k !== 'qh-audio').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const u = new URL(r.url);
  if (u.pathname.includes('/audio/')) {
    e.respondWith(caches.open('qh-audio').then(c => c.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }))));
  } else if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r).then(hit => hit || caches.match('./'))));
  } else {
    e.respondWith(caches.match(r).then(hit => { const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }); return hit || net; }));
  }
});

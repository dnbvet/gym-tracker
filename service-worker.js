const CACHE='gym-tracker-v6-9-artwork-test-15';
const STATIC=["./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./assets/bike-v2.jpg", "./assets/chest.jpg", "./assets/cross-v2.jpg", "./assets/dbrow.jpg", "./assets/facepull.jpg", "./assets/foam-v2.jpg", "./assets/glutebridge.jpg", "./assets/hinge.jpg", "./assets/hipabd.jpg", "./assets/hipext.jpg", "./assets/kneeext.jpg", "./assets/lat.jpg", "./assets/legcurl.jpg", "./assets/legpress.jpg", "./assets/pallof.jpg", "./assets/seatedrow.jpg", "./assets/shrug.jpg", "./assets/backextension45.jpg", "./assets/machine-hip-thrust-lower-back-v2.jpg", "./assets/treadmill.jpg", "./assets/rower.jpg", "./assets/legpress-new.jpg", "./assets/facepull-new.jpg", "./assets/dbrow-new.jpg", "./assets/chest-new.jpg", "./assets/lat-new.jpg", "./assets/pallof-new.jpg", "./assets/hipabd-new.jpg", "./assets/hipext-new.jpg", "./assets/shrug-new.jpg", "./assets/glutebridge-new.jpg", "./assets/kneeext-new.jpg", "./assets/legcurl-new.jpg", "./assets/hinge-v2.jpg", "./assets/seatedrow-v2.jpg", "./assets/backextension45-v2.jpg","./assets/hinge-thumb.jpg","./assets/seatedrow-thumb.jpg","./assets/backextension45-thumb.jpg","./assets/bike-thumb.jpg","./assets/cross-thumb.jpg","./assets/foam-thumb.jpg","./assets/machine-hip-thrust-lower-back-thumb.jpg"];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method !== 'GET') return;

  const url=new URL(req.url);

  // Supabase/auth must always remain live.
  if(url.hostname.endsWith('.supabase.co')) return;

  if(req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy=res.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy=res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
      return res;
    }))
  );
});

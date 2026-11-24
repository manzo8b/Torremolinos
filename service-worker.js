// TORREMOLINOS — Scoped offline cache. May be content-hashed in deployment builds.
// Never delete caches belonging to other applications hosted on github.io.
const CACHE_PREFIX='torremolinos-';
const CACHE='torremolinos-v30';
const SCOPE_URL=new URL(self.registration.scope);
const FILES=[
  './','./index.html','./offline.html','./locale-accessibility.js','./approved-clean-2026.css','./approved-clean-2026.js','./footer-professional-2026.css','./footer-professional-2026.js','./brand/torremolinos-logo-clean.svg','./apple-premium.css','./craft-refinement.css','./commercial-experience.css','./product-v6.css','./product-v6.js','./narrative-v7.css','./narrative-v7.js','./luminosity-v8.css','./luminosity-v8.js','./craft-finish.css','./apple-runtime.js','./craft-runtime.js','./design-system-2026.css','./editorial.css','./favicon.svg','./manifest.webmanifest','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png',
  './brand/torremolinos-logo.svg','./brand/torremolinos-logo-light.svg','./brand/torremolinos-symbol.svg','./assets/illustrations/pride-flag-ai.svg','./legal/ai-transparency.html',
  './gallery/','./gallery/styles.css','./gallery/data.js','./gallery/app.js',
  './explore/la-nogalera/','./explore/la-nogalera/styles.css','./explore/la-nogalera/data.js','./explore/la-nogalera/app.js',
  './album-motion.js','./coastal-light.css','./refinement.css','./v06.css','./listen/','./listen/content.js','./legal/','./legal/styles.css','./legal/app.js','./legal/data.js',
  './assets/photos/home-review/home-mangiare-800.webp','./assets/photos/home-review/home-agenda-672.webp','./assets/photos/home-review/home-gallery-800.webp','./assets/photos/home-review/home-stories-800.webp',
  './assets/photos/hero-apple-2026.webp','./assets/photos/hero-apple-2026-mobile.webp','./assets/photos/sound-headphones-torremolinos.webp',
  './assets/photos/hero-torremolinos-desktop.webp',
  './assets/photos/hero-torremolinos-mobile.webp',
  './assets/photos/playa-palmeras-panorama.webp',
  './assets/photos/el-bajondillo-letrero.webp',
  './assets/photos/paseo-palmeras.webp',
  './assets/photos/costa-torremolinos.webp',
  './assets/photos/paseo-centro.webp',
  './stories/','./stories/article.css','./agenda/', './agenda/styles.css', './agenda/app.js', './agenda/events.json', './comer/', './comer/styles.css', './comer/data.js', './comer/app.js',
  './stories/torremolinos-mucho-mas-que-sol-y-playa.html',
  './stories/la-nogalera-donde-la-noche-tiene-historia.html',
  './stories/pasaje-begona-memoria-de-libertad.html',
  './stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html',
  './stories/navidad-ano-nuevo-torremolinos-malaga-2026-2027.html'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE)
          .map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  // Only requests inside our registered scope are eligible for caching.
  // This explicitly excludes other projects (LUNE_X, MANZO AI, etc.)
  // even when they share the same github.io origin.
  if(req.method!=='GET'||url.origin!==SCOPE_URL.origin||
     !url.pathname.startsWith(SCOPE_URL.pathname))return;
  event.respondWith(
    fetch(req).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}
      return resp;
    }).catch(()=>caches.match(req).then(resp=>{
      if(resp)return resp;
      return req.mode==='navigate'?caches.match('./offline.html'):Response.error();
    }))
  );
});

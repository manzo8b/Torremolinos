// TORREMOLINOS v0.4 — offline shell and key editorial pages
const CACHE='torremolinos-v08';
const FILES=[
  './','./index.html','./editorial.css','./favicon.svg','./manifest.webmanifest',
  './brand/torremolinos-logo.svg','./brand/torremolinos-logo-light.svg','./brand/torremolinos-symbol.svg','./assets/illustrations/pride-flag-ai.svg','./legal/ai-transparency.html',
  './gallery/','./gallery/styles.css','./gallery/data.js','./gallery/app.js',
  './v06.css','./listen/','./listen/content.js','./legal/','./legal/styles.css','./legal/app.js','./legal/data.js',
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
  './stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  event.respondWith(
    fetch(req).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}
      return resp;
    }).catch(()=>caches.match(req).then(resp=>{
      if(resp)return resp;
      return req.mode==='navigate'?caches.match('./index.html'):Response.error();
    }))
  );
});

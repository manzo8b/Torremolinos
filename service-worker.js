// TORREMOLINOS v0.4 — offline shell and key editorial pages
const CACHE='torremolinos-v04';
const FILES=[
  './','./index.html','./editorial.css','./favicon.svg','./manifest.webmanifest',
  './assets/photos/hero-torremolinos-desktop.webp',
  './assets/photos/hero-torremolinos-mobile.webp',
  './assets/photos/playa-palmeras-panorama.webp',
  './assets/photos/el-bajondillo-letrero.webp',
  './assets/photos/paseo-palmeras.webp',
  './assets/photos/costa-torremolinos.webp',
  './assets/photos/paseo-centro.webp',
  './stories/','./stories/article.css','./agenda/',
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

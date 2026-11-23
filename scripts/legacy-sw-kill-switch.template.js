/* P0-08 · LEGACY ONLY · inert template.
   This file is NOT the live service-worker.js and MUST NOT be registered.
   Copy to the old GitHub Pages service-worker.js path ONLY after:
   (1) new domain passed QA,
   (2) old HTML ceased registering its former worker,
   (3) an explicit cutover decision.
   It unregisters only TORREMOLINOS and deletes only TORREMOLINOS caches.
*/
'use strict';
const LEGACY_ORIGIN='https://manzo8b.github.io';
const LEGACY_SCOPE='/Torremolinos/';
const CACHE_PREFIX='torremolinos-';
self.addEventListener('install',event=>{
  event.waitUntil(Promise.resolve(self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  const scope=new URL(self.registration.scope);
  if(scope.origin!==LEGACY_ORIGIN || scope.pathname!==LEGACY_SCOPE)return;
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key.startsWith(CACHE_PREFIX)).map(key=>caches.delete(key))
      ))
      .then(()=>self.registration.unregister())
  );
});
// No fetch handler: new navigations fall through to the network.
// Do not redirect clients or touch other registered service workers.

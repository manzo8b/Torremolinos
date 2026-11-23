import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sw=read('service-worker.js');
const root=resolve(new URL('..',import.meta.url).pathname);
const portTool=join(root,'scripts/version_sw_cache.mjs');

function makeEvents(){
 const events={};
 const deleted=[];
 const claimed=[];
 let cacheNames=['torremolinos-v27','torremolinos-v29','lune-x-v4','manzo-ai-v5','shared-other-cache'];
 const context={
   URL,
   caches:{
     keys:async()=>cacheNames,
     delete:async name=>{deleted.push(name);cacheNames=cacheNames.filter(x=>x!==name);return true},
     open:async()=>({put:async()=>true,match:async()=>null}),
     match:async()=>null,
   },
   self:{
     registration:{scope:'https://manzo8b.github.io/Torremolinos/'},
     location:{origin:'https://manzo8b.github.io'},
     clients:{claim:async()=>{claimed.push(true)}},
     skipWaiting:()=>{},
     addEventListener:(name,fn)=>{events[name]=fn},
   },
   Response:{error:()=>({error:true})},
   fetch:async()=>({ok:true,clone(){return this}}),
 };
 vm.runInNewContext(sw,context);
 return {events,deleted,claimed};
}
test('Only TORREMOLINOS caches are ever evicted, never other projects',async()=>{
 const {events,deleted,claimed}=makeEvents();
 let operation;
 events.activate({waitUntil:p=>{operation=p}});
 await operation;
 assert.deepEqual(deleted,['torremolinos-v27']);
 assert.equal(claimed.length,1);
 assert.match(sw,/CACHE_PREFIX='torremolinos-'/);
 assert.match(sw,/keys\.filter\(key=>key\.startsWith\(CACHE_PREFIX\)&&key!==CACHE\)/);
});
test('Fetch interception is strictly limited to this application scope',async()=>{
 const {events}=makeEvents();
 for(const url of [
   'https://manzo8b.github.io/Lune_X/assets/audio/music.mp3',
   'https://manzo8b.github.io/manzo-ai/',
   'https://example.com/Torremolinos/',
   'https://manzo8b.github.io/Torremolinos-other/',
 ]){
   let called=0;
   events.fetch({request:{method:'GET',url},respondWith:()=>{called++}});
   assert.equal(called,0,url+' must not be intercepted');
 }
 let handled=0;let completed;
 events.fetch({
  request:{method:'GET',url:'https://manzo8b.github.io/Torremolinos/comer/'},
  respondWith:p=>{handled++;completed=p}
 });
 assert.equal(handled,1);
 await completed;
 let posted=0;
 events.fetch({
  request:{method:'POST',url:'https://manzo8b.github.io/Torremolinos/api'},
  respondWith:()=>{posted++}
 });
 assert.equal(posted,0);
});
test('PWA still has a relative manifest and explicit offline fallback',()=>{
 const manifest=JSON.parse(read('manifest.webmanifest'));
 assert.equal(manifest.start_url,'./');
 assert.equal(manifest.scope,'./');
 assert.match(sw,/req\.mode/);
 assert.match(sw,/offline\.html/);
 assert.match(sw,/torremolinos-v29/);
});
test('Build-time cache revision depends on precache bytes and stays deterministic',()=>{
 const folder=join(root,'artifacts','sw-cache-fixture');
 const report=join(root,'artifacts','sw-cache-fixture-report.json');
 rmSync(folder,{recursive:true,force:true});
 try{
  mkdirSync(folder,{recursive:true});
  writeFileSync(join(folder,'index.html'),'<!doctype html><title>Test</title>','utf8');
  const list=['./'];
  for(let i=0;i<12;i++){
   const file='asset'+i+'.js';
   writeFileSync(join(folder,file),'window.a'+i+'='+i+';','utf8');
   list.push('./'+file);
  }
  const worker=sw.replace(/const FILES=\[[\s\S]*?\];/,
    'const FILES=['+list.map(p=>JSON.stringify(p)).join(',')+'];')
    .replaceAll('"./'," './").replaceAll('",', "',").replaceAll('"];', "'];");
  // Generate a straightforward single-quoted fixture to match the SW parser.
  const normalized=worker.replace(/const FILES=\[[\s\S]*?\];/,
    'const FILES=['+list.map(p=>"'"+p+"'").join(',')+'];');
  writeFileSync(join(folder,'service-worker.js'),normalized,'utf8');
  const build=()=>spawnSync(process.execPath,[portTool,'--root','artifacts/sw-cache-fixture',
    '--report','artifacts/sw-cache-fixture-report.json'],{cwd:root,encoding:'utf8'});
  let result=build();
  assert.equal(result.status,0,result.stderr);
  let a=JSON.parse(readFileSync(report,'utf8')).cache;
  assert.match(a,/^torremolinos-h[a-f0-9]{16}$/);
  result=build();
  assert.equal(result.status,0,result.stderr);
  let b=JSON.parse(readFileSync(report,'utf8')).cache;
  assert.equal(a,b,'same assets should produce the same cache revision');
  writeFileSync(join(folder,'asset4.js'),'window.changed=true;','utf8');
  result=build();
  assert.equal(result.status,0,result.stderr);
  let c=JSON.parse(readFileSync(report,'utf8')).cache;
  assert.notEqual(c,b,'asset change must invalidate the cache');
 } finally {
  rmSync(folder,{recursive:true,force:true});
  rmSync(report,{force:true});
 }
});

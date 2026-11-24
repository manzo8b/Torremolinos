import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const read=path=>readFileSync(join(root,path));
test('Home icon uses exactly the official blue wave symbol',()=>{
 const svg=read('favicon.svg').toString('utf8');
 const logo=read('brand/torremolinos-logo-clean.svg').toString('utf8');
 assert.match(svg,/stroke="#096BCB"/);
 assert.match(svg,/M8 46C33 27 54 29 75 42S118 57 143 39/);
 assert.match(logo,/M8 46C33 27 54 29 75 42S118 57 143 39/);
 assert.equal(read('brand/torremolinos-symbol.svg').toString('utf8'),svg);
});
test('PWA icons use valid PNG format and exact dimensions',()=>{
 for(const [filename,size] of [['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]){
  const bytes=read('icons/'+filename);
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(bytes.readUInt32BE(16),size);
  assert.equal(bytes.readUInt32BE(20),size);
 }
});
test('Manifest, home page, and PWA cache contain consistent icons',()=>{
 const manifest=JSON.parse(read('manifest.webmanifest').toString('utf8'));
 assert.equal(manifest.start_url,'./');
 assert.equal(manifest.scope,'./');
 assert.deepEqual(manifest.icons.slice(0,2).map(i=>i.sizes),['192x192','512x512']);
 const html=read('index.html').toString('utf8');
 assert.ok(html.includes('rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png"'));
 const sw=read('service-worker.js').toString('utf8');
 assert.ok(sw.includes("torremolinos-v30"));
 for(const p of ['icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png'])assert.ok(sw.includes("'./"+p+"'"));
});

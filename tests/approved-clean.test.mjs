import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const page=read('index.html'),css=read('approved-clean-2026.css'),
 script=read('approved-clean-2026.js'),sw=read('service-worker.js');
test('approved clean Home has four real navigation cards and the compact audio section directly afterwards',()=>{
 assert.equal((page.match(/class="approved-feature-card"/g)||[]).length,4);
 for(const ref of ['href="comer/"','href="agenda/"','href="gallery/"','href="stories/"'])assert.ok(page.includes(ref),ref);
 assert.ok(page.indexOf('id="clean-access"')<page.indexOf('id="sound"'));
 assert.ok(page.indexOf('id="sound"')<page.indexOf('id="discover"'));
 assert.equal((page.match(/id="torremolinos-audio"/g)||[]).length,1);
 assert.equal((page.match(/id="sound"/g)||[]).length,1);
});
test('approved design never replaces the visitor planner or original documentary hero assets',()=>{
 for(const id of ['id="cards"','id="filters"','id="lang"','id="plan"','id="route"','id="loadMap"'])
  assert.ok(page.includes(id),id);
 for(const item of ['hero-apple-2026.webp','hero-apple-2026-mobile.webp'])
  assert.ok(page.includes(item)||css.includes(item));
 assert.ok(page.includes('brand/torremolinos-logo-clean.svg'));
});
test('the new UI is white and blue, never orange/cream chapter fills',()=>{
 assert.match(css,/--ac-paper:#FFFFFF/);
 assert.match(css,/--ac-blue:#096BCB/);
 assert.match(css,/#F4F8FC/);
 assert.doesNotMatch(css,/background:\s*#F58A17/i);
 assert.doesNotMatch(css,/background:\s*#FFF3E6/i);
 assert.ok(css.includes('approved-feature-card'));
});
test('photographic credits are moved outside media frames without being discarded',()=>{
 new vm.Script(script,{filename:'approved-clean-2026.js'});
 assert.match(script,/movePhotoCredits\(\)/);
 assert.match(script,/photo-credit-outside/);
 assert.match(script,/\.magazine-text/);
 assert.match(css,/\.magazine-card \.cover :is\(\.cover-label,\.photoattribution\)/);
});
test('translated cards and headings cover all six supported languages',()=>{
 for(const code of ['es','en','it','de','fr','ru'])assert.match(script,new RegExp('\\b'+code+':\\{'));
 assert.ok(script.includes('Mare, sapori, eventi e storie sulla Costa del Sol'));
 assert.match(script,/MutationObserver/);
});
test('PWA includes updated UI and brand asset without breaking offline fallback',()=>{
 for(const name of ['approved-clean-2026.css','approved-clean-2026.js','torremolinos-logo-clean.svg','offline.html'])
  assert.ok(sw.includes(name),name);
 assert.ok(sw.includes('torremolinos-v27'));
});

test('chosen Sound image exists, is WebP, and is disclosed as an AI illustration',()=>{
 const photo=readFileSync(new URL('../assets/photos/sound-headphones-torremolinos.webp',import.meta.url));
 assert.ok(photo.length>10000,'missing or corrupt Sound image');
 assert.equal(photo.toString('ascii',0,4),'RIFF');
 assert.equal(photo.toString('ascii',8,12),'WEBP');
 assert.match(page,/src="assets\/photos\/sound-headphones-torremolinos\.webp"/);
 assert.match(page,/Immagine illustrativa generata con IA/);
 assert.doesNotMatch(page,/src="assets\/photos\/mar-mediterraneo\.webp"/);
 assert.match(sw,/\.\/assets\/photos\/sound-headphones-torremolinos\.webp/);
 assert.equal((page.match(/id="torremolinos-audio"/g)||[]).length,1);
});

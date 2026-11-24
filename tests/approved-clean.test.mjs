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
 assert.ok(sw.includes('torremolinos-v30'));
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

// Review §2: independent photographic sources, real WebP files, responsive markup.
test('review Home cards use four supplied documentary photos and valid responsive sources',()=>{
 const section=page.match(/<section id="clean-access"[\s\S]*?<\/section>/)[0];
 const assets=["assets/photos/home-review/home-mangiare-800.webp","assets/photos/home-review/home-mangiare-1600.webp","assets/photos/home-review/home-agenda-672.webp","assets/photos/home-review/home-gallery-800.webp","assets/photos/home-review/home-gallery-1600.webp","assets/photos/home-review/home-stories-800.webp","assets/photos/home-review/home-stories-1600.webp"];
 for(const name of assets){const bytes=readFileSync(new URL('../'+name,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length>10000&&bytes.length<=250000,name);assert.ok(section.includes(name),name);}
 assert.equal((section.match(/data-review-photo=/g)||[]).length,4);
 assert.doesNotMatch(section,/sunset-ai\.webp/);
 assert.match(section,/data-review-credit/);
 for(const name of assets.filter(x=>!x.includes('-1600.')))assert.ok(sw.includes(name),'missing offline card '+name);
});

test('Home review Gallery is one three-photo documentary strip with one action',()=>{
 const section=page.match(/<section[^>]*id="photodiary"[\s\S]*?<\/section>/)[0];
 assert.equal((section.match(/<figure>/g)||[]).length,3);
 assert.equal((section.match(/© Archivo fotográfico TORREMOLINOS/g)||[]).length,3);
 assert.equal((section.match(/href="gallery\/"/g)||[]).length,1);
 assert.doesNotMatch(page,/<section class="gallery-feature shell"/);
 assert.doesNotMatch(page,/tryImage\('assets\/photos\/album\/blue-hour-ai\.webp'/);
});

test('Gallery strip uses all six supplied WebP variants and caches the small versions',()=>{
 const section=page.match(/<section[^>]*id="photodiary"[\s\S]*?<\/section>/)[0];
 const assets=["assets/photos/home-review/gallery-forme-800.webp","assets/photos/home-review/gallery-forme-1600.webp","assets/photos/home-review/gallery-luce-800.webp","assets/photos/home-review/gallery-luce-1600.webp","assets/photos/home-review/gallery-dettagli-800.webp","assets/photos/home-review/gallery-dettagli-1152.webp"];
 for(const path of assets){const b=readFileSync(new URL('../'+path,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.ok(b.length>10000&&b.length<=250000,path);assert.ok(section.includes(path),path);if(path.endsWith('-800.webp'))assert.ok(sw.includes(path));}
 assert.equal((section.match(/srcset=/g)||[]).length,3);
 assert.equal((section.match(/width="800" height="533"/g)||[]).length,3);
 assert.doesNotMatch(section,/palmeras-sol\.webp|el-bajondillo-letrero\.webp|paseo-palmeras\.webp/);
});

test('Home review Stories keeps three articles and seasonal dossier, without redundant dining/San Miguel blocks',()=>{
 const section=page.match(/<section[^>]*id="stories"[\s\S]*?<\/section>/)[0];
 assert.equal((section.match(/class="magazine-card(?: primary)?"/g)||[]).length,3);
 assert.equal((section.match(/class="l8-season-promo"/g)||[]).length,1);
 assert.doesNotMatch(section,/class="magazine-extra"/);
 assert.doesNotMatch(page,/class="directory-teaser"/);
 assert.equal((section.match(/class="photoattribution"/g)||[]).length,3);
 assert.match(section,/Tyk · CC BY-SA 3\.0 · 2010/);
 assert.match(section,/BernardaAlba · CC0 · 2024/);
});

test('Home Agenda derives the next three confirmed future events and real editorial date',()=>{
 const sandbox={module:{exports:{}}};vm.runInNewContext(read('home-agenda.js'),sandbox);
 const {upcoming,localDay,validDate}=sandbox.module.exports;
 const data=JSON.parse(read('agenda/events.json'));
 const ids=(input,now)=>Array.from(upcoming(input,new Date(now)),x=>x.id);
 assert.deepEqual(ids(data,'2026-11-24T09:00:00+01:00'),['drag-mariquita-28nov26','fetish-awards-4dec26','ellas-12dec26']);
 assert.deepEqual(ids(data,'2028-01-01T00:00:00Z'),[]);
 assert.equal(localDay(new Date('2026-11-24T23:30:00Z')),'2026-11-25');
 assert.equal(validDate('2026-02-30'),false);
 assert.deepEqual(ids({events:[{id:'pending',status:'pending',start:'2027-01-01',title:'Pending',venue:'Test'},{id:'past',status:'confirmed',start:'2026-11-23',title:'Past',venue:'Test'},{id:'future',status:'confirmed',start:'2026-11-25',title:'Future',venue:'Test'}]},'2026-11-24T09:00:00Z'),['future']);
 const section=page.match(/<section[^>]*id="agenda-home"[\s\S]*?<\/section>/)[0];
 assert.doesNotMatch(section,/<img\b/);
 assert.equal((section.match(/class="agenda-home-btn"/g)||[]).length,1);
 assert.match(read('home-agenda.js'),/data\.editorialUpdated/);
 assert.ok(sw.includes("'./home-agenda.js'"));
});

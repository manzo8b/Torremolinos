import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const gallerySource=read('gallery/data.js');
const galleryApp=read('gallery/app.js');
const comerApp=read('comer/app.js');
const comerData=read('comer/data.js');
const comerHTML=read('comer/index.html');
const wrap={};
vm.runInNewContext(gallerySource,{window:wrap});
const gallery=wrap.TORREMOLINOS_GALLERY;
const languages=['es','en','it','de','fr','ru'];
test('C-01 Gallery has a real title and descriptive alternative label for every declared language',()=>{
 assert.ok(gallery);
 assert.equal(gallery.images.length,9);
 assert.equal(gallery.images.filter(x=>x.publicationStatus==='pending_review').length,2);
 for(const entry of gallery.images){
  assert.ok(['user_photo','ai','illustration'].includes(entry.provenance));
  for(const lang of languages){
   assert.ok(entry.title?.[lang]?.trim(),entry.id+' missing title '+lang);
   assert.ok(entry.alt?.[lang]?.trim(),entry.id+' missing alt '+lang);
   assert.notEqual(entry.alt[lang],'AI','Vague AI-only alt '+entry.id);
   assert.ok(entry.alt[lang].length>=10,entry.id+' too short alt '+lang);
  }
 }
 for(const lang of languages){
  assert.ok(gallery.translations?.[lang]?.previous);
  assert.ok(gallery.translations?.[lang]?.next);
  assert.ok(gallery.translations?.[lang]?.languageLabel);
 }
 new vm.Script(galleryApp,{filename:'gallery/app.js'});
 assert.match(galleryApp,/setAttribute\("aria-label",tr\("previous"\)\)/);
 assert.match(galleryApp,/setAttribute\("aria-label",tr\("next"\)\)/);
 assert.match(galleryApp,/\$\("#viewerCredit"\)\.textContent=tr\(creditKey\(entry\)\)/);
 assert.match(galleryApp,/if\(entry\.publicationStatus==="pending_review"\)return/);
});
test('C-10 Comer featured copy avoids unverified paid/non-paid assertions in all six languages',()=>{
 new vm.Script(comerApp,{filename:'comer/app.js'});
 assert.equal((comerApp.match(/featuredLead:"/g)||[]).length,6);
 assert.equal((comerApp.match(/transparency:"/g)||[]).length,6);
 assert.equal((comerApp.match(/pending:"/g)||[]).length,6);
 assert.match(comerApp,/rapporti commerciali restano da verificare/i);
 assert.ok(comerApp.includes('posibles vínculos comerciales'));
 assert.ok(comerApp.includes('Возможные коммерческие связи'));
 assert.doesNotMatch(comerApp,/No es un ranking, una puntuación ni una selección anunciada como patrocinada/);
});
test('C-12 Comer has 9 source-linked static HTML records under noscript, with documented dates',()=>{
 assert.match(comerHTML,/<noscript>[\s\S]*<\/noscript>/);
 const area=comerHTML.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
 assert.ok(area);
 const items=[...area.matchAll(/<li>[\s\S]*?<\/li>/g)].map(m=>m[0]);
 assert.equal(items.length,9);
 const names=[...comerData.matchAll(/\bid:"[^"]+",name:"([^"]+)"/g)].map(m=>m[1]);
 assert.equal(names.length,9);
 for(const item of items){
  assert.match(item,/<strong>.+<\/strong>/);
  assert.match(item,/<time datetime="2026-11-02">/);
  assert.match(item,/<a href="https:\/\//);
  assert.match(item,/rel="noopener noreferrer"/);
 }
 for(const n of names)assert.ok(area.includes(n),n+' missing in no-JS fallback');
});
test('C-17 licensed image credits directly link to source and license without asserting an undocumented crop',()=>{
 const specs=[
  ['stories/la-nogalera-donde-la-noche-tiene-historia.html','La_Nogalera_view.jpg','creativecommons.org/licenses/by-sa/3.0/deed.es','Tyk'],
  ['stories/pasaje-begona-memoria-de-libertad.html','Pasaje.bego%C3%B1a.jpg','creativecommons.org/publicdomain/zero/1.0/deed.es','BernardaAlba']
 ];
 for(const [path,source,license,author] of specs){
  const html=read(path);
  const credit=html.match(/<figcaption class="photo-credit">([\s\S]*?)<\/figcaption>/)?.[1];
  assert.ok(credit,path+' credit missing');
  assert.ok(credit.includes(source),path+' missing source link');
  assert.ok(credit.includes(license),path+' missing license link');
  assert.ok(credit.includes(author),path+' missing author');
  assert.ok(credit.includes('Presentación redimensionada'),path+' missing resize indication');
  assert.match(html,/<time datetime="2026-11-02">2 noviembre 2026<\/time>/);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const langs=['es','en','it','de','fr','ru'],base='https://manzo8b.github.io/Torremolinos/listen/';
const url=l=>base+(l==='es'?'':l+'.html');
test('Sound has six crawlable translated pages with reciprocal SEO links',()=>{
 const ctx={window:{}};vm.runInNewContext(read('listen/content.js'),ctx);
 const dict=ctx.window.TORREMOLINOS_LISTEN_I18N;
 new vm.Script(read('listen/language.js'));
 for(const l of langs){
  const p=read('listen/'+(l==='es'?'index':l)+'.html');
  assert.ok(p.includes('<html lang="'+l+'">'));
  assert.ok(p.includes('rel="canonical" href="'+url(l)+'"'));
  for(const k of langs)assert.ok(p.includes('hreflang="'+k+'" href="'+url(k)+'"'));
  assert.ok(p.includes('hreflang="x-default" href="'+base+'"'));
  assert.ok(p.includes(dict[l].headline.replaceAll('&','&amp;')));
  const article=p.match(/<div id="articleText"[^>]*>([\s\S]*?)<\/div>/)[1];
  assert.equal((article.match(/<p>/g)||[]).length,4);
  assert.ok(p.includes('src="language.js"'));
  assert.ok(read('sitemap.xml').includes('<loc>'+url(l)+'</loc>'));
 }
 assert.ok(read('service-worker.js').includes("'./listen/language.js'"));
});

test('Gallery captions, alt text and viewer controls exist in all six languages',()=>{
 const ctx={window:{}};vm.runInNewContext(read('gallery/data.js'),ctx);
 const d=ctx.window.TORREMOLINOS_GALLERY;
 for(const item of d.images)for(const l of langs){assert.ok(item.title[l],item.id+' title '+l);assert.ok(item.alt[l],item.id+' alt '+l)}
 for(const l of langs)for(const k of ['previous','next','language','categories','navigation','heroAlt'])assert.ok(d.translations[l][k],l+' '+k);
 assert.equal(d.images.filter(x=>x.publicationStatus==='pending_review').length,2);
 new vm.Script(read('gallery/app.js'));
});

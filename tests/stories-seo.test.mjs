import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const langs=['es','en','it','de','fr','ru'],base='https://manzo8b.github.io/Torremolinos/stories/';
const url=l=>base+(l==='es'?'':l+'.html');
test('Stories indices have real translated content and reciprocal hreflang; dossiers retain Spanish language',()=>{
const original=read('stories/index.html');
const photos=p=>[...p.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m=>m[1]);
for(const l of langs){const p=read('stories/'+(l==='es'?'index':l)+'.html');assert.ok(p.includes('<html lang="'+l+'">'));assert.ok(p.includes('rel="canonical" href="'+url(l)+'"'));for(const k of langs)assert.ok(p.includes('hreflang="'+k+'" href="'+url(k)+'"'));assert.ok(p.includes('hreflang="x-default" href="'+base+'"'));assert.equal((p.match(/<a class="story-card/g)||[]).length,6);assert.deepEqual(photos(p),photos(original));assert.ok(read('sitemap.xml').includes('<loc>'+url(l)+'</loc>'));if(l!=='es'){assert.equal((p.match(/href="[^"]+\.html" hreflang="es"/g)||[]).length,5);assert.ok(p.includes('href="../listen/'+l+'.html"'));assert.notEqual(p.match(/<h1>([^<]+)<\/h1>/)[1]+p.match(/<section class="index-hero">[\s\S]*?<p>([^<]+)/)[1],original.match(/<h1>([^<]+)<\/h1>/)[1]+original.match(/<section class="index-hero">[\s\S]*?<p>([^<]+)/)[1]);}}
new vm.Script(read('stories/language.js'));});

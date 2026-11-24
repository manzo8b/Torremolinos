import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Gallery initial HTML matches every published source, excludes pending images and preserves hydration geometry',()=>{
 const d=JSON.parse(read('gallery/data.js').replace(/^window\.TORREMOLINOS_GALLERY=/,'').replace(/;\s*$/,''));
 const published=d.images.filter(x=>x.publicationStatus!=='pending_review');
 const html=read('gallery/index.html').split('id="galleryGrid"')[1].split('id="empty"')[0];
 assert.deepEqual([...html.matchAll(/data-gallery-id="([^"]+)"/g)].map(x=>x[1]),published.map(x=>x.id));
 for(const e of published)assert.ok(html.includes('src="'+e.src+'"'));
 assert.doesNotMatch(read('gallery/app.js'),/main\.append\(article\)/);
 assert.match(html,/loading="eager" decoding="async" fetchpriority="high"/);
});

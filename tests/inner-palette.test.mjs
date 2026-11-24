import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pages=["agenda/index.html","comer/index.html","gallery/index.html","explore/index.html","explore/la-nogalera/index.html","listen/index.html","tu-torremolinos/index.html","offline.html","stories/index.html","stories/la-nogalera-donde-la-noche-tiene-historia.html","stories/navidad-ano-nuevo-torremolinos-malaga-2026-2027.html","stories/pasaje-begona-memoria-de-libertad.html","stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html","stories/torremolinos-mucho-mas-que-sol-y-playa.html","legal/accessibility.html","legal/ai-transparency.html","legal/contact.html","legal/cookie-policy.html","legal/copyright-credits.html","legal/editorial-policy.html","legal/event-source-policy.html","legal/index.html","legal/privacy-policy.html","legal/terms-of-use.html"];
test('All 24 active inner pages load the approved shared palette last; Home and preview are excluded',()=>{
 for(const path of pages){
  const html=read(path),head=html.split('</head>')[0];
  assert.match(html,/<body[^>]*data-torre-palette="/,path);
  const links=[...head.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)];
  assert.ok(links.at(-1)?.[0].includes('inner-palette-2026.css'),path);
 }
 for(const path of ['index.html','anteprima/index.html'])assert.doesNotMatch(read(path),/inner-palette-2026\.css|data-torre-palette=/);
 assert.ok(read('service-worker.js').includes("'./inner-palette-2026.css'"));
});
test('Palette uses exact approved Home tokens, with WCAG AA contrast on intended pairs',()=>{
 const css=read('inner-palette-2026.css'),home=read('approved-clean-2026.css');
 const colors=['#FFFFFF','#F4EFE6','#FBF8F2','#10244B','#096BCB','#0758AE','#596579','#E3EAF3'];
 for(const hex of colors){assert.ok(css.includes(hex),hex);assert.ok(home.includes(hex),hex)}
 const L=hex=>{const channels=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*channels[0]+.7152*channels[1]+.0722*channels[2]};
 for(const [a,b] of [['#10244B','#F4EFE6'],['#10244B','#FBF8F2'],['#FFFFFF','#096BCB'],['#0758AE','#F4EFE6'],['#0758AE','#FBF8F2'],['#596579','#F4EFE6'],['#F4EFE6','#10244B']]){
  const contrast=(Math.max(L(a),L(b))+.05)/(Math.min(L(a),L(b))+.05);assert.ok(contrast>=4.5,a+' '+b+' '+contrast);
 }
 // Explicit scope excludes Home. No dimension, positioning, crop or font changes.
 assert.doesNotMatch(css,/(?:^|[;{])\s*(?:width|height|min-width|max-width|min-height|max-height|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?|display|position|object-fit|object-position|font(?:-[a-z]+)?|grid[^:]*|flex[^:]*)\s*:/m);
});

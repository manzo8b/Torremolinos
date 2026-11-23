import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const home=read('index.html');
const css=read('approved-clean-2026.css');
const registry=JSON.parse(read('docs/C06_ESSENTIALS_SOURCE_REGISTRY.json'));
const galleryData=read('gallery/data.js');
const galleryApp=read('gallery/app.js');
const pages=[
 'stories/torremolinos-mucho-mas-que-sol-y-playa.html',
 'stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html',
 'stories/la-nogalera-donde-la-noche-tiene-historia.html',
 'stories/pasaje-begona-memoria-de-libertad.html',
 'stories/navidad-ano-nuevo-torremolinos-malaga-2026-2027.html'
];
test('C-06 has three preserved cards and precise clickable sources with safety limits',()=>{
 const useful=home.match(/<section class="section shell" id="useful">([\s\S]*?)<\/section>/)?.[1];
 assert.ok(useful);
 assert.equal((useful.match(/class="infocard"/g)||[]).length,3,'Design must keep 3 Essentials cards');
 assert.match(useful,/renfe\.com\/es\/es\/cercanias\/cercanias-malaga\/mapas/);
 assert.match(useful,/juntadeandalucia\.es\/organismos\/ema\/areas\/emergencias-112/);
 assert.match(useful,/turismotorremolinos\.es\/es\/descubre\/playas\/playas-accesibles/);
 assert.match(useful,/href="tel:112"/);
 for(const key of ['airportChecked','emergencyChecked','emergencySource','accessChecked'])
  assert.match(useful,new RegExp('data-t="'+key+'"'));
 assert.match(css,/\.infocard \.essentials-verified/);
 assert.doesNotMatch(useful,/24\/7|garantizados|always open|en tiempo real/);
});
test('C-06 internal registry has traceable official sources and no fabricated live availability',()=>{
 assert.equal(registry.schemaVersion,1);
 assert.equal(registry.verifiedDate,'2026-11-23');
 assert.equal(registry.publicationState,'internal_reference_only');
 assert.equal(registry.records.length,6);
 assert.equal(new Set(registry.records.map(x=>x.id)).size,6);
 for(const entry of registry.records){
  assert.ok(entry.fact_es&&entry.limitations_es);
  assert.match(entry.url,/^https:\/\//);
  assert.ok(['approved_reference','staging_reference','do_not_publish_without_reverification'].includes(entry.uiStatus));
 }
 assert.equal(registry.records.filter(x=>x.uiStatus==='approved_reference').length,3);
 assert.equal(registry.records.find(x=>x.id==='hospital-maritimo').uiStatus,'do_not_publish_without_reverification');
});
test('C-01 Gallery filter group switches its aria label across six languages',()=>{
 const dataContext={window:{}};
 vm.runInNewContext(galleryData,dataContext);
 const data=dataContext.window.TORREMOLINOS_GALLERY;
 for(const l of ['es','en','it','de','fr','ru'])
  assert.ok(data.translations[l].filterGroup,'Missing filter group '+l);
 assert.match(galleryApp,/\.filterbar"\)\?\.setAttribute\("aria-label",tr\("filterGroup"\)\)/);
});
test('C-17 five published articles retain original dates and declare canonical breadcrumbs',()=>{
 const origin='https://manzo8b.github.io/Torremolinos/';
 const expectedDates=['2026-11-02','2026-11-02','2026-11-02','2026-11-02','2026-11-15'];
 for(let i=0;i<pages.length;i++){
  const page=pages[i],html=read(page),date=expectedDates[i];
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical,origin+page);
  const json=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m=>JSON.parse(m[1]));
  const item=json.find(x=>x['@type']==='BreadcrumbList');
  assert.ok(item,page+' missing breadcrumbs');
  assert.equal(item.itemListElement.length,3);
  assert.equal(item.itemListElement[0].item,origin);
  assert.equal(item.itemListElement[1].item,origin+'stories/');
  assert.equal(item.itemListElement[2].item,canonical);
  assert.match(html,new RegExp('<time datetime="'+date+'">'));
  const article=json.find(x=>['Article','NewsArticle'].includes(x['@type']));
  assert.equal(article?.datePublished,date,page+' metadata publication date changed');
 }
});

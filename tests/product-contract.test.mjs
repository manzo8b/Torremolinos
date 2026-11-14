import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const file = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = file('index.html');
const css = file('design-system-2026.css');

test('home inline JavaScript compiles', () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  const js = scripts.map(x => x[1]).filter(s => s.trim() && !s.trim().startsWith('{"@context"'));
  assert.ok(js.length > 0);
  js.forEach((s, i) => assert.doesNotThrow(() => new Script(s, { filename: 'home-inline-' + i + '.js' })));
});

test('each home control has a unique id', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(ids.length, new Set(ids).size);
});

test('signature journey keeps the complete interactive flow', () => {
  const ids = ['plan', 'plan-title', 'moods', 'route', 'directions', 'planCount', 'planStatus', 'planEmpty', 'sharePlan', 'resetPlan', 'filters', 'cards', 'lang', 'searchForm'];
  ids.forEach(id => assert.match(html, new RegExp('id="' + id + '"')));
  assert.match(html, /function addToPlan\(/);
  assert.match(html, /function editPlan\(/);
  assert.match(html, /function persistPlan\(/);
  assert.match(html, /history\.replaceState/);
  assert.match(html, /torremolinos\.plan/);
  assert.match(html, /aria-pressed/);
  assert.match(html, /location\.href/);
});

test('route recommendations come from published catalog entries', () => {
  const routeIds = ['sanmiguel', 'bajondillo', 'playamar', 'pasaje', 'nogalera', 'carihuela', 'bateria', 'pimentel'];
  routeIds.forEach(id => assert.ok(html.includes("id:'" + id + "'"), id + ' catalog record missing'));
  assert.match(html, /return places\.find/);
});

test('product microcopy includes all six supported languages', () => {
  const start=html.indexOf('var planCopy={');
  const end=html.indexOf('var selectedStops=null;',start);
  assert.ok(start > 0 && end > start);
  const i18n=html.slice(start,end);
  ['es','en','it','de','fr','ru'].forEach(l => assert.ok(i18n.includes('\n ' + l + ':{'), l + ' missing'));
});

test('four-colour identity, motion preferences, and correct application order', () => {
  for(const hex of ['#FFFFFF','#111111','#F58A17','#16865A'])assert.ok(css.includes(hex));
  const colors=[...new Set([...css.matchAll(/#[\da-fA-F]{3,8}(?![\da-fA-F])/g)].map(x=>x[0].toUpperCase()))];
  colors.forEach(c=>assert.ok(['#FFFFFF','#111111','#F58A17','#16865A','#FFF'].includes(c),'unapproved color '+c));
  assert.doesNotMatch(css, /(?:linear|radial)-gradient\(/);
  assert.match(css,/prefers-reduced-motion/);
  assert.ok(html.indexOf('href="design-system-2026.css"')>html.indexOf('href="coastal-light.css"'));
});

test('PWA updates include product styles and approved theme', () => {
  const sw=file('service-worker.js');
  const manifest=JSON.parse(file('manifest.webmanifest'));
  assert.match(sw,/design-system-2026\.css/);
  assert.equal(manifest.theme_color,'#16865A');
  assert.equal(manifest.background_color.toUpperCase(),'#FFFFFF');
});

test('destination pages share the design system', () => {
  const paths=['agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html'];
  paths.forEach(path => assert.match(file(path), /design-system-2026\.css/,path+' missing stylesheet'));
});


test('new Apple product layer is loaded last on every destination', () => {
  const paths=['index.html','agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html'];
  paths.forEach(path=>{
    const source=file(path);
    assert.match(source,/apple-premium\.css/,path+' premium CSS missing');
    assert.match(source,/apple-runtime\.js/,path+' title rule missing');
    assert.ok(source.indexOf('apple-premium.css')>source.indexOf('design-system-2026.css'),path+' wrong stylesheet order');
  });
});

test('the user-supplied hero is installed as two optimized WebP photos', () => {
  for (const [path,limit] of [['assets/photos/hero-apple-2026.webp',500000],['assets/photos/hero-apple-2026-mobile.webp',250000]]) {
    const image=readFileSync(new URL('../'+path,import.meta.url));
    assert.ok(image.length>30000&&image.length<limit,path+' size out of budget');
    assert.equal(image.toString('ascii',0,4),'RIFF',path+' invalid RIFF header');
    assert.equal(image.toString('ascii',8,12),'WEBP',path+' invalid WebP image');
  }
  const ui=file('apple-premium.css');
  assert.match(ui,/hero-apple-2026\.webp/);
  assert.match(ui,/hero-apple-2026-mobile\.webp/);
  assert.match(html,/rel="preload" as="image" href="assets\/photos\/hero-apple-2026\.webp"/);
});

test('readable UI colours and guarded photo overlays', () => {
  const apple=file('apple-premium.css');
  const colors=[...new Set([...apple.matchAll(/#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g)].map(x=>x[0].toUpperCase()))];
  colors.forEach(c=>assert.ok(['#FFFFFF','#111111','#F58A17','#16865A'].includes(c),'extra UI colour '+c));
  const luminance=hex=>{
    const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
    const rgb=channels.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
    return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
  };
  const contrast=(a,b)=>{
    const l1=luminance(a),l2=luminance(b);
    return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
  };
  assert.ok(contrast('#FFFFFF','#16865A')>=4.5,'white on green must meet AA body contrast');
  assert.ok(contrast('#111111','#F58A17')>=4.5,'black on orange must meet AA body contrast');
  assert.ok(contrast('#111111','#FFFFFF')>=7);
  assert.match(apple,/hero-photo:after/);
  assert.match(apple,/prefers-reduced-motion/);
});

test('narrative copy and punctuation-free titles in all six languages', () => {
  const copy=html.slice(html.indexOf('var editorialCopy='),html.indexOf('Object.keys(editorialCopy)'));
  ['es','en','it','de','fr','ru'].forEach(l=>assert.ok(copy.includes('"'+l+'":{'),l+' copy missing'));
  assert.match(copy,/Dove il mare incontra la luce/);
  const runtime=file('apple-runtime.js');
  assert.doesNotThrow(()=>new Script(runtime));
  assert.match(runtime,/cleanHeading/);
  assert.match(runtime,/MutationObserver/);
  assert.match(runtime,/NodeFilter\.SHOW_TEXT/);
  assert.match(html,/data-plan-t="promiseTitle"/);
});

test('offline cache contains the modern UI and two actual hero photographs', () => {
  const sw=file('service-worker.js');
  assert.match(sw,/torremolinos-v18/);
  ['apple-premium.css','apple-runtime.js','hero-apple-2026.webp','hero-apple-2026-mobile.webp'].forEach(x=>assert.ok(sw.includes(x),x+' missing from offline cache'));
  assert.doesNotThrow(()=>new Script(sw));
});


test('craft refinements are last, consistent, and offline-available',()=>{
  const sections=['index.html','agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html'];
  const craft=file('craft-refinement.css');
  for(const path of sections){
    const page=file(path);
    assert.match(page,/craft-refinement\.css/,path+' refinement not loaded');
    assert.ok(page.indexOf('craft-refinement.css')>page.indexOf('craft-finish.css'),path+' craft css must override prior craft layer');
  }
  assert.match(file('service-worker.js'),/torremolinos-v18/);
  assert.match(file('service-worker.js'),/craft-refinement\.css/);
  assert.equal((craft.match(/\{/g)||[]).length,(craft.match(/\}/g)||[]).length);
  assert.match(craft,/prefers-reduced-motion/);
  assert.match(craft,/prefers-contrast:more/);
});

test('white is the footer surface across every site section',()=>{
  const craft=file('craft-refinement.css');
  assert.match(craft,/body\.torre-home \.footer,[\s\S]{0,120}body\[data-coast\]:not\(\.torre-home\) :is\(\.footer,\.foot,\.bottom\)/);
  assert.match(craft,/background:var\(--craft-paper\)!important;color:var\(--craft-ink\)!important/);
  assert.match(craft,/\.footerinner[\s\S]{0,170}grid-template-columns/);
  assert.match(craft,/\.footer \.brand-logo-img/);
});

test('editorial place cards use ten verified existing photo assets',()=>{
  const craft=file('craft-refinement.css');
  const placeIds=['nogalera','bajondillo','carihuela','pasaje','playamar','alamos','bateria','pimentel','sanmiguel','c1'];
  const expected=[
    'assets/photos/album/plaza.webp','assets/photos/el-bajondillo-letrero.webp',
    'assets/photos/album/espetos.webp','assets/photos/album/barca-flores.webp',
    'assets/photos/playa-palmeras-panorama.webp','assets/photos/album/blue-hour-ai.webp',
    'assets/photos/paseo-palmeras.webp','assets/photos/paseo-centro.webp',
    'assets/photos/album/estacion.webp'
  ];
  for(const id of placeIds)assert.ok(craft.includes('data-place-id="'+id+'"'),id+' has no photo presentation');
  for(const name of expected){
    assert.ok(craft.includes(name),name+' missing from craft css');
    assert.ok(readFileSync(new URL('../'+name,import.meta.url)).length>0,name+' asset missing');
  }
  assert.match(craft,/\.place \.articon\{display:none!important/);
});

test('all static section headings are punctuation-free at source',()=>{
  const paths=['index.html','agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html'];
  for(const path of paths){
    const src=file(path);
    for(const match of src.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)){
      const text=match[1].replace(/<[^>]+>/g,'').trim();
      assert.ok(!text.endsWith('.'),path+': trailing headline punctuation '+text.slice(-60));
    }
  }
  assert.match(file('apple-runtime.js'),/cleanHeading/);
});

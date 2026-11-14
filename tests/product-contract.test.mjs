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
  assert.match(sw,/torremolinos-v22/);
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
  assert.match(file('service-worker.js'),/torremolinos-v22/);
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


test('commercial experience is consistently loaded last across 21 public entrypoints',()=>{
  const paths=['index.html','agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html',
    'legal/index.html','legal/privacy-policy.html','legal/cookie-policy.html','legal/terms-of-use.html','legal/contact.html','legal/accessibility.html',
    'legal/editorial-policy.html','legal/event-source-policy.html','legal/ai-transparency.html','legal/copyright-credits.html',
    'stories/torremolinos-mucho-mas-que-sol-y-playa.html','stories/la-nogalera-donde-la-noche-tiene-historia.html',
    'stories/pasaje-begona-memoria-de-libertad.html','stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html'];
  for(const path of paths){
    const src=file(path);
    assert.match(src,/commercial-experience\.css/,path+' missing commercial stylesheet');
    assert.ok(src.indexOf('commercial-experience.css')>src.indexOf('craft-refinement.css'),path+' commercial CSS is not last');
  }
});

test('distinctive commercial sections, exclusively rounded content and oval actions',()=>{
 const css=file('commercial-experience.css');
 assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
 ['--story-white:#FFFFFF','--story-ink:#111111','--story-green:#16865A','--story-orange:#F58A17'].forEach(v=>assert.ok(css.includes(v),v));
 const zones=['#discover','#explore','.nogalera-feature','#pride','.photo-diary','.directory-teaser','.gallery-feature','.music-shell','.magazine','.agenda-home','.plan-workspace','#useful','.community','.editorial-bridge'];
 for(const key of zones)assert.ok(css.includes(key),key+' section has no identity');
 assert.match(css,/--story-pill:999px/);
 assert.match(css,/--story-box:clamp/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/prefers-contrast:more/);
 assert.match(css,/\.music-body[\s\S]*?background:var\(--story-green\)!important/);
 assert.match(css,/\.directory-teaser[\s\S]*?background:var\(--story-orange\)!important/);
 assert.match(css,/\.nogalera-feature-copy[\s\S]*?background:var\(--story-green\)!important/);
 assert.match(css,/footer[^}]+background:var\(--story-white\)!important/);
});

test('commercial storytelling is authored in all six locales and the action is functional',()=>{
 const home=file('index.html');
 const start=home.indexOf('var editorialCopy=');
 const end=home.indexOf('Object.keys(editorialCopy)',start);
 assert.ok(start>0&&end>start);
 const json=home.slice(start+'var editorialCopy='.length,end).trim().replace(/;\s*$/,'');
 const copy=JSON.parse(json);
 const keys=['bridgeEyebrow','bridgeTitle','bridgeText','bridgeAction','heroSub','discoverLead','exploreLead','nogaleraHomeIntro','prideText','soundDesc','storiesLead','agendaLead','usefulLead'];
 for(const lang of ['es','en','it','de','fr','ru']){
   for(const key of keys)assert.ok(copy[lang]?.[key]?.length>12,lang+' missing '+key);
   assert.doesNotMatch(copy[lang].bridgeTitle,/[.．]\s*$/);
 }
 assert.match(home,/class="editorial-bridge shell"/);
 assert.match(home,/class="editorial-bridge-action" data-t="bridgeAction"/);
 assert.match(home,/href="#plan" class="editorial-bridge-action"/);
});

test('commercial stylesheet is present in offline shell',()=>{
 const sw=file('service-worker.js');
 assert.match(sw,/torremolinos-v22/);
 assert.match(sw,/commercial-experience\.css/);
 assert.match(file('index.html'),/apple-runtime\.js/);
});


test('v6 product scenes load last on every published page',()=>{
 const pages=['index.html','agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html',
 'legal/index.html','legal/privacy-policy.html','legal/cookie-policy.html','legal/terms-of-use.html','legal/contact.html','legal/accessibility.html',
 'legal/editorial-policy.html','legal/event-source-policy.html','legal/ai-transparency.html','legal/copyright-credits.html',
 'stories/torremolinos-mucho-mas-que-sol-y-playa.html','stories/la-nogalera-donde-la-noche-tiene-historia.html',
 'stories/pasaje-begona-memoria-de-libertad.html','stories/san-miguel-la-fiesta-che-saca-torremolinos-a-la-calle.html'];
 const last=pages.pop();pages.push(last.replace('fiesta-che','fiesta-que'));
 for(const path of pages){
  const source=file(path);
  assert.match(source,/product-v6\.css/,path+' is missing product stylesheet');
  const head=source.split(/<\/head>/i)[0];
  assert.ok(head.lastIndexOf('product-v6.css')>head.lastIndexOf('commercial-experience.css'),path+' premium override order wrong');
 }
});
test('v6 hierarchy and critical screenshot contrast repairs exist',()=>{
 const css=file('product-v6.css');
 assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
 assert.match(css,/\.editorial-bridge\.shell/);
 assert.match(css,/\.gallery-feature\.shell/);
 assert.match(css,/\.agenda-home\.shell/);
 assert.match(css,/\.music-body/);
 assert.match(css,/background-image:none!important/);
 assert.match(css,/--v6-green:#16865A/);
 assert.match(css,/--v6-orange:#F58A17/);
 assert.match(css,/\.music-body :is\(h2,p,small,span,label/);
 assert.match(css,/\.agenda-home-photo img/);
 assert.match(css,/\.photo-diary-grid figcaption/);
 assert.match(css,/body\.torre-comer \.card/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('v6 offline shell includes its stylesheet and original supplied hero',()=>{
 const sw=file('service-worker.js');
 assert.match(sw,/torremolinos-v22/);
 assert.match(sw,/product-v6\.css/);
 assert.match(sw,/product-v6\.js/);
 assert.match(file('index.html'),/product-v6\.js/);
 assert.match(file('apple-premium.css'),/hero-apple-2026\.webp/);
 assert.match(file('index.html'),/hero-apple-2026\.webp/);
});


test('v7 narrative system is loaded last on all core and editorial pages',()=>{
 const pages=['index.html','agenda/index.html','comer/index.html','gallery/index.html',
 'listen/index.html','stories/index.html','explore/la-nogalera/index.html',
 'legal/index.html','legal/privacy-policy.html','legal/cookie-policy.html',
 'legal/terms-of-use.html','legal/contact.html','legal/accessibility.html',
 'legal/editorial-policy.html','legal/event-source-policy.html','legal/ai-transparency.html',
 'legal/copyright-credits.html','stories/torremolinos-mucho-mas-que-sol-y-playa.html',
 'stories/la-nogalera-donde-la-noche-tiene-historia.html',
 'stories/pasaje-begona-memoria-de-libertad.html',
 'stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html'];
 for(const path of pages){
  const html=file(path);
  const head=html.split(/<\/head>/i)[0];
  assert.match(head,/narrative-v7\.css/,path+' missing stylesheet');
  assert.ok(head.indexOf('narrative-v7.css')>head.indexOf('product-v6.css'),path+' stylesheet order');
 }
 assert.match(file('index.html'),/narrative-v7\.js/);
 const sw=file('service-worker.js');
 assert.match(sw,/torremolinos-v22/);
 assert.match(sw,/narrative-v7\.css/);
 assert.match(sw,/narrative-v7\.js/);
});
test('final craft enforces four colours, readable scenes and genuine responsive differentiation',()=>{
 const css=file('narrative-v7.css');
 assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
 ['--v7-white:#FFFFFF','--v7-ink:#111111','--v7-green:#16865A','--v7-orange:#F58A17']
   .forEach(t=>assert.ok(css.includes(t),t));
 for(const scene of ['#discover','#explore','.nogalera-feature','#pride','#photodiary',
   '.gallery-feature','.music-shell','#stories','#agenda-home','.editorial-bridge',
   '#plan','#useful','.community'])
   assert.ok(css.includes(scene),'missing scene '+scene);
 assert.match(css,/grid-column:span 2!important/);
 assert.match(css,/scroll-snap-type:x mandatory/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/prefers-contrast:more/);
 assert.match(css,/--v7-gap:clamp/);
 assert.match(css,/\.v7-action-arrow/);
 assert.match(css,/\.v7-reading-track/);
});
test('native thumb discovery and consistent accessible arrows are operational',()=>{
 const js=file('narrative-v7.js');
 for(const language of ['it','es','en','fr','de','ru'])
   assert.ok(js.includes(language+':{rail:'),'missing rail localization '+language);
 assert.match(js,/scrollBy\(/);
 assert.match(js,/ArrowLeft/);
 assert.match(js,/ArrowRight/);
 assert.match(js,/aria-hidden/);
 assert.match(js,/MutationObserver/);
 assert.match(js,/requestAnimationFrame/);
 assert.match(js,/prefers-reduced-motion/);
 new Script(js,{filename:'narrative-v7.js'});
});

import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const base='http://127.0.0.1:18991/';
const server=spawn('python3',['-m','http.server','18991','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
const records=[];let browser;
try{
 let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}
 assert.ok(ready,'Local origin unavailable');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:390,height:850},serviceWorkers:'block',reducedMotion:'reduce'});
 const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 let unblock,allowScripts;const held=new Promise(resolve=>unblock=resolve),scriptGate=new Promise(resolve=>allowScripts=resolve);
 await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='127.0.0.1')return route.abort();
  if(u.pathname==='/gallery/app.js'||u.pathname==='/gallery/data.js')await scriptGate;
  if(u.pathname.endsWith('/album/palmeras-sol.webp'))await held;
  return route.continue();
 });
 await p.goto(base+'gallery/?lang=es',{waitUntil:'commit'});
 await p.locator('footer.footer').waitFor({state:'attached'});
 await p.waitForFunction(()=>document.querySelector('.gallery-card')?.getBoundingClientRect().height>100);
 const footerBefore=(await p.locator('footer.footer').boundingBox()).y;
 allowScripts();await p.waitForLoadState('domcontentloaded');
 assert.equal(await p.locator('.gallery-card:not([hidden])').count(),7);
 const first=p.locator('.gallery-card:not([hidden])').first();
 assert.ok(await first.getAttribute('aria-busy'));
 const before=await first.boundingBox();assert.ok(before&&before.height>100);
 const footerHydrated=(await p.locator('footer.footer').boundingBox()).y;
 assert.ok(Math.abs(footerBefore-footerHydrated)<1,'Gallery footer moved during hydration: '+footerBefore+' -> '+footerHydrated);
 unblock();
 await p.waitForFunction(()=>!document.querySelector('.gallery-card .image-button').disabled);
 const after=await first.boundingBox();assert.ok(Math.abs(before.height-after.height)<1,'Loaded image must preserve reserved card height');
 await first.locator('.image-button').click();await p.locator('#viewer[open]').waitFor();
 await p.keyboard.press('Escape');records.push({galleryVisibleWhileLoading:7,reservedHeight:before.height,loadedHeight:after.height,footerBefore,footerHydrated,lightbox:true});
 await p.goto(base+'listen/?lang=it',{waitUntil:'domcontentloaded'});
 for(const lang of ['it','de','fr','ru','en','es']){
  await p.locator('#lang').selectOption(lang);
  await p.waitForFunction(l=>document.documentElement.lang===l,lang);
  assert.ok(await p.locator('#articleText p').count()>0,lang+' no Sound text');
 }
 assert.equal(await p.locator('audio').getAttribute('preload'),'none');
 records.push({listenLanguages:6,articleRendered:true,audioPreload:'none'});
 await p.goto(base+'agenda/?lang=es',{waitUntil:'domcontentloaded'});
 await p.evaluate(()=>{const h=document.createElement('h3');h.id='punctuation-probe';h.textContent='Prueba.';document.body.append(h)});
 await p.waitForFunction(()=>document.getElementById('punctuation-probe')?.textContent==='Prueba');
 await p.evaluate(()=>{document.getElementById('punctuation-probe').textContent='Cambio.'});
 await p.waitForFunction(()=>document.getElementById('punctuation-probe')?.textContent==='Cambio');
 records.push({incrementalHeadingNormalization:true});
 assert.deepEqual(errors,[]);
 await ctx.close();
 const ext=await browser.newContext({viewport:{width:390,height:850},serviceWorkers:'block'});
 const q=await ext.newPage();
 for(const path of ['stories/','stories/la-nogalera-donde-la-noche-tiene-historia.html','stories/pasaje-begona-memoria-de-libertad.html']){
  await q.goto(base+path,{waitUntil:'domcontentloaded'});
  const photos=q.locator('img[src*="wikimedia.org"]');
  assert.ok(await photos.count()>0);
  for(const img of await photos.all()){
   await img.scrollIntoViewIfNeeded();
   await img.evaluate(async i=>{await i.decode();if(!i.naturalWidth)throw Error('CDN photo missing')});
   assert.equal(await img.getAttribute('crossorigin'),'anonymous');
  }
  records.push({path,wikimediaImages:await photos.count(),decoded:true});
 }
 await ext.close();
 console.log('PASS performance regression tests '+JSON.stringify(records));
}finally{
 mkdirSync('artifacts/release',{recursive:true});
 writeFileSync('artifacts/release/perf-regression.json',JSON.stringify({records},null,2)+'\n');
 if(browser)await browser.close();server.kill('SIGTERM');
}

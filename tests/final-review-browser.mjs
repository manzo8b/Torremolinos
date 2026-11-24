import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync,writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),out='artifacts/final-review',base='http://127.0.0.1:18767/';
mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory','candidate'],{stdio:'ignore'});
let browser;const report={pages:[],gallery:null,planner:null,errors:[]};
try{
 for(let i=0;i<80;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,150))}
 browser=await chromium.launch({headless:true});
 for(const width of [375,1280]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const p=await context.newPage();
  for(const route of ['','explore/','tu-torremolinos/','gallery/','agenda/','comer/','listen/','stories/','explore/la-nogalera/','legal/']){
   const errors=[];const handler=e=>errors.push(e.message);p.on('pageerror',handler);
   const response=await p.goto(base+route+'?lang=it',{waitUntil:'networkidle'});
   await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const m=await p.evaluate(async()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.title,violations:(await axe.run()).violations.map(x=>({id:x.id,targets:x.nodes.map(n=>n.target)}))}));
   report.pages.push({route,width,http:response.status(),...m,errors});p.off('pageerror',handler);
   if(!response.ok()||m.scroll>width+1||errors.length)report.errors.push({route,width,http:response.status(),scroll:m.scroll,errors});
   // Report full axe results separately; unresolved violations are release blockers.
   if(m.violations.length)report.errors.push({route,width,accessibility:m.violations});
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:375,height:812},serviceWorkers:'block',reducedMotion:'reduce'});
 const p=await context.newPage();let releaseScripts,releasePhoto;
 const scripts=new Promise(r=>releaseScripts=r),photo=new Promise(r=>releasePhoto=r);
 await p.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1')return r.abort();if(['/gallery/app.js','/gallery/data.js'].includes(u.pathname))await scripts;if(u.pathname.endsWith('/album/palmeras-sol.webp'))await photo;return r.continue()});
 await p.goto(base+'gallery/?lang=es',{waitUntil:'commit'});
 await p.locator('footer').waitFor({state:'attached'});
 await p.waitForFunction(()=>document.querySelector('.gallery-card')?.getBoundingClientRect().height>100);
 const before=(await p.locator('footer').boundingBox()).y;releaseScripts();await p.waitForLoadState('domcontentloaded');const hydrated=(await p.locator('footer').boundingBox()).y;
 releasePhoto();await p.locator('.gallery-card .image-button').first().waitFor({state:'visible'});await p.waitForFunction(()=>!document.querySelector('.gallery-card .image-button').disabled);await p.locator('.gallery-card .image-button').first().click();assert.ok(await p.locator('#viewer').isVisible());await p.locator('#nextImage').click();await p.locator('#closeViewer').click();report.gallery={before,hydrated,cards:await p.locator('.gallery-card').count(),viewer:true};assert.ok(Math.abs(before-hydrated)<1,'Gallery hydration moved footer');await context.close();
 const pc=await browser.newContext({viewport:{width:375,height:812},serviceWorkers:'block',reducedMotion:'reduce'});const q=await pc.newPage();
 await q.goto(base+'?lang=it&plan=nogalera,bajondillo#plan');await q.waitForURL('**/tu-torremolinos/**');assert.equal(await q.locator('#route li').count(),2);
 await q.locator('#plannerExplore').click();await q.waitForURL('**/explore/**');const saved=await q.evaluate(()=>JSON.parse(localStorage.getItem('torremolinos.plan')));assert.deepEqual(saved,['nogalera','bajondillo']);
 await q.locator('[data-place-id="carihuela"] .add').click();await q.locator('#planLink').click();assert.equal(await q.locator('#route li').count(),3);
 await q.locator('#route li .route-control').last().click();assert.equal(await q.locator('#route li').count(),2);
 for(const lang of ['es','en','it','de','fr','ru']){await q.locator('#lang').selectOption(lang);assert.equal(await q.locator('html').getAttribute('lang'),lang)}
 report.planner={legacy:true,persisted:true,add:true,remove:true,languages:6};await pc.close();
}finally{writeFileSync(out+'/report.json',JSON.stringify(report,null,2));if(browser)await browser.close();server.kill('SIGTERM')}
console.log(JSON.stringify(report));assert.deepEqual(report.errors,[],'final release gate');

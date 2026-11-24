/* Test the actual built artifact, rather than assuming the source runtime works unchanged. */
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {LANGS,BASE,ROUTES,META} from './international-config.mjs';
const root=resolve(new URL('..',import.meta.url).pathname),dir=join(root,'artifacts/international-site');
const reportPath=join(root,'artifacts/international-report.json');
const report=JSON.parse(readFileSync(reportPath,'utf8'));
const base='http://127.0.0.1:8771/';
const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1','--directory',dir],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const path=(r,l)=>r+(l==='es'?'':l+'.html');
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await sleep(200);if(i===49)throw Error('Artifact server unavailable')}
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const width of [390,1440]){
   const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
   await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   const page=await ctx.newPage();
   for(const route of ROUTES)for(const lang of LANGS){
     const errors=[];const record=e=>errors.push(e.message);page.on('pageerror',record);
     const dest=path(route.path,lang);
     const response=await page.goto(base+dest,{waitUntil:'domcontentloaded',timeout:30000});
     assert.equal(response.status(),200,dest);
     await page.waitForFunction(l=>document.documentElement.lang===l&&!new URL(location.href).searchParams.has('lang'),lang,{timeout:10000});
     assert.equal(await page.locator('#lang,#language').inputValue(),lang,dest+' language selection');
     assert.equal(await page.title(),META[route.path][lang][0],dest+' metadata title');
     assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),BASE+dest);
     assert.equal(await page.locator('link[rel=alternate][hreflang]').count(),route.index?7:0);
     assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),route.index||lang==='es'?'index,follow':'noindex,follow');
     assert.deepEqual(errors,[],dest+' runtime error');
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),dest+' overflow '+width);
     page.off('pageerror',record);
     report.checks.push({path:dest,width,pass:true});
   }
   // Same-origin preferences, planner state and legacy query URLs.
   await page.goto(base+'?lang=it',{waitUntil:'domcontentloaded'});await page.waitForURL(base+'it.html');
   await page.evaluate(()=>localStorage.setItem('torremolinos.favs',JSON.stringify(['nogalera'])));
   await page.locator('#lang').selectOption('fr');await page.waitForURL(base+'fr.html');
   assert.equal(await page.evaluate(()=>localStorage.getItem('torremolinos.favs')),'["nogalera"]');
   await page.goto(base+'tu-torremolinos/?lang=it&plan=nogalera,bajondillo',{waitUntil:'domcontentloaded'});
   await page.waitForURL(u=>u.pathname.endsWith('/tu-torremolinos/it.html'));
   assert.equal(new URL(page.url()).searchParams.get('plan'),'nogalera,bajondillo');
   await page.locator('#lang').selectOption('de');
   await page.waitForURL(u=>u.pathname.endsWith('/tu-torremolinos/de.html'));
   assert.equal(new URL(page.url()).searchParams.get('plan'),'nogalera,bajondillo');
   await ctx.close();
 }
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});
 await noJS.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 const p=await noJS.newPage();
 for(const route of ROUTES)for(const lang of LANGS){
   const dest=path(route.path,lang);await p.goto(base+dest,{waitUntil:'domcontentloaded'});
   const actual=(await p.locator(route.probe).first().textContent()).trim();
   const expected=report.generated.find(x=>x.path===route.path+(lang==='es'?'index.html':lang+'.html')).probe;
   assert.equal(actual,expected,dest+' static localized copy');
   assert.equal(await p.locator('html').getAttribute('lang'),lang);
 }
 await noJS.close();
 report.noJavaScriptChecks=42;report.navigationChecks='PASS';report.status='PASS';
 console.log('PASS',report.checks.length,'responsive edition checks; 42 static-language checks; legacy links and storage');
}catch(e){report.status='FAIL';report.errors.push(String(e.stack||e));throw e}
finally{writeFileSync(reportPath,JSON.stringify(report,null,2));if(browser)await browser.close();server.kill('SIGTERM')}

import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const plans=[{root:'artifacts/portability/hosts/current',prefix:'/Torremolinos/',port:18970},{root:'artifacts/portability/hosts/preview',prefix:'/guide/',port:18971}];
const servers=[];const results=[];let browser;
try{
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const plan of plans){
  const server=spawn('python3',['-m','http.server',String(plan.port),'--bind','127.0.0.1','--directory',plan.root],{stdio:'ignore'});servers.push(server);
  const base='http://127.0.0.1:'+plan.port+plan.prefix;
  let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}
  assert.ok(ready);
  const ctx=await browser.newContext({viewport:{width:390,height:850},locale:'it-IT',serviceWorkers:'allow'});
  const page=await ctx.newPage();
  assert.equal((await page.goto(base,{waitUntil:'domcontentloaded'}))?.status(),200);
  // Register explicitly so this checks distribution independently of UI registration timing.
  await page.evaluate(async()=>{await navigator.serviceWorker.register('./service-worker.js');await navigator.serviceWorker.ready;await caches.open('other-project-release-sentinel')});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:45000});
  const state=await page.evaluate(async()=>({scope:(await navigator.serviceWorker.ready).scope,keys:await caches.keys()}));
  assert.equal(state.scope,base);
  assert.ok(state.keys.some(k=>k.startsWith('torremolinos-')));
  assert.ok(state.keys.includes('other-project-release-sentinel'));
  await ctx.setOffline(true);
  await page.goto(base+'comer/',{waitUntil:'domcontentloaded'});assert.ok((await page.title()).includes('TORREMOLINOS'));
  await page.goto(base+'not-cached/deep/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#home').getAttribute('href'),base);
  assert.ok(await page.locator('#retry').isVisible());
  await page.locator('#home').click();await page.waitForURL(base);
  await ctx.setOffline(false);
  results.push({prefix:plan.prefix,scope:state.scope,offlineNavigation:true,uncachedFallback:true,homeReturn:true,otherCachePreserved:true});
  await ctx.close();
 }
 mkdirSync('artifacts/release',{recursive:true});
 writeFileSync('artifacts/release/pwa-offline.json',JSON.stringify({results,note:'Chromium fresh installation and offline simulation; existing installed-client update and Safari remain manual.'},null,2)+'\n');
 console.log('PASS scoped offline',results.length);
}finally{if(browser)await browser.close();servers.forEach(s=>s.kill('SIGTERM'))}

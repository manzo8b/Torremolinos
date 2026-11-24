import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const base='http://127.0.0.1:18985/';
const server=spawn('python3',['-m','http.server','18985','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
const samples=[];
try{
 let ready=false;
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
 assert.ok(ready,'Local server unavailable');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 mkdirSync('artifacts/editorial-fase2e',{recursive:true});
 for(const width of [390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block',reducedMotion:'reduce'});
  await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  assert.equal((await page.goto(base+'explore/la-nogalera/?lang=it',{waitUntil:'domcontentloaded'}))?.status(),200);
  for(const lang of ['es','en','it','de','fr','ru']){
   await page.locator('#language').selectOption(lang);
   await page.waitForFunction(l=>document.documentElement.lang===l,lang);
   const cards=page.locator('#places article.place');
   assert.equal(await cards.count(),12);
   assert.equal(await cards.locator('time[datetime="2026-11-02"]').count(),12);
   assert.equal(await page.locator('#places [data-evidence-kind="operator"]').count(),6);
   assert.equal(await page.locator('#places [data-evidence-kind="directory"]').count(),2);
   const maps=page.locator('#places [data-evidence-kind="map_search"]');
   assert.equal(await maps.count(),4);
   for(const card of await maps.all()){assert.equal(await card.locator('a').count(),1);assert.ok((await card.locator('.venue-provenance').innerText()).length>35)}
   const label=await page.locator('.filters').getAttribute('aria-label');
   assert.ok(label&&label.length>5);
   samples.push({width,lang,visible:12,operator:6,directory:2,mapSearch:4,recordDate:'2026-11-02',filterLabel:label});
  }
  await page.locator('#language').selectOption('it');
  await page.locator('#places').screenshot({path:'artifacts/editorial-fase2e/nogalera-'+width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);
  await ctx.close();
 }
 writeFileSync('artifacts/editorial-fase2e/nogalera-report.json',JSON.stringify({samples,note:'Local rendering QA only; external venue operation not verified.'},null,2)+'\n');
 console.log('PASS La Nogalera editorial provenance',samples.length,'samples');
}finally{if(browser)await browser.close();server.kill('SIGTERM')}

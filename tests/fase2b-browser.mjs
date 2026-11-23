/* Fase 2B — Chromium editorial integration gate, no publish, no external requests. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const port=18981;
const base='http://127.0.0.1:'+port+'/';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
const result=[];
try {
 let up=false;
 for(let i=0;i<90;i++){
  try{if((await fetch(base)).status===200){up=true;break;}}catch{}
  await delay(140);
 }
 assert.ok(up,'Preview server not ready');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 mkdirSync('artifacts/editorial-fase2b',{recursive:true});
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'it-IT',
  reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();
 const errs=[];
 page.on('pageerror',e=>errs.push(e.message));
 let response=await page.goto(base+'gallery/?lang=it',{waitUntil:'domcontentloaded'});
 assert.equal(response?.status(),200);
 await page.locator('.gallery-card:not([hidden])').first().waitFor({timeout:14000});
 for(const lang of ['it','de','fr','ru','en','es']){
  await page.locator('#lang').selectOption(lang);
  await page.waitForFunction(code=>document.documentElement.lang===code,lang);
  const first=await page.locator('.gallery-card:not([hidden])').first().locator('img').getAttribute('alt');
  assert.ok(first&&first.length>9,'Missing localized gallery alt for '+lang);
  const prev=await page.locator('#previousImage').getAttribute('aria-label');
  assert.ok(prev&&!['Previous image'].includes(prev)||lang==='en','Previous image label failed '+lang);
  result.push({area:'gallery',lang,firstAlt:first,prev});
 }
 await page.locator('#lang').selectOption('it');
 await page.locator('.gallery-card:not([hidden]) .image-button').first().click();
 await page.locator('#viewer[open]').waitFor({timeout:6000});
 assert.match(await page.locator('#viewerCredit').innerText(),/Fotografia fornita per la guida/);
 await page.keyboard.press('Escape');
 await page.locator('#viewer[open]').waitFor({state:'hidden'});
 await page.screenshot({path:'artifacts/editorial-fase2b/gallery-mobile-it.png',animations:'disabled'});
 await page.goto(base+'comer/?lang=it',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('#featuredCards .card, #moreCards .other').length===9);
 assert.match(await page.locator('[data-i18n="featuredLead"]').innerText(),/rapporti commerciali/);
 await page.screenshot({path:'artifacts/editorial-fase2b/comer-mobile-it.png',animations:'disabled'});
 const nonJS=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
 const staticPage=await nonJS.newPage();
 response=await staticPage.goto(base+'comer/',{waitUntil:'load'});
 assert.equal(response?.status(),200);
 assert.equal(await staticPage.locator('#comerStaticFallback li').count(),9,'No-JS restaurant directory');
 const anchor=staticPage.locator('#comerStaticFallback li a').first();
 assert.match(await anchor.getAttribute('href'),/^https:\/\//);
 await staticPage.screenshot({path:'artifacts/editorial-fase2b/comer-without-js.png',animations:'disabled'});
 result.push({area:'comer',noJSLinks:9,withJSHasNineCards:true});
 for(const slug of ['la-nogalera-donde-la-noche-tiene-historia','pasaje-begona-memoria-de-libertad']){
  response=await page.goto(base+'stories/'+slug+'.html',{waitUntil:'domcontentloaded'});
  assert.equal(response?.status(),200);
  const license=page.locator('figure .photo-credit a[href*="creativecommons.org"]');
  assert.equal(await license.count(),1,'Missing license link on '+slug);
  result.push({area:'stories',slug,license:await license.getAttribute('href')});
 }
 assert.deepEqual(errs,[],'JS errors under editorial changes');
 writeFileSync('artifacts/editorial-fase2b/results.json',JSON.stringify({schemaVersion:1,checks:result},null,2)+'\n');
 await nonJS.close();
 await context.close();
 console.log('PASS Fase 2B browser checks: '+JSON.stringify(result));
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
}

/* Fase 2 editorial QA in Chromium: verifies functional i18n and provenance.
 * No source mutation or deployment. External media/analytics are not needed.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const server=spawn('python3',['-m','http.server','18976','--bind','127.0.0.1'],{stdio:'ignore'});
const origin='http://127.0.0.1:18976/';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
const summary=[];
try{
 let ready=false;
 for(let i=0;i<80;i++){
  try{let r=await fetch(origin);if(r.status===200){ready=true;break;}}catch{}
  await wait(130);
 }
 assert.ok(ready,'Local editorial QA server not running');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 mkdirSync('artifacts/editorial-fase2',{recursive:true});
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:850},locale:'it-IT',
   reducedMotion:'reduce',serviceWorkers:'block'});
  await ctx.route('**/Lune_X/**',route=>route.abort()); // no external audio requests needed
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  let response=await page.goto(origin+'?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'Home status');
  await page.locator('#agendaHomeScanStatus a[href*="/actions/runs/"]').waitFor({timeout:12000});
  assert.match(await page.locator('#agendaHomeScanStatus').innerText(),/Ultimo controllo automatico documentato/);
  assert.match(await page.locator('#agendaHomeScanStatus').innerText(),/23 novembre 2026/);
  assert.match(await page.locator('#agendaHomeScanStatus').innerText(),/2 novembre 2026/);
  assert.match(await page.locator('#agendaHomeScanStatus').innerText(),/Revisione editoriale da aggiornare/);
  assert.match(await page.locator('#agenda-home [data-t="agendaLead"]').innerText(),/LGBTQ\+/);
  await page.locator('#lang').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#agendaHomeScanStatus')?.textContent.includes('Last documented automated check'));
  assert.match(await page.locator('#agenda-home [data-t="agendaLead"]').innerText(),/LGBTQ\+/);
  await page.locator('#lang').selectOption('es');
  await page.waitForFunction(()=>document.querySelector('#agendaHomeScanStatus')?.textContent.includes('Última ejecución documentada'));
  await page.locator('#lang').selectOption('it');
  await page.waitForFunction(()=>document.querySelector('#agendaHomeScanStatus')?.textContent.includes('Ultimo controllo'));
  await page.locator('#agenda-home').screenshot({path:'artifacts/editorial-fase2/home-agenda-'+width+'.png',animations:'disabled'});
  response=await page.goto(origin+'agenda/?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'Agenda status');
  await page.locator('#agendaPageScanStatus a').waitFor({timeout:12000});
  await page.waitForFunction(()=>document.querySelector('#dataStatus')?.textContent.includes('schede con data'),{timeout:12000});
  assert.match(await page.locator('#dataStatus').innerText(),/27 schede con data/);
  assert.match(await page.locator('#agendaPageScanStatus').innerText(),/INFINITY e ACOGAT non verificabili/);
  await page.locator('#lang').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#dataStatus')?.textContent.includes('dated listings'));
  await page.locator('#lang').selectOption('it');
  await page.locator('#agendaPageScanStatus').screenshot({path:'artifacts/editorial-fase2/agenda-status-'+width+'.png',animations:'disabled'});
  response=await page.goto(origin+'comer/?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'Comer status');
  await page.waitForFunction(()=>document.querySelectorAll('#featuredCards .card, #moreCards .other').length===9);
  const details=await page.locator('#featuredCards .card, #moreCards .other').evaluateAll(nodes=>nodes.map(node=>({
   name:node.querySelector('h3')?.textContent,
   hasReview:node.textContent.includes('Revisione editoriale'),
   sourceLink:[...node.querySelectorAll('a')].some(a=>a.href.startsWith('https:')&&!a.href.includes('google.com/maps'))
  })));
  assert.equal(details.length,9);
  assert.equal(details.filter(d=>d.hasReview&&d.sourceLink).length,9,JSON.stringify(details));
  assert.ok(!errors.length,errors.join('\n'));
  summary.push({width,agendaUpdates:true,multilingual:true,nineComerReviews:true,consoleErrors:errors});
  await ctx.close();
 }
 const originalCtx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
 await originalCtx.route('**/assets/photos/album/blue-hour-ai.webp',route=>route.abort());
 const fallback=await originalCtx.newPage();
 await fallback.goto(origin+'?lang=es',{waitUntil:'domcontentloaded'});
 await fallback.waitForTimeout(750);
 const badge=await fallback.locator('#galleryTeaserProvenance').evaluate(x=>({
  hidden:x.hidden,display:getComputedStyle(x).display
 }));
 const originalPhoto=await fallback.locator('#galleryTeaserImg').getAttribute('src');
 assert.equal(badge.hidden,true,'AI badge must be hidden when fallback image is original');
 assert.equal(badge.display,'none','AI badge CSS did not honour hidden state');
 assert.match(originalPhoto,/palmeras-sol\.webp/);
 summary.push({originalPhotoWhenAIRequestFails:true,badgeHidden:badge.hidden});
 await originalCtx.close();
 writeFileSync('artifacts/editorial-fase2/browser-audit.json',JSON.stringify({summary},null,2)+'\n');
 console.log('PASS Fase 2 editorial browser checks',JSON.stringify(summary));
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
}

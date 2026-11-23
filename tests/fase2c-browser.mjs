/* Fase 2C — browser smoke and axe-core accessibility report, not WCAG certification. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const port=18984,base='http://127.0.0.1:'+port+'/';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser;
const records=[];
async function axeAudit(page,section,width){
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const results=await page.evaluate(()=>window.axe.run(document,{
  runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
 }));
 return {section,width,violations:results.violations.map(x=>({id:x.id,impact:x.impact,
  help:x.help,nodes:x.nodes.length,affected:x.nodes.slice(0,50).map(n=>({
   target:n.target,html:n.html.slice(0,260),summary:n.failureSummary?.slice(0,340)
  }))})),
  incompleteChecks:results.incomplete.length,
  resultType:'baseline observation, not a claim of WCAG conformance'};
}
try{
 let ready=false;
 for(let i=0;i<100;i++){
  try{if((await fetch(base)).status===200){ready=true;break;}}catch{}
  await sleep(120);
 }
 assert.ok(ready,'Local server did not start');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 mkdirSync('artifacts/editorial-fase2c',{recursive:true});
 for(const width of [390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},locale:'it-IT',
   reducedMotion:'reduce',serviceWorkers:'block'});
  await ctx.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.hostname==='127.0.0.1')return route.continue();
   return route.abort();
  });
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  let resp=await page.goto(base+'?lang=it',{waitUntil:'domcontentloaded'});
  assert.equal(resp?.status(),200);
  assert.equal(await page.locator('#useful .infocard').count(),3);
  for(const lang of ['it','en','de','fr','ru','es']){
   await page.locator('#lang').selectOption(lang);
   await page.waitForFunction(l=>document.documentElement.lang===l,lang);
   const notes=await page.locator('#useful .essentials-verified').allInnerTexts();
   assert.equal(notes.length,3);
   assert.ok(notes.every(t=>t.length>38),lang+' missing Essentials note');
   const link=await page.locator('#useful a[data-t="airportLink"]').getAttribute('href');
   assert.match(link,/\/cercanias-malaga\/mapas$/);
  }
  await page.locator('#lang').selectOption('it');
  await page.locator('#useful').screenshot({path:'artifacts/editorial-fase2c/essentials-'+width+'.png',animations:'disabled'});
  records.push(await axeAudit(page,'home',width));
  resp=await page.goto(base+'gallery/?lang=it',{waitUntil:'domcontentloaded'});
  assert.equal(resp?.status(),200);
  for(const lang of ['it','de','fr','ru','en','es']){
   await page.locator('#lang').selectOption(lang);
   await page.waitForFunction(l=>document.documentElement.lang===l,lang);
   assert.ok((await page.locator('.filterbar').getAttribute('aria-label'))?.length>5);
  }
  records.push(await axeAudit(page,'gallery',width));
  assert.deepEqual(errors,[],'Page errors: '+errors.join('; '));
  await ctx.close();
 }
 writeFileSync('artifacts/editorial-fase2c/accessibility-report.json',JSON.stringify({
  schemaVersion:1,records,
  note:'Automated axe-core 2.1 A/AA evaluation of two pages at two viewports; this is NOT a manual or mother-tongue accessibility certification.'
 },null,2)+'\n');
 console.log(JSON.stringify({status:'PASS functional 2C',samples:records.map(r=>({
  section:r.section,width:r.width,violations:r.violations.length,incomplete:r.incompleteChecks
 }))}));
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
}

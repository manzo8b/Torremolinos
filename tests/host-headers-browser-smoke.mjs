/* P0-09 — Real Chromium smoke against locally simulated Cloudflare/Netlify headers.
 * This does NOT prove that a future hosting provider has deployed the rules.
 * Creates only test artifacts. Does not change public pages or source assets.
 */
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const root='artifacts/hosting-staging';
const port=18952;
const url='http://127.0.0.1:'+port+'/';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const server=spawn('python3',[
 'scripts/preview_http_headers.py',
 '--headers',root+'/cloudflare-root/_headers',
 '--directory','.',
 '--port',String(port)
],{stdio:'ignore'});
let browser;
const findings=[];
try{
 let alive=false;
 for(let i=0;i<100;i++){
  try{const resp=await fetch(url);if(resp.ok){alive=true;break;}}catch{}
  await wait(110);
 }
 assert.ok(alive,'The scoped staging header server did not start');
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const width of [390,1440]){
  const ctx=await browser.newContext({
   viewport:{width,height:900},locale:'it-IT',
   reducedMotion:'reduce',serviceWorkers:'block'
  });
  const page=await ctx.newPage();
  await page.addInitScript(()=>{
   window.__cspWarnings=[];
   document.addEventListener('securitypolicyviolation',e=>{
    window.__cspWarnings.push({
     directive:e.effectiveDirective,
     disposition:e.disposition,
     blockedURI:e.blockedURI?new URL(e.blockedURI,location.href).origin:null
    });
   });
  });
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url+'?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'Home response');
  const headers=response.headers();
  assert.equal(headers['x-content-type-options'],'nosniff');
  assert.equal(headers['referrer-policy'],'strict-origin-when-cross-origin');
  assert.equal(headers['x-frame-options'],'DENY');
  assert.match(headers['content-security-policy'],/frame-ancestors 'none'/);
  assert.match(headers['content-security-policy-report-only'],/media-src 'self' https:\/\/manzo8b.github.io/);
  assert.ok(!('strict-transport-security' in headers),'HSTS should not activate in staging');
  await page.locator('#clean-access .approved-feature-card').first().waitFor({timeout:10000});
  await page.locator('#site-footer').waitFor({timeout:10000});
  assert.equal(await page.locator('#clean-access .approved-feature-card').count(),4);
  await page.locator('#lang').selectOption('en');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.locator('#lang').selectOption('it');
  assert.equal((await page.locator('#site-footer [data-footer="food"]').innerText()).trim(),'Mangiare');
  const sound=page.locator('#sound .music-art img');
  await sound.scrollIntoViewIfNeeded();
  const soundNaturalWidth=await sound.evaluate(async img=>{
   if(!img.complete||!img.naturalWidth){try{await img.decode()}catch{}}
   return img.naturalWidth;
  });
  assert.ok(soundNaturalWidth>0,'Sound image failed to decode');
  const sw=await page.request.get(url+'service-worker.js');
  assert.equal(sw.status(),200);
  assert.equal(sw.headers()['cache-control'],'no-cache');
  for(const path of ['comer/','agenda/','gallery/','listen/','stories/']){
   const result=await page.request.get(url+path);
   assert.equal(result.status(),200,path+' unavailable');
  }
  const geometry=await page.evaluate(()=>({
    viewport:window.innerWidth,scrollWidth:document.documentElement.scrollWidth,
    csp:window.__cspWarnings||[],
    title:document.title,
    homeBackground:getComputedStyle(document.body).backgroundColor
  }));
  assert.ok(geometry.scrollWidth<=width+3,'Horizontal overflow');
  assert.deepEqual(errors,[],'Runtime errors under staged headers');
  // Only the narrow CSP is enforced. The candidate full resource CSP can
  // generate report-only warnings without blocking the live interactions.
  const enforceViolations=geometry.csp.filter(e=>e.disposition==='enforce');
  assert.equal(enforceViolations.length,0,'Enforced CSP blocked site behavior');
  mkdirSync(root+'/screenshots',{recursive:true});
  await page.locator('#site-footer').screenshot({
   path:root+'/screenshots/footer-'+width+'.png',
   animations:'disabled'
  });
  findings.push({
   width,siteFunctionsPass:true,linksPass:true,footerPass:true,
   enforcedCSPViolations:enforceViolations,
   reportOnlyWarnings:geometry.csp.filter(e=>e.disposition==='report'),
   readOnlyStaging:true,
   note:'Local header-injecting server, not a live provider.'
  });
  await ctx.close();
  console.log('PASS staged headers in Chromium',width);
 }
 writeFileSync(root+'/browser-csp-observations.json',
    JSON.stringify({schemaVersion:1,findings},null,2)+'\n');
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
}

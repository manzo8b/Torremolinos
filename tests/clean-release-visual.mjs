/**
 * P0-10 — Pixel-level source vs clean dist regression on same Chromium runner.
 * Compare production files in repository to the clean distribution, not to
 * an invented mockup. External requests are blocked on both to remove CDN/font
 * timing flakiness; this does NOT replace full live visual QA.
 */
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const ROOT='artifacts/release/visual';
const ORIG=18960, CLEAN=18961;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const pages=['','comer/','agenda/','gallery/','stories/','listen/','explore/la-nogalera/','legal/'];
const widths=[390,1280];
const servers=[
 spawn('python3',['-m','http.server',String(ORIG),'--bind','127.0.0.1','--directory','.'],{stdio:'ignore'}),
 spawn('python3',['-m','http.server',String(CLEAN),'--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'})
];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const records=[],failures=[];
async function ready(port){
 for(let i=0;i<80;i++){
  try{let r=await fetch('http://127.0.0.1:'+port+'/');if(r.status===200)return;}catch{}
  await wait(120);
 }
 throw Error('Server not ready '+port);
}
async function screenshot(port,route,width){
 const context=await browser.newContext({
  viewport:{width,height:850},reducedMotion:'reduce',serviceWorkers:'block',
  locale:'it-IT',deviceScaleFactor:1,timezoneId:'Europe/Madrid'
 });
 await context.route('**/*',async request=>{
  const target=new URL(request.request().url());
  if(target.hostname==='127.0.0.1')await request.continue();
  else await request.abort();
 });
 const page=await context.newPage();
 const link='http://127.0.0.1:'+port+'/'+route;
 const resp=await page.goto(link,{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(resp?.status(),200,link+' status');
 await page.evaluate(async()=>{
  if(document.fonts?.ready)await document.fonts.ready;
  window.scrollTo({top:0,left:0,behavior:'instant'});
 });
 await page.waitForTimeout(180);
 const errors=[];
 const pageWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 assert.ok(pageWidth<=width+3,'horizontal overflow at '+route+' '+width);
 const file=route?route.replaceAll('/','_').replace(/_$/,''):'home';
 const buf=await page.screenshot({animations:'disabled',caret:'hide',fullPage:false});
 let footer=null;
 if(!route&&await page.locator('#site-footer').count()){
  await page.locator('#site-footer').scrollIntoViewIfNeeded();
  footer=await page.locator('#site-footer').screenshot({animations:'disabled',timeout:25000});
 }
 await context.close();
 return {buf,footer,pathname:file};
}
function comparison(a,b,key){
 const img1=PNG.sync.read(a),img2=PNG.sync.read(b);
 if(img1.width!==img2.width||img1.height!==img2.height){
  failures.push({key,error:'image dimension mismatch',one:[img1.width,img1.height],two:[img2.width,img2.height]});return;
 }
 let diff=0;
 for(let i=0;i<img1.data.length;i+=4){
  if(img1.data[i]!==img2.data[i]||img1.data[i+1]!==img2.data[i+1]||img1.data[i+2]!==img2.data[i+2])diff++;
 }
 const fraction=diff/(img1.width*img1.height);
 records.push({key,width:img1.width,height:img1.height,differingPixels:diff,
   pixelDifferenceRate:Number(fraction.toFixed(8))});
 if(fraction>.001)failures.push({key,error:'exceeds 0.1% allowance',rate:fraction});
}
try{
 await Promise.all([ready(ORIG),ready(CLEAN)]);
 mkdirSync(ROOT,{recursive:true});
 for(const width of widths){
  for(const route of pages){
   const name=route?route.replaceAll('/','_').replace(/_$/,''):'home';
   const old=await screenshot(ORIG,route,width);
   const fresh=await screenshot(CLEAN,route,width);
   const ref=ROOT+'/'+name+'-'+width;
   writeFileSync(ref+'-source.png',old.buf);
   writeFileSync(ref+'-dist.png',fresh.buf);
   comparison(old.buf,fresh.buf,name+'-'+width);
   if(!route&&old.footer&&fresh.footer){
    writeFileSync(ref+'-footer-source.png',old.footer);
    writeFileSync(ref+'-footer-dist.png',fresh.footer);
    comparison(old.footer,fresh.footer,'footer-'+width);
   }
   console.log('Compared',name,width);
  }
 }
 writeFileSync('artifacts/release/visual-diff.json',
  JSON.stringify({schemaVersion:1,widths,routes:pages,records,failures,
   caveat:'Same Chromium, external requests blocked; full live-device QA remains outstanding.'},null,2)+'\n');
 assert.equal(failures.length,0,JSON.stringify(failures.slice(0,8)));
 console.log('PASS visual parity',records.length,'screenshots');
}finally{
 await browser.close();
 servers.forEach(s=>s.kill('SIGTERM'));
}

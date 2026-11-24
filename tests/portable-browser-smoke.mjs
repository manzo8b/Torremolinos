// Test both deploy prefixes with real browser navigation; no production writes.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const plans=[
 {label:'github-pages',port:18910,root:'artifacts/portability/hosts/current',prefix:'/Torremolinos/',canonical:'https://manzo8b.github.io/Torremolinos/'},
 {label:'alternative',port:18911,root:'artifacts/portability/hosts/preview',prefix:'/guide/',canonical:'https://preview.example/guide/'},
];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const servers=[];
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const plan of plans){
  const server=spawn('python3',['-m','http.server',String(plan.port),'--bind','127.0.0.1','--directory',plan.root],{stdio:'ignore'});
  servers.push(server);
  const base='http://127.0.0.1:'+plan.port+plan.prefix;
  for(let attempt=0;attempt<60;attempt++){
    try{const res=await fetch(base);if(res.ok)break;}catch{}
    await sleep(150);
  }
  for(const width of [390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:850},locale:'it-IT',serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await ctx.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response?.status(),200,plan.label+' home '+width);
   await page.locator('#cards .place').first().waitFor({timeout:15000});
   const artwork=page.locator('#sound .music-art img');
   await artwork.scrollIntoViewIfNeeded();
   await artwork.evaluate(async img => {if(img.complete&&img.naturalWidth)return;await img.decode()});
   await page.evaluate(()=>window.scrollTo(0,0));
   const state=await page.evaluate(()=>({
    lang:document.documentElement.lang,
    title:document.title,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    og:document.querySelector('meta[property="og:image"]')?.content,
    width:document.documentElement.scrollWidth,
    sound:!!document.getElementById('sound'),
    photo:document.querySelector('#sound .music-art img')?.naturalWidth||0,
    cards:document.querySelectorAll('#clean-access .approved-feature-card').length
   }));
   assert.equal(state.lang,'it',plan.label+' language');
   assert.equal(state.canonical,plan.canonical,plan.label+' canonical');
   assert.ok(state.og?.startsWith(plan.canonical),plan.label+' OG image URL');
   assert.equal(state.cards,4,plan.label+' approved navigation cards');
   assert.ok(state.sound&&state.photo>0,plan.label+' sound photograph');
   assert.ok(state.width<=width+3,plan.label+' horizontal overflow');
   assert.equal(errors.length,0,plan.label+' runtime errors: '+errors.join('; '));
   const css=await page.request.get(base+'approved-clean-2026.css');
   assert.equal(css.status(),200,plan.label+' CSS');
   const manifest=await page.request.get(base+'manifest.webmanifest');
   assert.equal(manifest.status(),200,plan.label+' PWA manifest');
   for(const subpath of ['comer/','agenda/','gallery/','listen/','stories/']){
     const res=await page.request.get(base+subpath);
     assert.equal(res.status(),200,plan.label+' '+subpath);
   }
   mkdirSync('artifacts/portability/screenshots',{recursive:true});
   await page.screenshot({path:'artifacts/portability/screenshots/'+plan.label+'-'+width+'.png',fullPage:false});
   await ctx.close();
   console.log('PASS',plan.label,width,state.canonical);
  }
 }
}finally{
 if(browser)await browser.close();
 for(const server of servers)server.kill('SIGTERM');
}

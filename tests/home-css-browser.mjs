import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const endpoints=[{name:'source',port:18993,folder:'.',expected:14},{name:'bundle',port:18994,folder:'dist',expected:1}];
const servers=endpoints.map(p=>spawn('python3',['-m','http.server',String(p.port),'--bind','127.0.0.1','--directory',p.folder],{stdio:'ignore'}));
let browser;const samples=[];
try{
 for(const plan of endpoints){
  let ready=false;for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:'+plan.port+'/')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}
  assert.ok(ready);
 }
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const width of [390,1280]){
  const states=[];
  for(const plan of endpoints){
   const ctx=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block',reducedMotion:'reduce'});
   await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   const page=await ctx.newPage(),css=new Set(),errors=[];
   page.on('request',r=>{const u=new URL(r.url());if(r.resourceType()==='stylesheet'&&u.hostname==='127.0.0.1')css.add(u.pathname)});
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+plan.port+'/?lang=es',{waitUntil:'networkidle'});
   const snapshot=await page.evaluate(()=>{
    const list=[...document.querySelectorAll('header, main .hero, main .hero h1, main .hero-photo, #pride .feature-art, #sound, #site-footer')];
    return list.map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,display:c.display,color:c.color,bg:c.backgroundColor,font:c.fontFamily,size:c.fontSize,width:r.width,height:r.height}});
   });
   assert.equal(css.size,plan.expected,plan.name+' unexpected CSS requests: '+[...css]);
   assert.deepEqual(errors,[]);
   states.push(snapshot);samples.push({name:plan.name,width,css:[...css],snapshot});
   await ctx.close();
  }
  assert.deepEqual(states[0],states[1],'Computed layout/style differs at '+width);
 }
 console.log('PASS local CSS requests 14 → 1, computed parity at 390/1280');
}finally{
 mkdirSync('artifacts/release',{recursive:true});writeFileSync('artifacts/release/home-css-parity.json',JSON.stringify(samples,null,2)+'\n');
 if(browser)await browser.close();servers.forEach(p=>p.kill('SIGTERM'));
}

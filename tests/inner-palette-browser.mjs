import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),out='artifacts/inner-palette';
mkdirSync(out,{recursive:true});
const urls=['http://127.0.0.1:18771/','http://127.0.0.1:18772/'];
const servers=['baseline','candidate'].map((dir,i)=>spawn('python3',['-m','http.server',String(18771+i),'--bind','127.0.0.1','--directory',dir],{stdio:'ignore'}));
const routes=["agenda/","comer/","gallery/","explore/","explore/la-nogalera/","listen/","tu-torremolinos/","offline.html","stories/","stories/la-nogalera-donde-la-noche-tiene-historia.html","stories/navidad-ano-nuevo-torremolinos-malaga-2026-2027.html","stories/pasaje-begona-memoria-de-libertad.html","stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html","stories/torremolinos-mucho-mas-que-sol-y-playa.html","legal/accessibility.html","legal/ai-transparency.html","legal/contact.html","legal/cookie-policy.html","legal/copyright-credits.html","legal/editorial-policy.html","legal/event-source-policy.html","legal/","legal/privacy-policy.html","legal/terms-of-use.html"];
const report={samples:[],errors:[]};
let browser;
try{
 for(const u of urls){for(let i=0;i<80;i++){try{if((await fetch(u)).ok)break}catch{}await new Promise(r=>setTimeout(r,150))}}
 browser=await chromium.launch({headless:true});
 for(const width of [375,1280]){
  for(const route of routes){
   const pair=[];
   for(const [i,label] of ['before','after'].entries()){
    const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
    await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    const res=await p.goto(urls[i]+route+'?lang=it',{waitUntil:'networkidle'});
    const name=route.replaceAll('/','-').replaceAll('.html','')||'root';
    await p.screenshot({path:out+'/'+label+'-'+width+'-'+name+'.png',fullPage:true,animations:'disabled'});
    await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const m=await p.evaluate(async()=>{
     const c=(s,prop)=>{const el=document.querySelector(s);return el?getComputedStyle(el)[prop]:null};
     const images=[...document.images].map(x=>({src:x.getAttribute('src'),srcset:x.getAttribute('srcset'),alt:x.getAttribute('alt'),w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}));
     const a=await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}});
     return {bg:c('body','backgroundColor'),heading:c('h1','color'),header:c('body>header,.top,.mast','backgroundColor'),footer:c('footer','backgroundColor'),scroll:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images,violations:a.violations.flatMap(v=>v.nodes.map(n=>({target:n.target,summary:n.failureSummary})))};
    });
    const record={route,width,label,http:res.status(),errors,...m};report.samples.push(record);pair.push(record);await ctx.close();
   }
   const [b,a]=pair;
   if(a.bg!=='rgb(244, 239, 230)'||a.heading!=='rgb(16, 36, 75)'||(a.footer&&a.footer!=='rgb(16, 36, 75)')||(a.header&&a.header!=='rgb(255, 255, 255)'))report.errors.push({route,width,palette:{bg:a.bg,heading:a.heading,header:a.header,footer:a.footer}});
   const newJs=a.errors.filter(x=>!b.errors.includes(x));
   if(a.http!==200||newJs.length||a.scroll>width+1)report.errors.push({route,width,http:a.http,js:newJs,scroll:a.scroll});
   if(a.errors.length)console.log(JSON.stringify({route,width,existingJs:a.errors.filter(x=>b.errors.includes(x)),newJs}));
   if(JSON.stringify(b.images)!==JSON.stringify(a.images))report.errors.push({route,width,images:'Source or geometry differs'});
   const baseline=new Set(b.violations.map(x=>JSON.stringify(x.target)));
   const added=a.violations.filter(x=>!baseline.has(JSON.stringify(x.target)));
   if(added.length)report.errors.push({route,width,newContrast:added});
   console.log(JSON.stringify({route,width,contrastBefore:b.violations.length,contrastAfter:a.violations.length,images:a.images.length,palette:a.bg}));
  }
 }
}finally{writeFileSync(out+'/report.json',JSON.stringify(report,null,2));if(browser)await browser.close();servers.forEach(s=>s.kill('SIGTERM'))}
assert.deepEqual(report.errors,[],'inner palette regression gate');

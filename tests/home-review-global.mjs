import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const out='artifacts/home-review';
mkdirSync(out,{recursive:true});
const servers=[spawn('python3',['-m','http.server','18765','--bind','127.0.0.1','--directory','baseline'],{stdio:'ignore'}),spawn('python3',['-m','http.server','18766','--bind','127.0.0.1','--directory','candidate'],{stdio:'ignore'})];
const report={baseline:'d8c92b1c6a9e8d1d6893020834c7c3f1d6d4836b',status:'in attesa di validazione MF',samples:[],errors:[]};
let browser;
const urls=['http://127.0.0.1:18765/','http://127.0.0.1:18766/'];
async function start(){for(const u of urls){let ready=false;for(let i=0;i<80;i++){try{if((await fetch(u)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}assert.ok(ready,u)}}
function compare(a,b){const x=PNG.sync.read(readFileSync(a)),y=PNG.sync.read(readFileSync(b));if(x.width!==y.width||x.height!==y.height)return {sameDimensions:false,pixels:null};let n=0;for(let i=0;i<x.data.length;i+=4){if(x.data[i]!==y.data[i]||x.data[i+1]!==y.data[i+1]||x.data[i+2]!==y.data[i+2]||x.data[i+3]!==y.data[i+3])n++}return {sameDimensions:true,pixels:n,total:x.width*x.height}}
try{
 await start();browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 for(const width of [375,768,1280,1920]){
  const pair=[];
  for(const [i,label] of ['before','after'].entries()){
   const ctx=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'it-IT',reducedMotion:'reduce',serviceWorkers:'block'});
   // Deterministic parity: existing local pictures loaded; external resources
   // blocked equally on both sides. Actual external network used in Lighthouse.
   await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.clock.setFixedTime(new Date('2026-11-24T09:00:00+01:00'));
   await p.goto(urls[i]+'?lang=it',{waitUntil:'networkidle'});
   await p.locator('#cards .place').first().waitFor();
   await p.evaluate(()=>document.fonts.ready);
   // Load lazy images without changing their paths or final layout.
   await p.evaluate(async()=>{for(const img of document.images){img.loading='eager';try{await img.decode()}catch{}}window.scrollTo(0,0)});
   await p.waitForTimeout(250);
   const data=await p.evaluate(()=>{
    const rect=s=>{const el=document.querySelector(s),r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
    const protectedBottom=Math.ceil(document.querySelector('.trust.shell').getBoundingClientRect().bottom);
    const photos={};for(const img of document.querySelectorAll('main img')){const src=img.getAttribute('src');if(!src)continue;(photos[src]??=[]).push(img.closest('section')?.id||img.closest('section')?.className||'main')}
    const sections=[...document.querySelectorAll('main > section')].map(e=>({id:e.id||e.className,top:e.offsetTop,height:e.getBoundingClientRect().height,bg:getComputedStyle(e).backgroundColor}));
    const vis=s=>[...document.querySelectorAll(s)].filter(e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden').length;
    const frames=['.nogalera-feature-photo','.gallery-feature-img','#agenda-home .agenda-home-photo'].filter(s=>document.querySelector(s)).map(s=>({selector:s,frame:rect(s),image:rect(s+' img')}));
    const source=document.querySelector('#cards .source'),map=document.querySelector('#cards .placefoot a:not(.source)');
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,protectedBottom,sections,frames,duplicatePhotos:Object.entries(photos).filter(([k,v])=>v.length>1),soundControls:vis('#sound audio[controls],#sound #approvedSoundPlay'),mapControls:vis('#mapStart,#loadMap'),source:source&&{color:getComputedStyle(source).color,background:getComputedStyle(source).backgroundColor,opacity:getComputedStyle(source).opacity,href:source.href},map:map&&{color:getComputedStyle(map).color,href:map.href}};
   });
   const hero=out+'/'+label+'-protected-'+width+'.png';
   await p.screenshot({path:hero,clip:{x:0,y:0,width,height:data.protectedBottom},animations:'disabled'});
   await p.screenshot({path:out+'/'+label+'-home-'+width+'.png',fullPage:true,animations:'disabled'});
   await p.locator('#clean-access').screenshot({path:out+'/'+label+'-cards-'+width+'.png',animations:'disabled'});
   await p.locator('#discover').screenshot({path:out+'/'+label+'-explore-'+width+'.png',animations:'disabled'});
   await p.locator('.nogalera-feature').screenshot({path:out+'/'+label+'-nogalera-'+width+'.png',animations:'disabled'});
   await p.locator('#photodiary').screenshot({path:out+'/'+label+'-gallery-'+width+'.png',animations:'disabled'});
   await p.locator('#stories').screenshot({path:out+'/'+label+'-stories-'+width+'.png',animations:'disabled'});
   if(label==='after')await p.locator('#homeAgendaEvents[aria-busy="false"]').waitFor();
   await p.locator('#agenda-home').screenshot({path:out+'/'+label+'-agenda-'+width+'.png',animations:'disabled'});
   await p.locator('#sound').screenshot({path:out+'/'+label+'-sound-'+width+'.png',animations:'disabled'});
   if(label==='before')await p.locator('.gallery-feature').screenshot({path:out+'/before-gallery-banner-'+width+'.png',animations:'disabled'});
   if(label==='after'){
    const cardPhotos=await p.locator('#clean-access img[data-review-photo]').evaluateAll(imgs=>imgs.map(i=>({key:i.dataset.reviewPhoto,src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,ratio:i.getBoundingClientRect().width/i.getBoundingClientRect().height,alt:i.alt})));
    if(cardPhotos.length!==4||cardPhotos.some(x=>!x.loaded||Math.abs(x.ratio-1.5)>.025||!x.alt))report.errors.push('Card photo contract '+width+': '+JSON.stringify(cardPhotos));
    const tiles=await p.locator('#discover .review-photo-filter img').evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,ratio:i.getBoundingClientRect().width/i.getBoundingClientRect().height})));
    if(tiles.length!==4||tiles.some(x=>!x.loaded||Math.abs(x.ratio-1.5)>.03))report.errors.push('Explore photo contract '+width+': '+JSON.stringify(tiles));
    if(await p.locator('#cards .place').count()!==6)report.errors.push('Featured places count '+width);
    if(await p.locator('#pride').count())report.errors.push('Open to all still present '+width);
    const sound=await p.locator('#sound').evaluate(el=>{const a=el.querySelector('audio'),img=el.querySelector('.music-album-art'),credit=el.querySelector('.approved-sound-credit'),more=el.querySelector('.approved-music-more');return {players:el.querySelectorAll('audio[controls]').length,duplicate:!!el.querySelector('#approvedSoundPlay'),paused:a.paused,autoplay:a.autoplay,preload:a.preload,loaded:img.complete&&img.naturalWidth>=800,src:img.currentSrc,credit:credit?.textContent,creditVisible:!!credit?.getClientRects().length,more:!!more&&!more.open,links:more?.querySelectorAll('a').length,navy:getComputedStyle(el.querySelector('.music-shell')).backgroundColor}});
    if(sound.players!==1||sound.duplicate||!sound.paused||sound.autoplay||sound.preload!=='none'||!sound.loaded||!sound.src.includes('sound-headphones-')||!sound.creditVisible||!sound.credit?.includes('IA')||!sound.more||sound.links!==3||sound.navy!=='rgb(16, 36, 75)')report.errors.push('Sound contract '+width+': '+JSON.stringify(sound));
    const ag=await p.locator('#agenda-home').evaluate(el=>({ids:[...el.querySelectorAll('[data-event-id]')].map(x=>x.dataset.eventId),dates:[...el.querySelectorAll('[data-start]')].map(x=>x.dataset.start),verified:el.querySelector('#homeAgendaVerified')?.textContent,photos:el.querySelectorAll('img').length,cta:el.querySelectorAll('.agenda-home-btn').length}));
    if(ag.ids.join(',')!=='drag-mariquita-28nov26,fetish-awards-4dec26,ellas-12dec26'||ag.dates.some(x=>x<'2026-11-24')||!ag.verified?.includes('2 novembre 2026')||ag.photos||ag.cta!==1)report.errors.push('Agenda preview contract '+width+': '+JSON.stringify(ag));
    const st=await p.locator('#stories').evaluate(el=>({articles:el.querySelectorAll('.magazine-card').length,season:el.querySelectorAll('.l8-season-promo').length,extras:!!document.querySelector('.directory-teaser,.magazine-extra'),credits:[...el.querySelectorAll('.photoattribution')].map(x=>({border:getComputedStyle(x).borderTopWidth,outline:getComputedStyle(x).outlineWidth,inCopy:!!x.closest('.magazine-text')})),reads:[...el.querySelectorAll('.readmore,.l8-season-promo-copy em')].map(x=>getComputedStyle(x).backgroundColor)}));
    if(st.articles!==3||st.season!==1||st.extras||st.credits.length!==3||st.credits.some(x=>x.border!=='0px'||x.outline!=='0px'||!x.inCopy)||st.reads.some(x=>x!=='rgba(0, 0, 0, 0)'))report.errors.push('Stories contract '+width+': '+JSON.stringify(st));
    const strip=await p.locator('#photodiary').evaluate(el=>({photos:[...el.querySelectorAll('figure img')].map(img=>({src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0,ratio:img.getBoundingClientRect().width/img.getBoundingClientRect().height,alt:img.alt})),credits:[...el.querySelectorAll('figcaption small')].map(x=>x.textContent),links:el.querySelectorAll('a[href="gallery/"]').length,banner:!!document.querySelector('.gallery-feature')}));
    if(strip.photos.length!==3||strip.photos.some(x=>!x.loaded||Math.abs(x.ratio-1.5)>.03||!x.alt||!x.src.startsWith('assets/photos/home-review/gallery-'))||strip.credits.length!==3||strip.credits.some(x=>!x.includes('© Archivo fotográfico TORREMOLINOS'))||strip.links!==1||strip.banner)report.errors.push('Gallery strip contract '+width+': '+JSON.stringify(strip));
    const n=await p.locator('.nogalera-feature').evaluate(el=>({primary:el.querySelectorAll('.review-nogalera-main').length,links:[...el.querySelectorAll('.review-nogalera-stories a')].map(a=>({href:a.getAttribute('href'),background:getComputedStyle(a).backgroundColor})),photo:el.querySelector('img').getAttribute('src')}));
    if(n.primary!==1||n.links.length!==2||n.links.some(a=>a.background!=='rgba(0, 0, 0, 0)')||n.photo!=='assets/photos/album/plaza.webp')report.errors.push('Nogalera contract '+width+': '+JSON.stringify(n));
    await p.evaluate(()=>window.scrollTo(0,0));
   }

   await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const contrast=await p.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}});return {violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,count:v.nodes.length}))}});
   const record={label,...data,contrast,errors};
   pair.push({record,hero});report.samples.push(record);await ctx.close();
  }
  const [before,after]=pair;const diff=compare(before.hero,after.hero);after.record.protectedDiff=diff;
  after.record.heightReductionPercent=100*(before.record.height-after.record.height)/before.record.height;
  if(!diff.sameDimensions||diff.pixels!==0)report.errors.push('Protected pixel difference '+width+': '+JSON.stringify(diff));
  if(after.record.scrollWidth>width)report.errors.push('Horizontal overflow '+width);
  if(after.record.soundControls!==1||after.record.mapControls!==1)report.errors.push('Duplicate visible controls '+width);
  for(const f of after.record.frames)if(Math.abs(f.frame.top-f.image.top)>1||Math.abs(f.frame.bottom-f.image.bottom)>1)report.errors.push('Media inset '+width+' '+f.selector);
  if(after.record.errors.length)report.errors.push('JS '+width+' '+after.record.errors.join(';'));
  const old=new Set(before.record.contrast.violations.flatMap(v=>v.nodes.map(n=>JSON.stringify(n.target))));
  const added=after.record.contrast.violations.flatMap(v=>v.nodes.filter(n=>!old.has(JSON.stringify(n.target))));
  if(added.length)report.errors.push('New contrast findings '+width+': '+JSON.stringify(added));
  console.log(JSON.stringify({width,beforeHeight:before.record.height,afterHeight:after.record.height,diff,soundControls:after.record.soundControls,mapControls:after.record.mapControls,contrast:after.record.contrast.violations.length}));
 }
}finally{
 writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
 if(browser)await browser.close();servers.forEach(s=>s.kill('SIGTERM'));
}
assert.deepEqual(report.errors,[],'G1–G5 review gate');

import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),out='artifacts/inner-refinement';
mkdirSync(out,{recursive:true});
const urls=['http://127.0.0.1:18781/','http://127.0.0.1:18782/'];
const servers=['baseline','candidate'].map((dir,i)=>spawn('python3',['-m','http.server',String(18781+i),'--bind','127.0.0.1','--directory',dir],{stdio:'ignore'}));
const report={samples:[],errors:[]};let browser;
try{
 for(const u of urls){let ready=false;for(let i=0;i<80;i++){try{if((await fetch(u)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}assert.ok(ready,u)}
 browser=await chromium.launch({headless:true});
 for(const width of [320,375,768,1280,1920]){
  for(const route of ['agenda','stories','gallery']){
   const pair=[];
   for(const [i,label] of ['before','after'].entries()){
    const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce',locale:'es-ES'});
    await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.clock.setFixedTime(new Date('2026-11-24T12:00:00Z'));
    const res=await p.goto(urls[i]+route+'/?lang=es',{waitUntil:'networkidle'});
    if(route==='agenda')await p.locator('#highlights .highlight').first().waitFor();
    await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:out+'/'+label+'-'+route+'-'+width+'.png',fullPage:true,animations:'disabled'});
    await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const m=await p.evaluate(async route=>{
      const style=(s,prop)=>{const el=document.querySelector(s);return el?getComputedStyle(el)[prop]:null};
      const styles=(s,prop)=>[...document.querySelectorAll(s)].map(el=>getComputedStyle(el)[prop]);
      const contrast=await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}});
      const viewport=document.documentElement.clientWidth;
      const overflowNodes=[...document.querySelectorAll('body *')].map(el=>({el,rect:el.getBoundingClientRect()}))
        .filter(({el,rect})=>rect.width>0&&(rect.right>viewport+1||rect.left< -1)&&getComputedStyle(el).position!=='fixed')
        .map(({el,rect})=>({tag:el.tagName,id:el.id,cls:String(el.className).slice(0,140),left:Math.round(rect.left),right:Math.round(rect.right)})).slice(0,30);
      return {scroll:document.documentElement.scrollWidth,overflowNodes,bg:style('body','backgroundColor'),heading:style('h1','color'),
        cards:styles(route==='agenda'?'#highlights .highlight,#events .event,#watchlist .watchitem':route==='stories'?'.index-list .story-card':'#galleryGrid .gallery-card','backgroundColor'),
        padding:style(route==='agenda'?'#highlights .highlight':route==='stories'?'.story-text':'.gallery-copy','paddingLeft'),
        intro:style(route==='stories'?'.index-hero':'.hero','backgroundColor'),
        filter:style(route==='gallery'?'.filterbar':'.toolbox','backgroundColor'),
        dates:styles('#events .date','backgroundColor'),
        introPad:style(route==='stories'?'.index-hero':'.hero','paddingLeft'),
        introGap:style(route==='stories'?'.index-hero':'.hero','marginBottom'),
        gridGap:style(route==='stories'?'.index-list':'#galleryGrid','rowGap'),
        gridBg:style(route==='stories'?'.index-list':'#galleryGrid','backgroundColor'),
        noteBg:style('.editorial-note','backgroundColor'),
        cardBorders:styles(route==='stories'?'.index-list .story-card':'#galleryGrid .gallery-card','borderTopWidth'),
        photos:[...document.querySelectorAll('main img')].map(x=>[x.getAttribute('src'),x.getAttribute('srcset'),x.getAttribute('alt')]),
        links:[...document.querySelectorAll('main a')].map(x=>x.getAttribute('href')),
        contrast:contrast.violations.flatMap(v=>v.nodes.map(n=>({target:n.target,summary:n.failureSummary})))};
    },route);
    const record={width,route,label,http:res.status(),errors,...m};pair.push(record);report.samples.push(record);
    if(label==='after'&&route==='agenda'){await p.locator('[data-filter="culture"]').click();assert.equal(await p.locator('[data-filter="culture"]').getAttribute('aria-pressed'),'true');await p.locator('[data-filter="all"]').click()}
    if(label==='after'&&route==='gallery'){await p.locator('[data-filter="food"]').click();assert.ok(await p.locator('.gallery-card:visible').count()>0);await p.locator('[data-filter="all"]').click();await p.waitForFunction(()=>!document.querySelector('.gallery-card .image-button').disabled);await p.locator('.gallery-card .image-button').first().click();assert.ok(await p.locator('#viewer').isVisible());await p.locator('#closeViewer').click()}
    await ctx.close();
   }
   const [b,a]=pair,old=new Set(b.contrast.map(x=>JSON.stringify(x.target)));
   const added=a.contrast.filter(x=>!old.has(JSON.stringify(x.target)));
   if(a.http!==200||a.scroll>width+1||a.errors.length)report.errors.push({route,width,http:a.http,scroll:a.scroll,overflowNodes:a.overflowNodes,errors:a.errors});
   if(a.heading!=='rgb(16, 36, 75)'||!a.cards.length)report.errors.push({route,width,heading:a.heading,cards:a.cards});
   if(route==='agenda'&&(a.bg!=='rgb(244, 239, 230)'||a.cards.some(x=>x!=='rgb(251, 248, 242)')||parseFloat(a.padding)<18))report.errors.push({route,width,colors:a.cards,bg:a.bg,padding:a.padding});
   if(route!=='agenda'){
     const expectedIntro=route==='stories'?'rgb(236, 243, 250)':'rgb(244, 239, 230)';
     const expectedGrid=route==='stories'?'rgba(0, 0, 0, 0)':'rgb(236, 243, 250)';
     if(a.bg!=='rgb(255, 255, 255)'||a.intro!==expectedIntro||a.gridBg!==expectedGrid||parseFloat(a.introPad)<26||parseFloat(a.introGap)<32||parseFloat(a.gridGap)<28||a.cards.some(x=>x!=='rgba(0, 0, 0, 0)')||a.cardBorders.some(x=>x!=='0px')||(route==='stories'&&a.noteBg!=='rgb(244, 239, 230)'))report.errors.push({route,width,sectionComposition:{bg:a.bg,intro:a.intro,grid:a.gridBg,pad:a.introPad,gap:a.introGap,gridGap:a.gridGap,cards:a.cards,borders:a.cardBorders,note:a.noteBg}});
   }
   if(route==='gallery'&&a.filter!=='rgba(0, 0, 0, 0)')report.errors.push({route,width,filter:a.filter});
   if(route==='agenda'&&a.dates.some(x=>x!=='rgb(16, 36, 75)'))report.errors.push({route,width,dates:a.dates});
   if(JSON.stringify(a.photos)!==JSON.stringify(b.photos)||JSON.stringify(a.links)!==JSON.stringify(b.links))report.errors.push({route,width,sourceChange:true});
   if(a.contrast.length)report.errors.push({route,width,contrast:a.contrast});
   console.log(JSON.stringify({route,width,contrastBefore:b.contrast.length,contrastAfter:a.contrast.length,padding:a.padding,cards:a.cards.length}));
  }
 }
}finally{writeFileSync(out+'/report.json',JSON.stringify(report,null,2));if(browser)await browser.close();servers.forEach(s=>s.kill('SIGTERM'))}
assert.deepEqual(report.errors,[],'refinement release gate');

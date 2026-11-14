import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:8765';
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
async function waitForServer(){
  for(let i=0;i<50;i++){
    try{const response=await fetch(base+'/');if(response.ok)return;}catch{}
    await sleep(200);
  }
  throw new Error('Local HTTP server did not start');
}
async function titleAudit(page){
  await page.waitForTimeout(100);
  return page.locator('h1,h2,h3,h4,h5,h6').evaluateAll(nodes=>
    nodes.filter(node=>/[.．]\s*$/.test(node.textContent.trim()))
         .map(node=>node.textContent.trim())
  );
}
try{
  await waitForServer();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  mkdirSync('artifacts/screenshots',{recursive:true});
  const sizes=[360,390,768,1024,1440];
  for(const width of sizes){
    const context=await browser.newContext({viewport:{width,height:860},deviceScaleFactor:1,locale:'it-IT',reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(base+'/?lang=it',{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(),200);
    await page.locator('#cards .place').first().waitFor({timeout:15000});
    const doc=await page.evaluate(()=>({
      viewport:window.innerWidth,
      page:document.documentElement.scrollWidth,
      hero:getComputedStyle(document.querySelector('.hero-photo'),'::before').backgroundImage,
      title:document.querySelector('#hero-title').textContent,
      lang:document.documentElement.lang
    }));
    assert.ok(doc.page<=doc.viewport+3,'horizontal overflow '+width+': doc='+doc.page);
    assert.ok(doc.hero.includes('hero-apple-2026'),'hero image missing at '+width);
    assert.equal(doc.lang,'it');
    const whiteCraft=await page.evaluate(()=>{
      const footer=document.querySelector('footer.footer');
      const musicTitle=document.querySelector('.music-body h2');
      const nogaleraTitle=document.querySelector('.nogalera-feature-copy h2');
      return {
        footer:footer?getComputedStyle(footer).backgroundColor:null,
        music:musicTitle?getComputedStyle(musicTitle).color:null,
        nogalera:nogaleraTitle?getComputedStyle(nogaleraTitle).color:null,
        photos:document.querySelectorAll('#cards .place-photo').length,
        craftCss:[...document.styleSheets].some(sheet=>sheet.href?.includes('craft-finish.css'))
      };
    });
    assert.equal(whiteCraft.footer,'rgb(255, 255, 255)','footer is not white at '+width);
    assert.equal(whiteCraft.music,'rgb(255, 255, 255)','music title lacks contrast on green at '+width);
    assert.equal(whiteCraft.nogalera,'rgb(255, 255, 255)','Nogalera title lacks contrast on green at '+width);
    assert.equal(whiteCraft.photos,10,'place gallery should have 10 documentary photos at '+width);

    const premium=await page.evaluate(()=>{
      function css(sel){const e=document.querySelector(sel);return e?getComputedStyle(e):null;}
      function touch(sel){const e=document.querySelector(sel);if(!e)return null;const b=e.getBoundingClientRect();return {w:b.width,h:b.height};}
      function seam(root,a,b){
        const host=document.querySelector(root),x=document.querySelector(a),y=document.querySelector(b);
        if(!host||!x||!y)return null;
        const h=host.getBoundingClientRect(),p=x.getBoundingClientRect(),q=y.getBoundingClientRect();
        return {outer:h.width,one:p.width,two:q.width,gap:Math.abs(q.left-p.right)};
      }
      const bridge=css('.editorial-bridge'),bridgeText=css('.editorial-bridge h2'),
        agenda=css('.agenda-home'),music=css('.music-shell'),gallery=css('.gallery-feature');
      return {
        v6:[...document.styleSheets].some(x=>x.href?.includes('product-v6.css')),
        bridgeBg:bridge?.backgroundColor,bridgeText:bridgeText?.color,
        agendaBg:agenda?.backgroundColor,musicBg:music?.backgroundColor,
        galleryImg:touch('.gallery-feature-img'),musicCover:touch('.music-album-art:not([hidden])')||touch('.music-album-fallback:not([hidden])'),
        agendaPhoto:touch('.agenda-home-photo'),restaurantStyle:css('.directory-teaser')?.borderTopLeftRadius,
        gallerySeam:seam('.gallery-feature','.gallery-feature-img','.gallery-feature-body'),
        agendaSeam:seam('.agenda-home','.agenda-home-copy','.agenda-home-photo'),
        ctaRadius:css('.editorial-bridge-action')?.borderTopLeftRadius,
        galleryBg:gallery?.backgroundColor
      };
    });
    assert.ok(premium.v6,'product v6 stylesheet missing at '+width);
    assert.equal(premium.bridgeBg,'rgb(22, 134, 90)','narrative bridge washed out at '+width);
    assert.equal(premium.bridgeText,'rgb(255, 255, 255)','narrative bridge title illegible at '+width);
    assert.equal(premium.agendaBg,'rgb(245, 138, 23)','agenda scene has no color at '+width);
    assert.equal(premium.musicBg,'rgb(22, 134, 90)','music scene missing green at '+width);
    assert.ok(premium.galleryImg?.h>=240,'gallery image collapsed at '+width);
    assert.ok(premium.agendaPhoto?.h>=240,'agenda photograph collapsed at '+width);
    assert.ok(premium.musicCover?.h>=100,'music artwork collapsed at '+width);
    assert.ok(parseFloat(premium.ctaRadius)>=20,'action lost pill shape at '+width);
    if(width>=768){
      assert.ok(premium.gallerySeam?.gap<8,'gallery disconnected halves at '+width+': '+JSON.stringify(premium.gallerySeam));
      assert.ok(premium.agendaSeam?.gap<8,'agenda disconnected halves at '+width+': '+JSON.stringify(premium.agendaSeam));
    }

    assert.ok(whiteCraft.craftCss,'craft stylesheet missing at '+width);

    // V7: test actual layout relationships instead of just color tokens.
    const v7=await page.evaluate(()=>{
      const q=sel=>document.querySelector(sel);
      const box=sel=>q(sel)?.getBoundingClientRect();
      const gap=(a,b)=>{
        const p=box(a),n=box(b);
        return p&&n?Math.round(n.top-p.bottom):null;
      };
      const stylesheet=[...document.styleSheets].some(sheet=>sheet.href?.includes('narrative-v7.css'));
      const sourceCards=q('#cards'),figs=[...document.querySelectorAll('#photodiary .photo-diary-grid figure img')];
      const featured=q('#stories .magazine-card.primary'),small=q('#stories .magazine-card:not(.primary)');
      const action=q('.editorial-bridge-action'),aCss=action&&getComputedStyle(action);
      const rail=q('.v7-rail-controls');
      return {
        stylesheet,
        spaceDiscover:gap('#discover','#explore'),
        spaceExplore:gap('#explore','.nogalera-feature'),
        spaceSound:gap('.gallery-feature','#sound'),
        spaceStories:gap('#sound','#stories'),
        spaceAgenda:gap('#stories','#agenda-home'),
        photoLead:figs[0]?.getBoundingClientRect().height||0,
        photoDetail:figs[1]?.getBoundingClientRect().height||0,
        sourceWidth:sourceCards?.scrollWidth||0,
        viewerWidth:sourceCards?.clientWidth||0,
        featureWidth:featured?.getBoundingClientRect().width||0,
        storyWidth:small?.getBoundingClientRect().width||0,
        actions:document.querySelectorAll('main .v7-action-arrow[aria-hidden="true"]').length,
        reading:!!q('.v7-reading-track .v7-reading-bar'),
        rail:rail?getComputedStyle(rail).display:null,
        ctaRadius:aCss?.borderTopLeftRadius||null
      };
    });
    assert.ok(v7.stylesheet,'v7 final stylesheet absent at '+width);
    for(const [key,value] of Object.entries({
      discover:v7.spaceDiscover,explore:v7.spaceExplore,sound:v7.spaceSound,
      stories:v7.spaceStories,agenda:v7.spaceAgenda
    })){
      assert.ok(value>=50,'chapters visually stuck together at '+width+' '+key+' '+value+'px');
    }
    assert.ok(v7.photoLead>v7.photoDetail,'photo hierarchy collapsed at '+width);
    assert.ok(v7.actions>=5,'coordinated arrows missing at '+width);
    assert.ok(v7.reading,'scroll progress indicator absent at '+width);
    assert.ok(parseFloat(v7.ctaRadius)>20,'oval CTA lost at '+width);
    if(width<=760){
      assert.ok(v7.sourceWidth>v7.viewerWidth+80,'native places rail missing at '+width);
      assert.equal(v7.rail,'flex','thumb rail controls hidden at '+width);
    }else if(width>=1200){
      assert.ok(v7.featureWidth>v7.storyWidth*1.5,'editorial story spotlight not larger at '+width);
    }

    assert.deepEqual(await titleAudit(page),[],'headings ending with periods at '+width);
    assert.deepEqual(errors,[],'runtime errors on '+width);
    const ctas=await page.evaluate(()=>{
      function props(selector){
        const el=document.querySelector(selector),css=el&&getComputedStyle(el);
        return css?{text:css.color,bg:css.backgroundColor}:null;
      }
      return {gallery:props('.gallery-feature-body a'),feedback:props('.community .darkbtn'),credit:props('.music-art small')};
    });
    assert.deepEqual(ctas.gallery,{text:'rgb(255, 255, 255)',bg:'rgb(22, 134, 90)'},'gallery contrast '+width);
    assert.deepEqual(ctas.feedback,{text:'rgb(22, 134, 90)',bg:'rgb(255, 255, 255)'},'feedback CTA contrast '+width);
    assert.equal(ctas.credit.text,'rgb(255, 255, 255)','album credit unreadable at '+width);
    if(width===390||width===1440){
      // Full-page screenshots do not automatically reveal lazy images. Simulate
      // a real visitor scrolling through the whole catalog, then validate.
      for(let i=0;i<10;i++){
        const img=page.locator('#cards .place-photo').nth(i);
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node=>new Promise((resolve,reject)=>{
          const deadline=Date.now()+7500;
          function check(){
            if(node.complete&&node.naturalWidth>0){resolve();return;}
            if(Date.now()>deadline){reject(new Error('Place photo did not load: '+node.src));return;}
            setTimeout(check,75);
          }
          check();
        }));
      }
      await page.locator('.music-art').scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      const mediaOk=await page.evaluate(()=>{
        const img=document.querySelector('.music-album-art'),fallback=document.querySelector('.music-album-fallback');
        return (img?.naturalWidth>0&&!img.hidden) || (fallback&&!fallback.hidden);
      });
      assert.ok(mediaOk,'music cover and offline poster both missing at '+width);
      await page.locator('#cards').evaluate(el=>el.scrollLeft=0);
      await page.evaluate(()=>window.scrollTo(0,0));
      assert.equal(await page.locator('#cards .place-photo').count(),10,'broken place photo');
    }
    await page.screenshot({path:'artifacts/screenshots/home-'+width+'.png',fullPage:true,animations:'disabled'});
    if(width===390){
      const next=page.locator('.v7-rail-next'),prev=page.locator('.v7-rail-prev');
      await next.click();
      const offset=await page.locator('#cards').evaluate(el=>el.scrollLeft);
      assert.ok(offset>0,'Next place arrow does not move the rail');
      await prev.click();
      await page.locator('#cards').evaluate(el=>el.scrollLeft=0);
      await page.locator('[data-mood="taste"]').click();
      assert.ok((await page.locator('#route').innerText()).includes('La Carihuela'),'mood route did not change');
      const steps=await page.locator('#route li').count();
      assert.ok(steps>=2,'planner rendered no stops');
      await page.locator('#route li .route-control').last().click();
      assert.equal(await page.locator('#route li').count(),steps-1,'cannot remove a stop');
      await page.locator('[data-filter="lgbt"]').click();
      assert.ok(await page.locator('#cards .place').count()>=1,'catalog filter failed');
      await page.locator('#search').fill('Pasaje');
      assert.ok(await page.locator('#cards .place').count()>=1,'search failed');
      await page.locator('#search').fill('');
      await page.locator('#lang').selectOption('en');
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.deepEqual(await titleAudit(page),[],'English headings ending with periods');
      await page.locator('#lang').selectOption('es');
      assert.deepEqual(await titleAudit(page),[],'Spanish headings ending with periods');
    }
    await context.close();
    console.log('PASS responsive home '+width+'px');
  }
  const pages=['agenda/','comer/','gallery/','listen/','stories/','explore/la-nogalera/','legal/','legal/ai-transparency.html','legal/contact.html','stories/torremolinos-mucho-mas-que-sol-y-playa.html'];
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const path of pages){
    const response=await page.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(),200,'broken route '+path);
    await page.waitForTimeout(140);
    assert.deepEqual(await titleAudit(page),[],'title punctuation on '+path);
    const style=await page.evaluate(()=>[...document.styleSheets].some(sheet=>sheet.href?.includes('apple-premium.css')));
    assert.ok(style,'premium CSS not loaded on '+path);
    const color=await page.evaluate(()=>getComputedStyle(document.querySelector('footer')).backgroundColor);
    assert.equal(color,'rgb(255, 255, 255)','dark footer remains on '+path);

    const layout=await page.evaluate(()=>({
      viewport:window.innerWidth,
      full:document.documentElement.scrollWidth,
      hasFinalStyles:[...document.styleSheets].some(sheet=>sheet.href?.includes('narrative-v7.css'))
    }));
    assert.ok(layout.full<=layout.viewport+3,'horizontal overflow on '+path+': '+layout.full+' > '+layout.viewport);
    assert.ok(layout.hasFinalStyles,'narrative v7 styling absent on '+path);
    if(['comer/','agenda/','gallery/'].includes(path)){
      await page.screenshot({
        path:'artifacts/screenshots/inner-'+path.replaceAll('/','-')+'390.png',
        fullPage:true,animations:'disabled'
      });
    }

    console.log('PASS route '+path);
  }
  await context.close();

  const desktop=await browser.newContext({
    viewport:{width:1440,height:900},
    deviceScaleFactor:1,reducedMotion:'reduce',locale:'it-IT'
  });
  const desktopPage=await desktop.newPage();
  for(const path of ['comer/','agenda/','gallery/']){
    const response=await desktopPage.goto(base+'/'+path,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(),200,'desktop route unavailable '+path);
    await desktopPage.waitForTimeout(140);
    const result=await desktopPage.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(result.scroll<=result.width+3,'desktop overflow on '+path);
    await desktopPage.screenshot({
      path:'artifacts/screenshots/inner-'+path.replaceAll('/','-')+'1440.png',
      fullPage:true,animations:'disabled'
    });
  }
  await desktop.close();
  console.log('PASS all UI smoke tests');
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}

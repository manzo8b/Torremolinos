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
    assert.equal(whiteCraft.music,'rgb(17, 17, 17)','music title illegible on white at '+width);
    assert.equal(whiteCraft.nogalera,'rgb(17, 17, 17)','Nogalera title illegible at '+width);
    assert.equal(whiteCraft.photos,10,'place gallery should have 10 documentary photos at '+width);
    assert.ok(whiteCraft.craftCss,'craft stylesheet missing at '+width);
    assert.deepEqual(await titleAudit(page),[],'headings ending with periods at '+width);
    assert.deepEqual(errors,[],'runtime errors on '+width);
    const ctas=await page.evaluate(()=>{
      function props(selector){
        const el=document.querySelector(selector),css=el&&getComputedStyle(el);
        return css?{text:css.color,bg:css.backgroundColor}:null;
      }
      return {gallery:props('.gallery-feature-body a'),feedback:props('.community .darkbtn'),credit:props('.music-art small')};
    });
    assert.deepEqual(ctas.gallery,{text:'rgb(17, 17, 17)',bg:'rgb(255, 255, 255)'},'gallery contrast '+width);
    assert.deepEqual(ctas.feedback,{text:'rgb(255, 255, 255)',bg:'rgb(22, 134, 90)'},'feedback CTA contrast '+width);
    assert.equal(ctas.credit.text,'rgb(17, 17, 17)','album credit unreadable at '+width);

    const chapter=await page.evaluate(()=>{
      const background=selector=>getComputedStyle(document.querySelector(selector)).backgroundColor;
      const radius=selector=>parseFloat(getComputedStyle(document.querySelector(selector)).borderTopLeftRadius);
      return {
        discover:background('#discover'),plan:background('#plan'),
        agenda:background('#agenda-home'),pride:background('#pride .feature'),
        prideCopy:background('#pride .feature-copy'),prideArt:background('#pride .feature-art.pride-visual'),
        prideWordColor:getComputedStyle(document.querySelector('#pride .pride-visual-word')).color,
        planWorkspace:background('#plan .plan-workspace'),
        heroButtonRadius:radius('.hero-cta-main'),
        sceneRadius:radius('#discover'),
        cardRadius:radius('#explore .place-art'),
        plannerBeforePlaces:!!(document.querySelector('#plan').compareDocumentPosition(document.querySelector('#explore')) & Node.DOCUMENT_POSITION_FOLLOWING),
        pwaStyles:[...document.styleSheets].some(sheet=>sheet.href?.includes('product-chapters.css'))
      };
    });
    assert.equal(chapter.discover,'rgb(245, 138, 23)','discovery chapter not orange at '+width);
    assert.equal(chapter.plan,'rgb(22, 134, 90)','planner chapter not green at '+width);
    assert.equal(chapter.agenda,'rgb(22, 134, 90)','agenda chapter not green at '+width);
    assert.equal(chapter.pride,'rgb(22, 134, 90)','pride story not green at '+width);
    assert.equal(chapter.prideCopy,'rgb(22, 134, 90)','pride body lost its green surface at '+width);
    assert.equal(chapter.prideArt,'rgb(245, 138, 23)','pride story card not orange at '+width);
    assert.equal(chapter.prideWordColor,'rgb(17, 17, 17)','pride statement is not legible on orange at '+width);
    assert.equal(chapter.planWorkspace,'rgb(255, 255, 255)','plan reading surface must be white at '+width);
    assert.ok(chapter.heroButtonRadius>=24,'main button not pill-shaped at '+width);
    assert.ok(chapter.sceneRadius>=25,'discovery section not oval at '+width);
    assert.ok(chapter.cardRadius>=22,'photo cards not rounded at '+width);
    assert.ok(chapter.plannerBeforePlaces,'plan should appear before catalogue');
    assert.ok(chapter.pwaStyles,'product chapters CSS missing at '+width);

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
      
      const musicPhoto=page.locator('#sound .music-album-art');
      await musicPhoto.scrollIntoViewIfNeeded();
      await musicPhoto.evaluate(node=>new Promise((resolve,reject)=>{
        const deadline=Date.now()+7500;
        function check(){
          if(node.complete&&node.naturalWidth>0){resolve();return;}
          if(Date.now()>deadline){reject(new Error('Music photo did not load: '+node.src));return;}
          setTimeout(check,75);
        }
        check();
      }));
      await page.evaluate(()=>window.scrollTo(0,0));
      assert.equal(await page.locator('#cards .place-photo').count(),10,'broken place photo');
    }
    await page.screenshot({path:'artifacts/screenshots/home-'+width+'.png',fullPage:true,animations:'disabled'});
    if(width===390){
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
    console.log('PASS route '+path);
  }
  await context.close();
  console.log('PASS all UI smoke tests');
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}

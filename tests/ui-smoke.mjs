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
    if(!path.startsWith('legal/')&&!path.startsWith('stories/torremolinos-')){
      const color=await page.evaluate(()=>getComputedStyle(document.querySelector('footer')).backgroundColor);
      assert.equal(color,'rgb(255, 255, 255)','dark footer remains on '+path);
    }
    console.log('PASS route '+path);
  }
  await context.close();
  console.log('PASS all UI smoke tests');
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}

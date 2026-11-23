/**
 * TORREMOLINOS — pre-fix visual baseline (P0-00).
 * Captures all published or noindex HTML routes under the repository, using the
 * current site bytes. No changes to application HTML/CSS/JS, no migration assumptions.
 * Run: node scripts/capture_visual_baseline.mjs
 * Screenshots and measured tokens are output under baseline/runs/.
 */
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readdirSync,readFileSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,relative,resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';

const ROOT=resolve('.');
const PORT=18766;
const HOST='http://127.0.0.1:'+PORT;
const OUT=join(ROOT,'baseline','runs');
const WIDTHS=[375,768,1280,1920];
const LANGUAGES=['es','en','it','de','fr','ru'];
const selectors={
  body:'body',
  topbar:'.topbar',
  nav:'.navlinks',
  hero:'.hero',
  heroTitle:'.hero h1',
  sound:'#sound .music-shell',
  soundTitle:'#sound h2',
  feature:'#clean-access .approved-feature-card',
  stories:'#stories',
  agenda:'#agenda-home',
  footer:'footer'
};
const ignored=new Set(['.git','node_modules','baseline','artifacts','dist','coverage','fixtures']);
function htmlFiles(dir=ROOT){
  const files=[];
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    if(entry.isDirectory()&& !ignored.has(entry.name)){
      files.push(...htmlFiles(join(dir,entry.name)));
    }else if(entry.isFile()&&entry.name.toLowerCase().endsWith('.html')){
      files.push(relative(ROOT,join(dir,entry.name)).split(sep).join('/'));
    }
  }
  return files;
}
function routePath(file){return '/'+file.replace(/index\.html$/,'');}
function safeName(file){
  return file.replace(/index\.html$/,'index').replace(/\.html$/,'').replace(/[^a-zA-Z0-9_-]+/g,'__');
}
function sha(s){return createHash('sha256').update(s).digest('hex');}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){
  for(let n=0;n<100;n++){
    try{const r=await fetch(HOST+'/');if(r.status===200)return;}catch{}
    await sleep(160);
  }
  throw new Error('Local server did not start on '+HOST);
}
const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
let browser;
const records=[];
const errors=[];
try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
  for(const file of htmlFiles().sort()){
    for(const width of WIDTHS){
      const ctx=await browser.newContext({
        viewport:{width,height:width<800?844:900},
        deviceScaleFactor:1,
        locale:'es-ES',
        timezoneId:'Europe/Madrid',
        reducedMotion:'reduce',
        serviceWorkers:'block'
      });
      const page=await ctx.newPage();
      const path=routePath(file);
      const requestURL=HOST+path;
      const pageErrors=[];
      page.on('pageerror',error=>pageErrors.push(error.message));
      let status=0;
      try{
        const response=await page.goto(requestURL,{waitUntil:'domcontentloaded',timeout:30000});
        status=response?.status()||0;
        if(status!==200)throw new Error('HTTP '+status+' at '+requestURL);
        await page.waitForTimeout(220);
        let supported=[];
        const localeSelect=page.locator('#lang');
        if(await localeSelect.count()){
          supported=await localeSelect.locator('option').evaluateAll(options=>options.map(o=>o.value));
        }
        const candidates=supported.length
          ? LANGUAGES.filter(x=>supported.includes(x))
          : [(await page.locator('html').getAttribute('lang'))||'es'];
        for(const lang of candidates){
          if(supported.length){
            await localeSelect.selectOption(lang);
            await page.waitForTimeout(240);
          }
          await page.evaluate(async()=>{
            if(document.fonts?.ready){
              await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,3500))]);
            }
          });
          // Trigger lazy images via actual scrolling, preserving the application state.
          await page.evaluate(async()=>{
            const step=900;
            const total=Math.min(document.documentElement.scrollHeight,45000);
            for(let y=0;y<total;y+=step){
              window.scrollTo(0,y);
              await new Promise(resolve=>setTimeout(resolve,24));
            }
            window.scrollTo(0,0);
          });
          await page.waitForTimeout(160);
          const screenshot=join(OUT,'screenshots',safeName(file),String(width),lang+'.png');
          mkdirSync(resolve(screenshot,'..'),{recursive:true});
          await page.screenshot({path:screenshot,fullPage:true,animations:'disabled',caret:'hide',timeout:45000});
          const measured=await page.evaluate((pairs)=>{
            const report={};const props=[
              'color','backgroundColor','backgroundImage','fontFamily','fontSize','fontWeight',
              'lineHeight','letterSpacing','padding','margin','gap','borderRadius','boxShadow',
              'display','gridTemplateColumns','width','height'
            ];
            for(const [name,selector] of Object.entries(pairs)){
              const el=document.querySelector(selector);
              if(!el){report[name]=null;continue;}
              const style=getComputedStyle(el),rect=el.getBoundingClientRect();
              report[name]={selector,rect:{x:Math.round(rect.x),y:Math.round(rect.y),width:Math.round(rect.width),height:Math.round(rect.height)}};
              for(const p of props)report[name][p]=style[p];
            }
            return {computed:report,lang:document.documentElement.lang,
              viewportWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,
              pageHeight:document.documentElement.scrollHeight,
              title:document.title,fontsStatus:document.fonts?.status||'unknown',
              noindex:!!document.querySelector('meta[name="robots"][content*="noindex"]')};
          },selectors);
          const bytes=readFileSync(screenshot);
          const record={file,path,width,requestedLanguage:lang,
            renderedLanguage:measured.lang,status,
            screenshot:relative(OUT,screenshot).split(sep).join('/'),
            screenshotSHA256:sha(bytes),screenshotBytes:bytes.length,
            ...measured,
            jsErrors:[...new Set(pageErrors)]};
          records.push(record);
          console.log('BASELINE',file,width,lang,'rendered='+measured.lang,'bytes='+bytes.length);
        }
      }catch(error){
        errors.push({file,width,url:requestURL,status,error:String(error)});
        console.error('BASELINE ERROR',file,width,String(error));
      }finally{await ctx.close();}
    }
  }
  mkdirSync(OUT,{recursive:true});
  const metadata={schemaVersion:1,source:'local repository bytes on GitHub Actions runner',
    widths:WIDTHS,languages:LANGUAGES,
    routes:[...new Set(records.map(r=>r.path))],
    screenshotCount:records.length,errorCount:errors.length,
    screenshotsReferencedBySHA256:true,
    browser:browser.version(),
    sourceCommit:process.env.GITHUB_SHA||null,
    notes:[
      'Capture generated without changes to user-facing site code',
      'Multi-language captures only where this route exposes a language selector',
      'Expected visual pixel differences are < 0.1% in the same controlled browser environment',
      'Do not claim WCAG, SEO or translation quality from pixel snapshots'
    ]};
  writeFileSync(join(OUT,'manifest.json'),JSON.stringify({...metadata,errors},null,2)+'\n');
  writeFileSync(join(OUT,'tokens.json'),JSON.stringify(records,null,2)+'\n');
  console.log(JSON.stringify({screenshots:records.length,routeCount:metadata.routes.length,errors:errors.length}));
  if(errors.length)process.exitCode=1;
}finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
}

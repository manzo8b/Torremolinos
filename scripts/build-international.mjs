/* Generate language-specific HTML from the existing UI dictionaries, not a second application.
   Source templates remain the editable single source; only the release artifact contains projections. */
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,cpSync,readdirSync,rmSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {LANGS,BASE,ROUTES,META,NAMES,OG,NOTE} from './international-config.mjs';
const require=createRequire(import.meta.url);
const {file,localize,dossiers}=require('../locale-routing.js');
const root=resolve(new URL('..',import.meta.url).pathname);
const out=join(root,'artifacts','international-site');
const reportPath=join(root,'artifacts','international-report.json');
const base='http://127.0.0.1:8770/';
const read=p=>readFileSync(join(root,p),'utf8');
const write=(p,v)=>{mkdirSync(dirname(join(out,p)),{recursive:true});writeFileSync(join(out,p),v,'utf8')};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report={schema:1,generated:[],checks:[],warnings:[],errors:[]};
const server=spawn('python3',['-m','http.server','8770','--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break}catch{}await sleep(200);if(i===49)throw Error('Source HTTP server unavailable')}
 rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
 for(const entry of readdirSync(root,{withFileTypes:true})){
   if(['.git','.github','node_modules','artifacts','tests','scripts'].includes(entry.name))continue;
   cpSync(join(root,entry.name),join(out,entry.name),{recursive:true});
 }
 browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
 const targets={};
 for(const route of [...ROUTES.map(r=>r.path),'stories/','listen/'])for(const lang of LANGS){
   targets[file(route,lang)]={route,lang};
   if(lang==='es')targets[route+'index.html']={route,lang};
 }
 for(const slug of dossiers)for(const lang of LANGS)targets['stories/'+slug+(lang==='es'?'':'-'+lang)+'.html']={slug,lang};
 for(const route of ROUTES){
   let spanishProbe;
   for(const lang of LANGS){
     const path=route.path+'index.html';
     const raw=read(path);
     const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce',serviceWorkers:'block',locale:'es-ES'});
     const page=await context.newPage();
     const annotated=await page.evaluate(raw=>{
       const doc=new DOMParser().parseFromString(raw,'text/html');
       [...doc.body.querySelectorAll('*')].forEach((node,i)=>node.setAttribute('data-seo-node',String(i)));
       return '<!doctype html>\n'+doc.documentElement.outerHTML;
     },raw);
     const sourceURL=base+route.path+'?lang='+lang;
     await context.route('**/*',request=>{
       const u=new URL(request.request().url());
       if(u.origin!==new URL(base).origin)return request.abort();
       if(request.request().isNavigationRequest()&&u.href===sourceURL)return request.fulfill({status:200,contentType:'text/html; charset=utf-8',body:annotated});
       return request.continue();
     });
     const errors=[];page.on('pageerror',e=>errors.push(e.message));
     await page.goto(sourceURL,{waitUntil:'domcontentloaded',timeout:30000});
     await page.waitForFunction(l=>document.documentElement.lang===l,lang,{timeout:10000});
     // Wait for deterministic local rendering, never for third-party media or trackers.
     await page.waitForTimeout(180);
     const probe=(await page.locator(route.probe).first().textContent()).trim();
     assert.ok(probe.length>15,'Missing meaningful localized copy '+path+' '+lang);
     if(lang==='es')spanishProbe=probe;else assert.notEqual(probe,spanishProbe,'Untranslated primary copy '+path+' '+lang);
     assert.deepEqual(errors,[],'Source runtime errors '+path+' '+lang);
     const meta=META[route.path][lang],canonical=BASE+file(route.path,lang);
     const indexed=route.index||lang==='es';
     const depth=route.path.split('/').filter(Boolean).length;
     const relativeRoot='../'.repeat(depth)||'./';
     const result=await page.evaluate(({annotated,lang,meta,canonical,indexed,alternates,relativeRoot,lists,routePath,targets,base,publicBase,names,langs,og,note})=>{
       const doc=new DOMParser().parseFromString(annotated,'text/html');
       const live=new Map([...document.querySelectorAll('[data-seo-node]')].map(n=>[n.getAttribute('data-seo-node'),n]));
       let changed=0,matched=0;const unmatched=[];
       for(const node of doc.body.querySelectorAll('[data-seo-node]')){
         const id=node.getAttribute('data-seo-node'),actual=live.get(id);
         if(!actual||node.tagName!==actual.tagName){
           if(node.matches('[data-t],[data-i18n],[data-copy],[data-clean],[data-plan-t],[data-footer]')&&!node.children.length)unmatched.push(node.textContent.trim().slice(0,100));
           continue;
         }
         matched++;
         if(!node.matches('script,style,textarea,option,noscript')){
           // Preserve the original structural markup and every event-binding hook.
           if(!node.children.length&&!actual.children.length&&node.textContent!==actual.textContent){node.textContent=actual.textContent;changed++}
           else if(node.children.length&&[...node.children].map(n=>n.tagName).join() === [...actual.children].map(n=>n.tagName).join()){
             const from=[...node.childNodes].filter(n=>n.nodeType===3),to=[...actual.childNodes].filter(n=>n.nodeType===3);
             if(from.length===to.length)from.forEach((n,i)=>{if(n.textContent!==to[i].textContent){n.textContent=to[i].textContent;changed++}});
           }
         }
         for(const attr of ['alt','aria-label','placeholder','title']){
           if(actual.hasAttribute(attr)&&node.getAttribute(attr)!==actual.getAttribute(attr))node.setAttribute(attr,actual.getAttribute(attr));
         }
       }
       // Only public catalogue cards, in containers whose original runtime replaces children.
       // Never snapshot saved places, a personal itinerary, or time-dependent Agenda results.
       const captured={};
       for(const selector of lists){
         const source=document.querySelector(selector),target=doc.querySelector(selector);
         if(!source||!target)continue;
         const clone=source.cloneNode(true);
         clone.querySelectorAll('script,iframe,button,input,select,textarea,[data-private]').forEach(n=>n.remove());
         clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
         target.innerHTML=clone.innerHTML;
         captured[selector]=clone.querySelectorAll('article').length;
       }
       doc.querySelectorAll('[data-seo-node]').forEach(n=>n.removeAttribute('data-seo-node'));
       doc.documentElement.lang=lang;
       doc.documentElement.dataset.torreLocale=lang;
       doc.title=meta[0];
       const setMeta=(key,value,type='name')=>{
         let m=doc.head.querySelector('meta['+type+'="'+key+'"]');
         if(!m){m=doc.createElement('meta');m.setAttribute(type,key);doc.head.append(m)}
         m.setAttribute('content',value);
       };
       setMeta('description',meta[1]);setMeta('robots',indexed?'index,follow':'noindex,follow');
       setMeta('og:title',meta[0],'property');setMeta('og:description',meta[1],'property');
       setMeta('og:locale',og,'property');setMeta('og:url',canonical,'property');
       const canon=doc.head.querySelector('link[rel=canonical]');canon.href=canonical;
       doc.head.querySelectorAll('link[rel=alternate][hreflang]').forEach(n=>n.remove());
       if(alternates)for(const [code,url] of Object.entries(alternates)){const a=doc.createElement('link');a.rel='alternate';a.hreflang=code;a.href=url;doc.head.append(a)}
       for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){
         const obj=JSON.parse(script.textContent);
         if(obj['@type']==='WebSite'){obj.url=canonical;obj.inLanguage=lang;obj.description=meta[1];script.textContent=JSON.stringify(obj)}
       }
       const select=doc.querySelector('#lang,#language');
       if(select){
         for(const option of select.options){option.toggleAttribute('selected',option.value===lang)}
         const nav=doc.createElement('noscript');
         // Explicit language links still work without JavaScript.
         nav.textContent='<nav aria-label="Language">'+langs.map((l,i)=>'<a lang="'+l+'" hreflang="'+l+'" href="'+(l==='es'?'./':l+'.html')+'">'+names[i]+'</a>').join(' · ')+'</nav>';
         select.closest('label')?.after(nav) || (!nav.isConnected&&select.after(nav));
       }
       const localBase=new URL(base),site=new URL(publicBase);
       for(const a of doc.querySelectorAll('a[href]')){
         const href=a.getAttribute('href');if(!href||href.startsWith('#')||a.hasAttribute('hreflang'))continue;
         let url;try{url=new URL(href,base+routePath)}catch{continue}
         let path;
         if(url.origin===localBase.origin)path=url.pathname.slice(localBase.pathname.length);
         else if(url.origin===site.origin&&url.pathname.startsWith(site.pathname))path=url.pathname.slice(site.pathname.length);
         else continue;
         const match=targets[path];if(!match)continue;
         const dest=match.slug?'stories/'+match.slug+(lang==='es'?'':'-'+lang)+'.html':match.route+(lang==='es'?'':lang+'.html');
         url.searchParams.delete('lang');
         a.setAttribute('href',(relativeRoot+dest)+url.search+url.hash);
       }
       if(routePath==='agenda/'&&lang!=='es'){const disclaimer=doc.createElement('p');disclaimer.lang=lang;disclaimer.className='wrap';disclaimer.textContent=note;doc.querySelector('main')?.prepend(disclaimer)}
       // Executed before the legacy inline or deferred applications.
       const router=doc.createElement('script');router.src=relativeRoot+'locale-routing.js';router.dataset.root=relativeRoot;doc.head.append(router);
       return {html:'<!doctype html>\n'+doc.documentElement.outerHTML+'\n',changed,matched,unmatched,captured};
     },{annotated,lang,meta,canonical,indexed,alternates:route.index?Object.fromEntries([...LANGS.map(l=>[l,BASE+file(route.path,l)]),['x-default',BASE+route.path]]):null,relativeRoot,lists:route.lists,routePath:route.path,targets,base,publicBase:BASE,names:NAMES,langs:LANGS,og:OG[lang],note:NOTE[lang]});
     const dest=route.path+(lang==='es'?'index.html':lang+'.html');
     assert.ok(result.changed>0,'No projected copy '+dest);
     assert.ok(!result.html.includes('127.0.0.1:8770'),'Local server URL leaked '+dest);
     assert.ok(result.html.includes('lang="'+lang+'"'));
     assert.ok(result.html.includes('href="'+canonical+'"'));
     write(dest,result.html);
     report.generated.push({path:dest,lang,indexed,changed:result.changed,matched:result.matched,unmatched:result.unmatched,captured:result.captured,probe});
     if(result.unmatched.length)report.warnings.push({path:dest,unmatched:result.unmatched});
     await context.close();
     console.log('Generated',dest,'localized nodes',result.changed,'indexed',indexed);
   }
 }
 const sitemap=read('sitemap.xml');
 const additional=ROUTES.filter(r=>r.index).flatMap(r=>LANGS.slice(1).map(l=>'  <url><loc>'+BASE+file(r.path,l)+'</loc><lastmod>2026-11-24</lastmod></url>'));
 const nextSitemap=sitemap.replace('</urlset>',additional.join('\n')+'\n</urlset>');
 write('sitemap.xml',nextSitemap);
 const urls=[...nextSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(new Set(urls).size,urls.length);
 for(const url of urls){const p=url.slice(BASE.length);assert.ok(existsSync(join(out,p.endsWith('/')||!p?p+'index.html':p)),'Missing sitemap page '+url)}
 const precache=['./locale-routing.js',...ROUTES.flatMap(r=>LANGS.slice(1).map(l=>'./'+file(r.path,l)))];
 const sw=read('service-worker.js').replace(/\n\];/,',\n  '+precache.map(p=>"'"+p+"'").join(',')+'\n];');
 assert.ok(sw.includes("'./it.html'"));
 for(const p of precache)assert.ok(existsSync(join(out,p.slice(2))),p);
 write('service-worker.js',sw);
 report.sitemapCount=urls.length;report.newIndexed=additional.length;report.totalGenerated=report.generated.length;
 assert.equal(report.totalGenerated,42);assert.equal(report.newIndexed,30);
 console.log('International build complete:',report.totalGenerated,'editions;',report.sitemapCount,'sitemap URLs');
}catch(e){report.errors.push(String(e.stack||e));throw e}
finally{mkdirSync(dirname(reportPath),{recursive:true});writeFileSync(reportPath,JSON.stringify(report,null,2));if(browser)await browser.close();server.kill('SIGTERM')}

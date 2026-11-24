/* One locale router for the international static build. No tracking or external calls. */
(function(){
 'use strict';
 const langs=['es','en','it','de','fr','ru'];
 const routes=['','comer/','agenda/','gallery/','explore/','explore/la-nogalera/','tu-torremolinos/','stories/','listen/'];
 const dossiers=['torremolinos-mucho-mas-que-sol-y-playa','la-nogalera-donde-la-noche-tiene-historia','pasaje-begona-memoria-de-libertad','san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle','navidad-ano-nuevo-torremolinos-malaga-2026-2027'];
 const file=(route,lang)=>route+(lang==='es'?'':lang+'.html');
 function edition(path){
   for(const route of routes)for(const lang of langs)
     if(path===file(route,lang)||(lang==='es'&&path===route+'index.html'))return {route,lang};
   for(const slug of dossiers)for(const lang of langs)
     if(path==='stories/'+slug+(lang==='es'?'':'-'+lang)+'.html')return {slug,lang};
   return null;
 }
 function localize(href,lang,from,root){
   if(!langs.includes(lang)||!href||href.startsWith('#'))return null;
   let url;try{url=new URL(href,from)}catch{return null}
   if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return null;
   const match=edition(url.pathname.slice(root.pathname.length));
   if(!match)return null;
   url.pathname=root.pathname+(match.slug?'stories/'+match.slug+(lang==='es'?'':'-'+lang)+'.html':file(match.route,lang));
   url.searchParams.delete('lang');
   return url;
 }
 if(typeof module==='object'&&module.exports){module.exports={langs,routes,dossiers,file,edition,localize};return}
 const script=document.currentScript;
 if(!script?.dataset.root)return;
 const root=new URL(script.dataset.root,location.href);
 const current=edition(location.pathname.slice(root.pathname.length));
 if(!current||current.slug)return;
 const lang=document.documentElement.lang;
 if(!langs.includes(lang))return;
 const input=new URL(location.href), requested=input.searchParams.get('lang');
 // A query-language legacy link remains supported, including shared planner stops.
 if(langs.includes(requested)&&requested!==lang){
   const dest=localize(input.href,requested,input,root);
   if(dest){location.replace(dest.href);return}
 }
 // Existing app dictionaries read the lang query during startup; do not let
 // a previously stored preference change the language of an explicit SEO URL.
 const metaTitle=document.title,description=document.querySelector('meta[name="description"]')?.content;
 input.searchParams.set('lang',lang);history.replaceState(history.state,'',input.href);
 try{localStorage.setItem('torremolinos.lang',lang)}catch{}
 const rewrite=a=>{
   if(!a||a.hasAttribute('hreflang')||a.hasAttribute('download'))return;
   const dest=localize(a.getAttribute('href'),lang,location.href,root);
   if(dest&&a.href!==dest.href)a.href=dest.href;
 };
 function ready(){
   const clean=new URL(location.href);clean.searchParams.delete('lang');history.replaceState(history.state,'',clean.href);
   document.title=metaTitle;
   if(description)document.querySelector('meta[name="description"]')?.setAttribute('content',description);
   document.querySelectorAll('a[href]').forEach(rewrite);
 }
 // Capture before the app's own in-place language listener. Same-origin
 // storage and all non-language URL parameters survive the navigation.
 document.addEventListener('change',event=>{
   const select=event.target;
   if(!select?.matches('#lang,#language')||!langs.includes(select.value))return;
   event.stopImmediatePropagation();event.preventDefault();
   const target=localize(location.href,select.value,location.href,root);
   if(target){try{localStorage.setItem('torremolinos.lang',select.value)}catch{}location.assign(target.href)}
 },true);
 document.addEventListener('click',event=>rewrite(event.target.closest?.('a[href]')),true);
 document.addEventListener('DOMContentLoaded',()=>queueMicrotask(ready),{once:true});
})();

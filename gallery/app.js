(function(){
"use strict";
const source=window.TORREMOLINOS_GALLERY||{images:[],translations:{}};
const languages=source.translations;
const params=new URLSearchParams(location.search);
let currentEntry=null,opener=null;
let lang=params.get("lang")||"es",filter="all";
if(!languages[lang]){try{lang=localStorage.getItem("torremolinos.lang")||"es"}catch(e){}}
if(!languages[lang])lang="es";
const $=s=>document.querySelector(s),tr=k=>(languages[lang]||languages.es)[k]||k;
const state=new Map(),cards=new Map();
const main=$("#galleryGrid"),count=$("#results"),empty=$("#empty"),dialog=$("#viewer"),image=$("#viewerImage");
const categories={
 all:[],
 beach:["beach","beaches","promenade"],
 district:["district","details"],
 traditions:["traditions"],
 everyday:["local-life","everyday"],
 nightlife:["nightlife"],
 lgbtq:["lgbtq","lgbtq-sea","lgbtq-and-sea"],
 food:["food"],
 ai:[]
};
function label(entry,key){return entry?.[key]?.[lang]||entry?.[key]?.es||entry?.[key]?.en||"";}
function belongs(entry,key){
 if(key==="all")return true;
 if(key==="ai")return entry.provenance==="ai"||entry.provenance==="illustration";
 // A composite editorial artwork does not become a documentary photograph
 if(entry.provenance==="ai"||entry.provenance==="illustration")return false;
 return (categories[key]||[]).includes(entry.category);
}
function creditKey(entry){
 if(entry.provenance==="ai")return "generated";
 if(entry.provenance==="illustration")return "creative";
 if(entry.provenance==="user_photo")return "provided";
 return "original";
}
function update(){
 const ready=source.images.filter(e=>state.get(e.id)==="ready");
 const available=source.images.filter(e=>cards.has(e.id));
 const pending=source.images.some(e=>state.get(e.id)==="loading");
 if(filter!=="all"&&!available.some(e=>belongs(e,filter)))filter="all";
 document.querySelectorAll("[data-filter]").forEach(btn=>{
   const key=btn.dataset.filter;
   btn.hidden=key!=="all"&&!available.some(e=>belongs(e,key));
   btn.setAttribute("aria-pressed",String(key===filter));
   btn.textContent=tr(key);
 });
 let shown=0;
 source.images.forEach(e=>{
   const node=cards.get(e.id);
   if(!node)return;
   const visible=belongs(e,filter);
   node.hidden=!visible;
   if(visible)shown++;
 });
 count.textContent=ready.length===0&&pending?tr("loading"):"";
 empty.hidden=shown>0||pending;
}
function setLang(next){
 lang=languages[next]?next:"es";document.documentElement.lang=lang;$("#lang").value=lang;
 try{localStorage.setItem("torremolinos.lang",lang)}catch(e){}
 document.querySelectorAll("[data-t]").forEach(e=>e.textContent=tr(e.dataset.t));
 for(const [selector,key] of [['#lang','language'],['.filterbar','categories'],['header nav','navigation'],['#previousImage','previous'],['#nextImage','next']]){
   const node=$(selector);if(node)node.setAttribute('aria-label',tr(key));
 }
 const hero=$('.hero-media img');if(hero)hero.alt=tr('heroAlt');
 const ai=$('.ai-footer a');if(ai)ai.textContent=tr('legal');
 for(const entry of source.images){
   const node=cards.get(entry.id);if(!node)continue;
   node.querySelector(".gallery-title").textContent=label(entry,"title");
   node.querySelector(".gallery-credit").textContent=tr(creditKey(entry));
   node.querySelector("img").alt=label(entry,"alt");
   node.querySelector(".image-button").setAttribute("aria-label",label(entry,"title"));
 }
 const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);update();
}
function item(entry){
 if(entry.publicationStatus==="pending_review")return;
 const article=[...main.querySelectorAll("[data-gallery-id]")].find(n=>n.dataset.galleryId===entry.id);
 if(!article)throw Error("Missing static Gallery card: "+entry.id);
 const button=article.querySelector(".image-button"),img=button.querySelector("img");
 cards.set(entry.id,article);state.set(entry.id,"loading");
 const settle=ok=>{
  state.set(entry.id,ok?"ready":"missing");article.removeAttribute("aria-busy");button.disabled=!ok;
  if(!ok){article.dataset.imageUnavailable="true";img.alt=label(entry,"alt");}
  update();
 };
 img.addEventListener("load",()=>settle(true),{once:true});
 img.addEventListener("error",()=>settle(false),{once:true});
 button.addEventListener("click",()=>open(entry));
 if(img.complete&&img.naturalWidth>0)settle(true);
 else if(img.complete&&img.getAttribute("loading")!=="lazy")settle(false);
}
function visibleEntries(){return source.images.filter(e=>cards.has(e.id)&&state.get(e.id)!=="missing"&&belongs(e,filter))}
function open(entry){
 if(!cards.has(entry.id)||state.get(entry.id)==="missing")return;
 currentEntry=entry;
 if(!dialog.open)opener=document.activeElement;
 image.src=entry.src;image.alt=label(entry,"alt");
 $("#viewerTitle").textContent=label(entry,"title");
 $("#viewerCredit").textContent=tr(creditKey(entry));
 const entries=visibleEntries();$("#viewerPosition").textContent=(entries.indexOf(entry)+1)+" / "+entries.length;
 if(!dialog.open&&typeof dialog.showModal==="function")dialog.showModal();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)image.animate([{opacity:.45,transform:'translateX(12px)'},{opacity:1,transform:'none'}],{duration:280,easing:'ease-out'});
}
function advance(delta){const entries=visibleEntries();if(!entries.length)return;open(entries[(entries.indexOf(currentEntry)+delta+entries.length)%entries.length])}
$("#previousImage").addEventListener("click",()=>advance(-1));
$("#nextImage").addEventListener("click",()=>advance(1));
$("#closeViewer").addEventListener("click",()=>dialog.close());
dialog.addEventListener("close",()=>{if(opener&&opener.isConnected)opener.focus()});
dialog.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();advance(1)}if(e.key==="ArrowLeft"){e.preventDefault();advance(-1)}});
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
$("#lang").addEventListener("change",e=>setLang(e.target.value));
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
 if(btn.hidden)return;filter=btn.dataset.filter;update();
}));
source.images.forEach(item);setLang(lang);
})();
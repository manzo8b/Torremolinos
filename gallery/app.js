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
 const pending=source.images.some(e=>state.get(e.id)==="loading");
 if(filter!=="all"&&!ready.some(e=>belongs(e,filter)))filter="all";
 document.querySelectorAll("[data-filter]").forEach(btn=>{
   const key=btn.dataset.filter;
   btn.hidden=key!=="all"&&!ready.some(e=>belongs(e,key));
   btn.setAttribute("aria-pressed",String(key===filter));
   btn.textContent=tr(key);
 });
 let shown=0;
 source.images.forEach(e=>{
   const node=cards.get(e.id);
   if(!node)return;
   const visible=state.get(e.id)==="ready"&&belongs(e,filter);
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
 const article=document.createElement("article");article.className="gallery-card";article.dataset.type=entry.category;article.dataset.provenance=entry.provenance;
 article.hidden=true;state.set(entry.id,"loading");
 const button=document.createElement("button");button.type="button";button.className="image-button";button.setAttribute("aria-label",label(entry,"title"));
 const img=document.createElement("img");img.alt=label(entry,"alt");img.loading="eager";img.decoding="async";
 img.addEventListener("load",()=>{state.set(entry.id,"ready");update()});
 img.addEventListener("error",()=>{state.set(entry.id,"missing");update()});
 button.append(img);button.addEventListener("click",()=>open(entry));
 const info=document.createElement("div");info.className="gallery-copy";
 const title=document.createElement("strong");title.className="gallery-title";title.textContent=label(entry,"title");
 const credit=document.createElement("small");credit.className="gallery-credit";credit.textContent=tr(creditKey(entry));
 info.append(title,credit);article.append(button,info);main.append(article);cards.set(entry.id,article);
 img.src=entry.src;
}
function visibleEntries(){return source.images.filter(e=>state.get(e.id)==="ready"&&belongs(e,filter))}
function open(entry){
 if(state.get(entry.id)!=="ready")return;
 currentEntry=entry;
 if(!dialog.open)opener=document.activeElement;
 image.src=entry.src;image.alt=label(entry,"alt");
 $("#viewerTitle").textContent=label(entry,"title");
 $("#viewerCredit").textContent=entry.provenance==="ai"?"AI":"© Archivo TORREMOLINOS";
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
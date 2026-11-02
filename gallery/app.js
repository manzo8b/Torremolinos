(function(){
"use strict";
const source=window.TORREMOLINOS_GALLERY||{images:[],translations:{}};
const languages=source.translations;
const params=new URLSearchParams(location.search);
let lang=params.get("lang")||"es",filter="all";
if(!languages[lang]){try{lang=localStorage.getItem("torremolinos.lang")||"es"}catch(e){}}
if(!languages[lang])lang="es";
const $=s=>document.querySelector(s), tr=k=>(languages[lang]||languages.es)[k]||k;
const state=new Map(),cards=new Map();
const main=$("#galleryGrid"),count=$("#results"),empty=$("#empty"),dialog=$("#viewer"),image=$("#viewerImage");
function label(d,key){return d?.[key]?.[lang]||d?.[key]?.es||d?.[key]?.en||"";}
function setLang(next){
 lang=languages[next]?next:"es";
 document.documentElement.lang=lang;$("#lang").value=lang;
 try{localStorage.setItem("torremolinos.lang",lang)}catch(e){}
 document.querySelectorAll("[data-t]").forEach(e=>{e.textContent=tr(e.dataset.t)});
 for(const entry of source.images){const node=cards.get(entry.id);if(!node)continue;node.querySelector(".gallery-title").textContent=label(entry,"title");node.querySelector(".gallery-credit").textContent=tr(entry.provenance==="ai"?"generated":"original");node.querySelector("img").alt=label(entry,"alt")}
 document.querySelectorAll("[data-filter]").forEach(e=>{e.textContent=tr(e.dataset.filter);e.setAttribute("aria-pressed",String(e.dataset.filter===filter))});
 const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);
 update();
}
function item(entry){
 const article=document.createElement("article");article.className="gallery-card";article.dataset.type=entry.category;
 const btn=document.createElement("button");btn.type="button";btn.className="image-button";btn.setAttribute("aria-label",label(entry,"title"));
 const img=document.createElement("img");img.src=entry.src;img.alt=label(entry,"alt");img.loading="lazy";img.decoding="async";
 img.addEventListener("load",()=>{state.set(entry.id,"ready");update()});
 img.addEventListener("error",()=>{state.set(entry.id,"missing");update()});
 btn.append(img);btn.addEventListener("click",()=>open(entry));
 const cap=document.createElement("div");cap.className="gallery-copy";
 const title=document.createElement("strong");title.className="gallery-title";title.textContent=label(entry,"title");
 const credit=document.createElement("small");credit.className="gallery-credit";credit.textContent=tr(entry.provenance==="ai"?"generated":"original");
 cap.append(title,credit);article.append(btn,cap);main.append(article);cards.set(entry.id,article);
}
function update(){
 let countShown=0;for(const entry of source.images){const node=cards.get(entry.id);if(!node)continue;const visible=state.get(entry.id)==="ready"&&(filter==="all"||entry.category===filter);
 node.hidden=!visible;if(visible)countShown++;}
 count.textContent=countShown+" "+tr("count");empty.hidden=countShown>0;
}
function open(entry){
 if(state.get(entry.id)!=="ready")return;
 image.src=entry.src;image.alt=label(entry,"alt");$("#viewerTitle").textContent=label(entry,"title");
 $("#viewerCredit").textContent=tr(entry.provenance==="ai"?"generated":"original");
 if(typeof dialog.showModal==="function")dialog.showModal();
}
$("#closeViewer").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
$("#lang").addEventListener("change",e=>setLang(e.target.value));
document.querySelectorAll("[data-filter]").forEach(e=>e.addEventListener("click",()=>{
 filter=e.dataset.filter;
 setLang(lang);
}));
source.images.forEach(item);setLang(lang);
})();
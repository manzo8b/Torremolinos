(function(){
"use strict";
const dataset=window.TORREMOLINOS_NOGALERA||{venues:[],translations:{es:{}}};
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
const languages=dataset.translations;
let lang=params.get("lang"),filter="all",term="";
if(!languages[lang]){try{lang=localStorage.getItem("torremolinos.lang")||"es"}catch(e){lang="es";}}
const t=key=>(languages[lang]||languages.es)[key]||key;
const loc=venue=>(languages[lang]||languages.es)[venue.area]||venue.area;
function translate(){
 document.documentElement.lang=lang;$("#language").value=lang;
 document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=t(el.dataset.t)});
 document.querySelectorAll("[data-ph]").forEach(el=>{el.placeholder=t(el.dataset.ph);el.setAttribute("aria-label",t(el.dataset.ph))});
 try{localStorage.setItem("torremolinos.lang",lang)}catch(e){}
 const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);
 render();
}
function render(){
 const results=dataset.venues.filter(v=>{
  const matchesCategory=filter==="all"||v.category===filter;
  const hay=(v.name+" "+v.address+" "+(v.description[lang]||v.description.es)+" "+t(v.category)).toLocaleLowerCase(lang);
  return matchesCategory&&hay.includes(term);
 });
 document.querySelectorAll("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter===filter)));
 $("#results").textContent=results.length+" "+t("results");$("#empty").hidden=results.length>0;
 const cards=$("#places");cards.replaceChildren();
 for(const v of results){
  const card=document.createElement("article");card.className="place";card.dataset.category=v.category;
  const stripe=document.createElement("div");stripe.className="place-top";
  const body=document.createElement("div");body.className="place-body";
  const tag=document.createElement("span");tag.className="place-tag";tag.textContent=t(v.category)+" · "+loc(v);
  const name=document.createElement("h3");name.textContent=v.name;
  const summary=document.createElement("p");summary.textContent=v.description[lang]||v.description.es;
  const address=document.createElement("p");address.className="address";address.textContent=v.address;
  const links=document.createElement("div");links.className="place-links";
  const map=document.createElement("a");map.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(v.name+" "+v.address);map.target="_blank";map.rel="noopener noreferrer";map.textContent=t("onmap")+" ↗";links.append(map);
  if(v.official){const a=document.createElement("a");a.href=v.official;a.target="_blank";a.rel="noopener noreferrer";a.textContent=t("official")+" ↗";a.className="external";links.append(a)}
  body.append(tag,name,summary,address,links);card.append(stripe,body);cards.append(card);
 }
}
$("#language").addEventListener("change",e=>{lang=e.target.value;translate()});
$("#search").addEventListener("input",e=>{term=e.target.value.trim().toLocaleLowerCase(lang);render()});
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{filter=btn.dataset.filter;render()}));
const ul=$("#sources");
for(const src of dataset.officialSources){const li=document.createElement("li"),a=document.createElement("a");a.href=src.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=src.title;li.append(a);ul.append(li)}
translate();
})();
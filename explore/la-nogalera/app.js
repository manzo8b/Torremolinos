(function(){
"use strict";
const dataset=window.TORREMOLINOS_NOGALERA||{venues:[],translations:{es:{}}};
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
const languages=dataset.translations;
const published=dataset.venues.filter(v=>v.publicationStatus==="listed"&&typeof v.evidence==="string"&&v.evidence.startsWith("https://")&&["operator","directory","map_search"].includes(v.evidenceKind));
let lang=params.get("lang"),filter="all",term="";
if(!languages[lang]){try{lang=localStorage.getItem("torremolinos.lang")||"es"}catch(e){lang="es";}}
if(!languages[lang])lang="es";
const t=key=>(languages[lang]||languages.es)[key]||key;
const loc=venue=>(languages[lang]||languages.es)[venue.area]||venue.area;
function translate(){
 document.documentElement.lang=lang;$("#language").value=lang;
 $(".nav").setAttribute("aria-label",t("navigationLabel"));
 $("#language").setAttribute("aria-label",t("languageLabel"));
 $(".filters").setAttribute("aria-label",t("filterGroup"));
 document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=t(el.dataset.t)});
 document.querySelectorAll("[data-ph]").forEach(el=>{el.placeholder=t(el.dataset.ph);el.setAttribute("aria-label",t(el.dataset.ph))});
 try{localStorage.setItem("torremolinos.lang",lang)}catch(e){}
 const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);
 render();
}
function render(){
 const results=published.filter(v=>{
  const matchesCategory=filter==="all"||v.category===filter||(filter==="outside"&&v.area==="neighbor");
  const hay=(v.name+" "+v.address+" "+(v.description[lang]||v.description.es)+" "+t(v.category)).toLocaleLowerCase(lang);
  return matchesCategory&&hay.includes(term);
 });
 document.querySelectorAll("[data-filter]").forEach(b=>{
 const key=b.dataset.filter;
 b.hidden=key!=="all"&&!published.some(v=>key==="outside"?v.area==="neighbor":v.category===key);
 b.setAttribute("aria-pressed",String(key===filter));
 });
 $("#results").textContent=results.length+" "+t("results");$("#empty").hidden=results.length>0;
 const cards=$("#places");cards.replaceChildren();
 for(const v of results){
  const card=document.createElement("article");card.className="place";card.dataset.category=v.category;card.dataset.venueId=v.id;card.dataset.evidenceKind=v.evidenceKind;
  const stripe=document.createElement("div");stripe.className="place-top";
  const body=document.createElement("div");body.className="place-body";
  const tag=document.createElement("span");tag.className="place-tag";tag.textContent=t(v.category)+" · "+loc(v);
  const name=document.createElement("h3");name.textContent=v.name;
  const summary=document.createElement("p");summary.textContent=v.description[lang]||v.description.es;
  const address=document.createElement("p");address.className="address";address.textContent=v.address;
  const provenance=document.createElement("p");provenance.className="address venue-provenance";
  const date=document.createElement("time");date.dateTime=v.reviewed;
  date.textContent=new Intl.DateTimeFormat(lang,{dateStyle:"medium",timeZone:"UTC"}).format(new Date(v.reviewed+"T12:00:00Z"));
  const kindKey={operator:"sourceOperator",directory:"sourceDirectory",map_search:"sourceMapSearch"}[v.evidenceKind];
  provenance.append(t("recordDate")+": ",date," · "+t(kindKey),document.createElement("br"),t("recordLimit"));
  const links=document.createElement("div");links.className="place-links";
  const map=document.createElement("a");map.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(v.name+" "+v.address);map.target="_blank";map.rel="noopener noreferrer";map.textContent=t("onmap")+" ↗";links.append(map);
  if(v.evidenceKind==="directory"&&v.evidence!==v.official){const a=document.createElement("a");a.href=v.evidence;a.target="_blank";a.rel="noopener noreferrer";a.textContent=t("sourceLink")+" ↗";a.className="external";links.append(a)}
  if(v.official){const a=document.createElement("a");a.href=v.official;a.target="_blank";a.rel="noopener noreferrer";a.textContent=t("official")+" ↗";a.className="external";links.append(a)}
  body.append(tag,name,summary,address,provenance,links);card.append(stripe,body);cards.append(card);
 }
}
$("#language").addEventListener("change",e=>{lang=e.target.value;translate()});
$("#search").addEventListener("input",e=>{term=e.target.value.trim().toLocaleLowerCase(lang);render()});
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{filter=btn.dataset.filter;render()}));
const ul=$("#sources");
for(const src of dataset.officialSources){const li=document.createElement("li"),a=document.createElement("a");a.href=src.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=src.title;li.append(a);ul.append(li)}
translate();
})();
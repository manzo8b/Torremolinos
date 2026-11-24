/* Home agenda: a read-only view of the editorial dataset. No external requests. */
(function(){
'use strict';
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
function localDay(now){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=k=>parts.find(x=>x.type===k).value;
 return get('year')+'-'+get('month')+'-'+get('day');
}
function upcoming(data,now=new Date()){
 const today=localDay(now);
 return (Array.isArray(data?.events)?data.events:[]).filter(e=>e&&e.status==='confirmed'&&validDate(e.start)&&validDate(e.end||e.start)&&e.start>=today&&(e.end||e.start)>=e.start&&typeof e.title==='string'&&e.title.trim()&&typeof e.venue==='string'&&e.venue.trim())
 .sort((a,b)=>a.start.localeCompare(b.start)||(a.time||'').localeCompare(b.time||'')||String(a.id).localeCompare(String(b.id))).slice(0,3);
}
if(typeof module==='object'&&module.exports){module.exports={upcoming,localDay,validDate};return}
const root=document.getElementById('agenda-home'),host=document.getElementById('homeAgendaEvents'),verified=document.getElementById('homeAgendaVerified');
if(!root||!host||!verified)return;
const dict={
 es:{label:'AGENDA',title:'Próximos eventos',lead:'Las próximas fechas de nuestra selección editorial.',cta:'Ver eventos y agenda ↗',loading:'Cargando agenda…',empty:'No hay próximos eventos en la selección. Consulta la agenda completa.',error:'No se ha podido cargar la selección. Consulta la agenda completa.',last:'Última revisión editorial',unknown:'Fecha de revisión no disponible',check:'Confirma los detalles con los organizadores.',venue:'Lugar'},
 it:{label:'AGENDA',title:'I prossimi eventi',lead:'Le prossime date della nostra selezione editoriale.',cta:'Scopri eventi e agenda ↗',loading:'Caricamento agenda…',empty:'Non ci sono prossimi eventi nella selezione. Consulta l’agenda completa.',error:'Impossibile caricare la selezione. Consulta l’agenda completa.',last:'Ultima verifica editoriale',unknown:'Data di verifica non disponibile',check:'Verifica i dettagli con gli organizzatori.',venue:'Luogo'},
 en:{label:'EVENTS',title:'What’s coming up',lead:'The next dates in our editorial selection.',cta:'Explore events and agenda ↗',loading:'Loading events…',empty:'No upcoming events in this selection. See the full agenda.',error:'The selection could not be loaded. See the full agenda.',last:'Last editorial review',unknown:'Review date unavailable',check:'Confirm details with the organisers.',venue:'Venue'},
 de:{label:'TERMINE',title:'Kommende Veranstaltungen',lead:'Die nächsten Termine unserer redaktionellen Auswahl.',cta:'Events und Kalender entdecken ↗',loading:'Termine werden geladen…',empty:'Keine kommenden Termine in der Auswahl. Siehe vollständigen Kalender.',error:'Auswahl konnte nicht geladen werden. Siehe vollständigen Kalender.',last:'Letzte redaktionelle Prüfung',unknown:'Prüfdatum nicht verfügbar',check:'Details beim Veranstalter prüfen.',venue:'Ort'},
 fr:{label:'AGENDA',title:'Les prochains événements',lead:'Les prochaines dates de notre sélection éditoriale.',cta:'Découvrir les événements et l’agenda ↗',loading:'Chargement de l’agenda…',empty:'Aucun événement à venir dans la sélection. Consultez l’agenda complet.',error:'Impossible de charger la sélection. Consultez l’agenda complet.',last:'Dernière vérification éditoriale',unknown:'Date de vérification indisponible',check:'Confirmez les détails auprès des organisateurs.',venue:'Lieu'},
 ru:{label:'АФИША',title:'Ближайшие события',lead:'Ближайшие даты нашей редакционной подборки.',cta:'Все события и календарь ↗',loading:'Загрузка афиши…',empty:'В подборке нет предстоящих событий. Смотрите полный календарь.',error:'Не удалось загрузить подборку. Смотрите полный календарь.',last:'Последняя редакционная проверка',unknown:'Дата проверки недоступна',check:'Уточняйте детали у организаторов.',venue:'Место'}
};
let data=null,state='loading',previous='';
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
function render(){
 const lang=(document.documentElement.lang||'es').slice(0,2),t=dict[lang]||dict.es;
 const day=localDay(new Date()),signature=lang+'|'+day+'|'+state+'|'+(data?.editorialUpdated||'');
 if(previous===signature)return;previous=signature;
 root.querySelectorAll('[data-home-agenda]').forEach(n=>{const key=n.dataset.homeAgenda;if(t[key])n.textContent=t[key]});
 const cta=root.querySelector('.agenda-home-btn');if(cta)cta.href='agenda/?lang='+encodeURIComponent(lang);
 host.setAttribute('aria-busy',String(state==='loading'));host.replaceChildren();
 if(state!=='ready'){host.append(el('p','review-agenda-status',t[state]));verified.textContent='';return}
 const df=new Intl.DateTimeFormat(lang,{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
 const full=new Intl.DateTimeFormat(lang,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 const asDate=s=>new Date(s+'T12:00:00Z');
 verified.textContent=(validDate(data.editorialUpdated)?t.last+': '+full.format(asDate(data.editorialUpdated)):t.unknown)+'. '+t.check;
 const events=upcoming(data);
 if(!events.length){host.append(el('p','review-agenda-status',t.empty));return}
 for(const raw of events){
  const e=window.TORRE_AGENDA_LOCALE?.entry(raw,lang)||raw;
  const card=el('article','review-agenda-card');card.dataset.eventId=e.id;card.dataset.start=e.start;
  const date=el('div','review-agenda-date');
  const start=el('time','',df.format(asDate(e.start)));start.dateTime=e.start;date.append(start);
  if(e.end&&e.end!==e.start){const end=el('time','',df.format(asDate(e.end)));end.dateTime=e.end;date.append(document.createTextNode(' – '),end)}
  const title=el('h3','',e.title);
  const venue=el('p','',t.venue+': '+e.venue);
  card.append(date,title,venue);host.append(card);
 }
}
async function load(){
 try{const response=await fetch('agenda/events.json',{cache:'no-cache'});if(!response.ok)throw Error('agenda');const value=await response.json();if(!Array.isArray(value.events))throw Error('schema');data=value;state='ready'}catch{state='error'}
 previous='';render();
}
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();load()}});
window.addEventListener('pageshow',e=>{if(e.persisted){render();load()}});
setInterval(()=>{if(!document.hidden)render()},60000);
render();load();
})();

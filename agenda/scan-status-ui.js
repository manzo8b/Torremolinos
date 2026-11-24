/* TORREMOLINOS · Fase 2 C-09/C-13
   Human editorial review != automated monitoring. A bundled snapshot does not
   claim to be the last run after publication; use GitHub Actions for live status.
   Fetches only a same-origin JSON file, never any third-party endpoint. */
(()=>{
 'use strict';
 const script=document.currentScript;
 const snapshotURL=new URL('scan-status.json',script?.src||document.baseURI);
 const T={
  es:{snapshot:'Última ejecución documentada',human:'Revisión editorial de eventos',
   outdated:'Revisión editorial pendiente (más de 14 días)',
   scanOld:'El control automático documentado tiene más de 14 días',
   partial:'INFINITY y ACOGAT no pudieron verificarse en esa ejecución',
   source:'Ver informe de GitHub',unavailable:'No se puede consultar el estado del escáner',
   separator:' · '},
  en:{snapshot:'Last documented automated check',human:'Editorial review of event listings',
   outdated:'Editorial review overdue (over 14 days)',
   scanOld:'Documented automated check is over 14 days old',
   partial:'INFINITY and ACOGAT could not be verified in that run',
   source:'View GitHub report',unavailable:'Scanner status is temporarily unavailable',
   separator:' · '},
  it:{snapshot:'Ultimo controllo automatico documentato',human:'Revisione editoriale degli eventi',
   outdated:'Revisione editoriale da aggiornare (oltre 14 giorni)',
   scanOld:'Controllo automatico documentato oltre 14 giorni fa',
   partial:'INFINITY e ACOGAT non verificabili in quel controllo',
   source:'Apri il rapporto GitHub',unavailable:'Stato dello scanner non disponibile',
   separator:' · '},
  de:{snapshot:'Letzte dokumentierte automatische Prüfung',human:'Redaktionelle Prüfung der Termine',
   outdated:'Redaktionelle Prüfung überfällig (mehr als 14 Tage)',
   scanOld:'Dokumentierte automatische Prüfung älter als 14 Tage',
   partial:'INFINITY und ACOGAT konnten bei diesem Lauf nicht geprüft werden',
   source:'GitHub-Bericht ansehen',unavailable:'Scannerstatus derzeit nicht verfügbar',
   separator:' · '},
  fr:{snapshot:'Dernier contrôle automatique documenté',human:'Révision éditoriale des événements',
   outdated:'Révision éditoriale à actualiser (plus de 14 jours)',
   scanOld:'Contrôle automatique documenté datant de plus de 14 jours',
   partial:'INFINITY et ACOGAT n’ont pas pu être vérifiés lors de ce contrôle',
   source:'Voir le rapport GitHub',unavailable:'État du scanner indisponible',
   separator:' · '},
  ru:{snapshot:'Последняя документированная автоматическая проверка',human:'Редакционная проверка событий',
   outdated:'Редакционная проверка устарела (более 14 дней)',
   scanOld:'Документированной автоматической проверке более 14 дней',
   partial:'В этом запуске источники INFINITY и ACOGAT не удалось проверить',
   source:'Отчёт на GitHub',unavailable:'Данные о проверке недоступны',
   separator:' · '}
 };
 const locales={es:'es-ES',en:'en-GB',it:'it-IT',de:'de-DE',fr:'fr-FR',ru:'ru-RU'};
 const containers=[document.getElementById('agendaHomeScanStatus'),document.getElementById('agendaPageScanStatus')].filter(Boolean);
 if(!containers.length)return;
 let status=null;
 const dateToLocal=(str,lang)=>{
  const date=new Date(str?.length===10?str+'T12:00:00Z':str);
  if(Number.isNaN(date.getTime()))return String(str||'—');
  return new Intl.DateTimeFormat(locales[lang]||'es-ES',{timeZone:'Europe/Madrid',day:'numeric',month:'long',year:'numeric'}).format(date);
 };
 const old=(str)=>{
  const ms=Date.parse(str?.length===10?str+'T00:00:00Z':str);
  return Number.isFinite(ms)&&(Date.now()-ms)>14*86400*1000;
 };
 function draw(){
  const lang=(document.documentElement.lang||'es').slice(0,2);
  const t=T[lang]||T.es;
  for(const el of containers){
   el.replaceChildren();
   if(!status){
    el.textContent=t.unavailable;
    continue;
   }
   const auto=document.createElement('span');
   auto.textContent=t.snapshot+': '+dateToLocal(status.scanner.checkedAtUTC,lang);
   el.append(auto);
   const human=document.createElement('span');
   human.textContent=t.separator+t.human+': '+dateToLocal(status.editorial.verifiedThrough,lang);
   el.append(human);
   if(old(status.editorial.verifiedThrough)){
    const warn=document.createElement('strong');
    warn.className='agenda-stale-note';
    warn.textContent=t.separator+t.outdated;
    el.append(warn);
   }
   if(old(status.scanner.checkedAtUTC)){
    const warn=document.createElement('strong');
    warn.className='agenda-stale-note';
    warn.textContent=t.separator+t.scanOld;
    el.append(warn);
   }
   if(['infinity','acogat'].some(k=>status.scanner.sources[k].access!=='reachable')){
    const warning=document.createElement('span');
    warning.textContent=t.separator+t.partial;
    el.append(warning);
   }
   const anchor=document.createElement('a');
   anchor.href=status.scanner.runUrl;
   anchor.target='_blank';
   anchor.rel='noopener noreferrer';
   anchor.textContent=t.source+' ↗';
   anchor.className='agenda-scan-source';
   el.append(' · ',anchor);
  }
 }
 const init=async()=>{
  try{
   const resp=await fetch(snapshotURL,{cache:'no-cache'});
   if(!resp.ok)throw Error('HTTP '+resp.status);
   const data=await resp.json();
   if(data.schemaVersion!==1||
      !/^\d{4}-\d{2}-\d{2}/.test(data.scanner?.checkedAtUTC||'')||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.editorial?.verifiedThrough||'')||
      !/^https:\/\/github\.com\/manzo8b\/Torremolinos\/actions\/runs\/\d+$/.test(data.scanner?.runUrl||'')||
      !data.scanner.sources?.infinity||!data.scanner.sources?.acogat)throw Error('Invalid scanner status');
   status=data;
  }catch(err){status=null}
  draw();
  new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.getElementById('lang')?.addEventListener('change',()=>queueMicrotask(draw));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

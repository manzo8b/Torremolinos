/* Extracted from the original Home route planner; same storage and catalog IDs. */
(function(){'use strict';
var $=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),places=window.TORREMOLINOS_PLACES;
var lang='es',mood='sea';
try{lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('torremolinos.lang')||'es';mood=localStorage.getItem('torremolinos.planMood')||'sea'}catch(e){}
var routeSets={sea:['sanmiguel','bajondillo','playamar'],pride:['pasaje','nogalera','bajondillo'],taste:['sanmiguel','carihuela','bajondillo'],slow:['bateria','carihuela','pimentel']};
var planCopy={
 es:{promiseTitle:'LA CIUDAD, A TU MANERA',planCta:'Crea tu recorrido',edition:'La ciudad, a tu manera',title:'Tu Torremolinos',lead:'Déjate llevar por la curiosidad: un paseo junto al mar, una mesa para compartir, una calle que invita a perderse. Tú eliges cada parada.',promise:'Lugares reales de la guía. Sin registro ni disponibilidad inventada.',choose:'¿Por dónde empezamos?',chooseLead:'Cuatro formas de vivir la ciudad. Tu recorrido cambia al instante.',sea:'Mar y paseo',pride:'Cultura LGBTQ+',taste:'Sabores locales',slow:'Sin prisa',tip:'¿Quieres otra parada? Añádela desde los lugares en Explora.',browse:'Explorar todos los lugares ↗',journey:'Tu recorrido',routeTitle:'El día empieza aquí',empty:'Aún no hay paradas. Elige un ambiente o añade lugares desde Explora.',openMap:'Abrir en Maps ↗',share:'Compartir plan',reset:'Empezar de nuevo',disclaimer:'Recorrido orientativo. Confirma horarios, accesibilidad y transporte antes de salir.',stops:'paradas',oneStop:'parada',add:'Añadir al plan',added:'Añadido al plan',remove:'Quitar',up:'Subir',down:'Bajar',saved:'Plan actualizado.',copied:'Enlace copiado.',copyError:'No se pudo copiar. Usa la barra de direcciones.',limit:'Máximo 8 paradas.'},
 en:{promiseTitle:'THE CITY, YOUR WAY',planCta:'Build your day',edition:'The city, your way',title:'Your Torremolinos',lead:'Follow what draws you in: a sea view, a shared meal, a street worth wandering. Make every stop your own.',promise:'Real places from the guide. No signup or invented availability.',choose:'Where shall we start?',chooseLead:'Four ways to experience the city. Your route changes instantly.',sea:'Sea & promenade',pride:'LGBTQ+ heritage',taste:'Local flavours',slow:'Slow discovery',tip:'Want a different stop? Add it from the Explore directory.',browse:'Explore all places ↗',journey:'Your route',routeTitle:'Your day starts here',empty:'No stops yet. Choose a mood or add places from Explore.',openMap:'Open in Maps ↗',share:'Share plan',reset:'Start again',disclaimer:'Suggested route only. Confirm opening times, access and transport before setting out.',stops:'stops',oneStop:'stop',add:'Add to plan',added:'Added to plan',remove:'Remove',up:'Move up',down:'Move down',saved:'Plan updated.',copied:'Link copied.',copyError:'Could not copy the link. Use the address bar.',limit:'Maximum 8 stops.'},
 it:{promiseTitle:'LA CITTÀ, COME LA VIVI TU',planCta:'Crea il tuo percorso',edition:'La città, a modo tuo',title:'La tua Torremolinos',lead:'Segui ciò che ti incuriosisce: un tuffo, un pranzo vista mare, una strada da scoprire. Il percorso lo scegli tu, tappa dopo tappa.',promise:'Luoghi reali della guida. Senza registrazione né disponibilità inventate.',choose:'Da dove cominciamo?',chooseLead:'Quattro modi di vivere la città. Il percorso cambia immediatamente.',sea:'Mare e passeggiate',pride:'Cultura LGBTQ+',taste:'Sapori locali',slow:'Senza fretta',tip:'Vuoi una tappa diversa? Aggiungila dalla sezione Esplora.',browse:'Esplora tutti i luoghi ↗',journey:'Il tuo percorso',routeTitle:'La giornata prende forma',empty:'Nessuna tappa. Scegli un’atmosfera o aggiungi luoghi da Esplora.',openMap:'Apri in Maps ↗',share:'Condividi percorso',reset:'Ricomincia',disclaimer:'Itinerario indicativo. Verifica orari, accessibilità e trasporti prima di uscire.',stops:'tappe',oneStop:'tappa',add:'Aggiungi al piano',added:'Aggiunto al piano',remove:'Rimuovi',up:'Sposta su',down:'Sposta giù',saved:'Percorso aggiornato.',copied:'Link copiato.',copyError:'Impossibile copiare. Usa la barra degli indirizzi.',limit:'Massimo 8 tappe.'},
 de:{promiseTitle:'DIE STADT, DEIN WEG',planCta:'Plane deinen Tag',edition:'Deine Stadt, dein Weg',title:'Dein Torremolinos',lead:'Lass dich von deiner Neugier führen: ein Weg am Meer, ein langer Abend, eine neue Lieblingsstraße. Jede Station bestimmst du.',promise:'Echte Orte aus dem Guide. Ohne Anmeldung oder erfundene Verfügbarkeit.',choose:'Womit fangen wir an?',chooseLead:'Vier Arten, die Stadt zu erleben. Die Route passt sich sofort an.',sea:'Meer & Promenade',pride:'LGBTQ+-Kultur',taste:'Lokale Küche',slow:'Ganz entspannt',tip:'Noch ein Ort? Füge ihn direkt aus Entdecken hinzu.',browse:'Alle Orte entdecken ↗',journey:'Deine Route',routeTitle:'Dein Tag beginnt hier',empty:'Noch keine Stationen. Wähle ein Thema oder füge Orte hinzu.',openMap:'In Maps öffnen ↗',share:'Route teilen',reset:'Neu starten',disclaimer:'Unverbindlicher Vorschlag. Öffnungszeiten, Zugang und Verkehr prüfen.',stops:'Stationen',oneStop:'Station',add:'Zur Route hinzufügen',added:'Zur Route hinzugefügt',remove:'Entfernen',up:'Nach oben',down:'Nach unten',saved:'Route aktualisiert.',copied:'Link kopiert.',copyError:'Kopieren nicht möglich. Nutze die Adressleiste.',limit:'Maximal 8 Stationen.'},
 fr:{promiseTitle:'LA VILLE, À VOTRE FAÇON',planCta:'Créez votre parcours',edition:'La ville à votre façon',title:'Votre Torremolinos',lead:'Laissez la curiosité vous guider : une promenade face à la mer, une table à partager, une rue à découvrir. À vous de choisir les étapes.',promise:'Des lieux réels du guide, sans inscription ni disponibilité inventée.',choose:'Par où commencer ?',chooseLead:'Quatre façons de vivre la ville. Le parcours change immédiatement.',sea:'Mer & promenade',pride:'Culture LGBTQ+',taste:'Saveurs locales',slow:'À votre rythme',tip:'Un autre arrêt ? Ajoutez-le depuis Explorer.',browse:'Explorer tous les lieux ↗',journey:'Votre parcours',routeTitle:'La journée commence ici',empty:'Aucune étape. Choisissez une ambiance ou ajoutez des lieux.',openMap:'Ouvrir dans Maps ↗',share:'Partager',reset:'Recommencer',disclaimer:'Parcours indicatif. Vérifiez horaires, accès et transports.',stops:'étapes',oneStop:'étape',add:'Ajouter au parcours',added:'Ajouté au parcours',remove:'Retirer',up:'Monter',down:'Descendre',saved:'Parcours mis à jour.',copied:'Lien copié.',copyError:'Impossible de copier. Utilisez la barre d’adresse.',limit:'8 étapes maximum.'},
 ru:{promiseTitle:'ГОРОД ПО-ТВОЕМУ',planCta:'Создать маршрут',edition:'Город по-вашему',title:'Ваш Торремолинос',lead:'Следуй за любопытством: прогулка у моря, ужин с близкими, новая любимая улица. Каждая остановка — твой выбор.',promise:'Реальные места из путеводителя. Без регистрации и выдуманных данных.',choose:'С чего начнём?',chooseLead:'Четыре способа узнать город. Маршрут меняется сразу.',sea:'Море и прогулки',pride:'ЛГБТК+ культура',taste:'Местная кухня',slow:'Без спешки',tip:'Нужно другое место? Добавьте его из раздела «Исследовать».',browse:'Смотреть все места ↗',journey:'Ваш маршрут',routeTitle:'Ваш день начинается здесь',empty:'Остановок пока нет. Выберите тему или добавьте места.',openMap:'Открыть в Maps ↗',share:'Поделиться',reset:'Начать заново',disclaimer:'Примерный маршрут. Уточняйте часы работы, доступность и транспорт.',stops:'остановок',oneStop:'остановка',add:'Добавить в маршрут',added:'Добавлено',remove:'Удалить',up:'Выше',down:'Ниже',saved:'Маршрут обновлён.',copied:'Ссылка скопирована.',copyError:'Не удалось скопировать ссылку.',limit:'Не более 8 остановок.'}
};

if(!planCopy[lang])lang='es';if(!routeSets[mood])mood='sea';
planCopy.it.title='La tua Torremolinos';
var selectedStops=null;
try{
  var urlStops=new URLSearchParams(location.search).get('plan');
  var storedStops=urlStops===null?JSON.parse(localStorage.getItem('torremolinos.plan')||'null'):urlStops.split(',');
  if(Array.isArray(storedStops)){
    var safeStops=storedStops.filter(function(id,i){return typeof id==='string'&&places.some(function(p){return p.id===id})&&storedStops.indexOf(id)===i}).slice(0,8);
    if(safeStops.length||storedStops.length===0||urlStops!==null)selectedStops=safeStops;
  }
}catch(e){}
function planText(key){var value=(planCopy[lang]||planCopy.en)[key]||planCopy.en[key]||key;return key==='title'||key==='routeTitle'?value.replace(/[.．]+\s*$/u,''):value;}
function planStatus(key){var el=$('#planStatus');if(el)el.textContent=key?planText(key):'';}
function planItems(){return (selectedStops===null?routeSets[mood]:selectedStops).map(function(id){return places.find(function(p){return p.id===id})}).filter(Boolean);}
function persistPlan(){
 try{localStorage.setItem('torremolinos.planMood',mood)}catch(e){}
 try{if(selectedStops===null)localStorage.removeItem('torremolinos.plan');else localStorage.setItem('torremolinos.plan',JSON.stringify(selectedStops));}catch(e){}
 try{var url=new URL(location.href);if(selectedStops===null)url.searchParams.delete('plan');else url.searchParams.set('plan',selectedStops.join(','));history.replaceState(null,'',url);}catch(e){}
}
function editPlan(ids){selectedStops=ids.slice(0,8);persistPlan();route();planStatus('saved');}
function addToPlan(id){
 var ids=planItems().map(function(p){return p.id;});
 if(ids.includes(id)){planStatus('added');return;}
 if(ids.length>=8){planStatus('limit');return;}
 ids.push(id);editPlan(ids);$('#plan').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function route(){
 all('[data-mood]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.mood===mood));});
 all('[data-plan-t]').forEach(function(el){el.textContent=planText(el.dataset.planT);});
 var arr=planItems(),ol=$('#route');ol.replaceChildren();
 var count=$('#planCount');if(count)count.textContent=arr.length+' '+planText(arr.length===1?'oneStop':'stops');
 var empty=$('#planEmpty');if(empty)empty.hidden=arr.length!==0;
 arr.forEach(function(p,i){
   var li=document.createElement('li');li.className='route-stop';
   var nr=document.createElement('span');nr.className='route-number';nr.textContent=String(i+1).padStart(2,'0');nr.setAttribute('aria-hidden','true');
   var info=document.createElement('div');info.className='route-stop-info';
   var name=document.createElement('strong');name.textContent=p.name;
   var zone=document.createElement('small');zone.textContent=p.zone;
   info.append(name,zone);
   var actions=document.createElement('div');actions.className='route-stop-controls';
   function control(label,symbol,disabled,fn){
     var b=document.createElement('button');b.type='button';b.className='route-control';b.textContent=symbol;b.setAttribute('aria-label',label+' '+p.name);b.disabled=disabled;b.addEventListener('click',fn);return b;
   }
   actions.append(
     control(planText('up'),'↑',i===0,function(){var ids=arr.map(function(x){return x.id});var t=ids[i-1];ids[i-1]=ids[i];ids[i]=t;editPlan(ids);}),
     control(planText('down'),'↓',i===arr.length-1,function(){var ids=arr.map(function(x){return x.id});var t=ids[i+1];ids[i+1]=ids[i];ids[i]=t;editPlan(ids);}),
     control(planText('remove'),'×',false,function(){editPlan(arr.filter(function(x){return x.id!==p.id}).map(function(x){return x.id}));})
   );
   li.append(nr,info,actions);ol.append(li);
 });
 var maps=$('#directions');
 $('#sharePlan').disabled=!arr.length;
 if(arr.length){
  var stops=arr.map(function(p){return p.name+' Torremolinos España';});
  maps.href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(stops[stops.length-1])+(stops.length>1?'&waypoints='+encodeURIComponent(stops.slice(0,-1).join('|')):'')+'&travelmode=walking';
  maps.removeAttribute('aria-disabled');maps.tabIndex=0;
 }else{
  maps.removeAttribute('href');maps.setAttribute('aria-disabled','true');maps.tabIndex=-1;
 }
}


all('[data-mood]').forEach(function(b){b.addEventListener('click',function(){mood=b.dataset.mood;selectedStops=null;persistPlan();planStatus('');route()})});
$('#resetPlan').addEventListener('click',function(){selectedStops=null;persistPlan();planStatus('');route()});
$('#sharePlan').addEventListener('click',function(){var url=new URL(location.href);url.searchParams.set('lang',lang);url.searchParams.set('plan',planItems().map(function(p){return p.id}).join(','));var link=url.toString();if(navigator.share){navigator.share({title:'Tu Torremolinos',url:link}).catch(function(){});}else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(function(){planStatus('copied');}).catch(function(){planStatus('copyError');});}else{planStatus('copyError');}});


function localize(){document.documentElement.lang=lang;$('#lang').value=lang;document.title=planText('title')+' · TORREMOLINOS';$('#plannerHome').textContent=({"es":"Inicio","it":"Home","en":"Home","de":"Startseite","fr":"Accueil","ru":"Главная"})[lang];$('#plannerHome').href='../?lang='+lang;$('#plannerHomeLogo').href='../?lang='+lang;$('#plannerExplore').href='../explore/?lang='+lang;$('.plan-explore-link').href='../explore/?lang='+lang;route()}
$('#lang').addEventListener('change',function(e){lang=e.target.value;try{localStorage.setItem('torremolinos.lang',lang)}catch(e){}var url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);localize()});
localize();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('../service-worker.js').catch(function(){});
})();
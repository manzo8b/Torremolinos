/* Torremolinos — approved clean design: i18n microcopy, photo credits and real audio control.
   Language changes remain managed by the original app; this layer follows them.
   No tracking, timers, external libraries or simulated availability. */
(() => {
 'use strict';
 const T = {
 it:{
  home:'Home',menu:'Menu',menuNav:'Navigazione completa',food:'Mangiare',agenda:'Agenda',gallery:'Gallery',stories:'Stories',
  foodSub:'Ristoranti, tapas e sapori locali',agendaSub:'Eventi, concerti e appuntamenti',
  gallerySub:'La città attraverso le fotografie',storiesSub:'Curiosità, luoghi e ispirazioni',
  tagline:'Mare, sapori, eventi e storie sulla Costa del Sol',
  sound:'Sound',soundSub:'La colonna sonora di Torremolinos',soundInfo:'Un estratto originale di LUNE_X ispirato al Mediterraneo',
  moreMusic:'Altri ascolti',listen:'▶ Ascolta ora',pause:'Ⅱ Metti in pausa',listenError:'Riproduzione non disponibile. Controlla la connessione.',
  story1:'Torremolinos, molto più che sole e spiaggia',
  story2:'La Nogalera, dove la notte incontra la storia',
  story3:'Pasaje Begoña, memoria di libertà',
  sanmiguel:'San Miguel: la festa che porta la città in strada',
  photoCredit:'Fotografia d’archivio TORREMOLINOS',musicCredit:'Immagine illustrativa generata con IA · Musica LUNE_X'
 },
 es:{
  home:'Inicio',menu:'Menú',menuNav:'Navegación completa',food:'Comer',agenda:'Agenda',gallery:'Gallery',stories:'Stories',
  foodSub:'Restaurantes, tapas y sabores locales',agendaSub:'Eventos, conciertos y actividades',
  gallerySub:'La ciudad a través de las fotografías',storiesSub:'Curiosidades, lugares e inspiración',
  tagline:'Mar, sabores, eventos e historias de la Costa del Sol',
  sound:'Sound',soundSub:'La banda sonora de Torremolinos',soundInfo:'Un fragmento original de LUNE_X inspirado en el Mediterráneo',
  moreMusic:'Más opciones para escuchar',listen:'▶ Escuchar ahora',pause:'Ⅱ Pausar',listenError:'No se puede reproducir. Comprueba la conexión.',
  story1:'Torremolinos, mucho más que sol y playa',
  story2:'La Nogalera, donde la noche tiene historia',story3:'Pasaje Begoña, memoria de libertad',
  sanmiguel:'San Miguel: la fiesta que saca Torremolinos a la calle',
  photoCredit:'Fotografía del archivo TORREMOLINOS',musicCredit:'Imagen ilustrativa generada con IA · Música LUNE_X'
 },
 en:{
  home:'Home',menu:'Menu',menuNav:'Full navigation',food:'Food',agenda:'Events',gallery:'Gallery',stories:'Stories',
  foodSub:'Restaurants, tapas and local flavours',agendaSub:'Events, concerts and activities',
  gallerySub:'The city through its photographs',storiesSub:'Stories, places and inspiration',
  tagline:'Sea, flavours, events and stories on the Costa del Sol',
  sound:'Sound',soundSub:'The soundtrack to Torremolinos',soundInfo:'An original LUNE_X excerpt inspired by the Mediterranean',
  moreMusic:'More listening options',listen:'▶ Listen now',pause:'Ⅱ Pause',listenError:'Playback unavailable. Check your connection.',
  story1:'Torremolinos, more than sun and beaches',
  story2:'La Nogalera, where nightlife has a history',story3:'Pasaje Begoña, a place of freedom and remembrance',
  sanmiguel:'San Miguel: the festival that fills the streets',
  photoCredit:'TORREMOLINOS archive photograph',musicCredit:'AI-generated illustrative image · Music by LUNE_X'
 },
 de:{
  home:'Startseite',menu:'Menü',menuNav:'Vollständige Navigation',food:'Essen',agenda:'Termine',gallery:'Galerie',stories:'Stories',
  foodSub:'Restaurants, Tapas und lokale Küche',agendaSub:'Events, Konzerte und Aktivitäten',
  gallerySub:'Die Stadt in Bildern',storiesSub:'Geschichten, Orte und Inspiration',
  tagline:'Meer, Genuss, Veranstaltungen und Geschichten an der Costa del Sol',
  sound:'Sound',soundSub:'Der Soundtrack von Torremolinos',soundInfo:'Ein Originalausschnitt von LUNE_X, inspiriert vom Mittelmeer',
  moreMusic:'Weitere Hörmöglichkeiten',listen:'▶ Jetzt hören',pause:'Ⅱ Pause',listenError:'Wiedergabe nicht möglich. Internetverbindung prüfen.',
  story1:'Torremolinos: mehr als Sonne und Strand',story2:'La Nogalera: ein Viertel voller Geschichte',
  story3:'Pasaje Begoña: Erinnerung an die Freiheit',sanmiguel:'San Miguel: das Fest auf den Straßen',
  photoCredit:'Foto aus dem TORREMOLINOS-Archiv',musicCredit:'KI-generierte Illustration · Musik LUNE_X'
 },
 fr:{
  home:'Accueil',menu:'Menu',menuNav:'Navigation complète',food:'Restaurants',agenda:'Agenda',gallery:'Galerie',stories:'Stories',
  foodSub:'Restaurants, tapas et saveurs locales',agendaSub:'Événements, concerts et activités',
  gallerySub:'La ville à travers les photos',storiesSub:'Histoires, lieux et inspirations',
  tagline:'Mer, saveurs, événements et histoires sur la Costa del Sol',
  sound:'Sound',soundSub:'La bande-son de Torremolinos',soundInfo:'Un extrait original de LUNE_X inspiré de la Méditerranée',
  moreMusic:'Autres options d’écoute',listen:'▶ Écouter',pause:'Ⅱ Pause',listenError:'Lecture indisponible. Vérifiez votre connexion.',
  story1:'Torremolinos, bien plus que le soleil et la plage',story2:'La Nogalera, un quartier chargé d’histoire',
  story3:'Pasaje Begoña, mémoire de liberté',sanmiguel:'San Miguel : la fête dans les rues',
  photoCredit:'Photo des archives TORREMOLINOS',musicCredit:'Illustration générée par IA · Musique LUNE_X'
 },
 ru:{
  home:'Главная',menu:'Меню',menuNav:'Полная навигация',food:'Рестораны',agenda:'События',gallery:'Галерея',stories:'Истории',
  foodSub:'Рестораны, тапас и местная кухня',agendaSub:'События, концерты и встречи',
  gallerySub:'Город в фотографиях',storiesSub:'Истории, места и впечатления',
  tagline:'Море, кухня, события и истории Коста-дель-Соль',
  sound:'Музыка',soundSub:'Звучание Торремолиноса',soundInfo:'Оригинальный отрывок LUNE_X, вдохновлённый Средиземным морем',
  moreMusic:'Другие способы слушать',listen:'▶ Слушать',pause:'Ⅱ Пауза',listenError:'Не удаётся воспроизвести. Проверьте соединение.',
  story1:'Торремолинос: больше, чем солнце и пляж',story2:'Ла-Ногалера: история ночной жизни',
  story3:'Пассаж Бегонья: память о свободе',sanmiguel:'Сан-Мигель: праздник на улицах',
  photoCredit:'Фото из архива TORREMOLINOS',musicCredit:'Иллюстрация создана ИИ · Музыка LUNE_X'
 }
 };
 const audio=document.getElementById('torremolinos-audio');

 const titles={
  story1:'#stories .magazine-card.primary h3',
  story2:'#stories .magazine-card[href*="la-nogalera"] h3',
  story3:'#stories .magazine-card[href*="pasaje-begona"] h3',
  // San Miguel remains available in the Stories index, not on Home.
 };
 function movePhotoCredits(){
  document.querySelectorAll('#stories .magazine-card').forEach(card=>{
   const cover=card.querySelector('.cover');
   const body=card.querySelector('.magazine-text');
   if(!cover||!body)return;
   [...cover.querySelectorAll('.cover-label,.photoattribution')].forEach(el=>{
    if(el.classList.contains('photoattribution'))el.classList.add('photo-credit-outside');
    body.insertBefore(el,body.firstChild);
   });
  });
  const pairs=[
   ['.nogalera-feature-photo small','.nogalera-feature-copy'],



  ];
  pairs.forEach(([from,to])=>{
   const item=document.querySelector(from),target=document.querySelector(to);
   if(item&&target) {item.classList.add('photo-credit-outside');target.appendChild(item)}
  });
 }
 function keepPlaceLabelsOutsidePhotos(){
  const cards=document.getElementById('cards');
  if(!cards)return;
  cards.querySelectorAll('.place-art .chip').forEach(chip=>{
   const body=chip.closest('.place')?.querySelector('.place-body');
   if(body){chip.classList.add('approved-place-chip');body.prepend(chip)}
  });
 }
 function translate(){
  const lang=(document.documentElement.lang||'es').slice(0,2);
  const storyReview={"es":{"culture":"LGBTQ+ / CULTURA","memory":"HISTORIA / MEMORIA","people":"PERSONAS / LUGARES","season":"NAVIDAD 2026–2027","alts":["Fotografía original de la costa de Torremolinos desde el paseo marítimo","La Nogalera fotografiada en 2010","Fotografía del Pasaje Begoña tomada en 2024","Paseo mediterráneo con palmeras en Torremolinos, fotografía de ambiente, no del alumbrado"]},"it":{"culture":"LGBTQ+ / CULTURA","memory":"STORIA / MEMORIA","people":"PERSONE / LUOGHI","season":"NATALE 2026–2027","alts":["Fotografia originale della costa di Torremolinos dal lungomare","La Nogalera fotografata nel 2010","Fotografia di Pasaje Begoña del 2024","Passeggiata mediterranea con palme a Torremolinos, fotografia d’ambiente, non delle luminarie"]},"en":{"culture":"LGBTQ+ / CULTURE","memory":"HISTORY / MEMORY","people":"PEOPLE / PLACES","season":"CHRISTMAS 2026–2027","alts":["Original photograph of the Torremolinos coast from the promenade","La Nogalera photographed in 2010","Photograph of Pasaje Begoña taken in 2024","Palm-lined Mediterranean promenade in Torremolinos, atmospheric photograph, not the Christmas lights"]},"de":{"culture":"LGBTQ+ / KULTUR","memory":"GESCHICHTE / ERINNERUNG","people":"MENSCHEN / ORTE","season":"WEIHNACHTEN 2026–2027","alts":["Originalfoto der Küste von Torremolinos von der Strandpromenade","La Nogalera, fotografiert 2010","Foto der Pasaje Begoña von 2024","Mediterrane Palmenpromenade in Torremolinos, Stimmungsfoto, keine Weihnachtsbeleuchtung"]},"fr":{"culture":"LGBTQ+ / CULTURE","memory":"HISTOIRE / MÉMOIRE","people":"PERSONNES / LIEUX","season":"NOËL 2026–2027","alts":["Photographie originale de la côte de Torremolinos depuis la promenade","La Nogalera photographiée en 2010","Photographie du Pasaje Begoña prise en 2024","Promenade méditerranéenne bordée de palmiers à Torremolinos, photo d’ambiance, pas des illuminations"]},"ru":{"culture":"ЛГБТК+ / КУЛЬТУРА","memory":"ИСТОРИЯ / ПАМЯТЬ","people":"ЛЮДИ / МЕСТА","season":"РОЖДЕСТВО 2026–2027","alts":["Авторская фотография побережья Торремолиноса с набережной","Ла Ногалера на фотографии 2010 года","Фотография Пасахе Бегонья 2024 года","Средиземноморская набережная с пальмами в Торремолиносе, атмосферное фото, не праздничная иллюминация"]}};
  const sr=storyReview[lang]||storyReview.es;
  document.querySelectorAll('[data-review-story]').forEach(el=>{if(sr[el.dataset.reviewStory])el.textContent=sr[el.dataset.reviewStory];});
  document.querySelectorAll('#stories .magazine-card .cover img,#stories .l8-season-promo-photo img').forEach((img,i)=>{if(sr.alts[i])img.alt=sr.alts[i];});
  const galleryAlt={"es":["Escultura de dos figuras con brazos elevados, entre edificios y palmeras","Playa enmarcada por palmeras, con el mar y el cielo azul al fondo","Fachada roja con balcón de flores y una figura decorativa bajo un paraguas amarillo"],"it":["Scultura di due figure con le braccia alzate, tra edifici e palme","Spiaggia incorniciata da palme, con mare e cielo azzurro sullo sfondo","Facciata rossa con balcone fiorito e una figura decorativa sotto un ombrello giallo"],"en":["Sculpture of two figures with raised arms, between buildings and palm trees","Beach framed by palm trees, with blue sea and sky in the background","Red façade with a flower-filled balcony and decorative figure beneath a yellow umbrella"],"de":["Skulptur zweier Figuren mit erhobenen Armen zwischen Gebäuden und Palmen","Strand zwischen Palmen mit blauem Meer und Himmel im Hintergrund","Rote Fassade mit Blumenbalkon und einer Dekorationsfigur unter einem gelben Schirm"],"fr":["Sculpture de deux figures aux bras levés, entre bâtiments et palmiers","Plage encadrée de palmiers avec la mer et le ciel bleu en arrière-plan","Façade rouge au balcon fleuri et figure décorative sous un parapluie jaune"],"ru":["Скульптура двух фигур с поднятыми руками среди зданий и пальм","Пляж в обрамлении пальм на фоне моря и голубого неба","Красный фасад с цветочным балконом и декоративной фигурой под жёлтым зонтом"]};
  ['photoDiary1','photoDiary2','photoDiary3'].forEach((id,i)=>{const img=document.getElementById(id);if(img)img.alt=(galleryAlt[lang]||galleryAlt.es)[i];});
  const t=T[lang]||T.es;
  document.querySelectorAll('[data-clean]').forEach(el=>{
   const k=el.getAttribute('data-clean');
   const txt=t[k];
   if(txt)el.textContent=txt;
  });
  const hero=document.querySelector('.hero-tagline');
  if(hero)hero.textContent=t.tagline;
  Object.entries(titles).forEach(([key,selector])=>{
   const el=document.querySelector(selector);
   if(el&&t[key])el.textContent=t[key];
  });
  const body=document.querySelector('#sound .approved-sound-credit');
  if(body)body.textContent=t.musicCredit;
  if(audio){const label=document.querySelector('#sound .player-label');if(label)audio.setAttribute('aria-label',label.textContent.trim());}
  const image=document.querySelector('#sound .music-album-art');
  if(image)image.alt=({
   es:'Auriculares color marfil sobre rocas junto al Mediterráneo, imagen ilustrativa generada con IA',
   en:'Ivory-coloured headphones on rocks beside the Mediterranean Sea, AI-generated illustration',
   it:'Cuffie color avorio su rocce davanti al Mediterraneo, immagine illustrativa generata con IA',
   de:'Elfenbeinfarbene Kopfhörer auf Felsen am Mittelmeer, KI-generierte Illustration',
   fr:'Casque ivoire sur des rochers au bord de la Méditerranée, illustration générée par IA',
   ru:'Наушники цвета слоновой кости на скалах у Средиземного моря, иллюстрация создана ИИ'
  })[lang]||'AI-generated illustrative image of headphones beside the sea';
  const title=document.querySelector('#clean-access');
  if(title)title.setAttribute('aria-label',lang==='it'?'Esplora le sezioni della guida':lang==='es'?'Explora las secciones de la guía':lang==='en'?'Explore guide sections':'Guide sections');
  const mobilePanel=document.querySelector('.tm-mobile-menu .tm-mobile-panel');
  if(mobilePanel)mobilePanel.setAttribute('aria-label',t.menuNav);
  const reviewNogalera={"es":{"heritage":"La historia LGBTQ+ de Torremolinos se cuenta también entre La Nogalera y el histórico Pasaje Begoña.","nogalera":"La Nogalera: historia ↗","pasaje":"Pasaje Begoña: memoria ↗"},"it":{"heritage":"La storia LGBTQ+ di Torremolinos vive anche tra La Nogalera e lo storico Pasaje Begoña.","nogalera":"La storia di La Nogalera ↗","pasaje":"Pasaje Begoña: memoria ↗"},"en":{"heritage":"Torremolinos’ LGBTQ+ history lives on in La Nogalera and the historic Pasaje Begoña.","nogalera":"La Nogalera: its history ↗","pasaje":"Pasaje Begoña: memory ↗"},"de":{"heritage":"Die LGBTQ+-Geschichte von Torremolinos lebt in La Nogalera und der historischen Pasaje Begoña weiter.","nogalera":"La Nogalera: Geschichte ↗","pasaje":"Pasaje Begoña: Erinnerung ↗"},"fr":{"heritage":"L’histoire LGBTQ+ de Torremolinos se poursuit à La Nogalera et dans le passage historique Begoña.","nogalera":"La Nogalera : histoire ↗","pasaje":"Pasaje Begoña : mémoire ↗"},"ru":{"heritage":"История ЛГБТК+ в Торремолиносе живёт в Ла Ногалере и историческом Пасахе Бегонья.","nogalera":"История Ла Ногалеры ↗","pasaje":"Пасахе Бегонья: память ↗"}};
  document.querySelectorAll('[data-review-nogalera]').forEach(el=>{const value=(reviewNogalera[lang]||reviewNogalera.es)[el.dataset.reviewNogalera];if(value)el.textContent=value;});
  const reviewPhotoAlt={"mangiare":{"it":"Espetos di sardine cotti sulla brace in una barca tradizionale","es":"Espetos de sardinas asándose a las brasas en una barca tradicional","en":"Sardine skewers grilling over embers in a traditional boat","de":"Sardinenspieße auf der Glut in einem traditionellen Boot","fr":"Brochettes de sardines grillant sur les braises dans une barque traditionnelle","ru":"Сардины на шампурах над углями в традиционной лодке"},"agenda":{"it":"Insegna di San Miguel, Torremolinos 2026, fotografia d’archivio","es":"Cartel de San Miguel, Torremolinos 2026, fotografía de archivo","en":"San Miguel sign, Torremolinos 2026, archival photograph","de":"Schild von San Miguel, Torremolinos 2026, Archivfoto","fr":"Panneau de San Miguel, Torremolinos 2026, photographie d’archive","ru":"Вывеска Сан-Мигель, Торремолинос 2026, архивная фотография"},"gallery":{"it":"Insegna in ceramica di El Bajondillo circondata da vasi di terracotta","es":"Cartel de cerámica de El Bajondillo rodeado de macetas de terracota","en":"El Bajondillo ceramic sign surrounded by terracotta flowerpots","de":"Keramikschild von El Bajondillo, umgeben von Terrakottatöpfen","fr":"Panneau en céramique d’El Bajondillo entouré de pots en terre cuite","ru":"Керамическая табличка Эль-Бахондильо в окружении терракотовых горшков"},"stories":{"it":"Palazzo bianco e giallo con finestre ad arco e balconi a balaustra","es":"Edificio blanco y amarillo con ventanas de arco y balcones con balaustradas","en":"White and yellow building with arched windows and balustraded balconies","de":"Weiß-gelbes Gebäude mit Bogenfenstern und Balustradenbalkonen","fr":"Bâtiment blanc et jaune aux fenêtres cintrées et balcons à balustrades","ru":"Белое здание с жёлтой отделкой, арочными окнами и балконами с балюстрадами"}};
  const reviewPhotoCredit={"es":"© Archivo fotográfico TORREMOLINOS · Derechos reservados","it":"© Archivio fotografico TORREMOLINOS · Tutti i diritti riservati","en":"© TORREMOLINOS photographic archive · All rights reserved","de":"© Fotoarchiv TORREMOLINOS · Alle Rechte vorbehalten","fr":"© Archives photographiques TORREMOLINOS · Tous droits réservés","ru":"© Фотоархив TORREMOLINOS · Все права защищены"};
  document.querySelectorAll('#clean-access img[data-review-photo]').forEach(img=>{const a=reviewPhotoAlt[img.dataset.reviewPhoto];if(a)img.alt=a[lang]||a.es;});
  const reviewCredit=document.querySelector('#clean-access [data-review-credit]');
  if(reviewCredit)reviewCredit.textContent=reviewPhotoCredit[lang]||reviewPhotoCredit.es;
  // Keep the language-specific URLs already controlled by the application.
 }
 const init=()=>{
  movePhotoCredits();keepPlaceLabelsOutsidePhotos();translate();
  const mobileMenu=document.querySelector('.tm-mobile-menu');
  if(mobileMenu){
    mobileMenu.addEventListener('click',event=>{
      if(event.target.closest('.tm-mobile-panel a'))mobileMenu.open=false;
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&mobileMenu.open){
        mobileMenu.open=false;
        mobileMenu.querySelector('summary')?.focus();
      }
    });
    document.addEventListener('pointerdown',event=>{
      if(mobileMenu.open&&!mobileMenu.contains(event.target))mobileMenu.open=false;
    });
  }
  const placeHost=document.getElementById('cards');
  if(placeHost)new MutationObserver(keepPlaceLabelsOutsidePhotos).observe(placeHost,{childList:true,subtree:true});
  new MutationObserver(()=>{translate()})
    .observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.getElementById('lang')?.addEventListener('change',()=>{
    queueMicrotask(()=>{translate()});
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

/* Extend the white introduction through the four access cards at every width.
   Keep the sand canvas below the cards, including on iPhone. */
(()=>{const main=document.querySelector('body.torre-home main#main');
 if(!main)return;const trust=main.querySelector('.trust.shell');if(!trust)return;
 const access=main.querySelector('#clean-access');
 const update=()=>{const boundary=access||trust;
  const bottom=boundary.getBoundingClientRect().bottom-main.getBoundingClientRect().top;
  main.style.setProperty('--review-start',Math.ceil(bottom+1)+'px')};
 update();if('ResizeObserver'in window){const ro=new ResizeObserver(update);
  for(const e of main.querySelectorAll(':scope > .hero,:scope > .hero-tools,:scope > .trust,:scope > #clean-access'))ro.observe(e);
 }window.addEventListener('resize',update,{passive:true});document.fonts?.ready.then(update);
})();

/* §3 translated directory link and credit; category copy uses existing data-t dictionary. */
(()=>{const words={"es":{"all":"Todos los lugares","saved":"♡ Guardados","more":"Ver todos los lugares","credit":"© Archivo fotográfico TORREMOLINOS · Derechos reservados","title":"Explora todos los lugares","intro":"Elige un lugar, consulta sus fuentes y añádelo a tu recorrido.","home":"Inicio","plan":"Mi recorrido","search":"Buscar lugares","source":"Fuente oficial","map":"Mapa","add":"Añadir al plan","added":"Añadido al plan","limit":"Máximo 8 paradas","empty":"No hay lugares que coincidan","results":"lugares","cats":["Todos","LGBTQ+","Playas","Gastronomía","Cultura","Noche","Práctico","Guardados"],"titles":["Mar","La Nogalera","Sabores","Primeros pasos"],"subs":["Playas y paseos","Cultura y vida nocturna","Cocina local","Para sentirte en casa"]},"it":{"all":"Tutti i luoghi","saved":"♡ Salvati","more":"Vedi tutti i luoghi","credit":"© Archivio fotografico TORREMOLINOS · Tutti i diritti riservati","title":"Esplora tutti i luoghi","intro":"Scegli un luogo, consulta le fonti e aggiungilo al tuo percorso.","home":"Home","plan":"Il mio giro","search":"Cerca luoghi","source":"Fonte ufficiale","map":"Mappa","add":"Aggiungi al piano","added":"Aggiunto al piano","limit":"Massimo 8 tappe","empty":"Nessun luogo corrispondente","results":"luoghi","cats":["Tutti","LGBTQ+","Spiagge","Gastronomia","Cultura","Notte","Primi passi","Salvati"],"titles":["Mare","La Nogalera","Sapori","Primi passi"],"subs":["Spiagge e passeggiate","Cultura e vita notturna","Cucina locale","Per sentirti a casa"]},"en":{"all":"All places","saved":"♡ Saved","more":"See all places","credit":"© TORREMOLINOS photographic archive · All rights reserved","title":"Explore all places","intro":"Choose a place, check its sources and add it to your route.","home":"Home","plan":"My plan","search":"Search places","source":"Official source","map":"Map","add":"Add to plan","added":"Added to plan","limit":"Maximum 8 stops","empty":"No matching places","results":"places","cats":["All","LGBTQ+","Beaches","Food","Culture","Nightlife","Practical","Saved"],"titles":["Sea","La Nogalera","Flavours","First steps"],"subs":["Beaches and walks","Culture and nightlife","Local cuisine","Feel at home"]},"de":{"all":"Alle Orte","saved":"♡ Gemerkt","more":"Alle Orte ansehen","credit":"© Fotoarchiv TORREMOLINOS · Alle Rechte vorbehalten","title":"Alle Orte entdecken","intro":"Wähle einen Ort, prüfe die Quellen und füge ihn deiner Route hinzu.","home":"Startseite","plan":"Mein Plan","search":"Orte suchen","source":"Offizielle Quelle","map":"Karte","add":"Zum Plan hinzufügen","added":"Zum Plan hinzugefügt","limit":"Maximal 8 Stopps","empty":"Keine passenden Orte","results":"Orte","cats":["Alle","LGBTQ+","Strände","Gastronomie","Kultur","Nachtleben","Praktisch","Gemerkt"],"titles":["Meer","La Nogalera","Genuss","Erste Schritte"],"subs":["Strände und Spaziergänge","Kultur und Nachtleben","Lokale Küche","Wie zu Hause"]},"fr":{"all":"Tous les lieux","saved":"♡ Favoris","more":"Voir tous les lieux","credit":"© Archives photographiques TORREMOLINOS · Tous droits réservés","title":"Explorer tous les lieux","intro":"Choisissez un lieu, consultez les sources et ajoutez-le à votre parcours.","home":"Accueil","plan":"Mon parcours","search":"Rechercher des lieux","source":"Source officielle","map":"Carte","add":"Ajouter au parcours","added":"Ajouté au parcours","limit":"8 étapes maximum","empty":"Aucun lieu correspondant","results":"lieux","cats":["Tous","LGBTQ+","Plages","Gastronomie","Culture","Vie nocturne","Pratique","Favoris"],"titles":["Mer","La Nogalera","Saveurs","Premiers pas"],"subs":["Plages et promenades","Culture et vie nocturne","Cuisine locale","Comme chez soi"]},"ru":{"all":"Все места","saved":"♡ Избранное","more":"Посмотреть все места","credit":"© Фотоархив TORREMOLINOS · Все права защищены","title":"Все места города","intro":"Выберите место, проверьте источники и добавьте его в маршрут.","home":"Главная","plan":"Мой маршрут","search":"Поиск мест","source":"Официальный источник","map":"Карта","add":"Добавить в маршрут","added":"Добавлено в маршрут","limit":"Не более 8 остановок","empty":"Подходящих мест нет","results":"мест","cats":["Все","ЛГБТК+","Пляжи","Кухня","Культура","Ночная жизнь","Практическое","Избранное"],"titles":["Море","Ла-Ногалера","Вкусы","Первые шаги"],"subs":["Пляжи и прогулки","Культура и ночная жизнь","Местная кухня","Почувствуйте себя дома"]}};function update(){const lang=document.documentElement.lang||'es',t=words[lang]||words.es;document.querySelectorAll('[data-review-explore]').forEach(el=>{el.textContent=t[el.dataset.reviewExplore]||''});const a=document.querySelector('.review-all-places');if(a){a.href='explore/?lang='+encodeURIComponent(lang);}}update();new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});})();

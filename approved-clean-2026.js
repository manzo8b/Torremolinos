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
 const button=document.getElementById('approvedSoundPlay');
 const note=document.querySelector('#sound .approved-sound-note');
 const titles={
  story1:'#stories .magazine-card.primary h3',
  story2:'#stories .magazine-card[href*="la-nogalera"] h3',
  story3:'#stories .magazine-card[href*="pasaje-begona"] h3',
  sanmiguel:'#stories .magazine-extra h3'
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
   ['.agenda-home-photo small','.agenda-home-copy'],
   ['.gallery-feature-img .ai-badge','.gallery-feature-body'],
   ['#sound .music-art .approved-sound-credit','#sound .music-body']
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
  const t=T[lang]||T.es;
  document.querySelectorAll('[data-clean]').forEach(el=>{
   const k=el.getAttribute('data-clean');
   const txt= k==='listen' && audio && !audio.paused?t.pause:t[k];
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
  const reviewPhotoAlt={"mangiare":{"it":"Espetos di sardine cotti sulla brace in una barca tradizionale","es":"Espetos de sardinas asándose a las brasas en una barca tradicional","en":"Sardine skewers grilling over embers in a traditional boat","de":"Sardinenspieße auf der Glut in einem traditionellen Boot","fr":"Brochettes de sardines grillant sur les braises dans une barque traditionnelle","ru":"Сардины на шампурах над углями в традиционной лодке"},"agenda":{"it":"Insegna di San Miguel, Torremolinos 2026, fotografia d’archivio","es":"Cartel de San Miguel, Torremolinos 2026, fotografía de archivo","en":"San Miguel sign, Torremolinos 2026, archival photograph","de":"Schild von San Miguel, Torremolinos 2026, Archivfoto","fr":"Panneau de San Miguel, Torremolinos 2026, photographie d’archive","ru":"Вывеска Сан-Мигель, Торремолинос 2026, архивная фотография"},"gallery":{"it":"Insegna in ceramica di El Bajondillo circondata da vasi di terracotta","es":"Cartel de cerámica de El Bajondillo rodeado de macetas de terracota","en":"El Bajondillo ceramic sign surrounded by terracotta flowerpots","de":"Keramikschild von El Bajondillo, umgeben von Terrakottatöpfen","fr":"Panneau en céramique d’El Bajondillo entouré de pots en terre cuite","ru":"Керамическая табличка Эль-Бахондильо в окружении терракотовых горшков"},"stories":{"it":"Palazzo bianco e giallo con finestre ad arco e balconi a balaustra","es":"Edificio blanco y amarillo con ventanas de arco y balcones con balaustradas","en":"White and yellow building with arched windows and balustraded balconies","de":"Weiß-gelbes Gebäude mit Bogenfenstern und Balustradenbalkonen","fr":"Bâtiment blanc et jaune aux fenêtres cintrées et balcons à balustrades","ru":"Белое здание с жёлтой отделкой, арочными окнами и балконами с балюстрадами"}};
  const reviewPhotoCredit={"es":"© Archivo fotográfico TORREMOLINOS · Derechos reservados","it":"© Archivio fotografico TORREMOLINOS · Tutti i diritti riservati","en":"© TORREMOLINOS photographic archive · All rights reserved","de":"© Fotoarchiv TORREMOLINOS · Alle Rechte vorbehalten","fr":"© Archives photographiques TORREMOLINOS · Tous droits réservés","ru":"© Фотоархив TORREMOLINOS · Все права защищены"};
  document.querySelectorAll('#clean-access img[data-review-photo]').forEach(img=>{const a=reviewPhotoAlt[img.dataset.reviewPhoto];if(a)img.alt=a[lang]||a.es;});
  const reviewCredit=document.querySelector('#clean-access [data-review-credit]');
  if(reviewCredit)reviewCredit.textContent=reviewPhotoCredit[lang]||reviewPhotoCredit.es;
  // Keep the language-specific URLs already controlled by the application.
 }
 function renderPlay(){
  if(!button||!audio)return;
  const lang=(document.documentElement.lang||'es').slice(0,2);
  const t=T[lang]||T.es;
  button.textContent=audio.paused?t.listen:t.pause;
  button.setAttribute('aria-pressed',String(!audio.paused));
 }
 if(button&&audio){
  button.addEventListener('click',()=>{
   if(audio.paused){const task=audio.play();if(task&&typeof task.catch==='function'){
    task.catch(()=>{if(note)note.textContent=(T[document.documentElement.lang]||T.es).listenError;renderPlay()});
   }}else audio.pause();
  });
  ['play','pause','ended'].forEach(ev=>audio.addEventListener(ev,renderPlay));
 }
 const init=()=>{
  movePhotoCredits();keepPlaceLabelsOutsidePhotos();translate();renderPlay();
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
  new MutationObserver(()=>{translate();renderPlay()})
    .observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.getElementById('lang')?.addEventListener('change',()=>{
    queueMicrotask(()=>{translate();renderPlay()});
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

/* G1: keep the entire protected hero + tools + three trust labels on the
   original white background. The review canvas is below this boundary only. */
(()=>{const main=document.querySelector('body.torre-home main#main');
 if(!main)return;const trust=main.querySelector('.trust.shell');if(!trust)return;
 const update=()=>{const bottom=trust.getBoundingClientRect().bottom-main.getBoundingClientRect().top;
  main.style.setProperty('--review-start',Math.ceil(bottom+1)+'px')};
 update();if('ResizeObserver'in window){const ro=new ResizeObserver(update);
  for(const e of main.querySelectorAll(':scope > .hero,:scope > .hero-tools,:scope > .trust'))ro.observe(e);
 }window.addEventListener('resize',update,{passive:true});document.fonts?.ready.then(update);
})();

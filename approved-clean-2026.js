/* Torremolinos — approved clean design: i18n microcopy, photo credits and real audio control.
   Language changes remain managed by the original app; this layer follows them.
   No tracking, timers, external libraries or simulated availability. */
(() => {
 'use strict';
 const T = {
 it:{
  home:'Home',food:'Mangiare',agenda:'Agenda',gallery:'Gallery',stories:'Stories',
  foodSub:'Ristoranti, tapas e sapori locali',agendaSub:'Eventi, concerti e appuntamenti',
  gallerySub:'La città attraverso le fotografie',storiesSub:'Curiosità, luoghi e ispirazioni',
  tagline:'Mare, sapori, eventi e storie sulla Costa del Sol',
  sound:'Sound',soundSub:'La colonna sonora di Torremolinos',soundInfo:'Un estratto originale di LUNE_X ispirato al Mediterraneo',
  listen:'▶ Ascolta ora',pause:'Ⅱ Metti in pausa',listenError:'Riproduzione non disponibile. Controlla la connessione.',
  story1:'Torremolinos, molto più che sole e spiaggia',
  story2:'La Nogalera, dove la notte incontra la storia',
  story3:'Pasaje Begoña, memoria di libertà',
  sanmiguel:'San Miguel: la festa che porta la città in strada',
  photoCredit:'Fotografia d’archivio TORREMOLINOS',musicCredit:'Fotografia d’archivio TORREMOLINOS · Musica LUNE_X'
 },
 es:{
  home:'Inicio',food:'Comer',agenda:'Agenda',gallery:'Gallery',stories:'Stories',
  foodSub:'Restaurantes, tapas y sabores locales',agendaSub:'Eventos, conciertos y actividades',
  gallerySub:'La ciudad a través de las fotografías',storiesSub:'Curiosidades, lugares e inspiración',
  tagline:'Mar, sabores, eventos e historias de la Costa del Sol',
  sound:'Sound',soundSub:'La banda sonora de Torremolinos',soundInfo:'Un fragmento original de LUNE_X inspirado en el Mediterráneo',
  listen:'▶ Escuchar ahora',pause:'Ⅱ Pausar',listenError:'No se puede reproducir. Comprueba la conexión.',
  story1:'Torremolinos, mucho más que sol y playa',
  story2:'La Nogalera, donde la noche tiene historia',story3:'Pasaje Begoña, memoria de libertad',
  sanmiguel:'San Miguel: la fiesta que saca Torremolinos a la calle',
  photoCredit:'Fotografía del archivo TORREMOLINOS',musicCredit:'Fotografía de archivo TORREMOLINOS · Música LUNE_X'
 },
 en:{
  home:'Home',food:'Food',agenda:'Events',gallery:'Gallery',stories:'Stories',
  foodSub:'Restaurants, tapas and local flavours',agendaSub:'Events, concerts and activities',
  gallerySub:'The city through its photographs',storiesSub:'Stories, places and inspiration',
  tagline:'Sea, flavours, events and stories on the Costa del Sol',
  sound:'Sound',soundSub:'The soundtrack to Torremolinos',soundInfo:'An original LUNE_X excerpt inspired by the Mediterranean',
  listen:'▶ Listen now',pause:'Ⅱ Pause',listenError:'Playback unavailable. Check your connection.',
  story1:'Torremolinos, more than sun and beaches',
  story2:'La Nogalera, where nightlife has a history',story3:'Pasaje Begoña, a place of freedom and remembrance',
  sanmiguel:'San Miguel: the festival that fills the streets',
  photoCredit:'TORREMOLINOS archive photograph',musicCredit:'TORREMOLINOS archive photograph · Music by LUNE_X'
 },
 de:{
  home:'Startseite',food:'Essen',agenda:'Termine',gallery:'Galerie',stories:'Stories',
  foodSub:'Restaurants, Tapas und lokale Küche',agendaSub:'Events, Konzerte und Aktivitäten',
  gallerySub:'Die Stadt in Bildern',storiesSub:'Geschichten, Orte und Inspiration',
  tagline:'Meer, Genuss, Veranstaltungen und Geschichten an der Costa del Sol',
  sound:'Sound',soundSub:'Der Soundtrack von Torremolinos',soundInfo:'Ein Originalausschnitt von LUNE_X, inspiriert vom Mittelmeer',
  listen:'▶ Jetzt hören',pause:'Ⅱ Pause',listenError:'Wiedergabe nicht möglich. Internetverbindung prüfen.',
  story1:'Torremolinos: mehr als Sonne und Strand',story2:'La Nogalera: ein Viertel voller Geschichte',
  story3:'Pasaje Begoña: Erinnerung an die Freiheit',sanmiguel:'San Miguel: das Fest auf den Straßen',
  photoCredit:'Foto aus dem TORREMOLINOS-Archiv',musicCredit:'Archivfoto TORREMOLINOS · Musik LUNE_X'
 },
 fr:{
  home:'Accueil',food:'Restaurants',agenda:'Agenda',gallery:'Galerie',stories:'Stories',
  foodSub:'Restaurants, tapas et saveurs locales',agendaSub:'Événements, concerts et activités',
  gallerySub:'La ville à travers les photos',storiesSub:'Histoires, lieux et inspirations',
  tagline:'Mer, saveurs, événements et histoires sur la Costa del Sol',
  sound:'Sound',soundSub:'La bande-son de Torremolinos',soundInfo:'Un extrait original de LUNE_X inspiré de la Méditerranée',
  listen:'▶ Écouter',pause:'Ⅱ Pause',listenError:'Lecture indisponible. Vérifiez votre connexion.',
  story1:'Torremolinos, bien plus que le soleil et la plage',story2:'La Nogalera, un quartier chargé d’histoire',
  story3:'Pasaje Begoña, mémoire de liberté',sanmiguel:'San Miguel : la fête dans les rues',
  photoCredit:'Photo des archives TORREMOLINOS',musicCredit:'Photo des archives TORREMOLINOS · Musique LUNE_X'
 },
 ru:{
  home:'Главная',food:'Рестораны',agenda:'События',gallery:'Галерея',stories:'Истории',
  foodSub:'Рестораны, тапас и местная кухня',agendaSub:'События, концерты и встречи',
  gallerySub:'Город в фотографиях',storiesSub:'Истории, места и впечатления',
  tagline:'Море, кухня, события и истории Коста-дель-Соль',
  sound:'Музыка',soundSub:'Звучание Торремолиноса',soundInfo:'Оригинальный отрывок LUNE_X, вдохновлённый Средиземным морем',
  listen:'▶ Слушать',pause:'Ⅱ Пауза',listenError:'Не удаётся воспроизвести. Проверьте соединение.',
  story1:'Торремолинос: больше, чем солнце и пляж',story2:'Ла-Ногалера: история ночной жизни',
  story3:'Пассаж Бегонья: память о свободе',sanmiguel:'Сан-Мигель: праздник на улицах',
  photoCredit:'Фото из архива TORREMOLINOS',musicCredit:'Фото из архива TORREMOLINOS · Музыка LUNE_X'
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
  document.querySelectorAll('img[alt*="illustrativa generata"]').forEach(img=>{
   img.alt=lang==='it'?'Immagine illustrativa del Mediterraneo generata con intelligenza artificiale':
    lang==='en'?'AI-generated illustration of the Mediterranean sea':'Imagen ilustrativa del Mediterráneo generada con IA';
  });
  const title=document.querySelector('#clean-access');
  if(title)title.setAttribute('aria-label',lang==='it'?'Esplora le sezioni della guida':lang==='es'?'Explora las secciones de la guía':lang==='en'?'Explore guide sections':'Guide sections');
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

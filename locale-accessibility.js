/* MANZO Web Production v1.3 — multilingual accessibility layer.
   Accessible labels and browser metadata follow the selected UI language.
   The canonical page remains Spanish; this does not create language-specific SEO URLs.
   No tracking, external requests or additional dependencies. */
(() => {
  'use strict';
  const copy = {
    es: {
      home:'TORREMOLINOS — Inicio', nav:'Navegación principal', language:'Idioma de la guía',
      hero:'Costa mediterránea soleada con palmeras, mar azul y un pequeño curso de agua entre piedras',
      tools:'Buscar y escuchar Torremolinos', search:'Buscar lugares', categories:'Categorías de lugares',
      food:'Guía gastronómica', music:'Imagen ilustrativa de auriculares junto al mar para la música de LUNE_X',
      moods:'Tipos de recorrido', stops:'Paradas del recorrido', mobile:'Navegación móvil',
      skip:'Saltar al contenido',
      description:'Descubre Torremolinos a tu manera: playas, La Nogalera, gastronomía, cultura y agenda. Guarda lugares y crea tu ruta con esta guía independiente.'
    },
    en: {
      home:'TORREMOLINOS — Home', nav:'Main navigation', language:'Guide language',
      hero:'Sunny Mediterranean coast with palm trees, blue sea and a small stream flowing between stones',
      tools:'Search and listen to Torremolinos', search:'Search places', categories:'Place categories',
      food:'Dining guide', music:'Illustrative headphones by the sea for the music of LUNE_X',
      moods:'Route themes', stops:'Route stops', mobile:'Mobile navigation',
      skip:'Skip to content',
      description:'Discover Torremolinos your way: beaches, La Nogalera, dining, culture and events. Save places and plan your route with this independent guide.'
    },
    it: {
      home:'TORREMOLINOS — Inizio', nav:'Navigazione principale', language:'Lingua della guida',
      hero:'Costa mediterranea soleggiata con palme, mare azzurro e un piccolo corso d’acqua tra le pietre',
      tools:'Cerca e ascolta Torremolinos', search:'Cerca luoghi', categories:'Categorie dei luoghi',
      food:'Guida gastronomica', music:'Illustrazione di cuffie davanti al mare per la musica di LUNE_X',
      moods:'Temi del percorso', stops:'Tappe del percorso', mobile:'Navigazione mobile',
      skip:'Vai al contenuto',
      description:'Scopri Torremolinos a modo tuo: spiagge, La Nogalera, gastronomia, cultura e agenda. Salva i luoghi e crea il tuo percorso con una guida indipendente.'
    },
    de: {
      home:'TORREMOLINOS — Startseite', nav:'Hauptnavigation', language:'Sprache des Reiseführers',
      hero:'Sonnige Mittelmeerküste mit Palmen, blauem Meer und einem kleinen Bach zwischen Steinen',
      tools:'Torremolinos suchen und anhören', search:'Orte suchen', categories:'Ortskategorien',
      food:'Restaurantführer', music:'Kopfhörer am Meer als Illustration zur Musik von LUNE_X',
      moods:'Routenthemen', stops:'Stationen der Route', mobile:'Mobile Navigation',
      skip:'Zum Inhalt springen',
      description:'Entdecke Torremolinos auf deine Art: Strände, La Nogalera, Essen, Kultur und Veranstaltungen. Speichere Orte und plane deine Route.'
    },
    fr: {
      home:'TORREMOLINOS — Accueil', nav:'Navigation principale', language:'Langue du guide',
      hero:'Côte méditerranéenne ensoleillée avec palmiers, mer bleue et petit cours d’eau entre les pierres',
      tools:'Rechercher et écouter Torremolinos', search:'Rechercher des lieux', categories:'Catégories de lieux',
      food:'Guide gastronomique', music:'Illustration d’un casque au bord de la mer pour la musique de LUNE_X',
      moods:'Thèmes du parcours', stops:'Étapes du parcours', mobile:'Navigation mobile',
      skip:'Aller au contenu',
      description:'Découvrez Torremolinos à votre façon : plages, La Nogalera, gastronomie, culture et événements. Enregistrez des lieux et créez votre parcours.'
    },
    ru: {
      home:'TORREMOLINOS — Главная', nav:'Основная навигация', language:'Язык путеводителя',
      hero:'Солнечное побережье Средиземного моря с пальмами, голубым морем и небольшим ручьём среди камней',
      tools:'Поиск и музыка Торремолиноса', search:'Поиск мест', categories:'Категории мест',
      food:'Гастрономический гид', music:'Иллюстрация наушников у моря для музыки LUNE_X',
      moods:'Темы маршрута', stops:'Остановки маршрута', mobile:'Мобильная навигация',
      skip:'Перейти к содержимому',
      description:'Откройте Торремолинос по-своему: пляжи, Ла-Ногалера, кухня, культура и события. Сохраняйте места и создавайте собственный маршрут.'
    }
  };
  const labels = [
    ['.topbar .brand-logo-link','home'], ['footer .brand-logo-link','home'],
    ['.navlinks','nav'], ['#lang','language'], ['.hero-photo','hero'],
    ['.hero-tools','tools'], ['#search','search'], ['#filters','categories'],
    ['.directory-teaser','food'], ['.music-art','music'], ['#moods','moods'],
    ['#route','stops'], ['.mobilebar','mobile']
  ];
  function update(){
    const lang = (document.documentElement.lang || 'es').slice(0,2);
    const t = copy[lang] || copy.es;
    labels.forEach(([selector,key]) => {
      const element = document.querySelector(selector);
      if(element && (element.hasAttribute('aria-label') || key !== 'food')){
        element.setAttribute('aria-label',t[key]);
      }
    });
    const foodSection = document.querySelector('.directory-teaser')?.closest('section[aria-label]');
    if(foodSection) foodSection.setAttribute('aria-label',t.food);
    const skip = document.querySelector('.skip-link');
    if(skip) skip.textContent = t.skip;
    const description = document.querySelector('meta[name="description"]');
    if(description) description.setAttribute('content',t.description);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',update,{once:true});
  }else update();
  document.getElementById('lang')?.addEventListener('change',update);
})();

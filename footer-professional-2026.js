/* TORREMOLINOS · Footer localization.
   Updates visible editorial labels in ES, EN, IT, DE, FR and RU.
   No external API, analytics, cookies or changes to existing app state. */
(() => {
  'use strict';
  const translations = {
    es: {
      intro:'Torremolinos, a tu manera. Una guía independiente para descubrir lugares, sabores, eventos e historias de la Costa del Sol.',
      disclaimer:'Proyecto editorial independiente, no afiliado al Ayuntamiento de Torremolinos.',
      feedback:'Proponer una corrección',explore:'Explorar',food:'Dónde comer',events:'Agenda',listen:'Sound & Music',
      project:'Proyecto y fuentes',editorial:'Política editorial',verification:'Cómo verificamos los eventos',
      credits:'Créditos y derechos',ai:'Transparencia IA',tourism:'Turismo Torremolinos',
      information:'Información',legal:'Información legal',privacy:'Privacidad',cookies:'Cookies y preferencias',
      accessibility:'Accesibilidad',contact:'Contacto',legalStatus:'Algunas políticas informativas siguen en revisión.',
      by:'Un proyecto editorial de MANZO AI',browser:'Los favoritos y el idioma permanecen en tu navegador. Sin analítica publicitaria.',
      backTop:'Volver arriba',footerLabel:'Información del proyecto TORREMOLINOS',navLabel:'Explorar e información'
    },
    en: {
      intro:'Torremolinos, your way. An independent guide to the places, flavours, events and stories of the Costa del Sol.',
      disclaimer:'Independent editorial project, not affiliated with Torremolinos City Council.',
      feedback:'Suggest a correction',explore:'Explore',food:'Where to eat',events:'Events',listen:'Sound & Music',
      project:'Project & sources',editorial:'Editorial policy',verification:'How we verify events',
      credits:'Credits & copyright',ai:'AI transparency',tourism:'Torremolinos Tourism',
      information:'Information',legal:'Legal information',privacy:'Privacy',cookies:'Cookies & preferences',
      accessibility:'Accessibility',contact:'Contact',legalStatus:'Some legal information pages are still under review.',
      by:'An editorial project by MANZO AI',browser:'Saved places and language remain in your browser. No advertising analytics.',
      backTop:'Back to top',footerLabel:'About the TORREMOLINOS project',navLabel:'Explore and information'
    },
    it: {
      intro:'Torremolinos, a modo tuo. Una guida indipendente per scoprire luoghi, sapori, eventi e storie della Costa del Sol.',
      disclaimer:'Progetto editoriale indipendente, non affiliato al Comune di Torremolinos.',
      feedback:'Proponi una correzione',explore:'Esplora',food:'Mangiare',events:'Agenda',listen:'Sound & Music',
      project:'Progetto e fonti',editorial:'Politica editoriale',verification:'Come verifichiamo gli eventi',
      credits:'Crediti e diritti',ai:'Trasparenza IA',tourism:'Turismo Torremolinos',
      information:'Informazioni',legal:'Note legali',privacy:'Privacy',cookies:'Cookie e preferenze',
      accessibility:'Accessibilità',contact:'Contatti',legalStatus:'Alcune informative sono ancora in revisione.',
      by:'Un progetto editoriale MANZO AI',browser:'Preferiti e lingua restano nel tuo browser. Nessuna analitica pubblicitaria.',
      backTop:'Torna all’inizio',footerLabel:'Informazioni sul progetto TORREMOLINOS',navLabel:'Esplora e informazioni'
    },
    de: {
      intro:'Torremolinos auf deine Art. Ein unabhängiger Reiseführer zu Orten, Genüssen, Veranstaltungen und Geschichten der Costa del Sol.',
      disclaimer:'Unabhängiges redaktionelles Projekt, nicht mit der Stadtverwaltung Torremolinos verbunden.',
      feedback:'Korrektur vorschlagen',explore:'Entdecken',food:'Essen & Trinken',events:'Veranstaltungen',listen:'Musik',
      project:'Projekt & Quellen',editorial:'Redaktionsrichtlinien',verification:'So prüfen wir Veranstaltungen',
      credits:'Bildnachweise & Rechte',ai:'KI-Transparenz',tourism:'Tourismus Torremolinos',
      information:'Informationen',legal:'Rechtliche Hinweise',privacy:'Datenschutz',cookies:'Cookies & Einstellungen',
      accessibility:'Barrierefreiheit',contact:'Kontakt',legalStatus:'Einige Rechtstexte werden noch überprüft.',
      by:'Ein redaktionelles Projekt von MANZO AI',browser:'Gespeicherte Orte und Sprache bleiben in deinem Browser. Keine Werbeanalysen.',
      backTop:'Nach oben',footerLabel:'Informationen über das Projekt TORREMOLINOS',navLabel:'Entdecken und Informationen'
    },
    fr: {
      intro:'Torremolinos à votre façon. Un guide indépendant des lieux, saveurs, événements et histoires de la Costa del Sol.',
      disclaimer:'Projet éditorial indépendant, sans affiliation à la mairie de Torremolinos.',
      feedback:'Proposer une correction',explore:'Explorer',food:'Où manger',events:'Agenda',listen:'Musique',
      project:'Projet et sources',editorial:'Politique éditoriale',verification:'Comment nous vérifions les événements',
      credits:'Crédits et droits',ai:'Transparence IA',tourism:'Tourisme Torremolinos',
      information:'Informations',legal:'Mentions légales',privacy:'Confidentialité',cookies:'Cookies et préférences',
      accessibility:'Accessibilité',contact:'Contact',legalStatus:'Certaines informations juridiques sont encore en cours de révision.',
      by:'Un projet éditorial de MANZO AI',browser:'Vos favoris et votre langue restent dans votre navigateur. Aucune analyse publicitaire.',
      backTop:'Retour en haut',footerLabel:'À propos du projet TORREMOLINOS',navLabel:'Explorer et informations'
    },
    ru: {
      intro:'Торремолинос по-вашему. Независимый гид по местам, вкусам, событиям и историям Коста-дель-Соль.',
      disclaimer:'Независимый редакционный проект, не связанный с администрацией Торремолиноса.',
      feedback:'Предложить исправление',explore:'Исследовать',food:'Где поесть',events:'События',listen:'Музыка',
      project:'Проект и источники',editorial:'Редакционная политика',verification:'Как мы проверяем события',
      credits:'Авторские права и источники',ai:'Прозрачность ИИ',tourism:'Туризм Торремолинос',
      information:'Информация',legal:'Правовая информация',privacy:'Конфиденциальность',cookies:'Cookie и настройки',
      accessibility:'Доступность',contact:'Контакты',legalStatus:'Некоторые правовые документы ещё проходят проверку.',
      by:'Редакционный проект MANZO AI',browser:'Избранное и язык сохраняются в вашем браузере. Без рекламной аналитики.',
      backTop:'Наверх',footerLabel:'О проекте TORREMOLINOS',navLabel:'Разделы и информация'
    }
  };
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  function update() {
    const raw=(document.documentElement.lang || 'es').slice(0,2);
    const t=translations[raw] || translations.es;
    footer.querySelectorAll('[data-footer]').forEach(el=>{
      const k=el.getAttribute('data-footer');
      if(Object.prototype.hasOwnProperty.call(t,k)) el.textContent=t[k];
    });
    footer.setAttribute('aria-label',t.footerLabel);
    const nav=footer.querySelector('.footer-pro-columns');
    if(nav)nav.setAttribute('aria-label',t.navLabel);
    const brand=footer.querySelector('.footer-pro-brandlink');
    if(brand)brand.setAttribute('aria-label','TORREMOLINOS — '+t.backTop);
  }
  const init=()=>{
    update();
    new MutationObserver(update).observe(document.documentElement,{
      attributes:true,attributeFilter:['lang']
    });
    document.getElementById('lang')?.addEventListener('change',()=>queueMicrotask(update));
  };
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else init();
})();

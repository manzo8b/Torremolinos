/* TORREMOLINOS V7 — tactile controls, consistent arrows, guided mobile discovery.
   No network access, no tracking, no timers, no external dependencies. */
(function(){
  'use strict';
  const motionReduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  const labelCopy={
    it:{rail:'Scorri le schede per scoprire i luoghi',previous:'Luoghi precedenti',next:'Luoghi successivi'},
    es:{rail:'Desliza las tarjetas para descubrir lugares',previous:'Lugares anteriores',next:'Más lugares'},
    en:{rail:'Swipe through the cards to discover places',previous:'Previous places',next:'Next places'},
    fr:{rail:'Faites glisser les cartes pour découvrir les lieux',previous:'Lieux précédents',next:'Lieux suivants'},
    de:{rail:'Wische durch die Karten und entdecke Orte',previous:'Vorherige Orte',next:'Nächste Orte'},
    ru:{rail:'Листай карточки, чтобы открывать новые места',previous:'Предыдущие места',next:'Следующие места'}
  };
  const lang=()=>labelCopy[document.documentElement.lang?.slice(0,2)]||labelCopy.es;
  let queued=false;
  const main=document.querySelector('main');
  function arrowTarget(el){
    if(el.classList.contains('v7-action-arrow'))return false;
    if(el.closest('nav,.navlinks,.mobilebar,.topbar,footer'))return false;
    if(el.children.length!==0)return false;
    if(el.matches('.route-control,.heart,.mood-btn,[data-filter],[data-cat],#resetPlan,#sharePlan,#loadMap,#mapStart'))return false;
    const str=(el.textContent||'').trim();
    if(!str||str.length>110)return false;
    const explicit=el.matches('.hero-cta-row a,.hero-actions a,.editorial-bridge-action,.agenda-home-btn,.gallery-feature-body a,.nogalera-feature-copy a,.magazine-link,.gallery-promo-link a,.community a,.plan-explore-link,.plan-map-link');
    return explicit||/[↗→]\s*$/.test(str);
  }
  function decorateActions(){
    queued=false;
    if(!main)return;
    main.querySelectorAll('a,button,.directory-teaser b,.readmore').forEach(el=>{
      if(!arrowTarget(el))return;
      if(el.querySelector('.v7-action-arrow'))return;
      const text=(el.textContent||'').replace(/\s*[↗→]\s*$/u,'').trim();
      if(!text)return;
      el.textContent=text;
      const arrow=document.createElement('span');
      arrow.className='v7-action-arrow';
      arrow.setAttribute('aria-hidden','true');
      arrow.textContent='↗';
      el.appendChild(arrow);
      el.classList.add('v7-action');
    });
  }
  function requestDecorate(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(decorateActions);
  }
  function init(){
    if(!main)return;
    decorateActions();
    // Language engines replace the text of localised controls; restore one exact arrow.
    const observer=new MutationObserver(requestDecorate);
    observer.observe(main,{childList:true,subtree:true,characterData:true});
    const cards=document.getElementById('cards');
    const explore=document.getElementById('explore');
    if(cards&&explore){
      cards.setAttribute('tabindex','0');
      cards.setAttribute('role','region');
      const hint=document.createElement('div');
      hint.className='v7-rail-note';
      hint.innerHTML='<span class="v7-rail-icon" aria-hidden="true">↔</span><span class="v7-rail-copy"></span>';
      cards.parentNode.insertBefore(hint,cards);
      const controls=document.createElement('div');
      controls.className='v7-rail-controls';
      const prev=document.createElement('button');
      prev.type='button';prev.className='v7-rail-prev';
      prev.textContent='←';
      const next=document.createElement('button');
      next.type='button';next.className='v7-rail-next';
      next.textContent='→';
      controls.append(prev,next);
      cards.after(controls);
      function translate(){
        const c=lang();
        hint.querySelector('.v7-rail-copy').textContent=c.rail;
        cards.setAttribute('aria-label',c.rail);
        prev.setAttribute('aria-label',c.previous);
        next.setAttribute('aria-label',c.next);
      }
      function updateArrows(){
        const max=cards.scrollWidth-cards.clientWidth;
        prev.disabled=cards.scrollLeft<8;
        next.disabled=cards.scrollLeft>=max-8;
      }
      const move=(dir)=>{
        const amount=Math.max(250,Math.floor(cards.clientWidth*.86));
        cards.scrollBy({left:amount*dir,behavior:motionReduce?.matches?'auto':'smooth'});
      };
      prev.addEventListener('click',()=>move(-1));
      next.addEventListener('click',()=>move(1));
      cards.addEventListener('scroll',updateArrows,{passive:true});
      cards.addEventListener('keydown',ev=>{
        if(ev.target!==cards||!['ArrowLeft','ArrowRight'].includes(ev.key))return;
        ev.preventDefault();move(ev.key==='ArrowLeft'?-1:1);
      });
      new MutationObserver(updateArrows).observe(cards,{childList:true});
      window.addEventListener('resize',updateArrows,{passive:true});
      document.addEventListener('change',ev=>{
        if(ev.target.matches('#lang,.language select,select[name=lang]'))translate();
      });
      new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
      translate();updateArrows();
    }
    const header=document.querySelector('.topbar');
    if(header){
      const track=document.createElement('div');track.className='v7-reading-track';
      track.setAttribute('aria-hidden','true');
      const bar=document.createElement('span');bar.className='v7-reading-bar';
      track.appendChild(bar);header.appendChild(track);
      let scheduled=false;
      function update(){
        scheduled=false;
        const total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
        const ratio=Math.min(1,Math.max(0,window.scrollY/total));
        bar.style.transform='scaleX('+ratio+')';
      }
      function requestUpdate(){
        if(scheduled)return;
        scheduled=true;requestAnimationFrame(update);
      }
      window.addEventListener('scroll',requestUpdate,{passive:true});
      window.addEventListener('resize',requestUpdate,{passive:true});
      update();
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

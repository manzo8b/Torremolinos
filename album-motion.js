/* Progressive chapter motion: native scrolling remains fully controllable. */
(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sections=[...document.querySelectorAll('main > section,main > .gallery-grid,main > .filterbar')];
if(!reduced.matches&&'IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('chapter-visible');observer.unobserve(target)}}),{threshold:.06});
 sections.forEach(el=>{el.classList.add('chapter');observer.observe(el)});
 // Fail open if an observer callback is interrupted.
 setTimeout(()=>sections.forEach(el=>el.classList.add('chapter-visible')),4000);
}
})();

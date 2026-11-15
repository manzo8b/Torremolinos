/* Luminosity v8 — Apple-style response with conservative, interruptible pointer feedback.
   No additional dependencies, analytics, sounds, synthetic content or autoplay. */
(()=>{'use strict';
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(!fine.matches||reduced.matches)return;
 const query='body.torre-home #explore .place,body.torre-home #stories .magazine-card,body.torre-home #useful .infocard,body.torre-home #photodiary .photo-diary-grid figure,body.torre-comer .card,body.torre-comer .other,body[data-coast="blue"] .gallery-card,body[data-coast="sand"] .story-card';
 const updating=new WeakMap();
 const apply=(node,e)=>{
   let frame=updating.get(node);
   if(frame)cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
     const rect=node.getBoundingClientRect();
     if(!rect.width||!rect.height)return;
     const x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
     const y=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
     node.style.setProperty('--l8-rx',((.5-y)*2.6).toFixed(2)+'deg');
     node.style.setProperty('--l8-ry',((x-.5)*2.6).toFixed(2)+'deg');
     updating.delete(node);
   });
   updating.set(node,frame);
 };
 const reset=(node)=>{
   const frame=updating.get(node);
   if(frame)cancelAnimationFrame(frame);
   updating.delete(node);
   node.style.setProperty('--l8-rx','0deg');
   node.style.setProperty('--l8-ry','0deg');
 };
 document.addEventListener('pointermove',e=>{
   if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
   const target=e.target.closest?.(query);
   if(target)apply(target,e);
 },{passive:true});
 document.addEventListener('pointerout',e=>{
   const card=e.target.closest?.(query);
   if(card&&!card.contains(e.relatedTarget))reset(card);
 },{passive:true});
 window.addEventListener('blur',()=>{
   document.querySelectorAll(query).forEach(reset);
 },{passive:true});
})();

/* TORREMOLINOS | incremental punctuation maintenance.
   Initial sweep once; only changed/inserted headings are queued thereafter. */
(function(){
 'use strict';
 var selector='h1,h2,h3,h4,h5,h6',pending=new Set(),scheduled=false;
 function cleanHeading(heading){
   var walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),last=null,node;
   while((node=walker.nextNode()))if(node.nodeValue.trim())last=node;
   if(!last)return;
   var fixed=last.nodeValue.replace(/[.．]+\s*$/u,'');
   if(fixed!==last.nodeValue)last.nodeValue=fixed;
 }
 function flush(){
   scheduled=false;
   var headings=Array.from(pending);pending.clear();
   headings.forEach(function(h){if(h.isConnected)cleanHeading(h)});
 }
 function queue(h){if(h)pending.add(h)}
 function nearby(node){
   var el=node.nodeType===1?node:node.parentElement;
   if(el&&el.closest)queue(el.closest(selector));
 }
 function added(node){
   if(node.nodeType!==1)return;
   if(node.matches(selector))queue(node);
   node.querySelectorAll(selector).forEach(queue);
 }
 function init(){
   document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(cleanHeading);
   if(!document.body||!('MutationObserver' in window))return;
   var observer=new MutationObserver(function(changes){
     changes.forEach(function(change){
       nearby(change.target);
       if(change.type==='childList')change.addedNodes.forEach(added);
     });
     if(!pending.size||scheduled)return;
     scheduled=true;
     if('requestAnimationFrame' in window)requestAnimationFrame(flush);
     else Promise.resolve().then(flush);
   });
   observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

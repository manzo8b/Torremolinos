/* TORREMOLINOS | typography and a11y maintenance
   A product-level invariant: headings NEVER finish with a full stop.
   Works after language changes and after dynamically generated cards arrive.
   No content network requests, storage, tracking or third-party dependencies. */
(function(){
  'use strict';
  var scheduled=false;
  function cleanHeading(heading){
    var walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    var last=null,node;
    while((node=walker.nextNode())){if(node.nodeValue.trim())last=node;}
    if(!last)return;
    var fixed=last.nodeValue.replace(/[.．]+\s*$/u,'');
    if(fixed!==last.nodeValue)last.nodeValue=fixed;
  }
  function cleanAll(){
    scheduled=false;
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(cleanHeading);
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    if('requestAnimationFrame' in window)requestAnimationFrame(cleanAll);
    else Promise.resolve().then(cleanAll);
  }
  function init(){
    cleanAll();
    var root=document.querySelector('main')||document.body;
    if(root && 'MutationObserver' in window){
      var observer=new MutationObserver(function(changes){
        if(changes.some(function(change){return change.type==='childList'||change.type==='characterData';}))schedule();
      });
      observer.observe(root,{subtree:true,childList:true,characterData:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

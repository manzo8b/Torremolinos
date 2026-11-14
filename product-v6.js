/* Torremolinos Product v6 — resilient promotional media without broken images */
(function(){
  'use strict';
  function init(){
    const image=document.querySelector('.music-album-art');
    const fallback=document.querySelector('.music-album-fallback');
    if(!image||!fallback)return;
    function showFallback(){
      if(image.naturalWidth>0)return;
      image.hidden=true;
      image.style.display='none';
      fallback.hidden=false;
    }
    image.addEventListener('error',showFallback,{once:true});
    if(image.complete && image.naturalWidth===0)showFallback();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else init();
})();

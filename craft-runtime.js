/*
TORREMOLINOS / progressive media fallback
A remotely hosted article/album image must never turn a magazine card into an
empty panel. Replace failures with an existing local archive image and correct
the credit to say "illustrative", without pretending the photograph shows the
specific venue. No analytics, trackers or external dependencies.
*/
(function(){
 'use strict';
 var fallback=[
  {selector:'.magazine-card[href*="la-nogalera"] .cover img',source:'assets/photos/album/plaza.webp'},
  {selector:'.magazine-card[href*="pasaje-begona"] .cover img',source:'assets/photos/paseo-centro.webp'},
  {selector:'.magazine-card.primary .cover img',source:'assets/photos/costa-torremolinos.webp'},
  {selector:'.photo-diary-grid #photoDiary2',source:'assets/photos/album/plaza.webp'},
  {selector:'.music-album-art',source:'assets/photos/album/palmeras-sol.webp'}
 ];
 var fallbackText={
  it:'Immagine illustrativa · Archivio Torremolinos',
  es:'Imagen ilustrativa · Archivo Torremolinos',
  en:'Illustrative archive photograph · Torremolinos',
  de:'Archivbild zur Illustration · Torremolinos',
  fr:"Photo d'archive illustrative · Torremolinos",
  ru:'Иллюстративное архивное фото · Торремолинос'
 };
 function label(){
  var selector=document.getElementById('lang');
  var language=selector&&selector.value||document.documentElement.lang||'es';
  return fallbackText[language]||fallbackText.es;
 }
 function installFallback(entry){
  var img=document.querySelector(entry.selector);
  if(!img)return;
  function recover(){
   if(img.dataset.fallbackUsed==='true')return;
   img.dataset.fallbackUsed='true';
   img.alt=label();
   img.src=entry.source;
   var frame=img.closest('.cover,.music-art,figure');
   var credit=frame&&frame.querySelector('.photoattribution,.photoattribution small,figcaption small,.music-art small');
   if(credit)credit.textContent=label();
  }
  img.addEventListener('error',recover);
  if(img.complete&&img.naturalWidth===0)recover();
 }
 function init(){
  fallback.forEach(installFallback);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();

/* Static localized Stories indices. Explicit URL is authoritative; no automatic locale redirect. */
(()=>{'use strict';
 const langs=['es','en','it','de','fr','ru'], current=document.documentElement.lang;
 const select=document.getElementById('lang');
 const target=lang=>new URL(lang==='es'?'./':lang+'.html',location.href);
 function go(lang,replace=false){
   if(!langs.includes(lang))return;
   try{localStorage.setItem('torremolinos.lang',lang)}catch{}
   const url=target(lang);if(replace)location.replace(url.href);else location.assign(url.href);
 }
 const requested=new URLSearchParams(location.search).get('lang');
 if(langs.includes(requested)&&requested!==current){go(requested,true);return}
 if(select){select.value=current;select.addEventListener('change',()=>go(select.value))}
})();

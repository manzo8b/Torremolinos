import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = p => fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const home=read("index.html");
const craft=read("craft-finish.css");
const runtime=read("craft-runtime.js");
const sw=read("service-worker.js");
const pages=["index.html","agenda/index.html","comer/index.html","gallery/index.html","listen/index.html","stories/index.html","explore/la-nogalera/index.html"];

function colorLuminance(hex){
 const channels=hex.match(/[a-fA-F0-9]{2}/g).map(x=>parseInt(x,16)/255);
 const c=channels.map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
 return c[0]*.2126+c[1]*.7152+c[2]*.0722;
}
function contrast(a,b){
 const x=colorLuminance(a),y=colorLuminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
test("the site keeps no dark footer and uses the correct wordmark",()=>{
 for(const page of pages){
  const s=read(page);
  assert.match(s,/craft-finish\.css/,"craft stylesheet missing from "+page);
  assert.doesNotMatch(s,/torremolinos-logo-light\.svg/,"light logo on white footer: "+page);
  assert.ok(s.indexOf("craft-finish.css")>s.indexOf("apple-premium.css"),"wrong CSS cascade order: "+page);
 }
 assert.match(craft,/body\.torre-home \.footer\{[\s\S]*?background:var\(--craft-white\)!important/);
 assert.match(craft,/body\[data-coast\]:not\(\.torre-home\) :is\(\.footer,\.foot,\.bottom\)/);
});
test("headings never end with full stops, even after language changes",()=>{
 const runtime=read("apple-runtime.js");
 assert.match(runtime,/querySelectorAll\('h1,h2,h3,h4,h5,h6'\)/);
 assert.match(runtime,/MutationObserver/);
 assert.match(runtime,/replace\(\/\[\.．\]\+/);
 for(const page of pages){
  const h=read(page);
  for(const m of h.matchAll(/<h[1-6]\b[^>]*>([^<]*)<\/h[1-6]>/gi)){
   assert.doesNotMatch(m[1],/[.．]\s*$/u,page+" heading: "+m[1]);
  }
 }
});
test("safely compiled interactive scripts and progressive image fallback",()=>{
 new vm.Script(runtime,{filename:"craft-runtime.js"});
 assert.match(home,/craft-runtime\.js/);
 const scripts=[...home.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(x=>x[1]).filter(x=>x.trim()&&!x.trim().startsWith('{"@context"'));
 assert.ok(scripts.length>0);
 scripts.forEach((s,i)=>new vm.Script(s,{filename:"inline-"+i+".js"}));
 assert.match(runtime,/dataset\.fallbackUsed/);
 assert.match(runtime,/Immagine illustrativa/);
});
test("real catalog images are lazy, locally hosted and transparently decorative",()=>{
 const data=home.slice(home.indexOf("var placePhoto={"),home.indexOf("function render(){"));
 for(const id of ["nogalera","bajondillo","carihuela","pasaje","playamar","alamos","bateria","pimentel","sanmiguel","c1"])
  assert.match(data,new RegExp("\\b"+id+":\\["));
 assert.match(home,/photo\.loading='lazy'/);
 assert.match(home,/photo\.alt=''/);
 assert.match(home,/photo\.addEventListener\('error'/);
 for(const asset of [
  "assets/photos/album/plaza.webp","assets/photos/el-bajondillo-letrero.webp",
  "assets/photos/album/espetos.webp","assets/photos/paseo-centro.webp",
  "assets/photos/playa-palmeras-panorama.webp","assets/photos/paseo-palmeras.webp",
  "assets/photos/album/barca-flores.webp","assets/photos/album/estacion.webp"
 ])assert.ok(fs.existsSync(new URL("../"+asset,import.meta.url)),asset+" missing");
});
test("brand colors provide AA contrast for normal text",()=>{
 assert.ok(contrast("#16865A","#FFFFFF")>=4.5,"white-on-green must pass AA");
 assert.ok(contrast("#F58A17","#111111")>=4.5,"orange-on-black text must pass AA");
 assert.ok(contrast("#FFFFFF","#111111")>=4.5,"ink text on white must pass AA");
 assert.match(craft,/background:var\(--craft-white\)!important/);
 assert.match(craft,/background:var\(--craft-green\)!important/);
});
test("app keeps native focus, reduced motion, and tactile hit targets",()=>{
 assert.match(craft,/:focus-visible/);
 assert.match(craft,/prefers-reduced-motion:reduce/);
 assert.match(craft,/prefers-reduced-transparency:reduce/);
 assert.match(craft,/prefers-contrast:more/);
 assert.match(craft,/width:44px!important;height:44px!important/);
 assert.match(craft,/grid-template-columns:1fr!important/);
});
test("PWA revs its version and caches the finishing assets",()=>{
 assert.match(sw,/torremolinos-v35/);
 assert.match(sw,/\.\/craft-finish\.css/);
 assert.match(sw,/\.\/craft-runtime\.js/);
});


test("all legal and published editorial footers inherit the white visual contract",()=>{
  const extra=[
    "legal/index.html","legal/privacy-policy.html","legal/cookie-policy.html",
    "legal/terms-of-use.html","legal/contact.html","legal/accessibility.html",
    "legal/editorial-policy.html","legal/event-source-policy.html",
    "legal/ai-transparency.html","legal/copyright-credits.html",
    "stories/torremolinos-mucho-mas-que-sol-y-playa.html",
    "stories/la-nogalera-donde-la-noche-tiene-historia.html",
    "stories/pasaje-begona-memoria-de-libertad.html",
    "stories/san-miguel-la-fiesta-que-saca-torremolinos-a-la-calle.html"
  ];
  for(const path of extra){
    const source=read(path);
    assert.match(source,/craft-finish\.css/,path+" light stylesheet missing");
    assert.match(source,/apple-runtime\.js/,path+" heading normalization missing");
    assert.match(source,/data-coast=/,path+" no body theme binding");
  }
});

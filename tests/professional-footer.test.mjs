import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../'+path, import.meta.url),'utf8');
const home=read('index.html');
const css=read('footer-professional-2026.css');
const js=read('footer-professional-2026.js');
const sw=read('service-worker.js');
const markup=home.match(/<footer class="footer footer-pro"[^>]*>[\s\S]*?<\/footer>/)?.[0];

test('Home footer is one clearly structured landmark, not the legacy unordered link dump',()=>{
 assert.ok(markup,'professional footer not found');
 assert.equal((home.match(/id="site-footer"/g)||[]).length,1);
 assert.equal((home.match(/id="year"/g)||[]).length,1);
 assert.equal((markup.match(/class="footer-pro-column"/g)||[]).length,3);
 assert.ok(markup.includes('class="footer-pro-brand"'));
 assert.ok(markup.includes('class="shell footer-pro-bottom"'));
 assert.ok(markup.includes('class="footer-pro-legal-status"'));
 assert.doesNotMatch(markup,/(?:v0\.6|footerinner|v06-footer-links|style="padding)/);
 assert.match(markup,/aria-label="Esplora e informazioni"/);
});
test('Every footer destination uses a real published route or a documented source',()=>{
 for(const url of [
  'comer/','agenda/','gallery/','stories/','explore/la-nogalera/','listen/',
  'legal/','legal/editorial-policy.html','legal/event-source-policy.html',
  'legal/copyright-credits.html','legal/ai-transparency.html','legal/privacy-policy.html',
  'legal/cookie-policy.html','legal/accessibility.html','legal/contact.html',
  'https://turismotorremolinos.es/es/','https://www.renfe.com/es/es/cercanias/cercanias-malaga',
  'https://github.com/manzo8b/Torremolinos/issues/new'
 ])assert.ok(markup.includes('href="'+url+'"'),url);
 assert.doesNotMatch(markup,/(?:mailto:|tel:|VAT|P\.IVA|partita IVA)/i);
 assert.match(markup,/target="_blank" rel="noopener noreferrer"/);
});
test('No invented legal identity; unpublished legal pages remain labelled under review',()=>{
 assert.match(markup,/data-footer="legalStatus"/);
 assert.match(markup,/data-footer="disclaimer"/);
 assert.match(markup,/id="year"/);
 assert.doesNotMatch(markup,/(?:sede legale|registered office|numero di partita|©.*v0\.6)/i);
});
test('Six localization maps update all footer keys without altering the rest of the app',()=>{
 new vm.Script(js,{filename:'footer-professional-2026.js'});
 const languages=['es','en','it','de','fr','ru'];
 for(const code of languages)assert.match(js,new RegExp('\\b'+code+':\\s*\\{'));
 assert.match(js,/MutationObserver/);
 assert.match(js,/attributeFilter:\['lang'\]/);
 assert.match(js,/data-footer/);
 const keys=[...markup.matchAll(/data-footer="([^"]+)"/g)].map(x=>x[1]);
 for(const key of keys){
  assert.ok(js.includes(key+':'),key+' translation missing');
 }
});
test('Navy Home footer works on mobile and is cached offline',()=>{
 assert.match(css,/body\.torre-home footer\.footer\.footer-pro/);
 assert.match(css,/background:var\(--ac-ink,#10244B\)!important/);
 assert.match(markup,/data-footer="feedback">Invia un suggerimento/);
 assert.match(css,/#096BCB/);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.match(css,/focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(css,/background:\s*#F58A17/i);
 for(const name of ['footer-professional-2026.css','footer-professional-2026.js']) {
  assert.ok(home.includes(name),name+' missing from Home');
  assert.ok(sw.includes('./'+name),name+' missing from service worker cache');
 }
 assert.match(sw,/torremolinos-v33/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const home=read('index.html');
const agendaHtml=read('agenda/index.html');
const agendaJS=read('agenda/app.js');
const scanJS=read('agenda/scan-status-ui.js');
const scan=JSON.parse(read('agenda/scan-status.json'));
const events=JSON.parse(read('agenda/events.json'));
const comerData=read('comer/data.js');
const comerJS=read('comer/app.js');
const sw=read('service-worker.js');
const readme=read('README.md');

test('C-09 scanner snapshot is anchored to real successful action with source failures explicitly disclosed',()=>{
 assert.equal(scan.schemaVersion,1);
 assert.equal(scan.scanner.runId,45235268131);
 assert.equal(scan.scanner.checkedAtUTC,'2026-11-23T18:09:18Z');
 assert.equal(scan.scanner.runUrl,'https://github.com/manzo8b/Torremolinos/actions/runs/45235268131');
 assert.equal(scan.scanner.conclusion,'success');
 assert.equal(scan.scanner.sources.madbear.access,'reachable');
 assert.equal(scan.scanner.sources.infinity.httpStatus,202);
 assert.equal(scan.scanner.sources.acogat.httpStatus,202);
 assert.equal(scan.scanner.sources.infinity.access,'unverified');
 assert.equal(scan.scanner.sources.acogat.access,'unverified');
 assert.equal(scan.editorial.verifiedThrough,events.editorialUpdated);
 assert.equal(scan.editorial.reviewRequired,true);
 assert.notEqual(scan.scanner.checkedAtUTC.slice(0,10),events.editorialUpdated);
 const checked=(Date.parse(scan.scanner.checkedAtUTC)-Date.parse(events.editorialUpdated+'T00:00:00Z'))/86400000;
 assert.ok(checked>14,'Editorial review age warning should be active');
});
test('C-13 localized scanner and editorial status appears in both Home and Agenda',()=>{
 new vm.Script(scanJS,{filename:'agenda/scan-status-ui.js'});
 assert.match(home,/id="agendaHomeScanStatus"/);
 assert.match(agendaHtml,/id="agendaPageScanStatus"/);
 for(const page of [home,agendaHtml])assert.match(page,/scan-status-ui\.js/);
 for(const key of ['es','en','it','de','fr','ru'])assert.match(scanJS,new RegExp('\\b'+key+':\\{'));
 assert.match(scanJS,/14\*86400\*1000/);
 assert.match(scanJS,/status\.editorial\.verifiedThrough/);
 assert.match(scanJS,/status\.scanner\.checkedAtUTC/);
 assert.match(scanJS,/document\.documentElement\.lang/);
 assert.match(scanJS,/No se puede consultar|temporarily unavailable/);
 assert.match(agendaJS,/renderCatalogueStatus/);
 assert.match(agendaJS,/catalogCount/);
 assert.doesNotMatch(agendaJS,/fichas con fecha · '\+watch\.length\+' bajo seguimiento/);
});
test('C-14 homepage lead represents actual LGBTQ-majority dataset rather than a predominantly cultural calendar',()=>{
 assert.equal(events.events.length,27);
 assert.equal(events.events.filter(e=>e.kind==='lgbtq').length,24);
 assert.equal(events.events.filter(e=>e.kind==='general').length,3);
 const begin=home.indexOf('var nextStageStrings=');
 assert.ok(begin>0);
 const block=home.slice(begin,begin+5400);
 assert.equal((block.match(/"agendaLead":/g)||[]).length,6);
 for(const frag of ['LGBTQ+','Pride','ЛГБТК'])assert.ok(block.includes(frag),frag);
});
test('C-03 gallery AI label is hidden with original photo, visible only on AI image load',()=>{
 assert.match(home,/galleryTeaserProvenance" class="ai-badge" hidden/);
 assert.match(home,/teaserLabel\.hidden=false/);
 assert.match(home,/teaserLabel\.hidden=true/);
 assert.match(home,/teaser\.dataset\.isAI='true'/);
 assert.match(home,/teaser\.dataset\.isAI='false'/);
 assert.match(read('approved-clean-2026.css'),/#galleryTeaserProvenance\[hidden\]\{display:none!important\}/);
});
test('C-11 all current Comer entries carry a dated source with localized display in both list types',()=>{
 const ids=[...comerData.matchAll(/\bid:"([^"]+)"/g)].map(m=>m[1]);
 const dates=[...comerData.matchAll(/\bverified:"(\d{4}-\d{2}-\d{2})"/g)].map(m=>m[1]);
 const sources=[...comerData.matchAll(/\bsource:"(https:[^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,9);assert.equal(new Set(ids).size,ids.length);
 assert.equal(dates.length,ids.length);
 assert.equal(sources.length,ids.length);
 for(const date of dates)assert.match(date,/^2026-11-02$/);
 for(const url of sources)assert.ok(url.startsWith('https://'));
 assert.match(comerJS,/function verifiedLabel\(r\)/);
 assert.match(comerJS,/new Intl\.DateTimeFormat\(locale/);
 assert.equal((comerJS.match(/verifiedLabel\(r\)/g)||[]).length,3); // helper + two card renderers
});
test('Already implemented C-15/C-20 functions are preserved, not falsely reported as new',()=>{
 assert.match(agendaJS,/function icsUrl\(e\)/);
 assert.match(agendaJS,/DTSTART;VALUE=DATE/);
 assert.match(read('listen/index.html'),/controls preload="none"/);
 assert.ok(readme.includes('ultima revisione **umana**'),'README must distinguish human review');
 assert.match(read('footer-professional-2026.js'),/Un progetto editoriale MANZO AI/);
});
test('PWA caches new same-origin editorial evidence and never overwrites other projects',()=>{
 assert.match(sw,/torremolinos-v29/);
 assert.match(sw,/\.\/agenda\/scan-status\.json/);
 assert.match(sw,/\.\/agenda\/scan-status-ui\.js/);
 assert.match(sw,/key\.startsWith\(CACHE_PREFIX\)/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const context={window:{}};
vm.runInNewContext(read('explore/la-nogalera/data.js'),context);
const {venues,translations}=context.window.TORREMOLINOS_NOGALERA;
test('C19 preserves 16 records, discloses evidence strength and excludes four pending records',()=>{
 assert.equal(venues.length,16);
 const listed=venues.filter(v=>v.publicationStatus==='listed');
 assert.equal(listed.length,12);
 for(const [kind,n] of [['operator',6],['directory',2],['map_search',4]])assert.equal(listed.filter(v=>v.evidenceKind===kind).length,n);
 for(const v of venues){
  assert.equal(v.reviewed,'2026-11-02');
  if(v.evidenceKind==='operator')assert.equal(v.evidence,v.official);
  if(v.evidenceKind==='map_search'){assert.ok(v.evidence.startsWith('https://www.google.com/maps/search/'));assert.equal(v.official,null);}
  if(v.publicationStatus==='pending_review'){assert.equal(v.evidenceKind,'none');assert.equal(v.evidence,null);}
 }
});
test('C19 provenance and accessible labels are localized in six languages',()=>{
 for(const lang of ['es','en','it','de','fr','ru'])for(const key of ['recordDate','sourceOperator','sourceDirectory','sourceMapSearch','recordLimit','filterGroup','languageLabel','agenda','navigationLabel','updated'])assert.ok(translations[lang][key],lang+' '+key);
 const app=read('explore/la-nogalera/app.js');
 assert.ok(app.includes('date.dateTime=v.reviewed'));
 assert.ok(app.includes('venue-provenance'));
});
test('Unapproved legal policies remain unapproved',()=>{
 const c={window:{}};vm.runInNewContext(read('legal/data.js'),c);
 for(const id of ['privacy-policy','cookie-policy','terms-of-use','accessibility','contact'])assert.equal(c.window.TORREMOLINOS_LEGAL[id].approved,false);
});

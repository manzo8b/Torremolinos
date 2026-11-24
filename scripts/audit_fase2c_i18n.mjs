#!/usr/bin/env node
/* Fase 2C — static coverage audit, not native-language validation. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const home=read('index.html');
const languages=['es','en','it','de','fr','ru'];
function extractObject(src,marker){
 const at=src.indexOf(marker);
 if(at<0)throw Error('Missing '+marker);
 const start=src.indexOf('{',at+marker.length);
 if(start<0)throw Error('Object opening missing '+marker);
 let depth=0,quote='',escape=false,line=false,block=false;
 for(let i=start;i<src.length;i++){
  const c=src[i],next=src[i+1];
  if(line){if(c==='\n')line=false;continue}
  if(block){if(c==='*'&&next==='/'){block=false;i++}continue}
  if(quote){
   if(escape){escape=false;continue}
   if(c==='\\'){escape=true;continue}
   if(c===quote)quote='';
   continue;
  }
  if(c==='/'&&next==='/'){line=true;i++;continue}
  if(c==='/'&&next==='*'){block=true;i++;continue}
  if(c==='"'||c==="'"||c==='\x60'){quote=c;continue}
  if(c==='{')depth++;
  if(c==='}'&&--depth===0)return src.slice(start,i+1);
 }
 throw Error('Unterminated '+marker);
}
const dataObjects={};
for(const name of ['base','other','editorialStrings','photoDiaryStrings','nextStageStrings',
 'foodHomeTranslations','v06HomeStrings','editorialCopy']){
 dataObjects[name]=vm.runInNewContext('('+extractObject(home,'var '+name+'=')+')',{});
}
const context={window:{}};
vm.runInNewContext(read('gallery/data.js'),context);
const gallery=context.window.TORREMOLINOS_GALLERY;
if(!gallery)throw Error('Missing Gallery dataset');
const keys=[...new Set([...home.matchAll(/data-t="([^"]+)"/g)].map(m=>m[1]))].sort();
const essentials=['airportTitle','airportText','airportLink','airportChecked','emergencyTitle',
 'emergencyText','emergencyLink','emergencySource','emergencyChecked','accessTitle',
 'accessText','accessLink','accessChecked','usefulTitle','usefulLead'];
const coverage={};
for(const lang of languages){
 const root=dataObjects.base[lang]||dataObjects.other[lang];
 if(!root)throw Error('Missing main language dictionary '+lang);
 const dict={...root};
 for(const group of ['editorialStrings','photoDiaryStrings','nextStageStrings',
  'foodHomeTranslations','v06HomeStrings','editorialCopy'])
  Object.assign(dict,dataObjects[group][lang]||{});
 const missing=keys.filter(k=>typeof dict[k]!=='string'||!dict[k].trim());
 coverage[lang]={keysInHome:keys.length,resolved:keys.length-missing.length,
  missingKeys:missing,
  missingEssentials:essentials.filter(k=>typeof dict[k]!=='string'||!dict[k].trim()),
  placeholderKeys:Object.entries(dict).filter(([k,v])=>typeof v==='string'&&/\b(TODO|FIXME|TBD)\b/.test(v)).map(([k])=>k)};
}
const missingGallery=[];
for(const img of gallery.images){
 for(const lang of languages)for(const field of ['title','alt'])
  if(!img[field]?.[lang])missingGallery.push(img.id+':'+lang+':'+field);
}
for(const lang of languages)for(const key of ['filterGroup','languageLabel','previous','next'])
 if(!gallery.translations[lang]?.[key])missingGallery.push(lang+':'+key);
const report={schemaVersion:1,date:'2026-11-23',languages,coverage,
 missingGallery,motherTongueReview:'NOT PERFORMED',
 gate:{homeComplete:languages.every(l=>coverage[l].missingKeys.length===0),
  essentialsComplete:languages.every(l=>coverage[l].missingEssentials.length===0),
  galleryComplete:missingGallery.length===0},
 limitations:['Missing-key detection cannot establish grammatical quality',
  'Dynamic DOM keys require complementary browser checks',
  'Stories are Spanish originals, not separate translated SEO URLs']};
const output='artifacts/editorial-fase2c/i18n-coverage.json';
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({coverage:Object.fromEntries(languages.map(l=>[l,{
  resolved:coverage[l].resolved,total:coverage[l].keysInHome,missing:coverage[l].missingKeys.length
 }])),missingGallery:missingGallery.length,gate:report.gate}));
assert.ok(report.gate.homeComplete,'Visible Home translations are missing keys');
assert.ok(report.gate.essentialsComplete,'Essentials copy missing in one or more languages');
assert.ok(report.gate.galleryComplete,'Gallery language labels are missing');

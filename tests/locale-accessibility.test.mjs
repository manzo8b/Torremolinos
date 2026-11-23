import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const home=read('index.html');
const locale=read('locale-accessibility.js');
const sw=read('service-worker.js');
const offline=read('offline.html');

test('Spanish canonical metadata matches the source language and approved brand',()=>{
  assert.match(home,/<html lang="es">/);
  assert.match(home,/<meta name="description" content="Descubre Torremolinos/);
  assert.match(home,/<meta property="og:locale" content="es_ES">/);
  assert.match(home,/<meta property="og:description" content="Playas, barrios/);
  assert.match(home,/hero-apple-2026/);
  assert.match(home,/locale-accessibility\.js" defer/);
});
test('six UI languages have accessible labels without external dependencies',()=>{
  new vm.Script(locale,{filename:'locale-accessibility.js'});
  for(const code of ['es','en','it','de','fr','ru'])assert.match(locale,new RegExp('\\b'+code+':\\s*\\{'));
  for(const selector of ['.hero-photo','.navlinks','#lang','#search','#filters','#moods','#route','.mobilebar']){
    assert.ok(locale.includes(selector),selector+' has no localised label');
  }
  assert.match(locale,/DOMContentLoaded/);
  assert.match(locale,/addEventListener\('change',update\)/);
});
test('offline PWA uses a transparent and navigable fallback, not a misleading home page',()=>{
  assert.match(sw,/torremolinos-v25/);
  assert.match(sw,/\.\/offline\.html/);
  assert.match(sw,/\.\/locale-accessibility\.js/);
  assert.match(sw,/req\.mode==='navigate'\?caches\.match\('\.\/offline\.html'\)/);
  assert.doesNotMatch(sw,/req\.mode==='navigate'\?caches\.match\('\.\/index\.html'\)/);
  assert.match(offline,/name="robots" content="noindex,nofollow"/);
  assert.match(offline,/href="\/Torremolinos\/"/);
  assert.match(offline,/prefers-reduced-motion:reduce/);
  for(const code of ['es','en','it','de','fr','ru'])assert.match(offline,new RegExp('\\b'+code+':\\['));
  const scripts=[...offline.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1);
  new vm.Script(scripts[0][1],{filename:'offline-inline.js'});
});

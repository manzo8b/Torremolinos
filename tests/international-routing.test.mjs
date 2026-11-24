import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {LANGS,ROUTES,META} from '../scripts/international-config.mjs';
const require=createRequire(import.meta.url);
const {file,edition,localize}=require('../locale-routing.js');
const root=new URL('https://manzo8b.github.io/Torremolinos/');
test('All 42 application editions share a deterministic URL policy',()=>{
  for(const r of ROUTES)for(const l of LANGS){
    assert.deepEqual(edition(file(r.path,l)),{route:r.path,lang:l});
    assert.ok(META[r.path][l].every(s=>s.length>10));
  }
  assert.equal(ROUTES.filter(r=>r.index).length,6);
});
test('Locale routing preserves planner parameters and does not cross project boundaries',()=>{
  assert.equal(localize('tu-torremolinos/?lang=es&plan=nogalera%2Cbajondillo#plan','it',root,root).href,root.href+'tu-torremolinos/it.html?plan=nogalera%2Cbajondillo#plan');
  assert.equal(localize('stories/pasaje-begona-memoria-de-libertad.html','fr',root,root).href,root.href+'stories/pasaje-begona-memoria-de-libertad-fr.html');
  assert.equal(localize('../Lune_X/','it',root,root),null);
  assert.equal(localize('https://example.org/','it',root,root),null);
  assert.equal(localize('#useful','it',root,root),null);
});

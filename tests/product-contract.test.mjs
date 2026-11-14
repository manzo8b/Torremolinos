import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const file = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = file('index.html');
const css = file('design-system-2026.css');

test('home inline JavaScript compiles', () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  const js = scripts.map(x => x[1]).filter(s => s.trim() && !s.trim().startsWith('{"@context"'));
  assert.ok(js.length > 0);
  js.forEach((s, i) => assert.doesNotThrow(() => new Script(s, { filename: 'home-inline-' + i + '.js' })));
});

test('each home control has a unique id', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(ids.length, new Set(ids).size);
});

test('signature journey keeps the complete interactive flow', () => {
  const ids = ['plan', 'plan-title', 'moods', 'route', 'directions', 'planCount', 'planStatus', 'planEmpty', 'sharePlan', 'resetPlan', 'filters', 'cards', 'lang', 'searchForm'];
  ids.forEach(id => assert.match(html, new RegExp('id="' + id + '"')));
  assert.match(html, /function addToPlan\(/);
  assert.match(html, /function editPlan\(/);
  assert.match(html, /function persistPlan\(/);
  assert.match(html, /history\.replaceState/);
  assert.match(html, /torremolinos\.plan/);
  assert.match(html, /aria-pressed/);
  assert.match(html, /location\.href/);
});

test('route recommendations come from published catalog entries', () => {
  const routeIds = ['sanmiguel', 'bajondillo', 'playamar', 'pasaje', 'nogalera', 'carihuela', 'bateria', 'pimentel'];
  routeIds.forEach(id => assert.ok(html.includes("id:'" + id + "'"), id + ' catalog record missing'));
  assert.match(html, /return places\.find/);
});

test('product microcopy includes all six supported languages', () => {
  const start=html.indexOf('var planCopy={');
  const end=html.indexOf('var selectedStops=null;',start);
  assert.ok(start > 0 && end > start);
  const i18n=html.slice(start,end);
  ['es','en','it','de','fr','ru'].forEach(l => assert.ok(i18n.includes('\n ' + l + ':{'), l + ' missing'));
});

test('four-colour identity, motion preferences, and correct application order', () => {
  for(const hex of ['#FFFFFF','#111111','#F58A17','#16865A'])assert.ok(css.includes(hex));
  const colors=[...new Set([...css.matchAll(/#[\da-fA-F]{3,8}(?![\da-fA-F])/g)].map(x=>x[0].toUpperCase()))];
  colors.forEach(c=>assert.ok(['#FFFFFF','#111111','#F58A17','#16865A','#FFF'].includes(c),'unapproved color '+c));
  assert.doesNotMatch(css, /(?:linear|radial)-gradient\(/);
  assert.match(css,/prefers-reduced-motion/);
  assert.ok(html.indexOf('href="design-system-2026.css"')>html.indexOf('href="coastal-light.css"'));
});

test('PWA updates include product styles and approved theme', () => {
  const sw=file('service-worker.js');
  const manifest=JSON.parse(file('manifest.webmanifest'));
  assert.match(sw,/design-system-2026\.css/);
  assert.equal(manifest.theme_color,'#16865A');
  assert.equal(manifest.background_color.toUpperCase(),'#FFFFFF');
});

test('destination pages share the design system', () => {
  const paths=['agenda/index.html','comer/index.html','gallery/index.html','listen/index.html','stories/index.html','explore/la-nogalera/index.html'];
  paths.forEach(path => assert.match(file(path), /design-system-2026\.css/,path+' missing stylesheet'));
});

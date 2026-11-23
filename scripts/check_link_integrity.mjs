/**
 * TORREMOLINOS — non-mutating local HTML link inventory (Q-06 / P0-10 preflight).
 *
 * Run node scripts/check_link_integrity.mjs to write artifacts/audit/links.json.
 * --strict is intentionally opt-in until the current site has been triaged.
 * Tests local paths, not external server availability; network is not needed.
 */
import {readdirSync,readFileSync,statSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,join,sep} from 'node:path';
const ROOT=resolve('.');
const EXCLUDED=new Set(['.git','node_modules','baseline','artifacts','dist','coverage']);
function pages(dir=ROOT){
 const result=[];
 for(const f of readdirSync(dir,{withFileTypes:true})){
  const p=join(dir,f.name);
  if(f.isDirectory()&&!EXCLUDED.has(f.name))result.push(...pages(p));
  else if(f.isFile()&&f.name.endsWith('.html'))result.push(p);
 }
 return result;
}
function normalizeTarget(file,uri){
 if(/^(?:#|mailto:|tel:|sms:|data:|blob:|javascript:)/i.test(uri))return null;
 let path=uri;
 try{
  const url=new URL(uri,'https://placeholder.example/'+relative(ROOT,file).replaceAll('\\','/'));
  if(url.origin!=='https://placeholder.example'){
   if(url.hostname==='manzo8b.github.io'&&url.pathname.startsWith('/Torremolinos/')){
    path=url.pathname.slice('/Torremolinos/'.length);
   }else{return {external:true,url:uri};}
  }else path=url.pathname.replace(/^\//,'');
 }catch {return {invalid:true,url:uri}}
 path=decodeURIComponent(path).replace(/^Torremolinos\//,'').replace(/^\//,'');
 path=path.replace(/\/+$/,'');
 const target=resolve(ROOT,path);
 if(!target.startsWith(ROOT))return {invalid:true,url:uri};
 const candidates=[target,target+'/index.html'];
 if(existsSync(target)&&statSync(target).isDirectory())candidates.unshift(join(target,'index.html'));
 return {target:path,exists:candidates.some(p=>existsSync(p)&&statSync(p).isFile())};
}
const results={schemaVersion:1,method:'filesystem static HTML href/src/srcset resolution',checkedFiles:[],local:0,external:0,broken:[],invalid:[],externalSamples:[],notCovered:['JS-constructed URLs','external HTTP status','CSS url()','dynamic client-side routes']};
for(const file of pages().sort()){
 const name=relative(ROOT,file).split(sep).join('/');
 results.checkedFiles.push(name);
 const html=readFileSync(file,'utf8');
 const attrs=[...html.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"'<>]+)["']/gi)].map(m=>m[1]);
 const srcsets=[...html.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)].flatMap(m=>m[1].split(',').map(x=>x.trim().split(/\s+/)[0]));
 for(const raw of [...attrs,...srcsets]){
  const r=normalizeTarget(file,raw);
  if(!r)continue;
  if(r.external){
   results.external++;if(results.externalSamples.length<30)results.externalSamples.push({file:name,url:r.url});
  }else if(r.invalid){results.invalid.push({file:name,url:raw});}
  else{results.local++;if(!r.exists)results.broken.push({file:name,url:raw,target:r.target});}
 }
}
mkdirSync(join(ROOT,'artifacts','audit'),{recursive:true});
writeFileSync(join(ROOT,'artifacts','audit','links.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({files:results.checkedFiles.length,localLinks:results.local,externalLinks:results.external,
 broken:results.broken.length,invalid:results.invalid.length,samples:results.broken.slice(0,12)},null,2));
if(process.argv.includes('--strict')&&(results.broken.length||results.invalid.length))process.exitCode=1;

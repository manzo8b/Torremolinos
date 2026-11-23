#!/usr/bin/env node
/* Version the TORREMOLINOS service-worker cache from actual pre-cache asset bytes.
   Only run on a built OUTPUT directory; never rewrites repository source files.
   Usage: node scripts/version_sw_cache.mjs --root dist --report artifacts/portability/sw-version.json
*/
import {readFileSync,writeFileSync,mkdirSync,statSync,existsSync,realpathSync} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {createHash} from 'node:crypto';

const args=process.argv.slice(2);
const get=(key,fallback)=>{
 const i=args.indexOf(key);
 return i>=0?args[i+1]:fallback;
};
const cwd=realpathSync('.');
const root=resolve(get('--root','dist'));
if(root===cwd || !root.startsWith(cwd+'/'))throw Error('Only build output directories within repository are supported');
const first=relative(cwd,root).split('/')[0];
if(!['dist','dist-preview','artifacts'].includes(first))throw Error('Unsafe output folder: '+first);
const worker=join(root,'service-worker.js');
if(!existsSync(worker))throw Error('Missing '+worker);
const original=readFileSync(worker,'utf8');
const files=original.match(/const FILES=\[([\s\S]*?)\];/)?.[1];
if(!files)throw Error('Precache array not found');
const raw=[...files.matchAll(/'([^']+)'/g)].map(x=>x[1]);
if(raw.length<10 || raw.some(x=>!x.startsWith('./')))throw Error('Invalid precache declaration');
const pathSet=[...new Set(raw)].sort();
const hasher=createHash('sha256');
const inputs=[];
for(const entry of pathSet){
 let path=resolve(root,entry.slice(2));
 if(statSync(path).isDirectory())path=join(path,'index.html');
 if(!path.startsWith(root+'/'))throw Error('Precache escapes distribution: '+entry);
 const bytes=readFileSync(path);
 hasher.update(entry+'\0');
 hasher.update(bytes);
 inputs.push({path:entry,bytes:bytes.byteLength});
}
const hash=hasher.digest('hex');
const newVersion='torremolinos-h'+hash.slice(0,16);
const pattern=/const CACHE='torremolinos-[A-Za-z0-9-]+';/;
if(!pattern.test(original))throw Error('Service worker has no versioned cache name');
const rewritten=original.replace(pattern,"const CACHE='"+newVersion+"';");
writeFileSync(worker,rewritten,'utf8');
const report=resolve(get('--report','artifacts/portability/sw-version.json'));
mkdirSync(dirname(report),{recursive:true});
writeFileSync(report,JSON.stringify({cache:newVersion,assetCount:inputs.length,sha256:hash,inputs},null,2)+'\n','utf8');
console.log(JSON.stringify({cache:newVersion,files:inputs.length}));

import {spawn,spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='artifacts/performance';
mkdirSync(dir,{recursive:true});
const server=spawn('python3',['-m','http.server','18990','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
const base='http://127.0.0.1:18990/';
const controlBase='http://127.0.0.1:18992/';
const controlServer=spawn('python3',['-m','http.server','18992','--bind','127.0.0.1','--directory','artifacts/lighthouse-control/site'],{stdio:'ignore'});
const categories=['performance','accessibility','best-practices','seo'];
const targets={performance:90,accessibility:95,'best-practices':95,seo:95,LCPms:2500,CLS:.1,TBTms:200};
const plans=[{name:'home-control',route:'',mode:'mobile',runs:3,control:true},{name:'home',route:'',mode:'mobile',runs:3},{name:'home',route:'',mode:'desktop',runs:3},
 {name:'comer',route:'comer/',mode:'mobile',runs:1},{name:'agenda',route:'agenda/',mode:'mobile',runs:1},
 {name:'gallery-control',route:'gallery/',mode:'mobile',runs:3,control:true},{name:'gallery',route:'gallery/',mode:'mobile',runs:3},{name:'listen',route:'listen/',mode:'mobile',runs:1},
 {name:'stories',route:'stories/',mode:'mobile',runs:1},{name:'nogalera',route:'explore/la-nogalera/',mode:'mobile',runs:1}];
const records=[],errors=[];
const median=xs=>{const a=[...xs].sort((x,y)=>x-y);return a[Math.floor(a.length/2)]};
try{
 for(const endpoint of [base,controlBase]){
  let ready=false;for(let i=0;i<80;i++){try{if((await fetch(endpoint)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}
  assert.ok(ready,'Local server unavailable '+endpoint);
 }
 for(const p of plans){
  const samples=[];
  for(let n=1;n<=p.runs;n++){
   const id=p.name+'-'+p.mode+'-'+n,out=dir+'/'+id+'.json';
   const args=[(p.control?controlBase:base)+p.route+'?lang=es','--output=json','--output-path='+out,'--quiet','--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--only-categories='+categories.join(','),'--disable-full-page-screenshot'];
   if(p.mode==='desktop')args.push('--preset=desktop');
   const result=spawnSync('node_modules/.bin/lighthouse',args,{encoding:'utf8',timeout:120000,env:{...process.env,CHROME_PATH:process.env.CHROME_PATH||'/usr/bin/google-chrome'}});
   if(result.status!==0){errors.push({id,error:(result.stderr||result.error?.message||'Lighthouse exited').slice(-3000)});continue;}
   try{
    const l=JSON.parse(readFileSync(out,'utf8'));if(l.runtimeError)throw Error(JSON.stringify(l.runtimeError));
    const scores=Object.fromEntries(categories.map(c=>[c,Math.round(l.categories[c].score*100)]));
    const values={...scores,LCPms:l.audits['largest-contentful-paint'].numericValue,CLS:l.audits['cumulative-layout-shift'].numericValue,TBTms:l.audits['total-blocking-time'].numericValue};
    if(Object.values(values).some(v=>!Number.isFinite(v)))throw Error('Missing metric');
    const diagnostics=Object.fromEntries(['render-blocking-insight','cls-culprits-insight','lcp-discovery-insight','long-tasks','color-contrast','third-party-cookies','inspector-issues','errors-in-console'].map(key=>{
      const a=l.audits[key];return [key,{score:a?.score??null,displayValue:a?.displayValue??null,items:Array.isArray(a?.details?.items)?a.details.items.length:null}];
    }));
    samples.push({id,values,diagnostics,version:l.lighthouseVersion,fetchTime:l.fetchTime,environment:l.environment,warnings:l.runWarnings||[],report:out});
   }catch(e){errors.push({id,error:e.message})}
  }
  if(samples.length!==p.runs){records.push({...p,samples,status:'incomplete'});continue;}
  const values=Object.fromEntries(Object.keys(targets).map(k=>[k,median(samples.map(s=>s.values[k]))]));
  const missed=Object.keys(targets).filter(k=>k.endsWith('ms')||k==='CLS'?values[k]>targets[k]:values[k]<targets[k]);
  records.push({...p,samples,median:values,missed,status:missed.length?'below-target':'target-met'});
  console.log(JSON.stringify({page:p.name,mode:p.mode,median:values,missed,diagnostics:samples[0].diagnostics}));
 }
 const control=records.find(r=>r.name==='home-control'&&r.mode==='mobile')?.median;
 const candidate=records.find(r=>r.name==='home'&&r.mode==='mobile')?.median;
 const comparison=control&&candidate?{control,candidate,performanceDelta:candidate.performance-control.performance,LCPDeltaMs:candidate.LCPms-control.LCPms,CLSDelta:candidate.CLS-control.CLS}:null;
 console.log('HOME CSS A/B '+JSON.stringify(comparison));
 const galleryControl=records.find(r=>r.name==='gallery-control')?.median;
 const galleryCandidate=records.find(r=>r.name==='gallery')?.median;
 const galleryComparison=galleryControl&&galleryCandidate?{control:galleryControl,candidate:galleryCandidate,performanceDelta:galleryCandidate.performance-galleryControl.performance,LCPDeltaMs:galleryCandidate.LCPms-galleryControl.LCPms,CLSDelta:galleryCandidate.CLS-galleryControl.CLS}:null;
 console.log('GALLERY A/B '+JSON.stringify(galleryComparison));
 writeFileSync(dir+'/summary.json',JSON.stringify({targets,records,errors,comparison,galleryComparison,fieldINP:null,fieldStatus:'not measured; CrUX/Search Console access not verified',method:'Local dist, Lighthouse simulated throttling, external resources allowed, Home control and bundled mobile medians of three independent cold runs each, sequential in the same runner; desktop three, Gallery control/candidate three each, other routes one run; targets are diagnostic until reviewed. TBT is not INP. No real-user telemetry.',source:process.env.GITHUB_SHA||null},null,2)+'\n');
 assert.equal(errors.length,0,JSON.stringify(errors));
 console.log('Measured '+records.length+' route/device groups. Below-target metrics require triage before release; baseline workflow fails on missing measurements, not target misses.');
}finally{server.kill('SIGTERM');controlServer.kill('SIGTERM')}

#!/usr/bin/env python3
"""Static release gate. No external network or claim of actual indexing."""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser
from xml.etree import ElementTree as ET
from urllib.parse import urljoin
from audit_clean_release import local_target
from build_portable_site import distribution_files,BUNDLE,GENERATED

class Meta(HTMLParser):
 def __init__(self):
  super().__init__();self.canonical=[];self.robots=[];self.descriptions=[];self.titles=[];self.title=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link' and 'canonical' in a.get('rel','').split():self.canonical.append(a.get('href',''))
  if tag=='meta':
   if a.get('name','').lower()=='robots':self.robots.append(a.get('content','').lower())
   if a.get('name','').lower()=='description':self.descriptions.append(a.get('content',''))
  if tag=='title':self.title=True
 def handle_endtag(self,tag):
  if tag=='title':self.title=False
 def handle_data(self,data):
  if self.title:self.titles.append(data.strip())

def audit(dist,base):
 issues=[]; pages=[]; sitemap=set()
 def require(ok,message):
  if not ok:issues.append(message)
 for el in ET.parse(dist/'sitemap.xml').getroot().iter():
  if el.tag.split('}')[-1]=='loc' and el.text:
   loc=el.text.strip();require(loc not in sitemap,'duplicate sitemap '+loc);sitemap.add(loc)
 for loc in sorted(sitemap):
  path=local_target(loc,base,base)
  require(bool(path) and (dist/path).is_file(),'missing sitemap target '+loc)
  if not path or not (dist/path).is_file():continue
  m=Meta();m.feed((dist/path).read_text('utf8'))
  require(m.canonical==[loc],'canonical mismatch '+path)
  require(not any('noindex' in x for x in m.robots),'noindex in sitemap '+path)
  require(bool(''.join(m.titles).strip()),'missing title '+path)
  require(any(x.strip() for x in m.descriptions),'missing description '+path)
  pages.append({'path':path,'canonical':m.canonical,'robots':m.robots})
 for name in ['privacy-policy','cookie-policy','terms-of-use','accessibility','contact']:
  path='legal/'+name+'.html';m=Meta();m.feed((dist/path).read_text('utf8'))
  require(any('noindex' in x for x in m.robots),'draft indexable '+path)
  require(base+path not in sitemap,'draft in sitemap '+path)
 robots=(dist/'robots.txt').read_text('utf8')
 require('Sitemap: '+base+'sitemap.xml' in robots,'robots sitemap mismatch')
 worker=(dist/'service-worker.js').read_text('utf8')
 match=re.search(r'const FILES=\[([\s\S]*?)\];',worker)
 require(bool(match),'precache list absent')
 precache=re.findall(r"'([^']+)'",match.group(1)) if match else []
 require(bool(precache),'empty precache')
 for path in precache:
  target=local_target(path,base,base)
  require(bool(target) and (dist/target).is_file(),'precache missing '+path)
 expected,optimization=distribution_files(base)
 actual={p.relative_to(dist).as_posix():p for p in dist.rglob('*') if p.is_file()}
 require(set(expected)==set(actual),'distribution file inventory differs from expected optimized sources')
 for name in set(expected)&set(actual):
  require(actual[name].read_bytes()==expected[name],'unexpected bytes '+name)
 for name in GENERATED:require('./'+name in precache,'generated file missing from precache '+name)
 require(optimization['homeLocalStylesAfter']==1,'Home bundle count mismatch')
 require('href="/Torremolinos/' not in (dist/'offline.html').read_text('utf8'),'hardcoded offline route')
 sizes=sorted([{'path':name,'bytes':p.stat().st_size} for name,p in actual.items()],key=lambda x:x['bytes'],reverse=True)
 return {'siteBase':base,'sitemapEntries':len(sitemap),'pages':pages,'precacheEntries':len(precache),'fileCount':len(actual),'totalBytes':sum(x['bytes'] for x in sizes),'largestFiles':sizes[:15],'optimization':optimization,'issues':issues,'limits':'Static metadata and package bytes only; indexing, external links and performance metrics not measured.'}

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--dist',required=True);p.add_argument('--site-base',required=True);p.add_argument('--report',required=True);a=p.parse_args()
 result=audit(Path(a.dist),a.site_base);out=Path(a.report);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n','utf8')
 print(json.dumps({k:result[k] for k in ['siteBase','sitemapEntries','precacheEntries','fileCount','totalBytes','issues']},ensure_ascii=False))
 if result['issues']:raise SystemExit('NO-GO: static candidate audit failed')

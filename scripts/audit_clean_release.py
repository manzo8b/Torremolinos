#!/usr/bin/env python3
"""P0-10 / public distribution gate: verify content hashes, referenced assets and sitemap.

This checks static links to required assets, not the availability of external
websites or all JS-built URLs. No modifications to app content or visitor data.
"""
from __future__ import annotations
import argparse
import hashlib
from html.parser import HTMLParser
import json
import re
from pathlib import Path
from urllib.parse import urljoin,urlsplit,unquote
from xml.etree import ElementTree
from build_portable_site import distribution_files

ROOT=Path(__file__).resolve().parents[1]
BASE="https://manzo8b.github.io/Torremolinos/"
REQUIRED={
 "index.html","comer/index.html","agenda/index.html","agenda/events.json",
 "gallery/index.html","listen/index.html","stories/index.html",
 "legal/index.html","explore/la-nogalera/index.html",
 "offline.html","manifest.webmanifest","service-worker.js",
 "sitemap.xml","robots.txt",".nojekyll",
 "footer-professional-2026.css","footer-professional-2026.js",
 "approved-clean-2026.css","approved-clean-2026.js","home-render.css",
 "assets/photos/sound-headphones-torremolinos.webp"
}
FORBIDDEN={
 "README.md","DESIGN-CONTRACT.md","anteprima/index.html",
 "agenda/scanner-baseline.json",
 "scripts/scan_events.py","tests/ui-smoke.mjs",".github/workflows/pages.yml"
}
RESOURCE_TAGS={
 "script":("src",),"img":("src","srcset"),"audio":("src",),
 "video":("src","poster"),"source":("src","srcset"),
 "iframe":("src",)
}
RESOURCE_RE=re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)",re.I)
def sha(b):return hashlib.sha256(b).hexdigest()
def local_target(raw:str,base_url:str,site_base:str=BASE):
 raw=raw.strip()
 if not raw or raw.startswith(("#","data:","blob:","javascript:","mailto:","tel:")):
  return None
 url=urlsplit(urljoin(base_url,raw))
 if url.scheme not in ("https","http"):return None
 b=urlsplit(site_base)
 if url.netloc!=b.netloc or not url.path.startswith(b.path):return None
 rel=unquote(url.path[len(b.path):])
 if rel.startswith("/") or ".." in Path(rel).parts:return "INVALID:"+rel
 return (rel+"index.html") if not rel or rel.endswith("/") else rel
class AssetParser(HTMLParser):
 def __init__(self,url):
  super().__init__(convert_charrefs=True);self.url=url;self.refs=[]
  self.style_open=False
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=="style":self.style_open=True
  for name in RESOURCE_TAGS.get(tag,()):
   value=attrs.get(name)
   if not value:continue
   parts=[p.strip().split()[0] for p in value.split(",")] if name=="srcset" else [value]
   self.refs.extend(parts)
  if tag=="link" and attrs.get("href"):
   rel=set(attrs.get("rel","").lower().split())
   if rel.intersection({"stylesheet","icon","manifest","preload","modulepreload","apple-touch-icon"}):
    self.refs.append(attrs["href"])
  if "style" in attrs:
   self.refs.extend(match.group(2) for match in RESOURCE_RE.finditer(attrs["style"]))
 def handle_endtag(self,tag):
  if tag=="style":self.style_open=False
 def handle_data(self,data):
  if self.style_open:
   self.refs.extend(match.group(2) for match in RESOURCE_RE.finditer(data))

def check(dist:Path,report:Path,expected_base:str):
 source=ROOT.resolve()
 dist=dist.resolve()
 if dist==source or not dist.is_dir():raise ValueError("Need an existing separate dist directory")
 manifest=dist/"index.html"
 if not manifest.is_file():raise ValueError("Missing distribution index")
 files=sorted(p for p in dist.rglob("*") if p.is_file())
 relative=[p.relative_to(dist).as_posix() for p in files]
 forbidden=sorted(x for x in FORBIDDEN if (dist/x).exists())
 extras=sorted(x for x in relative if x.startswith((
  ".github/","scripts/","tests/","docs/","baseline/","anteprima/","node_modules/","artifacts/"
 )))
 missing=sorted(x for x in REQUIRED if not (dist/x).is_file())
 hashes=[]
 for path in files:
  name=path.relative_to(dist).as_posix()
  origin=source/name
  hashes.append({
   "path":name,
   "sha256":sha(path.read_bytes()),
   "sourceSHA256":sha(origin.read_bytes()) if origin.is_file() else None,
   "identicalToSource":origin.is_file() and path.read_bytes()==origin.read_bytes()
  })
 base=expected_base
 expected,optimization=distribution_files(base)
 unexpected=sorted(set(relative)^set(expected))
 unexpected+=sorted(name for name in set(relative)&set(expected) if (dist/name).read_bytes()!=expected[name])
 url_parts=urlsplit(base)
 if url_parts.scheme not in ("https","http") or not base.endswith("/"):
  raise ValueError("Expected origin must end in / and be HTTP(S)")
 broken=[]
 resource_count=0
 for item in files:
  rel=item.relative_to(dist).as_posix()
  candidates=[]
  if item.suffix.lower()==".html":
   parser=AssetParser(base+rel)
   parser.feed(item.read_text("utf8"))
   candidates=parser.refs
  elif item.suffix.lower()==".css":
   candidates=[m.group(2) for m in RESOURCE_RE.finditer(item.read_text("utf8"))]
  for asset in candidates:
   resource_count+=1
   target=local_target(asset,base+rel,base)
   if not target:continue
   if target.startswith("INVALID:") or not (dist/target).is_file():
    broken.append({"page":rel,"reference":asset,"resolved":target})
 sitemap_errors=[]
 try:
  root=ElementTree.parse(dist/"sitemap.xml").getroot()
  for el in root.iter():
   if el.tag.split("}")[-1]!="loc" or not el.text:continue
   loc=el.text.strip()
   if not loc.startswith(base):
    sitemap_errors.append({"url":loc,"reason":"outside configured site base"})
   else:
    resolved=local_target(loc,base,base)
    if not resolved or not (dist/resolved).is_file():
     sitemap_errors.append({"url":loc,"reason":"target unavailable"})
 except Exception as e:
  sitemap_errors.append({"reason":"XML parsing failed","error":str(e)})
 results={
  "schemaVersion":1,"source":str(source),"distribution":str(dist),
  "siteBase":base,"fileCount":len(files),"checkedResources":resource_count,
  "missingRequired":missing,"forbiddenFound":forbidden,
  "unapprovedDirectories":extras,"unresolvedStaticResources":broken,
  "sitemapProblems":sitemap_errors,
  "sourceByteChanges":[x["path"] for x in hashes if not x["identicalToSource"]],
  "fileHashes":hashes,"expectedTransformation":optimization,"unexpectedDistributionChanges":unexpected,
  "coverageLimitations":[
   "References built at runtime in JavaScript require browser smoke tests.",
   "Outbound external URLs are not probed.",
   "A clean build on GitHub Pages is not released by this audit."
  ]
 }
 report.parent.mkdir(parents=True,exist_ok=True)
 report.write_text(json.dumps(results,ensure_ascii=False,indent=2)+"\n","utf8")
 errors=missing or forbidden or extras or broken or sitemap_errors or unexpected
 print(json.dumps({"files":len(files),"resources":resource_count,
                   "missing":len(missing),"forbidden":len(forbidden)+len(extras),
                   "broken":len(broken),"sitemapProblems":len(sitemap_errors),
                   "changedFiles":len(results["sourceByteChanges"]),"unexpectedChanges":len(unexpected),
                   "firstErrors":(broken+sitemap_errors)[:8]},ensure_ascii=False))
 if errors:raise SystemExit("NO-GO: distribution validation failed")
 return results

if __name__=="__main__":
 p=argparse.ArgumentParser()
 p.add_argument("--dist",default="dist")
 p.add_argument("--site-base",default=BASE)
 p.add_argument("--report",default="artifacts/release/manifest-audit.json")
 x=p.parse_args()
 check(Path(x.dist),Path(x.report),x.site_base)

#!/usr/bin/env python3
"""Static v0.6 release checks for TORREMOLINOS, no third-party dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE="https://manzo8b.github.io/Torremolinos/"
DRAFTS=[
  "anteprima/index.html",
  "legal/privacy-policy.html",
  "legal/cookie-policy.html",
  "legal/terms-of-use.html",
  "legal/contact.html",
  "legal/accessibility.html",
]
MUST_EXIST=[
 "index.html","editorial.css","v06.css",
 "listen/index.html","listen/content.js",
 "gallery/index.html","gallery/data.js","gallery/app.js","gallery/styles.css",
 "explore/la-nogalera/index.html","explore/la-nogalera/data.js","explore/la-nogalera/app.js","explore/la-nogalera/styles.css",
 "agenda/index.html","agenda/events.json",
 "comer/index.html","comer/data.js",
 "legal/index.html","legal/app.js","legal/data.js","legal/styles.css",
 "legal/editorial-policy.html","legal/event-source-policy.html","legal/ai-transparency.html",
 "legal/copyright-credits.html","service-worker.js","sitemap.xml","robots.txt",
]
class MiniParser(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=[];self.h1=[];self.current=None
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if attrs.get("id"):self.ids.append(attrs["id"])
  if tag=="h1":self.current="h1"
 def handle_data(self,value):
  if self.current=="h1":self.h1.append(value)
 def handle_endtag(self,tag):
  if tag=="h1":self.current=None
def page_html(path):
 s=(ROOT/path).read_text("utf-8")
 assert "<!doctype html>" in s.lower(),path
 p=MiniParser();p.feed(s)
 assert len(p.ids)==len(set(p.ids)),(path,"duplicate IDs")
 assert "<title>" in s,(path,"missing title")
 if 'noindex' not in s:assert 'rel="canonical"' in s,(path,"missing canonical")
 return s,p
def validate():
 for f in MUST_EXIST:assert (ROOT/f).is_file(),("missing",f)
 for f in DRAFTS:
  s,p=page_html(f)
  assert 'noindex' in s,("draft indexed",f)
 for f in ["index.html","listen/index.html","gallery/index.html","explore/la-nogalera/index.html","legal/index.html","legal/editorial-policy.html","legal/event-source-policy.html","legal/copyright-credits.html"]:
  page_html(f)
 home=(ROOT/"index.html").read_text("utf-8")
 assert 'class="torre-home"' in home and 'v06.css' in home
 assert 'id="torremolinos-audio"' in home
 assert 'id="heroMusicBtn"' in home and 'aria-pressed="false"' in home
 assert 'Lune_X/assets/audio/next-stop-torremolinos-preview.mp3' in home
 for url in ['listen/','agenda/','comer/','legal/','gallery/','explore/la-nogalera/']:
  assert 'href="'+url+'"' in home,("home missing",url)
 listen=(ROOT/"listen/content.js").read_text("utf-8")
 legal=(ROOT/"legal/data.js").read_text("utf-8")
 for lang in ["es","en","it","de","fr","ru"]:
  assert '"'+lang+'"' in listen and '"'+lang+'"' in legal,("translation",lang)
 x=ET.parse(ROOT/"sitemap.xml").getroot()
 namespace="{http://www.sitemaps.org/schemas/sitemap/0.9}"
 urls=[e.text for e in x.findall(".//"+namespace+"loc")]
 assert len(urls)==len(set(urls))==16,("sitemap",len(urls))
 assert all(u.startswith(BASE) for u in urls)
 for url in urls:
  route=unquote(urlsplit(url).path.split("/Torremolinos/",1)[-1])
  dest=ROOT/route
  if not dest.suffix:dest=dest/"index.html"
  assert dest.is_file(),("missing sitemap target",url)
 for f in DRAFTS:
  part=f.replace("index.html","") if f.endswith("/index.html") else f
  assert BASE+part not in urls,("draft listed in sitemap",f)
 manifest=json.loads((ROOT/"manifest.webmanifest").read_text("utf-8"))
 assert manifest["theme_color"]=="#07565d"
 sw=(ROOT/"service-worker.js").read_text("utf-8")
 assert "torremolinos-v10" in sw and "'./listen/'" in sw
 gallery=(ROOT/"gallery/data.js").read_text("utf-8")
 assert "TORREMOLINOS_GALLERY" in gallery
 assert "provenance" in gallery and '"ai"' in gallery
 assert "gallery-cover-editorial-ai.webp" in home
 assert "beach-palms-ai.webp" in home
 nogalera=(ROOT/"explore/la-nogalera/data.js").read_text("utf-8")
 assert "TORREMOLINOS_NOGALERA" in nogalera and "Bodega Guerola" in nogalera
 guide=json.loads(nogalera.split("=",1)[1].rstrip().rstrip(";"))
 langs=("es","en","it","de","fr","ru")
 assert all(k in guide["translations"] for k in langs),"La Nogalera languages missing"
 public=[v for v in guide["venues"] if v.get("publicationStatus")=="listed"]
 assert len(public)>=10,"too few sourced listings"
 assert all(v.get("evidence","").startswith("https://") for v in public),"public listing without source"
 assert all(all(v["description"].get(l) for l in langs) for v in public),"missing venue translation"
 assert len({v["id"] for v in guide["venues"]})==len(guide["venues"]),"duplicate venue id"
 assert any(v["name"]=="Bodega Guerola" and v["area"]=="neighbor" for v in public),"Guerola must stay outside La Nogalera"
 assert "data-filter=\"outside\"" in (ROOT/"explore/la-nogalera/index.html").read_text("utf-8")
 assert "--editorial-coral-strong:#B44719" in (ROOT/"v06.css").read_text("utf-8"),"coral contrast styling"

 assert "GUÍA INDEPENDIENTE · COSTA DEL SOL" in home
 assert "Sitemap: "+BASE+"sitemap.xml" in (ROOT/"robots.txt").read_text("utf-8")
 print("TORREMOLINOS v0.10 QA PASS | 16 canonical URLs | 6 language packs | controlled music | draft noindex")
if __name__=="__main__":validate()

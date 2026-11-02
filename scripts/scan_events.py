#!/usr/bin/env python3
"""TORREMOLINOS event source monitor. No automatic publishing of unverified dates.

Fetch a small allowlist of publicly accessible, event-relevant pages.
Extract key festival date windows + new ACOGAT titles. Compare against curated
agenda/events.json and write a human-readable review report + machine state.

This is a monitoring tool, not an unrestricted crawler or an event publisher.
No scraping of login-gated social networks. No ticket purchases or personal data.
"""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
URLS={
 "madbear":"https://madbear.org/madbear-beach-torremolinos",
 "infinity":"https://www.infinityfestival.eu/",
 "acogat":"https://torremolinosplus.com/en/whats-on/",
}
MONTHS={"agosto":8,"august":8,"junio":6,"june":6}
class Reader(HTMLParser):
    def __init__(self):
        super().__init__();self.parts=[];self.h3=[];self._h3=False;self._h3_text=[]
        self.skip=0
    def handle_starttag(self,tag,attrs):
        if tag in ("script","style","noscript"):self.skip+=1
        if tag=="h3":self._h3=True;self._h3_text=[]
    def handle_endtag(self,tag):
        if tag in ("script","style","noscript"):self.skip=max(0,self.skip-1)
        if tag=="h3" and self._h3:
            title=" ".join(" ".join(self._h3_text).split()).strip()
            if title:self.h3.append(title)
            self._h3=False
    def handle_data(self,data):
        if self.skip:return
        if self._h3:self._h3_text.append(data)
        self.parts.append(data)
def parsed(html):
    r=Reader();r.feed(html);txt=unescape(" ".join(" ".join(r.parts).split()))
    return txt,r.h3
def fetch(url,timeout=25):
    req=urllib.request.Request(url,headers={"User-Agent":"TORREMOLINOS-Events-Monitor/0.5 (+https://github.com/manzo8b/Torremolinos; public-source-monitor)","Accept":"text/html,application/xhtml+xml"})
    with urllib.request.urlopen(req,timeout=timeout) as resp:
        if resp.status!=200:raise ValueError(f"HTTP {resp.status}")
        ctype=resp.headers.get("Content-Type","")
        if "html" not in ctype.lower():raise ValueError("Unexpected content type: "+ctype)
        data=resp.read(2_000_001)
        if len(data)>2_000_000:raise ValueError("Document too large")
        return data.decode(resp.headers.get_content_charset() or "utf-8",errors="replace")
def date_span(text,kind):
    # Anchored to the *festival heading*; ignore old subprogrammes copied below it.
    patterns={
      "madbear":r"MADBEAR\s*BEACH\s*(20\d\d)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*(?:AGOSTO|AUGUST)",
      "infinity":r"INFINITY\s*Festival\s*Summer\s*Edition(?:(?!KINK Festival).){0,500}?(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*June\s*(20\d\d)",
    }
    m=re.search(patterns[kind],text,re.I|re.S)
    if not m:return None
    if kind=="madbear":
        year,start,end=map(int,m.groups());month=8
    else:
        start,end,year=map(int,m.groups());month=6
    return (f"{year:04d}-{month:02d}-{start:02d}",f"{year:04d}-{month:02d}-{end:02d}")
def normalized(v):
    return " ".join(re.sub(r"[^a-z0-9 ]+"," ",v.casefold()).split())
def check_curated(curated,kind,found,expected_id):
    e=next(x for x in curated if x["id"]==expected_id)
    return {"source":kind,"event_id":expected_id,"expected":[e["start"],e["end"]],"found":list(found) if found else None,"status":"same" if found==(e["start"],e["end"]) else ("different" if found else "not_detected")}
def acogat_headings(headings):
    names=[]
    ban={"Explore","Association","Save the date","Festivals","Everything coming up"}
    for name in headings:
        if 4<=len(name)<=150 and name not in ban and not name.lower().startswith("looking for"):
            names.append(name)
    return list(dict.fromkeys(names))
def review_acogat(headings,curated):
    now=dt.datetime.now(dt.timezone.utc).date().isoformat()
    ac_names=acogat_headings(headings)
    expected=[x for x in curated if x["kind"]=="lgbtq" and x["end"]>=now and "torremolinosplus.com" in x["source"]]
    # Compare against a known human-reviewed snapshot. Never exempt a new event
    # merely because its title includes "Daddy", "Pride" or "Infinity".
    baseline=json.loads((ROOT/"agenda/scanner-baseline.json").read_text("utf-8"))
    initial={normalized(name) for name in baseline.get("acogatHeadings",[])}
    unexpected=[name for name in ac_names if normalized(name) not in initial]
    previous={normalized(name) for name in ac_names}
    no_longer_visible=[name for name in baseline.get("acogatHeadings",[]) if normalized(name) not in previous]
    return {"headings":ac_names,"expected_future_count":len(expected),"unrecognized_headings":unexpected,"no_longer_visible":no_longer_visible}
def scan(fixtures=None):
    feed=json.loads((ROOT/"agenda/events.json").read_text("utf-8"))
    results={};issues=[]
    for key,url in URLS.items():
        try:
            if fixtures:
                html=(Path(fixtures)/(key+".html")).read_text("utf-8")
            else:
                html=fetch(url)
            text,headings=parsed(html)
            if not text:raise ValueError("Empty extracted text")
            results[key]={"url":url,"reachable":True,"textLength":len(text),"headings":headings}
            if key in ("madbear","infinity"):
                ev_id={"madbear":"madbear-beach-2027","infinity":"infinity-2027"}[key]
                check=check_curated(feed["events"],key,date_span(text,key),ev_id)
                results[key]["dateCheck"]=check
                if check["status"]!="same":issues.append(f"{key}: official date detection differs from curated record ({check['status']}).")
                if key=="madbear" and ("2025" in text or "2026" in text):
                    results[key]["warning"]="Page includes old-year programme material; only festival header dates are checked."
            else:
                results[key]["discovery"]=review_acogat(headings,feed["events"])
                if results[key]["discovery"]["unrecognized_headings"]:
                    issues.append("ACOGAT has newly listed event headings not in the editorial baseline; review dates and sources manually.")
        except (OSError,ValueError,urllib.error.URLError) as err:
            results[key]={"url":url,"reachable":False,"error":str(err)[:240]}
            issues.append(f"{key}: source not reachable; retain existing editorial dates.")
    # Always mark the watchlist for manual review: this is not an automatic suggestion to publish.
    report={"scannedAtUTC":dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),"readOnly":True,"editorialUpdated":feed["editorialUpdated"],"sourceResults":results,"reviewRequired":bool(issues),"reviewIssues":issues,"pendingIds":[e["id"] for e in feed["watchlist"]]}
    return report
def write_report(report,outdir):
    outdir.mkdir(parents=True,exist_ok=True)
    (outdir/"scan-result.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    lines=["# TORREMOLINOS · Report de escáner de eventos","",f"Consulta (UTC): {report['scannedAtUTC']}",f"Última edición humana: {report['editorialUpdated']}","","## Fuentes consultadas",""]
    for k,r in report["sourceResults"].items():
        lines.extend([f"### {k.upper()}","",f"- URL: {r['url']}",f"- Accesible: {'sí' if r['reachable'] else 'no'}"])
        if "dateCheck" in r:
            z=r["dateCheck"]
            lines.append(f"- Fechas guardadas: {' a '.join(z['expected'])}")
            lines.append(f"- Fechas detectadas: {z['found'] if z['found'] else 'no detectadas'}")
            lines.append(f"- Estado: {z['status']}")
        if "discovery" in r:
            lines.append(f"- Títulos visibles: {len(r['discovery']['headings'])}")
            lines.append("- Nuevos títulos frente a la línea base (no publicar sin verificar): "+", ".join(r["discovery"]["unrecognized_headings"] or ["ninguno"]))
        if "warning" in r:lines.append("- Advertencia: "+r["warning"])
        if "error" in r:lines.append("- Error: "+r["error"])
        lines.append("")
    lines+=["## Decisión de publicación","",
      "El escáner **nunca** modifica `agenda/events.json` ni publica fechas por deducción.",
      "Cualquier cambio detectado exige cotejo con una ficha de organizador y revisión editorial.",
      "Los eventos en `watchlist` siguen como pendientes aunque se hayan detectado menciones en redes o agendas secundarias.","",
      "## Incidencias","","\n".join("- "+m for m in report["reviewIssues"]) if report["reviewIssues"] else "Sin discrepancias detectadas en las comprobaciones programadas.",""]
    (outdir/"scan-report.md").write_text("\n".join(lines),encoding="utf-8")
    digest=hashlib.sha256(json.dumps({"sources":report["sourceResults"],"issues":report["reviewIssues"]},ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:16]
    (outdir/"digest.txt").write_text(digest+"\n",encoding="utf-8")
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--fixture-dir",help="Directory with madbear.html, infinity.html and acogat.html")
    parser.add_argument("--out",default=str(ROOT/"reports/agenda-scan"))
    parser.add_argument("--strict",action="store_true",help="Nonzero on source/date discrepancy (use for fixtures)")
    args=parser.parse_args()
    report=scan(args.fixture_dir)
    write_report(report,Path(args.out))
    print(json.dumps({"ok":not report["reviewRequired"],"results":{k:v.get("dateCheck",{}).get("status","ok" if v.get("reachable") else "failed") for k,v in report["sourceResults"].items()},"issues":report["reviewIssues"]},ensure_ascii=False))
    if args.strict and report["reviewRequired"]:return 1
    return 0
if __name__=="__main__":sys.exit(main())

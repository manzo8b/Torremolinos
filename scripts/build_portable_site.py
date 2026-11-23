#!/usr/bin/env python3
"""P0-01/P0-10: build deployable static files without changing site design.
Defaults to current GitHub Pages origin. Use SITE_ORIGIN and BASE_PATH for staging.
Only project canonical/schema/OG/sitemap links are moved; LUNE_X stays external.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]
CURRENT="https://manzo8b.github.io/Torremolinos/"
ROOT_FILES={".nojekyll","index.html","offline.html","favicon.svg","manifest.webmanifest",
            "service-worker.js","robots.txt","sitemap.xml"}
PUBLIC_DIRS={"assets","brand","agenda","comer","explore","gallery","legal","listen","stories"}
FORMATS={".html",".css",".js",".json",".webmanifest",".webp",".svg",".jpg",
         ".jpeg",".png",".ico",".gif",".woff",".woff2",".mp3",".ogg",".wav",".pdf"}
TEXT={".html",".css",".js",".json",".webmanifest",".svg",".xml",".txt"}
def hash_bytes(b): return hashlib.sha256(b).hexdigest()
def clean_origin(raw):
    value=raw.strip().rstrip("/")
    parts=urlsplit(value)
    if parts.scheme not in ("https","http") or not parts.netloc or any(
        (parts.path,parts.query,parts.fragment,parts.username,parts.password)):
        raise ValueError("SITE_ORIGIN must be an HTTP(S) origin with no path or credentials")
    return value
def clean_path(raw):
    value=raw.strip()
    if not re.fullmatch(r"/(?:[A-Za-z0-9_-]+/)*",value):
        raise ValueError("BASE_PATH must be / or /name/subpath/ with a final /")
    return value
def source_files():
    paths=[]
    for p in ROOT.iterdir():
        if p.is_symlink(): raise ValueError("Symlink forbidden: "+str(p))
        if p.is_file() and (p.name in ROOT_FILES or p.suffix in {".html",".css",".js"}):
            paths.append(p)
        if p.is_dir() and p.name in PUBLIC_DIRS:
            for child in p.rglob("*"):
                if child.is_symlink():raise ValueError("Symlink forbidden: "+str(child))
                if child.is_file() and child.suffix.lower() in FORMATS: paths.append(child)
    return sorted(paths)
def build(origin,base,out,report):
    site=clean_origin(origin)+clean_path(base)
    target=Path(out).resolve()
    if target==ROOT or target in ROOT.parents:raise ValueError("Output would overwrite source")
    if target.is_relative_to(ROOT) and target.relative_to(ROOT).parts[0] not in (
        "dist","dist-preview","artifacts"):
        raise ValueError("Write output only under dist, dist-preview or artifacts")
    if target.exists():shutil.rmtree(target)
    target.mkdir(parents=True)
    data=[]
    for source in source_files():
        rel=source.relative_to(ROOT)
        new=target/rel
        new.parent.mkdir(parents=True,exist_ok=True)
        original=source.read_bytes()
        value=original
        if source.suffix.lower() in TEXT:
            value=original.decode("utf8").replace(CURRENT,site).encode("utf8")
        new.write_bytes(value)
        data.append({"path":rel.as_posix(),"sha256":hash_bytes(value),
                     "source_sha256":hash_bytes(original),"changed":value!=original})
    if not data:raise RuntimeError("No site files were selected")
    manifest=json.loads((target/"manifest.webmanifest").read_text("utf8"))
    if manifest.get("start_url")!="./" or manifest.get("scope")!="./":
        raise RuntimeError("PWA manifest scope must remain relative")
    forbidden=["README.md","anteprima/index.html",".github/workflows/pages.yml",
               "scripts/scan_events.py","tests/ui-smoke.mjs","docs/"]
    if any((target/p).exists() for p in forbidden):
        raise RuntimeError("Internal source materials included in site build")
    if site!=CURRENT:
        for info in data:
            p=target/info["path"]
            if p.suffix in TEXT and CURRENT in p.read_text("utf8"):
                raise RuntimeError("Legacy site address left in: "+str(p))
    result={"schemaVersion":1,"siteBase":site,"siteOrigin":clean_origin(origin),
            "basePath":clean_path(base),"fileCount":len(data),
            "rewritten":[d["path"] for d in data if d["changed"]],
            "sourceUnchanged":True,"files":data,
            "externalMediaDependency":"https://manzo8b.github.io/Lune_X/"}
    report_path=Path(report)
    report_path.parent.mkdir(parents=True,exist_ok=True)
    report_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print(json.dumps({"base":site,"files":len(data),"rewritten":len(result["rewritten"]),
                      "internalFilesExcluded":True},ensure_ascii=False))
    return result
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--origin",default=os.getenv("SITE_ORIGIN","https://manzo8b.github.io"))
    parser.add_argument("--base-path",default=os.getenv("BASE_PATH","/Torremolinos/"))
    parser.add_argument("--out",default="dist")
    parser.add_argument("--report",default="artifacts/portability/build-manifest.json")
    args=parser.parse_args()
    build(args.origin,args.base_path,args.out,args.report)

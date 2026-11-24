#!/usr/bin/env python3
"""P0-01/P0-10: build deployable static files without changing site design.
Defaults to current GitHub Pages origin. Use SITE_ORIGIN and BASE_PATH for staging.
Only project canonical/schema/OG/sitemap links are moved; LUNE_X stays external.
"""
import argparse
import hashlib
import gzip
import tinycss2
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
# Scanner reference data is for editorial maintenance, not for website visitors.
INTERNAL_FILE_PATHS={"agenda/scanner-baseline.json"}

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
    return sorted(p for p in paths if p.relative_to(ROOT).as_posix() not in INTERNAL_FILE_PATHS)
# Bundle only the ordered root-level Home styles. Relative URLs stay relative
# to the same root, and original styles remain available to every other route.
HOME_CSS=("editorial.css","v06.css","refinement.css","coastal-light.css",
          "design-system-2026.css","apple-premium.css","craft-finish.css",
          "craft-refinement.css","commercial-experience.css","product-v6.css",
          "narrative-v7.css","luminosity-v8.css","approved-clean-2026.css",
          "footer-professional-2026.css")
BUNDLE="home-render.css"
GALLERY_BUNDLE="gallery-render.css"
HOME_RUNTIME="home-initial.js"
GALLERY_CSS=HOME_CSS[3:12]
GENERATED={BUNDLE,GALLERY_BUNDLE,HOME_RUNTIME}
CSS_LINK=re.compile(r'<link rel="stylesheet" href="([^"]+\.css)">')
UNSAFE_AT=re.compile(r"@(?:import|charset|namespace)\b",re.I)

# A token-aware selector split is essential: commas inside :is(), :not(),
# attribute values and other functions are not selector-list separators.
def route_css(css,body_class,coast):
    import re
    def incompatible(tokens):
        s=tinycss2.serialize(tokens).strip()
        # Only test an explicit leading body compound, never a descendant.
        if not re.match(r"^body(?=[.\[:#\s>+~]|$)",s,re.I):return False
        rest=s[4:]
        # Match only the contiguous compound immediately following body.
        # Deliberately retain uncertain/complex selectors instead of guessing.
        while rest:
            m=re.match(r"^\.(torre-home|torre-comer|torre-agenda|torre-seasonal)(?![\w-])",rest)
            if m:
                if m.group(1)!=body_class:return True
                rest=rest[m.end():];continue
            m=re.match(r"^\[data-coast\s*=\s*(['\"]?)([a-z-]+)\1\]",rest,re.I)
            if m:
                if m.group(2)!=coast:return True
                rest=rest[m.end():];continue
            if rest.startswith("[data-coast]"):
                rest=rest[len("[data-coast]"):];continue
            if rest.startswith(":not(.torre-home)"):
                if body_class=="torre-home":return True
                rest=rest[len(":not(.torre-home)"):];continue
            break
        return False
    def split(tokens):
        groups=[[]]
        for t in tokens:
            if t.type=="literal" and t.value==",":groups.append([])
            else:groups[-1].append(t)
        return groups
    def visit(rules):
        out=[]
        for r in rules:
            if r.type=="error":raise ValueError("CSS parse error: "+r.message)
            if r.type=="qualified-rule":
                selectors=[tinycss2.serialize(s).strip() for s in split(r.prelude) if not incompatible(s)]
                if selectors:out.append(",".join(selectors)+"{"+tinycss2.serialize(r.content)+"}")
            elif r.type=="at-rule" and r.content is not None and r.lower_at_keyword in {"media","supports","container","layer"}:
                body=visit(tinycss2.parse_rule_list(r.content,skip_comments=True,skip_whitespace=True))
                if body:out.append("@"+r.at_keyword+tinycss2.serialize(r.prelude)+"{"+body+"}")
            else:out.append(tinycss2.serialize([r]))
        return "\n".join(out)
    return visit(tinycss2.parse_stylesheet(css,skip_comments=True,skip_whitespace=True))

def distribution_files(site, optimize=True):
    sources={p.relative_to(ROOT).as_posix():p for p in source_files()}
    if GENERATED.intersection(sources):raise ValueError("Generated files must not be committed in source")
    files={}
    for name,p in sources.items():
        value=p.read_bytes()
        if p.suffix.lower() in TEXT:value=value.decode("utf8").replace(CURRENT,site).encode("utf8")
        files[name]=value
    details={"optimized":optimize,"homeLocalStylesBefore":len(HOME_CSS),"homeLocalStylesAfter":len(HOME_CSS)}
    if not optimize:return files,details
    home=files["index.html"].decode("utf8")
    head,tail=home.split("</head>",1)
    found=tuple(CSS_LINK.findall(head))
    if found!=HOME_CSS:raise ValueError("Unexpected Home stylesheet cascade: "+repr(found))
    # No non-CSS markup or script execution order changes; replace the first
    # link, remove the other 13 links. All styles follow the inline Home CSS.
    if head.rfind("</style>")>head.index(CSS_LINK.search(head).group(0)):
        raise ValueError("Inline style interleaved with bundle inputs")
    # Route-aware CSS: remove only selectors provably excluded by the fixed
    # body class or data-coast value; no coverage-based removal or async CSS.
    def combine(names,body_class,coast):
        chunks=[]
        for name in names:
            css=files[name].decode("utf8")
            if UNSAFE_AT.search(css):raise ValueError("CSS at-rule requires manual handling: "+name)
            chunks.append("/* "+name+" */\n"+route_css(css,body_class,coast))
        return "\n".join(chunks).encode("utf8")
    combined=combine(HOME_CSS,"torre-home","green")
    count=0
    def link(match):
        nonlocal count
        count+=1
        return '<link rel="stylesheet" href="'+BUNDLE+'">' if count==1 else ''
    head=CSS_LINK.sub(link,head)
    # Main inline script was executed before deferred album-motion and the
    # remaining runtime scripts. Preserve that order with external defer.
    inline=re.compile(r'<script>([\s\S]*?)</script>')
    matches=list(inline.finditer(tail))
    if len(matches)!=1:raise ValueError("Unexpected Home inline scripts")
    script=matches[0].group(1)
    album='<script src="album-motion.js" defer></script>'
    if head.count(album)!=1:raise ValueError("Unexpected album-motion script")
    head=head.replace(album,"")
    tail=inline.sub('<script src="'+HOME_RUNTIME+'" defer></script>'+album,tail,count=1)
    files["index.html"]=(head+"</head>"+tail).encode("utf8")
    files[HOME_RUNTIME]=script.encode("utf8")
    files[BUNDLE]=combined
    gallery=files["gallery/index.html"].decode("utf8")
    gh,gt=gallery.split("</head>",1)
    links=re.compile(r'<link rel="stylesheet" href="\.\./([^"]+\.css)">')
    if tuple(links.findall(gh))!=GALLERY_CSS:raise ValueError("Unexpected Gallery cascade")
    gallery_combined=combine(GALLERY_CSS,None,"blue")
    gcount=0
    def gallery_link(match):
        nonlocal gcount
        gcount+=1
        return '<link rel="stylesheet" href="../'+GALLERY_BUNDLE+'">' if gcount==1 else ''
    files["gallery/index.html"]=(links.sub(gallery_link,gh)+"</head>"+gt).encode("utf8")
    files[GALLERY_BUNDLE]=gallery_combined
    # Dist uses its own deterministic revision, including all assets and SW
    # logic. Source remains the separately testable v35. Avoid stale bundles
    # on upgrade or rollback without touching caches of other projects.
    sw=files["service-worker.js"].decode("utf8")
    if "const FILES=[" not in sw:raise ValueError("Missing precache array")
    sw=sw.replace("const FILES=[","const FILES=[\n  "+",".join("'./"+n+"'" for n in sorted(GENERATED))+",",1)
    files["service-worker.js"]=sw.encode("utf8")
    digest=hashlib.sha256()
    for name,value in sorted(files.items()):
        digest.update(name.encode("utf8")+b"\0"+hashlib.sha256(value).digest())
    cache="torremolinos-h"+digest.hexdigest()[:16]
    sw,n=re.subn(r"const CACHE='torremolinos-[A-Za-z0-9-]+';", "const CACHE='"+cache+"';",sw,count=1)
    if n!=1:raise ValueError("Missing versioned cache")
    files["service-worker.js"]=sw.encode("utf8")
    details.update({"homeLocalStylesAfter":1,"bundle":BUNDLE,"bundleInputs":list(HOME_CSS),
      "bundleSHA256":hash_bytes(combined),"bundleBytes":len(combined),
      "bundleGzipBytes":len(gzip.compress(combined,mtime=0)),
      "originalCssBytes":sum(len(files[n]) for n in HOME_CSS),
      "originalCssGzipBytes":sum(len(gzip.compress(files[n],mtime=0)) for n in HOME_CSS),
      "cache":cache,"generated":sorted(GENERATED),"transformed":["index.html","gallery/index.html","service-worker.js"],
      "galleryBundleBytes":len(gallery_combined),"galleryOriginalCssBytes":sum(len(files[n]) for n in GALLERY_CSS),
      "galleryLocalStylesBefore":len(GALLERY_CSS)+1,"galleryLocalStylesAfter":2,
      "homeExternalRuntimeBytes":len(files[HOME_RUNTIME]),"homeHtmlBytes":len(files["index.html"])})
    return files,details

def build(origin,base,out,report,optimize=True):
    site=clean_origin(origin)+clean_path(base)
    target=Path(out).resolve()
    if target==ROOT or target in ROOT.parents:raise ValueError("Output would overwrite source")
    if target.is_relative_to(ROOT) and target.relative_to(ROOT).parts[0] not in (
        "dist","dist-preview","artifacts"):
        raise ValueError("Write output only under dist, dist-preview or artifacts")
    if target.exists():shutil.rmtree(target)
    target.mkdir(parents=True)
    data=[]
    files,optimization=distribution_files(site,optimize)
    for name,value in sorted(files.items()):
        new=target/name
        new.parent.mkdir(parents=True,exist_ok=True)
        source=ROOT/name
        original=source.read_bytes() if source.is_file() else None
        new.write_bytes(value)
        data.append({"path":name,"sha256":hash_bytes(value),
                     "source_sha256":hash_bytes(original) if original is not None else None,
                     "changed":value!=original})
    if not data:raise RuntimeError("No site files were selected")
    manifest=json.loads((target/"manifest.webmanifest").read_text("utf8"))
    if manifest.get("start_url")!="./" or manifest.get("scope")!="./":
        raise RuntimeError("PWA manifest scope must remain relative")
    forbidden=["agenda/scanner-baseline.json","README.md","anteprima/index.html",".github/workflows/pages.yml",
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
            "sourceUnchanged":True,"files":data,"optimization":optimization,
            "externalMediaDependency":"https://manzo8b.github.io/Lune_X/"}
    report_path=Path(report)
    report_path.parent.mkdir(parents=True,exist_ok=True)
    report_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print(json.dumps({"base":site,"files":len(data),"rewritten":len(result["rewritten"]),
                      "internalFilesExcluded":True,"optimization":optimization},ensure_ascii=False))
    return result
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--origin",default=os.getenv("SITE_ORIGIN","https://manzo8b.github.io"))
    parser.add_argument("--base-path",default=os.getenv("BASE_PATH","/Torremolinos/"))
    parser.add_argument("--out",default="dist")
    parser.add_argument("--report",default="artifacts/portability/build-manifest.json")
    parser.add_argument("--unoptimized",action="store_true",help="Build control package without bundling")
    args=parser.parse_args()
    build(args.origin,args.base_path,args.out,args.report,not args.unoptimized)

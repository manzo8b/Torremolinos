#!/usr/bin/env python3
"""Strict visual non-regression gate (P0-00).

Usage:
 python3 scripts/compare_visual_baseline.py baseline/reference/screenshots baseline/runs/screenshots
Both directories must come from the same Chromium/Playwright environment and
include identical route/viewport/language PNG sets. Rejected if >0.1% pixels
differ in any screenshot (a strict guard, not an approval to change design).
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from PIL import Image, ImageChops

def main():
    p=argparse.ArgumentParser()
    p.add_argument("reference")
    p.add_argument("candidate")
    p.add_argument("--max-diff",type=float,default=.001)
    args=p.parse_args()
    ref=Path(args.reference)
    new=Path(args.candidate)
    if not 0<=args.max_diff<=1: p.error("--max-diff must be in [0,1]")
    originals={x.relative_to(ref) for x in ref.rglob("*.png")}
    candidates={x.relative_to(new) for x in new.rglob("*.png")}
    if not originals: raise SystemExit("NO-GO: reference has no PNG screenshots")
    if originals!=candidates:
        print(json.dumps({"missing":[str(x) for x in sorted(originals-candidates)],
           "unexpected":[str(x) for x in sorted(candidates-originals)]},indent=2))
        raise SystemExit("NO-GO: screenshot coverage mismatch")
    failures=[]
    for rel in sorted(originals):
        with Image.open(ref/rel) as a,Image.open(new/rel) as b:
            if a.size!=b.size:
                failures.append([str(rel),"dimensions",a.size,b.size])
                continue
            left=a.convert("RGB")
            right=b.convert("RGB")
            change=ImageChops.difference(left,right)
            bbox=change.getbbox()
            count=0
            if bbox:
                # Difference count across channels, not average brightness.
                for v in change.getdata():
                    if v!=(0,0,0):count+=1
            fraction=count/(a.width*a.height)
            if fraction>args.max_diff:
                failures.append([str(rel),"pixel_fraction",round(fraction,7)])
    print(json.dumps({"checked":len(originals),"limit":args.max_diff,
        "failed":len(failures),"examples":failures[:40]},indent=2))
    if failures:raise SystemExit("NO-GO: design freeze visual regression")
if __name__=="__main__":main()

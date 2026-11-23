"""P0-01/P0-10 regression: current production files unchanged, portable URLs."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
TOOL=ROOT/"scripts/build_portable_site.py"
CURRENT="https://manzo8b.github.io/Torremolinos/"

def run_build(output,report,origin=None,path=None):
    args=[sys.executable,str(TOOL),"--out",str(output),"--report",str(report)]
    if origin:args+=["--origin",origin]
    if path:args+=["--base-path",path]
    return subprocess.run(args,cwd=ROOT,text=True,capture_output=True)

class Portability(unittest.TestCase):
    def test_current_public_site_is_byte_identical(self):
        with tempfile.TemporaryDirectory() as tmp:
            out,report=Path(tmp)/"dist",Path(tmp)/"audit.json"
            result=run_build(out,report)
            self.assertEqual(result.returncode,0,result.stderr)
            meta=json.loads(report.read_text("utf8"))
            self.assertEqual(meta["siteBase"],CURRENT)
            self.assertGreater(meta["fileCount"],75)
            self.assertEqual(meta["rewritten"],[],"Current public pages must not be rewritten")
            for item in meta["files"]:
                self.assertEqual(item["sha256"],item["source_sha256"],item["path"])
                self.assertTrue((out/item["path"]).is_file())
            for forbidden in [
                "README.md","DESIGN-CONTRACT.md","anteprima/index.html",
                "scripts/fixtures/madbear.html","tests/ui-smoke.mjs",
                "docs/AUDIT_TRIAGE_2026-11-23.md",
                ".github/workflows/pages.yml",
            ]:self.assertFalse((out/forbidden).exists(),forbidden)
            self.assertTrue((out/"assets/photos/sound-headphones-torremolinos.webp").exists())
            self.assertTrue((out/"service-worker.js").exists())
            self.assertTrue((out/".nojekyll").exists())

    def test_another_origin_and_subpath_rewrites_only_internal_urls(self):
        with tempfile.TemporaryDirectory() as tmp:
            out,report=Path(tmp)/"preview",Path(tmp)/"audit.json"
            result=run_build(out,report,"https://preview.example","/guide/")
            self.assertEqual(result.returncode,0,result.stderr)
            meta=json.loads(report.read_text("utf8"))
            self.assertEqual(meta["siteBase"],"https://preview.example/guide/")
            self.assertGreater(len(meta["rewritten"]),10)
            for name in ["index.html","comer/index.html","agenda/index.html",
                         "gallery/index.html","listen/index.html",
                         "stories/index.html","sitemap.xml","robots.txt"]:
                data=(out/name).read_text("utf8")
                self.assertNotIn(CURRENT,data,name)
                self.assertIn("https://preview.example/guide/",data,name)
            html=(out/"index.html").read_text("utf8")
            self.assertIn('href="manifest.webmanifest"',html)
            self.assertIn('src="approved-clean-2026.js"',html)
            self.assertIn("https://manzo8b.github.io/Lune_X/",html,
                          "Music is an independent third-party dependency")
            self.assertEqual((out/"approved-clean-2026.css").read_bytes(),
                             (ROOT/"approved-clean-2026.css").read_bytes())
            self.assertEqual((out/"approved-clean-2026.js").read_bytes(),
                             (ROOT/"approved-clean-2026.js").read_bytes())
            self.assertEqual((out/"service-worker.js").read_bytes(),
                             (ROOT/"service-worker.js").read_bytes())
            self.assertEqual((out/"manifest.webmanifest").read_bytes(),
                             (ROOT/"manifest.webmanifest").read_bytes())

    def test_refuse_invalid_targets(self):
        with tempfile.TemporaryDirectory() as tmp:
            out=Path(tmp)/"site"
            report=Path(tmp)/"report.json"
            for origin,path in [("https://preview.example/path","/guide/"),
                                ("https://preview.example","/../"),
                                ("https://preview.example","guide"),
                                ("file:///unsafe","/")]:
                result=run_build(out,report,origin,path)
                self.assertNotEqual(result.returncode,0,(origin,path))
                self.assertFalse(out.exists(),"Invalid build must fail before modifying output")

if __name__=="__main__":unittest.main()

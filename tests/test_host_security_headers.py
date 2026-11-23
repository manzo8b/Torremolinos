"""P0-09 test: ensure headers are valid, scoped, and never alter the live site."""
from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/generate_security_headers.py"
spec = importlib.util.spec_from_file_location("torre_headers", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class HostHeadersTest(unittest.TestCase):
    def test_cloudflare_and_netlify_share_supported_static_syntax(self):
        root = mod.render("/")
        sub = mod.render("/guide/")
        self.assertIn("\n/*\n", root)
        self.assertIn("\n/service-worker.js\n  Cache-Control: no-cache", root)
        self.assertIn("\n/guide/*\n", sub)
        self.assertIn("\n/guide/service-worker.js\n", sub)
        self.assertNotIn("\n/*\n", sub)
        for text in [root, sub]:
            self.assertIn("X-Content-Type-Options: nosniff", text)
            self.assertIn("Referrer-Policy: strict-origin-when-cross-origin", text)
            self.assertIn("X-Frame-Options: DENY", text)
            self.assertIn("Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'", text)
            self.assertIn("Content-Security-Policy-Report-Only:", text)
            self.assertIn("frame-src https://www.openstreetmap.org", text)
            self.assertIn("media-src 'self' https://manzo8b.github.io", text)
            self.assertIn("font-src 'self' data: https://fonts.gstatic.com", text)
            self.assertNotIn("Strict-Transport-Security:", text)
            self.assertNotIn("upgrade-insecure-requests", text)
            self.assertNotIn("includeSubDomains", text)
            self.assertNotIn("report-uri https://", text)
            self.assertNotIn("Cache-Control: public, max-age=31536000", text)
            self.assertNotIn("Content-Security-Policy: default-src 'none'", text)
            self.assertTrue(all(line.startswith("  ") for line in text.splitlines()
                                if line.startswith("Content-") is False and
                                line.startswith("  Content-")))

    def test_base_prefix_must_be_a_safe_directory(self):
        for bad in ["guide", "/guide", "//guide/", "/../", "/x/../", "/name with spaces/",
                    "/x?y/", "/é/", "/foo//bar/"]:
            with self.assertRaises(ValueError, msg=bad):
                mod.render(bad)
        self.assertIn("\n/Torremolinos/*\n", mod.render("/Torremolinos/"))

    def test_hsts_pilot_is_opt_in_only_for_verified_dedicated_root(self):
        for params in [
            {"enable_short_hsts": True},
            {"enable_short_hsts": True, "custom_domain_verified": True},
        ]:
            if params.get("custom_domain_verified"):
                with self.assertRaises(ValueError):
                    mod.render("/guide/", **params)
            else:
                with self.assertRaises(ValueError):
                    mod.render("/", **params)
        h = mod.render("/", enable_short_hsts=True, custom_domain_verified=True)
        self.assertIn("Strict-Transport-Security: max-age=300", h)
        self.assertNotIn("includeSubDomains", h)
        self.assertNotIn("preload", h)

    def test_providers_output_only_staging_files_and_do_not_change_site(self):
        source_files = [ROOT / "index.html", ROOT / "approved-clean-2026.css",
                        ROOT / "service-worker.js", ROOT / "manifest.webmanifest"]
        before = [hashlib.sha256(f.read_bytes()).hexdigest() for f in source_files]
        with tempfile.TemporaryDirectory(dir=ROOT / "artifacts") as base:
            base_path = Path(base)
            for provider in ["netlify", "cloudflare-pages"]:
                out = base_path / provider / "_headers"
                report = base_path / (provider + "-report.json")
                command = [sys.executable, str(SCRIPT),
                           "--provider", provider,
                           "--base-path", "/guide/",
                           "--out", str(out),
                           "--report", str(report)]
                result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(out.is_file())
                self.assertTrue(report.is_file())
                self.assertEqual(json.loads(report.read_text())["provider"], provider)
                self.assertNotIn("Strict-Transport-Security:", out.read_text())
        after = [hashlib.sha256(f.read_bytes()).hexdigest() for f in source_files]
        self.assertEqual(before, after)
        self.assertFalse((ROOT / "_headers").exists(), "Never publish headers on GitHub Pages root")
        self.assertFalse((ROOT / "netlify.toml").exists(), "Never activate unapproved hosting config")

    def test_wrong_output_and_host_flags_fail_closed(self):
        with tempfile.TemporaryDirectory(dir=ROOT / "artifacts") as base:
            out = Path(base) / "test" / "_headers"
            report = Path(base) / "report.json"
            for args in [
                ["--out", str(ROOT / "_headers")],
                ["--out", str(out), "--report", str(report), "--base-path", "/../"],
                ["--out", str(out), "--report", str(report), "--enable-short-hsts"],
                ["--out", str(out), "--report", str(report), "--enable-short-hsts",
                 "--custom-domain-verified", "--base-path", "/guide/"],
            ]:
                result = subprocess.run([sys.executable, str(SCRIPT), *args],
                                        cwd=ROOT, capture_output=True, text=True)
                self.assertNotEqual(result.returncode, 0, str(args))
        self.assertFalse((ROOT / "_headers").exists())


if __name__ == "__main__":
    unittest.main()

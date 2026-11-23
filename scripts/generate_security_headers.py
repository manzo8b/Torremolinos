#!/usr/bin/env python3
"""P0-09 — Generate staging-only HTTP response headers for static hosts.

Supported: Cloudflare Pages and Netlify (_headers static asset format).
GitHub Pages ignores this configuration. This script never changes HTML/CSS/JS,
and by default writes ONLY under artifacts/hosting-staging/.

Examples:
 python3 scripts/generate_security_headers.py --provider cloudflare-pages
 python3 scripts/generate_security_headers.py --provider netlify --base-path /guide/ \
   --out artifacts/hosting-staging/netlify-guide/_headers
 python3 scripts/generate_security_headers.py --base-path / \
   --custom-domain-verified --enable-short-hsts

Do not publish generated headers before full browser + CSP review.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT = ROOT / "artifacts/hosting-staging/root/_headers"
ALLOWED_OUTPUT_ROOTS = ("artifacts", "dist", "dist-preview")

# Audit inventory (23 Nov 2026):
# - Google Fonts stylesheets & fonts: fonts.googleapis.com, fonts.gstatic.com
# - Existing inline scripts/styles: numerous published HTML pages
# - Documentary imagery: Wikimedia Special:FilePath and local assets
# - Sound preview: manzo8b.github.io/Lune_X/ (separate external project)
# - On-demand embedded map: www.openstreetmap.org
# - links out to Google Maps, official sources, YouTube, DistroKid:
#   top-level navigation is not governed by connect-src/frame-src.
#
# Full resource CSP remains report-only until same-site browser verification.
MONITOR_CSP = (
    "default-src 'self'; "
    "script-src 'self' 'unsafe-inline'; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    "img-src 'self' data: blob: https:; "
    "font-src 'self' data: https://fonts.gstatic.com; "
    "media-src 'self' https://manzo8b.github.io; "
    "connect-src 'self' https://manzo8b.github.io; "
    "frame-src https://www.openstreetmap.org; "
    "worker-src 'self'; "
    "manifest-src 'self'; "
    "form-action 'self'; "
    "object-src 'none'; "
    "base-uri 'self'"
)

# These three directives do not block the currently supported embeds, inline
# scripts, stylesheet imports or direct outbound links, but protect framing,
# plugin execution and malicious <base> rewrites.
ENFORCED_CSP = "frame-ancestors 'none'; object-src 'none'; base-uri 'self'"

BASE_HEADERS = (
    ("X-Content-Type-Options", "nosniff"),
    ("Referrer-Policy", "strict-origin-when-cross-origin"),
    ("X-Frame-Options", "DENY"),
    ("Permissions-Policy", "camera=(), microphone=(), payment=()"),
    ("Content-Security-Policy", ENFORCED_CSP),
    ("Content-Security-Policy-Report-Only", MONITOR_CSP),
)


def validate_base_path(raw: str) -> str:
    value = raw.strip()
    if not re.fullmatch(r"/(?:[A-Za-z0-9_-]+/)*", value):
        raise ValueError("base path must be / or /folder/ (directory suffix / required)")
    return value


def render(base_path: str, *, enable_short_hsts: bool = False,
           custom_domain_verified: bool = False) -> str:
    base_path = validate_base_path(base_path)
    if enable_short_hsts and (not custom_domain_verified or base_path != "/"):
        raise ValueError("HSTS requires verified dedicated HTTPS domain at /")
    rule = base_path + "*"
    lines = [
        "# P0-09: deployment candidate ONLY — not active on GitHub Pages.",
        "# Compatible with Cloudflare Pages static assets and Netlify _headers.",
        "# Full resource CSP is REPORT-ONLY; review browser violations before enforcement.",
        rule,
    ]
    headers = list(BASE_HEADERS)
    if enable_short_hsts:
        # Low-risk pilot ONLY after HTTPS across the whole dedicated hostname;
        # HSTS is host-wide, even if sent for a single URL path.
        headers.append(("Strict-Transport-Security", "max-age=300"))
    for name, value in headers:
        lines.append("  " + name + ": " + value)

    # The registered service-worker must be revalidated on every visit.
    # No global cache rule: public filenames are not all content-hashed.
    lines.extend([
        "",
        base_path + "service-worker.js",
        "  Cache-Control: no-cache",
        "",
    ])
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--provider", choices=("cloudflare-pages", "netlify"),
                        default="cloudflare-pages")
    parser.add_argument("--base-path", default="/")
    parser.add_argument("--out", default=str(DEFAULT_OUT))
    parser.add_argument("--report",
                        default="artifacts/hosting-staging/headers-report.json")
    parser.add_argument("--custom-domain-verified", action="store_true")
    parser.add_argument("--enable-short-hsts", action="store_true")
    args = parser.parse_args()
    text = render(args.base_path, enable_short_hsts=args.enable_short_hsts,
                  custom_domain_verified=args.custom_domain_verified)
    output = Path(args.out).resolve()
    if output.name != "_headers":
        parser.error("output file must be named _headers")
    if output == ROOT or not output.is_relative_to(ROOT):
        parser.error("output must stay inside the checkout")
    if output.relative_to(ROOT).parts[0] not in ALLOWED_OUTPUT_ROOTS:
        parser.error("output must be within artifacts/, dist/ or dist-preview/")
    if output.is_symlink():
        parser.error("refusing to overwrite a symlink")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")
    report_path = Path(args.report).resolve()
    if not report_path.is_relative_to(ROOT) or report_path.relative_to(ROOT).parts[0] != "artifacts":
        parser.error("report must be inside artifacts/")
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "schemaVersion": 1, "provider": args.provider,
        "basePath": validate_base_path(args.base_path),
        "generatedFile": str(output.relative_to(ROOT)),
        "hostHeadersSupported": True,
        "githubPagesCompatibility": "NOT SUPPORTED — does not affect public site",
        "resourceCSPMode": "report-only",
        "cspViolationCollection": "Browser developer tools only; no report endpoint configured",
        "hstsIncluded": bool(args.enable_short_hsts),
        "currentDeploymentUnchanged": True,
    }
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()

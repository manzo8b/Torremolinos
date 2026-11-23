#!/usr/bin/env python3
"""Loopback-only test server simulating a static host that applies _headers.

For P0-09 Chromium QA only. Real Netlify/Cloudflare header application must
still be tested on a real staging deployment before a provider cutover.
"""
from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


def load_header_rules(filename: Path):
    rules = []
    for line in filename.read_text(encoding="utf8").splitlines():
        if not line or line.startswith("#"):
            continue
        if line.startswith("  "):
            if not rules or ": " not in line:
                raise ValueError("Malformed _headers line: " + line)
            key, value = line.strip().split(": ", 1)
            rules[-1][1].append((key, value))
        else:
            if not line.startswith("/"):
                raise ValueError("Invalid path pattern: " + line)
            rules.append([line, []])
    if not rules:
        raise ValueError("No header rules provided")
    return rules


class Handler(SimpleHTTPRequestHandler):
    header_rules = ()

    def end_headers(self):
        request_path = urlsplit(self.path).path
        for pattern, headers in self.header_rules:
            matches = (request_path.startswith(pattern[:-1]) if pattern.endswith("*")
                       else request_path == pattern)
            if matches:
                for key, value in headers:
                    self.send_header(key, value)
        super().end_headers()

    def log_message(self, *args):
        pass


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--headers", required=True)
    p.add_argument("--directory", default=".")
    p.add_argument("--port", type=int, default=18952)
    args = p.parse_args()
    rules = load_header_rules(Path(args.headers))
    cls = type("HeaderPreviewHandler", (Handler,), {"header_rules": rules})
    httpd = ThreadingHTTPServer(
        ("127.0.0.1", args.port),
        partial(cls, directory=str(Path(args.directory).resolve())),
    )
    print("Local-only headers preview on port", args.port, flush=True)
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()

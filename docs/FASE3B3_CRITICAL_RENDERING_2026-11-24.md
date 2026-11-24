# TORREMOLINOS — Fase 3B.3: Critical Rendering Path
24/11/2026. PR #21 draft. No merge or deploy.

## v35 verified (Lighthouse run 45342901918)
Home mobile performance 67, LCP 6684 ms, 16 render-blocking resources, estimated savings 2490 ms. Home desktop 90, Comer 80, Agenda 79, Gallery 52, Sound 84, Stories 74, Nogalera 90. Accessibility, Best Practices and SEO 100 across all eight groups. Agenda TBT 671 → 95 ms. Gallery CLS .8446 → .4301, still above .1 and LCP worse. Stories performance 86 → 74, despite BP 77 → 100. No claims of improvement for those two. Browser test confirms stable first Gallery card height, six Sound languages, real Wikimedia image decode, and offline two prefixes. Home pixel parity still failed .24947%, not waived. Static product test expected literal heading selector; restore literal initial query while retaining incremental observer.

## Candidate transformation
Build defaults to optimized Home: combine 14 root CSS in exact existing cascade order into home-render.css. Source files and HTML retained; no deletion, no minification, no async CSS/FOUC, no design change. Bundle in root so relative URLs resolve as before. Fail closed if stylesheet order changes or import/charset/namespace requires explicit handling. Existing 14 styles remain for other routes. Only built index, worker and generated bundle differ at same origin; deterministic cache hash derived from all output assets/worker. Bundle precached; audits reconstruct and verify all exact expected output bytes rather than allowing arbitrary changes. Report uncompressed and estimated gzip bytes, not actual transfer. Original source build available via --unoptimized. No new hosting cost.

## Evidence required
- Independent unit tests exact concatenation, deterministic cache, preserved control bytes; two origin/prefix audits.
- Chromium actual local CSS requests 14 → 1, computed selected style/layout equality at 390 and 1280, unchanged strict pixel threshold .1%, offline fresh install and all functional/regression checks.
- Lighthouse same-run control (3 mobile Home samples) vs candidate (3 mobile Home, 3 desktop, 6 other routes): 15 samples total, medians and delta. Keep source CSS if benefit not confirmed or parity fails. Lab measurements, not field CWV. No assertion of achieved LCP or scores before CI.
- Gallery residual CLS and Stories LCP remain next targeted actions; typography/critical rules not removed blindly. Manual Safari/VoiceOver, legal/editorial release gates remain open.

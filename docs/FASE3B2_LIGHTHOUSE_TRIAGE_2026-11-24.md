# TORREMOLINOS — Fase 3B.2: Lighthouse triage
24/11/2026. PR #21; baseline v34 commit 96cf158; run 45341319029; artifact 14896745168.
No deploy. Lab: Home 67 mobile/90 desktop; Comer 80; Agenda 62; Gallery 54; Listen 84; Stories 86; Nogalera 89. SEO 100 in all 8 groups. Gallery CLS .8446 (main .82965, web-font attribution); Agenda TBT 671ms, apple-runtime 686ms long task; Home LCP 6755.6ms, render-blocking estimated 2240ms; Stories BP77 (Wikimedia redirect third-party cookies and inspector issues); Listen BP96 (Unexpected token '<' from nested script). Contrast failures Comer/Agenda/Stories/Nogalera; Home/Gallery axe zero in 3A. Offline two prefixes PASS 45341318920; Home 390 visual diff .24796% (822 pixels, 819 concentrated y575–599). No threshold relaxation.

## Corrective patch
- Gallery keeps approved card geometry visible during successful image loading; first photo preloaded/high priority, subsequent lazy, no pending-review art; no ready-only reflow. Stable category membership. Preconnect fonts.gstatic; loading status visually clipped but available to assistive tech. Fonts still may shift; retest.
- Incremental apple-runtime heading observer: initial scan once, changed/added headings only, not full-document rescan for unrelated mutations. Retains no terminal full stop invariant.
- Sound closes malformed first script, restores multilingual article and selector; high priority on same hero image.
- Stories direct licensed Wikimedia CDN assets (same photos, anonymous CORS, no referrer; source/attribution/licenses intact). CDN URLs verified as images from file pages; CORS decode must pass browser CI. No assertion cookies eliminated before new Lighthouse.
- Existing hues darkened on contrast targets in subpages; no geometry changes. Font preconnect on routes with missing hint. Home render-blocking CSS remains a separate optimization if LCP misses; do not blindly remove shared stylesheet rules. No redesign.
- v35 cache and static expectations synchronized. Browser regression validates gallery reserved height, six Sound languages, incremental headings, real image decode. Visual comparison waits for network idle, fonts and visible image decode; unchanged 0.1% threshold.
- Lighthouse summary includes diagnostic counts. New CI results required before declaring improvements. LCP/CLS lab are not field CWV. No new hosting expense.

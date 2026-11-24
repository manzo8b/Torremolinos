# TORREMOLINOS — Fase 3A / release candidate
24 novembre 2026. Nessuna pubblicazione.

## Provenienza
- main pubblico: eed4d7c3cae80acd03cc21453e0e879439b614fe.
- PR #19: c9428c7 (Fasi 2A–2E); PR #18: 4afdc7b (clean release), integrate in un ramo separato da main.
- PR #13 baseline 396 screenshot, non ancora gate golden persistente. PR #17 security headers simulati per hosting futuro: non attivare su GitHub Pages.
- Esiti #19: quality, product contract e verifica La Nogalera 12 campioni pass; contrast gate fail sul colore Pride calcolato. Correzione mirata al selettore legacy ad alta specificità; non rilassato assert.
- Offline: eliminati percorsi hardcoded e ritorno alla root del worker per fallback su route annidate.

## Gate 3A
1. Unittest build, audit asset e sitemap su dist e dist-preview, inventario/byte attesi, canonical, robots/noindex, precache e rapporto dimensioni.
2. Smoke Chromium dei due prefissi, offline fresh install e ritorno alla guida; confronto source/dist <=0,1%.
3. CI editoriale e contrasto sul commit candidato. Test reale iOS, upgrade di un'installazione esistente e baseline visiva storica restano aperti.
4. Artifacts CI separati, nessun deploy, nessuna modifica a pages.yml.
5. Report inventario non prova indicizzazione o Core Web Vitals; fase 3B misura prestazioni e verifica Search Console ove accessibile.
6. Fase 3C: titolarità/recapito, privacy/cookie/condizioni/accessibilità, ANDALUZ, licenze audio/foto, revisione lingue/fonti, manual QA. Issue #1 e #20 aperte.
7. Fase 3D solo dopo autorizzazione: modificare workflow Pages per build e gate dist; caricare solo dist, non reports. Verificare produzione e rollback.

## Rollback (procedura da collaudare, non eseguita)
- Registrare SHA main e run Pages ultima nota, salvare pacchetto e hash della candidata.
- Se gate o smoke post-release falliscono, interrompere ulteriori deploy, ripristinare contenuti/workflow all'ultimo SHA buono tramite PR revert (non force-push).
- In presenza di cache obsoleta, nuova revisione worker esplicita con test offline; non cancellare cache di altri progetti.
- Rieseguire Pages, smoke URL principali, sitemap, manifest e controllare cache iOS. Annotare SHA e risultati; nessun rollback automatico senza autorizzazione.

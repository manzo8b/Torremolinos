# TORREMOLINOS — P0-00 Visual Design Freeze

**Riferimento immutabile:** branch `baseline/pre-fix-2026-11-23`, creato dalla commit `088a622a2055194cca3c577750fe5b0e81f82a3e` di `main` il 23 novembre 2026. È una *branch di riferimento*, non un tag Git; non farvi commit.

**Regola contrattuale:** il design di produzione resta invariato. Nessuna modifica a HTML, CSS, JS, componenti, palette, layout o immagini senza autorizzazione esplicita. Priorità al rendering effettivo e a `DESIGN-CONTRACT.md` (prevalenza dell'aggiornamento White/Blue del 23 novembre).

## Come eseguire la baseline

- Lo script `node scripts/capture_visual_baseline.mjs` usa Chromium Playwright 1.57 e un server HTTP locale, senza mutare i file pubblici.
- Cattura **tutti i file HTML**, inclusi i documenti noindex, a **375 / 768 / 1280 / 1920 px**.
- Per ciascun percorso con selettore `#lang` cattura tutte le lingue disponibili tra `es/en/it/de/fr/ru`. Per le pagine senza cambio lingua cattura soltanto la lingua realmente esposta e registra la copertura mancante: **non inventa traduzioni**.
- La raccolta produce `baseline/runs/screenshots/`, `baseline/runs/tokens.json` e `baseline/runs/manifest.json`, con dimensioni, SHA-256 delle immagini, lingua effettiva, errori JS, nomi delle sezioni e token CSS calcolati.
- Il workflow `baseline-capture.yml` allega gli output alla run GitHub Actions, durata conservazione **90 giorni**. Il semplice superamento della run non è ancora il gate pixel completo.
- Dopo la prima run riuscita, congelare un archivio permanente delle immagini di riferimento, registrando runner/Chromium e hash; soltanto allora attivare `scripts/compare_visual_baseline.py` come controllo bloccante sui PR futuri. La soglia da audit è **0,1% per screenshot**. Fino a quel momento il gate è **non completato**.
- Per confrontare: `python3 -m pip install Pillow` e `python3 scripts/compare_visual_baseline.py baseline/reference/screenshots baseline/runs/screenshots`.

## Criteri P0-00 e P0-00b

- P0-00b confermato il **23 novembre 2026**: `main` a `088a622`; workflow GitHub Pages e controlli statici/funzionali su quel commit con conclusione `success`. URL live `https://manzo8b.github.io/Torremolinos/`; il controllo di risposta HTTP va certificato separatamente da un browser/connettore con rete.
- P0-00 non va marcato chiuso fino a screenshot reali, token raccolti, revisione dell'inventario lingue e riferimento permanente dei pixel.
- Se screenshot su browser diversi differiscono per rasterizzazione dei font, eseguire il confronto solo su runner e versione browser identici. **Non ritoccare CSS per far passare un confronto instabile.**

## Scoperte già validate vs audit originale

- Lo scanner Agenda **era attivo** al 22 novembre 2026; l'Issue #1 è aggiornata dai report. Il problema è la **revisione umana** degli eventi, ferma al 2 novembre, non l'assenza di esecuzioni automatiche.
- Le policy privacy/termini/accessibilità rimangono `noindex` in bozza: non rimuovere `noindex` o inventare identità/recapiti legali.
- Il sito usa canonical assolute sulla origine GitHub. In SEO la canonical finale deve essere una URL assoluta valida: non sostituirla con una relativa solo per soddisfare un grep. La migrazione richiederà un generatore con `SITE_ORIGIN` / `BASE_PATH` dopo la scelta del dominio.

**Data del protocollo:** 23 novembre 2026 · **Stato:** preparazione baseline, nessuna pubblicazione.

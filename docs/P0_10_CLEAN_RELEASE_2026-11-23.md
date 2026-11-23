# TORREMOLINOS — P0-10 · Distribuzione pubblica pulita

**Data:** 23 novembre 2026 · **Stato:** staging / prerelease, nessun merge o deploy  
**Base verificata:** ramo `main` al commit `eed4d7c3cae80acd03cc21453e0e879439b614fe` (footer professionale e PWA v28 inclusi).  
**Vincoli:** design congelato. Non cambiare pagine HTML, CSS, JS, fotografie, copy, player LUNE_X o URL pubbliche senza approvazione.

## Perché un ramo nuovo direttamente da main

La PR #14 preparava P0-01, ma è costruita sulla PR #13, precedente alle modifiche di footer e service worker già pubblicate. **Non usare quella storia Git per il rilascio**, altrimenti si rischia di riportare in produzione codice non aggiornato. P0-10 recupera gli script/test di portabilità, ma li innesta sull'ultimo `main`, controllando le nuove funzioni. PR #13, #14 e #17 restano indipendenti, in bozza, finché non verrà chiarita l'integrazione finale.

## Contenuto del nuovo pacchetto

`python3 scripts/build_portable_site.py --out dist` produce una copia dedicata al pubblico con URL di produzione invariati. I file elencati in `artifacts/release/current-build.json` hanno SHA-256 confrontabili con i sorgenti.

La distribuzione include Home, Comer, Agenda, Gallery, Stories, Listen, La Nogalera, pagine legali e their `noindex` existing, font/immagini locali, scripts, CSS, PWA, sitemap, robots e `.nojekyll`. Include correttamente il nuovo footer e `assets/photos/sound-headphones-torremolinos.webp`.

Sono esclusi esplicitamente: `README.md`, `.github/`, `docs/`, `scripts/`, `tests/`, `baseline/`, `anteprima/`, i file di lavoro e `agenda/scanner-baseline.json`, che è un riferimento interno dello scanner (non il feed pubblico `agenda/events.json`).

La build alternativa `dist-preview/` riscrive gli indirizzi del progetto verso un'origine ipotetica `https://preview.example/guide/`. **È solo un test di portabilità, non una URL pubblica**.

## Test automatici / release gate

1. **Test Python esistenti:** identità byte-per-byte tra sorgente e build GitHub Pages; nuova origine con riferimenti aggiornati; esclusione di documentazione e fixture.
2. **Manifest di release:** `scripts/audit_clean_release.py` verifica tutti gli asset statici referenziati da HTML/CSS, elenco di pagine obbligatorie, assenza di file interni, URL della sitemap e hash dei file. Questo controllo non copre tutte le URL prodotte da JavaScript né la raggiungibilità dei servizi esterni.
3. **Browser smoke:** usa Playwright sui due prefissi (`/Torremolinos/` e `/guide/`) a 390 e 1280 px. Verifica caricamento Home, sezione Sound, immagine, canonical, manifest, sezioni principali e console JS.
4. **Pixel parity:** `tests/clean-release-visual.mjs` acquisisce nel **medesimo browser/runner** il sito sorgente e `dist/` su Home, Comer, Agenda, Gallery, Stories, Listen, La Nogalera, Legal a 390 e 1280 px. Confronta i pixel delle schermate iniziali e del footer Home. Soglia massima **0,1% per immagine**. Durante il confronto sono bloccate le richieste ai CDN esterni **su entrambi** i siti, per un controllo ripetibile; la verifica visiva reale completa (font esterni, fotografie Wikimedia, dispositivi fisici) resta un gate separato.
5. **Output verificabile:** workflow `.github/workflows/clean-release.yml` allega il pacchetto `dist/`, rapporto SHA-256, test di asset e screenshot come artefatto di GitHub Actions. Non utilizza `deploy-pages`.

## Condizioni di pubblicazione futura

- Risolvere dipendenze e sovrapposizioni tra PR #13 (baseline), #14 (portabilità storica), #17 (header per provider futuro), senza rimuovere la protezione PWA già integrata.
- Prima di sostituire `path: '.'` con `path: 'dist'` nel workflow Pages, confermare QA completo, screenshot reali, test PWA con cache già installata e verifica di tutte le sezioni.
- Conservare la baseline del sito approvato; la grafica non deve essere rimaneggiata per far passare test.
- Non copiare audio LUNE_X senza conferma dei diritti (P0-02), non attivare HSTS/CSP da PR #17 su GitHub Pages e non pubblicare documenti legali come definitivi se ancora in revisione.
- Per ora il workflow principale di GitHub Pages rimane **invariato**, con caricamento della root. P0-10 fornisce un pacchetto provato ma non esegue il cutover.

**Decisione di rilascio:** NO GO automatico. La PR attende revisione esplicita.

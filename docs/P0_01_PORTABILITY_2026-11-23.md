# TORREMOLINOS — Fase 1 / P0-01 + preparazione P0-10

**Data:** 23 novembre 2026  
**Fonte:** audit utente `brief-sistemazione-torremolinos.md` (§5, P0-01 e P0-10); dipendenza tecnica dalla Fase 0 nella PR #13.  
**Stato:** build e test di staging, **nessuna modifica al sito live né autorizzazione di merge**.

## Obiettivo e vincoli

Trasferire il sito statico senza cambiarne l'identità visiva. `DESIGN-CONTRACT.md` e il rendering congelato hanno la precedenza; non si alterano tipografia, layout, palette, animazioni, fotografie, componenti o microcopy.

La build separa il contenuto **pubblicabile** dai sorgenti tecnici (test, scanner, documentazione, bozze). Il repository originale e il workflow Pages pubblicato rimangono invariati.

## Comandi

Build equivalente a GitHub Pages, con le stesse URL pubbliche:

```bash
python3 scripts/build_portable_site.py --out dist
```

Build di prova su provider o sottopercorso diverso:

```bash
SITE_ORIGIN=https://preview.example BASE_PATH=/guide/ \
  python3 scripts/build_portable_site.py --out dist-preview \
  --report artifacts/portability/preview-report.json
```

`SITE_ORIGIN` è un'origine assoluta HTTP(S), senza percorso. `BASE_PATH` è `/` o un sotto-percorso terminante con `/`. Il sito non usa un framework né un passaggio di compilazione CSS/JS.

## Cosa cambia, cosa resta identico

- I riferimenti assoluti del progetto `https://manzo8b.github.io/Torremolinos/` sono parametrizzati **solo nell'output**: canonical, Open Graph, JSON-LD, sitemap, robots e eventuali altri riferimenti alla stessa origine.
- Con la configurazione di produzione corrente i file pubblici, inclusi i metadati, sono **identici byte per byte** al repository. Non servono modifiche visive per la portabilità.
- Con una nuova origine il testo HTML cambia soltanto nei riferimenti URL. CSS, runtime JS, immagini, audio esistente, manifest e service worker sono copiati invariati.
- La distribuzione comprende Home, Comer, Agenda, Gallery, Stories, La Nogalera, Listen, Legal, asset, foto, JS, CSS, PWA, sitemap e robots. Non include `README.md`, `docs/`, `scripts/`, `tests/`, `baseline/`, `anteprima/` e `.github/`.
- L'audio LUNE_X resta un collegamento esterno (P0-02 ancora aperto); non si presume il diritto di copiare un MP3 in un altro repository.

## Precauzioni importanti

1. **SEO:** canonical e Open Graph devono restare URL assolute. Convertirle in path relativi sarebbe un errore. Il valore cambia con la futura origine scelta.
2. **robots.txt:** nel sottopercorso GitHub Pages non controlla l'intera origine; la build lo prepara per un provider su dominio proprio. La proprietà Search Console è un passaggio distinto.
3. **PWA:** manifest con `scope: './'` e `start_url: './'` è già relativo. Il vecchio service worker verrà gestito nella fase P0-08 con un piano di disattivazione/cache, non durante P0-01.
4. **Privacy:** le policy ancora in bozza restano `noindex`, sebbene accessibili dal footer, fino alla revisione legale. Non si inventano nome del titolare, recapiti o informativa.
5. **Test:** la CI confronta byte sorgente/output, controlla i file esclusi e naviga in Chromium sulle due basi URL `/Torremolinos/` e `/guide/` alle larghezze 390 e 1280 px. Il test di regressione pixel ≤0,1% della PR #13 resta un gate separato.
6. **Provider:** nessun provider/dominio scelto. `https://preview.example` è un segnaposto di test, **non** un indirizzo funzionante o un deploy pubblico.

## Attività successive dipendenti

- P0-05: pagina 404 e redirect map solo dopo scelta URL definitive (una 404 è una nuova schermata, da approvare).
- P0-08: piano safe-cleanup per cache e service worker, preservando altri progetti eventualmente ospitati sulla stessa origine `github.io`.
- P0-09: adapter per `_headers`/`_redirects` sul provider futuro; GitHub Pages non supporta direttamente quelle regole.
- P0-10: aggiornamento del workflow di produzione per usare `dist/` solo **dopo** conferma della parità funzionale/visiva e approvazione. La CI attuale pubblica ancora la root originale.

**Criterio di rilascio:** nessun merge automatico. `main` e il sito pubblico rimangono invariati fino alla decisione sul pacchetto di distribuzione.

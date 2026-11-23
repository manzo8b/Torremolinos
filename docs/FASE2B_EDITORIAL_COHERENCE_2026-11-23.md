# TORREMOLINOS — Fase 2B | Coerenza multilingue, trasparenza commerciale, fotografie e fonti

**Data:** 23 novembre 2026  
**Ramo:** `content/fase2-coerenza-editoriale-2026-11-23` (stessa PR #19, senza merge né pubblicazione).  
**Dipendenza:** Fase 2A già collaudata al commit `051fbffd` con quality, contract e Chromium success.

## Interventi realizzati nel secondo lotto

| Audit | Azione implementata | Limite |
|---|---|---|
| C-01 | Gallery: titoli e `alt` per ES/EN/IT/DE/FR/RU su tutte le nove schede; navigazione accessibile del lightbox localizzata | Non equivale a dizionario i18n unificato per tutto il sito, né a revisione madrelingua |
| C-10 | Mangiare: testo per i quattro locali evidenziati chiarisce che la posizione deriva da decisione editoriale; possibile rapporto commerciale non verificato e da dichiarare se esiste | Nessun rapporto commerciale confermato, nessun segno di sponsorizzazione inventato; ANDALUZ ancora concept da verificare |
| C-12 | Mangiare: fallback HTML `<noscript>` con 9 locali, indirizzi, date editoriali e collegamenti alle fonti effettivamente già in `comer/data.js` | Gli altri contenuti JS della Home e dell'Agenda richiedono un successivo lavoro di prerender |
| C-16 | Gallery: provenienza nella lightbox basata su `user_photo` / `ai`; catalogo rettificato (7 foto pubblicabili, 2 illustrazioni IA ancora sospese) | Lighthouse, axe e dimensioni fotografiche originali ancora da misurare; nessuna foto nuova pubblicata |
| C-17 | Nei dossier La Nogalera e Pasaje Begoña, credito con autore, scheda originale Wikimedia, collegamento diretto alla licenza CC BY-SA 3.0 o CC0 1.0 e nota di visualizzazione redimensionata; date del testo espresse con `<time datetime>` | Niente pretesa di ulteriore modifica/ritaglio oltre il ridimensionamento dinamico Wikimedia; altri articoli da completare |

## Evidenze di licenza

- [La Nogalera view.jpg — Tyk, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:La_Nogalera_view.jpg) — versione per il web chiesta via `Special:FilePath` con `?width=1600`. Testo della licenza: [Creative Commons BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.es).
- [Pasaje.begoña.jpg — BernardaAlba, CC0 1.0](https://commons.wikimedia.org/wiki/File:Pasaje.bego%C3%B1a.jpg) — `?width=1600`, testo CC0: [Creative Commons Zero 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.es).

**Nota:** Gli archivi di Wikimedia forniscono licenze immagine specifiche, distinte da quelle del codice o dei testi editoriali originali. Non dedurre licenze dagli alt o dalle miniature.

## Protezione del catalogo e contatti

- I nove ristoranti restano gli stessi, con `verified=2026-11-02`. Nessuna nuova fonte, valutazione o disponibilità inventata.
- Nessuna delle due illustrazioni IA in `pending_review` viene resa visibile dalla Gallery.
- Nessuna pubblicazione commerciale o pubblicitaria dichiarata senza documentazione; l'assenza di un accordo non è affermata come fatto.
- Restano in revisione i testi legali e il canale di contatto privato; non togliere `noindex` dalle policy in bozza.

## Verifica di accettazione

- `node --test tests/content-consistency-fase2.test.mjs tests/content-consistency-fase2b.test.mjs`
- `node tests/fase2-content-browser.mjs`
- `node tests/fase2b-browser.mjs`
- Workflow `.github/workflows/content-coherence.yml`: test via GitHub Actions e prove Chromium; screenshot e risultati nella cartella `artifacts/editorial-fase2b/`, senza deploy.
- Verifica regressioni con i normali quality/contract del repository.

## Lavoro ancora aperto

1. **C-01/02:** centralizzazione vera degli i18n e revisione di traduzioni RU/DE/FR/EN da madrelingua.
2. **C-06:** ampliare le schede Essentials solo dopo verifica delle fonti ufficiali già raccolte in `docs/C06_ESSENTIALS_OFFICIAL_SOURCES_2026-11-23.md`.
3. **C-10:** verificare con il titolare effettivo gli eventuali rapporti commerciali per ANDALUZ e gli altri locali evidenziati; aggiornare le etichette solo dopo la conferma.
4. **C-16/17:** accessibilità completa della Gallery, licenze/crediti delle altre fotografie, date e breadcrumb degli articoli.
5. **C-18:** traduzione editoriale EN dei dossier solo dopo revisione, con URL/hreflang reali.
6. **C-20:** verificare i diritti dell'anteprima LUNE_X prima di copiarla altrove.

**Gate finale:** PR #19 draft; la Fase 2B è un miglioramento verificabile ma non la chiusura di tutta la Fase 2. Design e navigazione pubblicati non si modificano senza approvazione.

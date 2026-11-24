# TORREMOLINOS — Fase 2 · Contenuti e coerenza

**Audit di riferimento:** `brief-sistemazione-torremolinos.md` (23 novembre 2026), C-01 … C-20.  
**Ramo:** `content/fase2-coerenza-editoriale-2026-11-23`, derivato dall'ultimo `main` pubblico `eed4d7c`.  
**Stato:** prima tranche di correzioni verificabili e registro degli interventi aperti. Nessun redesign, nessuna nuova data evento dedotta, nessun merge o deploy implicito.

## Evidenza verificata

- `agenda/events.json`: **27** eventi con date (`24` `kind=lgbtq`, `3` `kind=general`), **5** voci nella watchlist; `editorialUpdated=2026-11-02`.
- Run scanner [45235268131](https://github.com/manzo8b/Torremolinos/actions/runs/45235268131) concluso con `success` il 23/11/2026; consultazione 18:09:18 UTC. **MADBEAR** e **MADBEARHUB** raggiungibili, date base MADBEAR invariate; **INFINITY/ACOGAT** con risposta HTTP 202: il controllo non valida quelle fonti. L'[Issue #1](https://github.com/manzo8b/Torremolinos/issues/1) è aggiornata e rimane **aperta**.
- `comer/data.js`: **9** locali con indirizzo, categoria, zona, fonte cliccabile e `verified=2026-11-02`. Il concept ANDALUZ è segnato `conceptPending` e rimane una scelta editoriale in evidenza senza prova documentata di rapporti commerciali.
- `listen/index.html` ha già `preload="none"`. `agenda/app.js` ha già export `.ics` in modalità date intere. Non attribuire queste due funzioni alla presente tranche come nuove.
- Nella Home `palmeras-sol.webp` è la foto originale di fallback; un caricamento progressivo può sostituirla con `blue-hour-ai.webp`. La vecchia etichetta AI era inizialmente visibile anche sulla foto originale.

## Interventi effettivamente implementati (prima tranche)

- **C-03, parziale:** etichetta AI nascosta finché l'illustrazione IA non è stata caricata; torna nascosta se il file non si carica. Il testo rimane esterno all'immagine secondo il design approvato. Audit completo alt/crediti della Gallery ancora aperto.
- **C-05, parziale:** eliminato `href=https://www.google.com/maps` generico dal pulsante itinerario: il link rimane inizialmente disabilitato e viene costruito dall'app solo dopo aver scelto tappe reali. Web Share e copia link erano già presenti; unicità del comando mappa e nomi accessibili da perfezionare con QA visivo.
- **C-07:** README aggiornato allo stato reale (architettura multipagina, 9 schede Comer, 27 eventi Agenda, footer e PWA, stato delle PR).
- **C-09:** verifica GitHub Actions effettiva e commento ragionato nell'Issue #1; **non** chiuderla finché ACOGAT/INFINITY e le segnalazioni editoriali non siano riviste da una persona.
- **C-11:** data `r.verified` resa visibile su **tutte le 9 schede**, non più soltanto tramite una frase fissa per le quattro evidenziate. Fonte cliccabile conservata; localizzazione della data in ES/EN/IT/DE/FR/RU, senza aggiornare artificialmente la data.
- **C-13, parziale:** snapshot verificabile `agenda/scan-status.json`, vista Home e Agenda `scan-status-ui.js`, due date distinte, avviso di revisione umana obsoleta **>14 giorni** e di scan storico >14 giorni, fonti che non hanno risposto e collegamento alla run esatta. **È l'ultimo controllo documentato in questa versione**, non una richiesta di rete in tempo reale né una certificazione giornaliera. L'aggiornamento del file con ogni run futura andrà implementato in una pipeline autorizzata e collaudata.
- **C-14:** testo Home aggiornato per descrivere correttamente che la selezione è **prevalentemente LGBTQ+**, con alcune proposte culturali. Le restrizioni `ageRestricted` e il badge `18+` erano già implementati nell'Agenda.
- **C-01, parziale:** sistemato lo stato dell'Agenda con contatori tradotti e linguaggio esplicito sulla revisione. La migrazione a **un dizionario i18n unico** e il check linguistico automatico completo sono attività ulteriori, non coperte da questa tranche.

## Ricerca ufficiale preliminare per C-06

Ho raccolto e registrato fonti pubbliche pertinenti a Renfe C1, autobus M-110/M-112, accessibilità spiagge, emergenze 112 e assistenza sanitaria nella guida `docs/C06_ESSENTIALS_OFFICIAL_SOURCES_2026-11-23.md`. La ricerca distingue ciò che la pagina ufficiale documenta dall'operatività del servizio nel giorno del viaggio. Nessun numero taxi, farmacia di turno, supermercato o ospedale d'urgenza viene inventato; le nuove card Essentials non sono state pubblicate per rispettare il design freeze.

## Matrice di avanzamento C-01 … C-20

| ID | Stato dopo prima tranche | Condizione ancora da rispettare |
|---|---|---|
| C-01 | PARZIALE | Dizionario unico multi-pagina; zero frammenti misti certificati da QA |
| C-02 | DA REVISIONARE | RU madrelingua, poi DE/FR/EN; nessuna auto-certificazione linguistica |
| C-03 | PARZIALE | Verifica completa degli alt/crediti Gallery e Stories |
| C-04 | DA VALUTARE | Duplicazioni Gallery/Stories/Sound; qualunque rimozione che muti la composizione visiva richiede approvazione |
| C-05 | PARZIALE | Mappa/URL sharing e comandi duplicati da audit browser; link di destinazione corretti |
| C-06 | FONTI UFFICIALI RACCOLTE, UI IN ATTESA | Registro documentale in `docs/C06_ESSENTIALS_OFFICIAL_SOURCES_2026-11-23.md`; taxi, farmacie di turno, supermercati e servizio attivo dell'ascensore da verificare; nessun nuovo recapito pubblicato |
| C-07 | IMPLEMENTATO | README aggiornato; mantenere changelog storico |
| C-08 | IN VERIFICA | Gerarchia nel footer già TORREMOLINOS / MANZO AI; LUNE_X solo per musica, testo definitivo da approvare |
| C-09 | VERIFICATO, ISSUE APERTA | Ultima run scanner documentata, INFINITY/ACOGAT HTTP 202 e revisione umana necessaria |
| C-10 | BLOCCATO DA CONFERMA | Criteri pubblicabili ma rapporto commerciale con ANDALUZ e posizione in evidenza da accertare |
| C-11 | IMPLEMENTATO SUI DATI ESISTENTI | Nove schede con fonte e data; nuova verifica sul campo non eseguita |
| C-12 | IN ATTESA | Più locali solo con fonti nuove; fallback senza JS da progettare |
| C-13 | PARZIALE | Snapshot e scadenza funzionano; alimentazione automatica per ogni run ancora da progettare |
| C-14 | IMPLEMENTATO NEL TESTO | Home descrive composizione reale; badge 18+ già presente, contenuto non rifatto |
| C-15 | PARZIALE / PREESISTENTE | ICS già disponibile, verificare importazione in 3 client e JSON-LD Event affidabile |
| C-16 | DA AUDITARE | Gallery: alt, dimensioni, lightbox, axe |
| C-17 | DA AUDITARE | Stories: crediti CC, date, breadcrumb |
| C-18 | BLOCCATO DA TRADUZIONI | Tradurre 2–3 articoli EN solo con revisione e URL realmente dedicate |
| C-19 | DA AUDITARE | La Nogalera: data verifica per locale e URL singole |
| C-20 | PARZIALE / PREESISTENTE | preload none già presente; diritti musica LUNE_X da documentare |

## Test e release gate

`tests/content-consistency-fase2.test.mjs` controlla la fedeltà di date e fonti, la composizione effettiva, la provenienza delle immagini, tutte le schede Comer, le 6 lingue e la PWA cache v29. `tests/fase2-content-browser.mjs` verifica tramite Chromium stato Home/Agenda, switch IT/EN/ES, 9 schede Comer e fallback fotografico senza etichetta IA. Workflow `content-coherence.yml` archivia screenshot ed esito.

**Regola:** nessuna nuova verifica editoriale inventata, nessuna chiusura automatica dell'Issue #1, nessuna rimozione `noindex` alle policy in bozza, nessuna modifica dei rapporti commerciali finché non confermati. Qualunque futuro allargamento di Essentials richiederà una vera ricerca documentata.

**Stato di rilascio:** PR in bozza, nessuna modifica alla Home pubblica fino ai test e alla decisione di rilascio.

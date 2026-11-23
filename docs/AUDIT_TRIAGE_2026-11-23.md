# TORREMOLINOS · Stato di attuazione dell'audit

**Data**: 23 novembre 2026 · **Fonte**: audit utente `brief-sistemazione-torremolinos.md`, acquisito il 23 novembre · **Base congelata**: `088a622a2055194cca3c577750fe5b0e81f82a3e`.  
**Regola**: design freeze assoluto; nessuna variazione all'interfaccia in questa PR. Cambi visivi solo dopo autorizzazione.

| ID audit | Stato verificato | Intervento ammesso senza modifica visuale |
|---|---|---|
| P0-00 | IN CORSO | Ramo ref permanente e runner screenshot 375/768/1280/1920; convalida artefatti reali e screenshot ancora necessaria |
| P0-00b | CI/PAGES PASS | Ultimo `main` `088a622`: workflow Pages, static quality e product contract su stesso SHA tutti `success` |
| P0-01 | DA PROGETTARE | URL assolute oggi servono a canonical/OG/sitemap: NON fare sostituzioni cieche con path relativi. Per nuova origine, generare URL SEO assolute da configurazione e link interni portabili |
| P0-02 | BLOCCATO da diritti/provenienza | Anteprima MP3 da repo Lune_X. Prima di copiare e redistribuire verificare diritto ed asset originale |
| P0-03 | DA PROGETTARE | URL distinte e hreflang solo dopo audit della copertura effettiva ES/IT/EN/DE/FR/RU; non creare pagine con traduzioni mancanti |
| P0-04 | DA MISURARE | Valutare esperienza JS disattivato per Home, Comer e Agenda, senza cambiare rendering con JS abilitato |
| P0-05 | DA PROGETTARE | 404/sitemap/robots per origine corrente e futura, con base configurable senza minare canonical pubblicate |
| P0-06 | BLOCCATO da dati e revisione legale | Privacy, cookie, termini, contatto e accessibilità presentano bozza/noindex: preservare avvertenza finché titolare e revisore non approvano |
| P0-07 | BLOCCATO da contatto pubblico | Nessuna email/form verificata autorizzata; non inventare indirizzi o aggiungere raccolta dati |
| P0-08 | DA PROGETTARE | Manifest già usa scope/start_url `./`; service worker usa `./` per asset e cache `torremolinos-v26`. Testare due prefix su staging prima del cutover e progettare deregistrazione sulla vecchia origine |
| P0-09 | NON ATTIVO SU PAGES | Headers/redirect configurabili non sono letti da GitHub Pages: generarli solo come adapter per l'host futuro |
| P0-10 | DA TESTARE | Il workflow Pages carica oggi tutta la root (include docs e test). Prima di escludere file dal deploy, testare tutte le dipendenze con baseline invariata |
| C-01/02 | INCOMPLETO | In Home il selettore dà sei lingue ma Stories sono solo ES e RU è da revisionare |
| C-07 | DOCUMENTATO | Aggiornato README con stato corrente, senza cambiare lo storico dei release |
| C-09 | SCANNER ATTIVO | Issue #1 aggiornata 22/11/2026, contiene 20 commenti; resta aperta per nuove voci ACOGAT da verificare umanamente. Non chiuderla in automatico |
| C-13 | DATI IN ATTESA | Agenda `editorialUpdated=2026-11-02` benché scanner 22/11 sia riuscito; non presentare data scanner come verifica umana |
| Q-04 | NO-GO senza golden | Consolidamento vecchi strati CSS/JS solo dopo confronto pixel <=0,1% e test di funzionalità invariati |

## Rettifiche tecniche necessarie all'audit

1. **P0-01, canonical**: un canonical HTTP(S) assoluto è valido e desiderabile. La regola `grep github.io = 0` va applicata al codice di build/configurazione dopo il cutover, **non** imponendo canonical relative. Mentre il sito risiede su GitHub Pages, la canonical deve puntare all'URL pubblicato.
2. **P0-08, manifest**: `manifest.webmanifest` usa già `"start_url":"./"` e `"scope":"./"`; il service worker pre-cacha path relativi e porta cache versione `torremolinos-v26`. Il rischio è il cutover tra origini e il percorso del deployment, non un attuale `start_url` hardcoded assoluto.
3. **C-09, scanner**: la run del 22 novembre è `success`, e Issue #1 aggiornata al 22 novembre; rimane aperta perché sono presenti titoli nuovi ACOGAT. Nessun evento va aggiunto automaticamente.
4. **Q-06**: i workflow esistenti eseguono Node, fixture scanner e smoke Chromium responsivo. Mancano test ripetibili di regressione pixel con golden, audit axe/Lighthouse, check completa di link, lingue e hostability. Prima di introdurre test che possono bloccare il deploy, congelare golden e catalogare falsi positivi.

## Gate e decisioni editoriali rimaste

**Nessun go-live** finché golden baseline e accessibilità non sono controllati. Legal, provider e musica rimangono decisioni aperte; non assumere accordi commerciali né diritti.  
Le modifiche di questa PR riguardano solo script, workflow, documentazione e branch di riferimento. HTML/CSS/JS applicativi e asset restano identici.

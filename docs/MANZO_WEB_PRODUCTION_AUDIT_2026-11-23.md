# TORREMOLINOS — MANZO Web Production v1.3 · Audit incrementale

**Data:** 23 novembre 2026  
**Sorgente analizzata:** repository `manzo8b/Torremolinos`, branch `main`  
**Destinazione modifiche:** branch separato `audit/manzo-web-production-v13-2026-11-23` (PR di revisione; produzione invariata)  
**Metodo:** MANZO AI Web Production Skill v1.3, protocollo micro-app; DESIGN-CONTRACT.md, PRODUCT-VISION.md e test presenti nel repository.

## Perimetro

Conservare la micro-app esistente: hero originale, sei lingue (ES/EN/IT/DE/FR/RU), palette bianco / #111111 / #F58A17 / #16865A, titoli senza punto finale, navigazione, ricerca, filtri, preferiti, itinerari, mappa opt-in, Agenda, Comer, Gallery, Stories, Listen e PWA.

**Non si introducono** nuovi luoghi, eventi, fotografie senza licenza, orari o recensioni inventati. Non si modifica la direzione creativa approvata; no migrazione di piattaforma e nessun costo operativo aggiuntivo.

## Gate della Skill

| Gate | Stato | Evidenza / limite |
| --- | --- | --- |
| G1 Discovery e piattaforma | PASS su vincoli esistenti | Progetto statico già pubblicato su GitHub Pages; requisiti e design contract esistenti. Decisione di migrare NON assunta |
| G2 Architettura e contenuti | PASS su struttura esistente | Index, route interne, Stories, Agenda, Gallery, Comer, Listen; fonti da riverificare nel tempo |
| G3 Design e UX writing | PASS su identità documentata, QA visiva NOT TESTED | DESIGN-CONTRACT.md; hero e palette preservate |
| G4 Implementazione | Preparata in branch | Correzioni metadata, etichette accessibili e offline fallback |
| G5 QA tecnica | PASS CI statico, PASS 41/41 test Node, PASS Chromium responsive; dispositivi fisici NOT TESTED | [Quality checks](https://github.com/manzo8b/Torremolinos/actions/runs/45131405044) · [Product + Chromium](https://github.com/manzo8b/Torremolinos/actions/runs/45131405149) |
| G6 Lancio | NO-GO | Nessuna autorizzazione a fondere il PR e nessuna verifica conclusiva di tutti i gate |
| G7 Handover e manutenzione | Da pianificare | Revisione fonti eventi, traduzioni, privacy, gestione contenuti |

## Problemi accertati e modifiche realizzate

1. **P1 | SEO/default language:** la Home dichiara `lang=es`, ma `meta description` e `og:description` originali erano in italiano. Corretto lo spagnolo canonico e aggiunto `og:locale=es_ES`.
2. **P2 | Accessibilità multilingue:** etichette `aria-label` e skip-link non seguivano la lingua selezionata, con alcune stringhe in italiano e inglese anche sulla pagina spagnola. Aggiunto un livello leggero, senza dipendenze, per aggiornare etichette e meta descrizione browser in sei lingue. La SEO multilingue con URL/hreflang dedicati **non è implementata**.
3. **P2 | PWA e comunicazione dello stato:** la navigazione offline verso una pagina non cacheata mostrava il contenuto della Home sotto l'URL richiesto. Ora mostra una pagina offline distinta, in sei lingue, che spiega il limite e permette rientro nella guida o un nuovo tentativo. Aggiornata versione cache.
4. **Regressione:** aggiunti test automatici per i tre punti e aggiornato il test del cache versioning.

## Debito tecnico e priorità successive

- **CSS in cascata:** la Home carica numerosi fogli di rifinitura successivi. Prima di consolidarli occorre baseline screenshot su 360/390/768/1024/1440, controllo dei selettori effettivi e confronto visivo; evitare una riscrittura cieca.
- **SEO internazionale:** per indicizzazione realmente distinta delle sei lingue servono URL localizzati, canonical e hreflang corretti, oltre a traduzioni revisionate. Non simulare equivalenti linguistici inesistenti.
- **Aggiornamento editoriale:** `agenda/events.json` indica `editorialUpdated: 2026-11-02`; verificare eventi e fonti prima di promettere disponibilità aggiornata.
- **Prestazioni:** misurare Lighthouse/Core Web Vitals in condizioni ripetibili, incluse le fotografie e il carico dei CSS.
- **Accessibilità:** controlli reali con tastiera, VoiceOver/Safari, Android TalkBack/Chrome e zoom 200%. Test statici da soli non certificano WCAG.
- **Protezione dati e attribuzioni:** rivedere periodicamente privacy, copyright/crediti, provenienza fotografica ed eventuali servizi di terze parti.

## Evidenze raccolte il 23 novembre 2026

- **PASS — GitHub Actions static quality checks:** workflow 45131405044, risultato `success`.
- **PASS — Node product contract:** 41 test su 41, 0 fallimenti, incluso test per il nuovo sistema di accessibilità multilingue e la pagina offline; job 137547517973.
- **PASS — Chromium browser smoke:** job 137547518267, risultato `success`; larghezze 360, 390, 768, 1024 e 1440 px, navigazione e schermate interne previste dal test.
- **Artefatti di screenshot:** archivio `torremolinos-visual-review` associato al workflow, comprensivo di Home e pagine interne in formato desktop e mobile. Controllata una selezione visiva; non equivale a un collaudo manuale completo su tutti i dispositivi.
- **NOT TESTED:** Safari/iPhone fisico, VoiceOver, Android/TalkBack, Lighthouse/Core Web Vitals su rete reale, revisione madrelingua delle sei lingue e verifica giuridica finale.

## Verifica di accettazione prima del merge

1. GitHub Actions: test Node preesistenti e nuovo test, browser smoke Chromium e screenshot esaminati.
2. iPhone e desktop: cambiare lingua sei volte e controllare skip-link, label immagine hero, ricerca, filtri, scelta itinerario, navigazione mobile e meta descrizione nel DOM.
3. Offline: installare il service worker aggiornato, visitare la Home almeno una volta online, disconnettersi e aprire un percorso non cacheato; verificare il messaggio senza confondere pagina richiesta e Home.
4. Controllare che preferiti, condivisione URL e routing Google Maps restino operativi.
5. Confermare fonti editoriali, Google Search Console, legal e revisione umana. **Solo dopo approvazione esplicita** valutare il merge.

**Decisione corrente: NO-GO per il go-live.** Il branch documenta la proposta; `main` non va modificato automaticamente.

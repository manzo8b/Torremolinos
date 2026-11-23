# TORREMOLINOS — Fase 2C | Essentials, i18n, accessibilità e metadati Stories

**Data:** 23 novembre 2026  
**Ramo:** `content/fase2-coerenza-editoriale-2026-11-23`, PR #19 già in bozza.  
**Obiettivo:** consolidamento verificabile dei contenuti esistenti, senza cambiare numero di card Essentials, la griglia Home, la palette, la sezione Sound o le fotografie.

## C-06 — Essentials

Le tre card esistenti (Renfe C1, emergenze 112, accessibilità spiagge) conservano la stessa gerarchia. La prima punta ora alla pagina Renfe sui collegamenti Cercanías Málaga; l'ultima alla pagina comunale sulle spiagge accessibili. Il pulsante `tel:112` rimane disponibile ed è accompagnato dalla fonte ufficiale della Junta de Andalucía. Ciascuna card indica **data della consultazione 23/11/2026**, non stato live. Limitazioni e link sono espressi nelle sei lingue della Home.

**Fonti consultate (23/11/2026):**
- [Renfe — Cercanías Málaga / mapa linee](https://www.renfe.com/es/es/cercanias/cercanias-malaga/mapas)
- [Consorcio M-110 Málaga–Torremolinos–Benalmádena Costa](https://siu.ctmam.ctan.es/es/horarios_lineas_tabla.php?linea=1) — dato in staging, non pubblicato nella Home
- [Consorcio M-112 Málaga–Mijas](https://siu.ctmam.ctan.es/es/horarios_lineas_tabla.php?linea=3) — dato in staging
- [Turismo Torremolinos — Playas Accesibles](https://turismotorremolinos.es/es/descubre/playas/playas-accesibles/) — la pagina non certifica condizioni operative in tempo reale
- [Junta de Andalucía — 112](https://www.juntadeandalucia.es/organismos/ema/areas/emergencias-112/112-andalucia-digame.html)
- [Servicio Andaluz de Salud — Hospital Marítimo](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/hospital/virgen-victoria/preguntas-frecuentes/hay-urgencias-en-el-hospital-maritimo-de-torremolinos) — FAQ indica assenza di Urgencias, ma dato da riconfermare prima di fornire direzioni sanitarie; **non** è pubblicato come nuova card

`docs/C06_ESSENTIALS_SOURCE_REGISTRY.json` conserva sei fonti tipizzate, con `fact_es`, `limitations_es`, `verifiedDate` e `uiStatus`. Gli ultimi tre record non presenti nelle card non devono essere presentati come operativi in tempo reale. Non si inventano taxi, turni farmacia, tempi di percorrenza, orari del treno o stato dell'ascensore.

## C-01 / C-02 / C-16 — Copertura linguistica e accessibilità

- `scripts/audit_fase2c_i18n.mjs` legge il dizionario Home base e l'override editoriale **effettivamente utilizzato** e confronta le chiavi `data-t` su ES/EN/IT/DE/FR/RU. Genera `artifacts/editorial-fase2c/i18n-coverage.json` con chiavi eventualmente mancanti.
- L'audit blocca assenze per le card Essentials e la Gallery, ma non presume di avere eseguito una revisione madrelingua. I dossier Stories originali in ES rimangono non tradotti. Non aggiungere `hreflang` finché non esistono URL realmente localizzati.
- I filtri della Gallery aggiornano l'etichetta `aria-label` contestualmente alla lingua.
- `tests/fase2c-browser.mjs` esercita le tre card, cambia lingua e produce `artifacts/editorial-fase2c/accessibility-report.json` con axe-core (WCAG 2.1 A/AA automatico) su Home e Gallery alle viewport 390/1280. **Una scansione axe non equivale a certificazione WCAG**; riscontrare e pianificare le criticità.

## Risultato del primo audit automatico e correzioni accessibilità

- Prima lettura: tutti gli **109 token visibili in ES/EN/IT**, mentre DE/FR/RU erano a **104/109**, con cinque etichette mancanti per lingua (`trust1`, `trust2`, `trust3`, `mapLead`, `mapPrivacy`). Il ramo ora integra le **15 traduzioni mancanti**; l'audit successivo deve confermare **109/109 per tutte e sei le lingue**.
- Prima lettura axe-core (viewport 390 e 1280): **1 categoria di violazione WCAG sul contrasto cromatico nella Home** (25/24 nodi a seconda della viewport), **0 violazioni automatiche nella Gallery**. Non dichiarare conformità WCAG finché i nodi non risultano risolti e non viene effettuata una verifica manuale.
- Correzione CSS mirata su etichette di fiducia, pulsanti delle fonti nei luoghi, testi verdi in Stories/piano e voce attiva mobile. Nuovi colori verificati aritmeticamente sullo sfondo osservato con contrasto > 4,5:1, senza introdurre nuove tinte principali, layout o modifiche alle fotografie.
- La verifica di regressione axe e gli screenshot dopo il cambio CSS sono parte del gate della PR #19, non una certificazione ufficiale.

## C-17 — Dossier Stories

Sui cinque articoli attuali, metadati `BreadcrumbList` coerenti con canonical effettiva: Home → Stories → articolo. Le date visibili sono marcate con `<time datetime>`, mantenendo date di pubblicazione già dichiarate negli Article/NewsArticle JSON-LD (`2026-11-02` per quattro, `2026-11-15` per Navidad). Non sono state inventate nuove date di modifica o verifiche. Le licenze Wikimedia per La Nogalera e Pasaje Begoña restano collegate come già fatto in Fase 2B.

## Gate di verifica e rilascio

- `node --test tests/content-consistency-fase2.test.mjs tests/content-consistency-fase2b.test.mjs tests/content-consistency-fase2c.test.mjs`
- `node scripts/audit_fase2c_i18n.mjs`
- `node tests/fase2-content-browser.mjs && node tests/fase2b-browser.mjs && node tests/fase2c-browser.mjs`
- Workflow `content-coherence.yml` con browser e rapporto accessibility + screenshots. Test di qualità e product contract separati, già attivi.
- La build PWA passa a `torremolinos-v31` per non mantenere risorse HTML/CSS/JS precedenti in cache, incluse le correzioni di contrasto.
- **Nessun merge o deploy automatico**: la PR #19 rimane in draft, il deploy Pages continua da `main`.

## Punti non risolti

Revisione linguistica madrelingua, convergenza definitiva dei dizionari tra tutte le pagine, accessibilità manuale con tastiera e screen reader, eventuali violazioni axe da classificare, verifica operativa servizi sanitari e accessibilità fisica, conferma degli eventuali rapporti commerciali e dei diritti musica LUNE_X. La Fase 2 rimane aperta fino al QA finale.

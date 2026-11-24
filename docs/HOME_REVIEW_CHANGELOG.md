# HOME REVIEW · G1–G6 · 24 novembre 2026
**in attesa di validazione MF** — proposta, non approvata, nessun merge/deploy.
Baseline main d8c92b1c6a9e8d1d6893020834c7c3f1d6d4836b. PR #21 separata, non inclusa.
- G1: fondo sabbia #F4EFE6 dopo Hero+tools+trust; card #FBF8F2, navy esistente #10244B nelle sole Nogalera e Sound (footer rinviato alla sua consegna), blu #096BCB e #0758AE; titoli ridotti, tracking -0.012em, spazi di sezione ridotti. Protezione pixel esatta di hero/header/ricerca/trust, non solo markup. Header, hero e fotografie invariati. Verde esistente #16865A su sabbia 3.99:1, su card 4.31:1; proposta #086C47 (5.65:1 / 6.10:1) da approvare, non applicata. Conservate le etichette blu effettivamente presenti nel tema; testo sabbia nei pannelli navy per contrasto.
- G2: player nativo visibile, nascondi pulsante custom Sound; scorciatoia hero protetta. Mappa solo loadMap, mapStart nascosto; nessuna chiamata esterna prima dell'azione.
- G3: top inset e transform rimossi solo su tre pannelli, immagini in frame pieno; verifica geometrica in CI.
- G4: rimuovi bordo/outline solo da span non interattivi delle didascalie, non da link/controlli.
- G5: source/map link secondari blu scuro su card, testo sottolineato, altezza 44px; aggiunta al piano resta unica azione piena per card.
- G6: nessuna immagine cambiata: duplicati nel markup e runtime (palmeras-sol, plaza, paseo-palmeras, paseo-centro, espetos, ecc.) da inventariare nel report browser per ogni URL effettivo. Vincolo di nuove foto MF prevale; non dichiarare unicità raggiunta.
- Niente eliminazioni/riordino sezioni, niente nuova pagina, niente modifiche ai dataset o alle policy. Hero href #plan resta intatto fino alla fase dedicata.
- Test esistenti: aggiornate solo aspettative cromatiche intenzionali; nessuna riduzione dei controlli funzionali. Workflow indipendente con confronto prima/dopo a 375/768/1280/1920, report altezza, pixel identici area protetta, contrasto axe e Lighthouse mobile prima/dopo. Non dichiarare PASS prima degli esiti.

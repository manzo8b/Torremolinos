# TORREMOLINOS — Contratto di prodotto e design

**Stato:** v4, 14 novembre 2026. Documento operativo per ogni futura modifica.

## Principio di prodotto

Torremolinos è una **micro-app narrativa e interattiva**. Non è una brochure, un mockup o un catalogo statico. Ogni schermata deve permettere di **capire, scegliere e agire**: esplorare luoghi, personalizzare tappe, salvarle, condividerle e aprire la mappa.

## Vincoli non negoziabili

1. **Quattro colori UI:** bianco `#FFFFFF`, nero inchiostro `#111111` solo come colore di testo, arancione sole `#F58A17`, verde palme `#16865A`. Sono permesse varianti trasparenti di verde/arancione; le fotografie conservano i colori naturali.
2. **Mai sfondi neri**, incluso footer, audio, pannelli, pagina legal, card. Testo nero su arancione e bianco su verde per leggibilità (WCAG AA per testo normale).
3. **Titoli senza punto finale**, in ogni lingua e in tutte le pagine. La punteggiatura del testo narrativo segue la grammatica normale.
4. **Pulsanti e badge ovali** (`border-radius:999px`); riquadri e sezioni con angoli generosamente arrotondati e una geometria coerente anche su mobile.
5. **La fotografia hero è quella approvata dall'autore**, `hero-apple-2026.webp` e variante mobile: non sostituirla senza una richiesta.
6. **Caligrafia contemporanea, leggibile, non pesante**; gerarchia ottica, spaziature intenzionali, niente schermate accademiche rigide, ombre generiche, icone infantili o angoli a squadra.
7. **Narrativa calda e sensoriale**, non testo pubblicitario stereotipato: mare, luce, libertà, quartieri, cultura, musica, voci e quotidianità reale.
8. **Sezioni riconoscibili per colore e composizione:** discovery arancione, route builder verde, esplorazione bianca, cultura LGBTQ+ verde/arancione, galleria arancione, agenda verde, utilità chiara. Distinzione sì, sovraccarico no.
9. **Sei lingue mantenute:** ES, EN, IT, DE, FR, RU. Titoli e CTA devono restare leggibili con testi più lunghi.
10. **Funzionalità preservate:** filtri e ricerca, preferiti locali, itinerario modificabile, link condivisibile, Maps, audio, agenda, galleria e pagine legal. Niente tempi, prezzi, recensioni, orari, disponibilità, testimonianze o accordi commerciali inventati.
11. **Accessibilità e comportamento:** touch target almeno 44 px, feedback immediato, focus visibile, riduzione del movimento rispettata, navigazione tastiera, assenza di overflow a 360/390/768/1024/1440 px.
12. **Trasparenza editoriale:** eventuali partnership e sponsorizzazioni future vanno dichiarate. Il livello di preparazione commerciale del design non equivale a una piattaforma di prenotazione o pagamento già attiva.

## Architettura dell'esperienza

`Hero → Scopri il tuo ritmo → Tu Torremolinos → Luoghi da vivere → Identità locali → Foto / Musica / Storie / Agenda → Informazioni utili → Footer chiaro`

## Regola di rilascio

Eseguire test Node, smoke test Chromium, controllo screenshot integrali (mobile e desktop), verificare contrasto dei nuovi pannelli e tutte le traduzioni. Non unire una PR con regressioni visive bloccanti. Aggiornare `service-worker.js` quando si aggiunge o cambia il CSS dell'interfaccia.

## Ambizione commerciale, senza promesse false

Il design e la guida personalizzata preparano la base di un prodotto. La monetizzazione richiederà successivamente proposte commerciali reali, consenso privacy e modalità di contatto/partnership verificabili; non creare pagamenti, recensioni, disponibilità o voci sponsorizzate fittizie.

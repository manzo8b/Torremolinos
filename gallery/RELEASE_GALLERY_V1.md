# TORREMOLINOS · Gallery · Piano di pubblicazione v1

Data: 2 novembre 2026. Questo file è una checklist operativa, non una dichiarazione di pubblicazione.

## Stato confermato
- **8** immagini già nel catalogo pubblico della Gallery, incluse due illustrazioni IA già presenti su GitHub.
- **16** nuovi visual ricevuti, organizzati in due lotti (01: foto 01–09, 02: foto 10–16), con WebP ottimizzati preparati separatamente e schede catalogate.
- **16 nuove schede staged** in `gallery/data.js`, tutte con `publicationStatus: pending_review` e `editorialApproved: false`: NON vengono mostrate nella Gallery pubblica finché la fase editoriale non è conclusa.
- Cartelle GitHub già create: `assets/gallery/batch-01/` e `assets/gallery/batch-02/`.
- Filtri pronti in 6 lingue: mare/spiagge, quartieri/dettagli, cultura/tradizioni, vita locale, nightlife, LGBTQ+/diversità e illustrazioni IA. I filtri senza media disponibili restano nascosti.

## Priorità fotografica
1. **Mare e spiagge**: G06, G07, G08, G11, e la panoramica Paraíso G10 (inclusione costiera).
2. **La città e i dettagli**: G12 bandiere sui vasi; G14 facciata rossa; G15 Plaza San Miguel.
3. **Tradizioni**: G03 ambiente religioso e musicale; G13 facciata bianca, senza nome del luogo finché non è identificato.
4. **Vita locale e nightlife**: G02 festa con molte persone; G04 insegna Strass; G09 Paraíso Beach Pride.
5. **Doppione editoriale**: G16 è una seconda inquadratura del muro di Plaza San Miguel già fotografato in G15; meglio usarlo come dettaglio di un articolo anziché affiancare due card quasi uguali in Gallery.

## Materiali creativi da verificare
- **G01 San Miguel collage**: composizione di più scene, non etichettare come foto unica di cronaca. Confermare eventuale intervento IA.
- **G05 San Miguel visual creativo 2026**: verificare origine e distinguere chiaramente da una locandina ufficiale. Non ricavare date dalla grafica.

## Passi per la pubblicazione
1. Estrarre il pacchetto locale `TORREMOLINOS_GALLERY_16_FOTO_UPLOAD.zip`.
2. GitHub → `assets/gallery/batch-01/` → Add file → Upload files → selezionare 9 WebP, **non** il file ZIP → commit.
3. GitHub → `assets/gallery/batch-02/` → Add file → Upload files → selezionare 7 WebP → commit.
4. Confrontare nomi e dimensioni in `gallery/batches/lotto-01.json` e `gallery/batches/lotto-02.json`.
5. Verificare che sia autorizzato l'uso pubblico delle foto, soprattutto quando mostrano persone riconoscibili; accertare contesto, luogo, data e distinzione IA/documento.
6. **Solo dopo verifica** aggiornare `gallery/data.js`: impostare `publicationStatus: published` e `editorialApproved: true` soltanto sulle foto approvate; G01/G05 possono restare staged. Le immagini mancanti devono rimanere nascoste.
7. Testare URL immagine, caricamento in gallery, didascalie ES/EN/IT/DE/FR/RU, filtri, lightbox, smartphone, privacy/AI e GitHub Actions.

## Regole di progetto
- Logo ufficiale e nuova Hero dell'utente **non devono essere modificati**.
- Sfondo bianco, teal/petrolio e accenti corallo; nessun punto finale nei titoli.
- Originali fotografici e grafica IA separati. Evitare nomi di persone, identità o date dedotte dalle sole immagini.
- Aggiungere altri gruppi come lotti 03, 04 ecc., senza rompere link o rinumerare il lotto 01/02.
- Dopo la Gallery, priorità alla guida **Explore La Nogalera** (locali misti, tapas, social bar, nightlife, LGBTQ+, mappa e schede su fonti verificabili). Evitare l'idea che il quartiere sia esclusivamente LGBTQ+.

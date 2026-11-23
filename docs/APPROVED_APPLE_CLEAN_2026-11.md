# Torremolinos — direzione Apple Clean White approvata

Data: 23 novembre 2026. Base tecnica: PR #11, MANZO Web Production v1.3.
Direzione estetica approvata: primo mockup + Sound del secondo mockup.

## Implementato in questo ramo
- Header a cinque destinazioni con palette bianco/blu e font sistema.
- Hero fotografica pulita, titolo e descrizione sotto la fotografia.
- Quattro vere card di collegamento Comer, Agenda, Gallery, Stories; non immagini cliccabili senza destinazione.
- Sound spostato subito dopo le card e rimpicciolito, con lettore audio originale mantenuto.
- Colori principali: bianco #fff, blu #096BCB, navy #10244B, superficie grigio chiaro #F4F8FC; eliminati i fondi arancione e crema in Home.
- Testo delle fotografie separato dalle immagini, con credito editoriale sotto i contenuti e dicitura esplicita per le immagini generate.
- Correzioni editoriali in IT e copy delle nuove parti localizzato in sei lingue.
- Ricerca, preferiti, filtri, rotte, mappa opt-in, link interni, PWA e accessibilità restano nel codice originale.

## Vincoli editoriali e QA
- Le immagini d'atmosfera sono illustrative e non rappresentano per forza un evento o locale nominato.
- La presenza di traduzioni dei titoli delle Stories in homepage non implica che gli articoli siano tradotti: il contenuto degli articoli rimane nella lingua pubblicata, con disclosure.
- Gli asset originali del sito (inclusa la hero) non vengono sostituiti senza una decisione editoriale separata.
- Gate: test Node, browser Chromium desktop/mobile, ispezione screenshot, Safari/iPhone fisico ancora da verificare.
- Non pubblicare automaticamente: merge richiede approvazione separata.

# TORREMOLINOS 🌞

**Your city. Your way.** Micro-app indipendente mobile-first per turisti e residenti a Torremolinos, Spagna. **Non è il sito istituzionale del Comune.**

## MVP v0.1 · 2 novembre 2026

- Nome ufficiale e brand: **TORREMOLINOS** (mai TORREMO o Brillante)
- Lingue: spagnolo, inglese, italiano, tedesco, francese, russo (revisione linguistica professionale ancora da svolgere)
- Esplora quartieri e luoghi reali filtrando per spiagge, LGBTQ+, gastronomia, cultura, notte e servizi
- Cerca tra schede; salva preferiti in localStorage; itinerari tematici con indicazioni esterne
- Informazioni essenziali con fonti ufficiali, numero 112 e collegamento a Renfe
- Mappa OpenStreetMap attivata soltanto dall'utente
- Web app installabile dove supportato, cache offline del guscio applicativo
- Zero analytics, zero pubblicità, zero account in questa versione

## Avvio locale

Servire la cartella come sito statico: `python3 -m http.server 8000` e aprire `http://localhost:8000/`.

## Architettura

La v0.1 è un unico `index.html` con CSS/JS incorporati: nessuna build, nessuna chiave API. URL pubblicato: https://manzo8b.github.io/Torremolinos/ (verificare che GitHub Pages sia attivo).

## Limiti editoriali

Non inventare orari, prezzi, eventi, aperture o recensioni. Questa versione presenta luoghi e quartieri riconoscibili; **non** contiene ancora una directory commerciale verificata né un calendario eventi aggiornato. I dati locali sono statici e i link esterni vanno controllati periodicamente. La traduzione russa è iniziale e prudente; serve revisione madrelingua. Le informazioni LGBTQ+ sono trattate senza profilazione degli utenti.

## Roadmap

1. Verifica di locali/indirizzi/orari sul campo; schede JSON con timestamp e fonte
2. Agenda eventi validata e data-scoped, senza affermazioni di disponibilità live
3. SEO per lingue con percorsi dedicati /es/, /en/, /it/, /de/, /fr/, /ru/ e hreflang
4. Accessibilità WCAG, verifica traduzioni, fotografie locali autorizzate
5. Iscrizione professionale per business e partnership **sempre etichettate**; modello commerciale trasparente
6. Analytics privacy-first dopo scelta legale consapevole; policy privacy estesa
7. Logo MANZO AI vettoriale ufficiale, Apple touch icon 180px, icone PNG 192/512

## Fonti e crediti

Vedere [CREDITS.md](./CREDITS.md). Suggerimenti o correzioni tramite GitHub Issues.

## v0.2 · Redesign editoriale e Stories (2 novembre 2026)

- Copertina fotografica a larghezza piena, stile rivista mediterranea e navigazione mobile a cinque schede
- Foglio `editorial.css` dedicato: preserva il codice applicativo v0.1
- Tre articoli originali completi e indicizzabili in `stories/`: città, La Nogalera, Pasaje Begoña
- Indice editorial `stories/index.html` e stile condiviso `stories/article.css`
- Ogni articolo: titolo e descrizione SEO, canonical, schema Article, immagine con licenza e credito, sezioni, riferimenti, approfondimenti correlati
- UI della homepage tradotta per Stories in ES / EN / IT / DE / FR / RU; testi degli articoli **solo in spagnolo**, chiaramente etichettati
- Aggiornata `sitemap.xml` con homepage, indice editoriale e tre articoli

**Stato della pubblicazione:** file caricati su GitHub / ramo `main`; verificare GitHub Pages (Settings → Pages → Source: GitHub Actions) e l'URL pubblico. Non dichiarare operativo un deployment senza prova HTTP.

**Prossime attività:** controlli responsive in browser reale, controllo WCAG, fotografie proprie, revisione multilingue completa, directory commerciale verificata con data e fonte, agenda eventi reale, pagine privacy e trasparenza commerciali aggiornate.

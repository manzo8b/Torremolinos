# Verifica della revisione — 3 novembre 2026

Ambito: refinement della home, testi di apertura e guida operativa; stack statico e hosting GitHub Pages conservati. Principi del prompt master v3 applicati, senza dichiarare installate le tre skill originali. Skill Sites consultata per progettazione e verifica; hosting Sites non utilizzato.

Eseguiti:
- `python3 scripts/validate_v06.py`: PASS, 16 URL canonici, sei pacchetti lingua e controlli esistenti. Aggiornato il valore atteso della cache a v11.
- `node --check` sugli script inline della home: PASS.
- Browser IAB: ispezione visiva della copertina desktop e mobile in spagnolo e italiano. Verifica overflow a 320, 390, 768, 1024, 1440 px; corretto il superamento dell’header a 320 px, verificato nuovamente senza overflow.
- Ricerca Bajondillo: un risultato; ricerca inesistente: messaggio vuoto; ripristino: dieci schede.
- Preferito selezionato e filtro Salvati: un risultato; itinerario cultura/orgoglio: Pasaje Begoña, La Nogalera, El Bajondillo.
- Cambio lingua ES→IT: testi evocativi e controlli aggiornati.
- Console durante i percorsi provati: nessun log di errore restituito.
- Link footer duplicato La Nogalera rimosso; teaser duplicato rimosso mantenendo il blocco editoriale completo.
- Nessuna nuova immagine o dipendenza; un foglio CSS aggiunto, cache aggiornata per includerlo. Movimento ridotto rispettato anche nello scroll programmato.

Limiti: nessun audit Lighthouse/axe, nessuna misura Core Web Vitals sul campo, nessuna certificazione WCAG, nessuna verifica fisica su dispositivi o matrice di browser. Le sei traduzioni di apertura sono implementate; controllo editoriale approfondito eseguito su IT/ES, non revisione madrelingua delle altre. Audio preservato, riproduzione e sorgente remota non collaudate in questa revisione. Nessun pagamento, analytics, affiliazione o raccolta contatti aggiunto. I documenti strategici descrivono fasi future, non servizi già attivi.

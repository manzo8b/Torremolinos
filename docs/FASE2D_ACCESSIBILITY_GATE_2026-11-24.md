# TORREMOLINOS — Fase 2D: gate accessibilità

Data: 24 novembre 2026. PR #19 draft, nessun deploy.

Baseline v32: 11 nodi color-contrast per viewport (10 fonti e label Pride), Gallery zero. Issue #20.

## Correzione
- Le regole legacy .source (opacity .8) e .pride-visual-detail (opacity .9) alteravano i colori compositati. Override circoscritto ai nodi effettivi, opacità 1 e token --ac-blue-dark (#0758AE); hover/focus #064788. Non modificati foto, dimensioni, layout, Sound, contenuti o animazioni.
- Cache PWA v33 e contratti statici sincronizzati.
- Test Chromium a 390/1280: stile calcolato, round-trip Tab/Shift+Tab per fonti, focus visibile, screenshot sezioni, axe contrast con assert bloccante e report JSON. I test automatizzati non equivalgono a una revisione manuale.

## Checklist manuale prima del rilascio (non eseguita su dispositivo reale)
- [ ] Safari iOS con VoiceOver: Home, selettore lingua, fonti, menu, Gallery; nomi, ruoli, ordine e annunci dei controlli.
- [ ] Desktop con tastiera: Tab/Shift+Tab, Enter/Spazio, salto al contenuto, focus sempre visibile e non coperto, assenza di trappole, apertura/chiusura Gallery.
- [ ] Zoom 200%, reflow 320 CSS px, orientamento, testo ingrandito iOS, reduced motion; nessuna perdita di contenuto o funzionalità.
- [ ] Registrare browser, versione, dispositivo, lingua, esito e difetti per ogni prova. Non dichiarare conformità WCAG completa.

Gate: attendere CI su SHA effettivo; mantenere Issue #20 aperta fino a verifica automatica e manuale. Revisione editoriale finale e approvazione esplicita prima di merge/deploy.

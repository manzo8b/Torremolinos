# TORREMOLINOS — Fase 3B / performance e SEO
24 novembre 2026 — PR #21, no deploy.

## Baseline 3A (37730ad)
Quality, product contract, Fase 2 Content Coherence PASS. Home/Gallery 0 violazioni axe WCAG 2.1 A/AA a 390 e 1280; Home 2 incomplete checks per viewport, manuale aperto. La Nogalera 12 campioni PASS, Home 109/109 × 6. Run 45336397250.
Clean gate 45336397162: 100 file, 4.323.450 byte, 17 URL sitemap, 75 precache, zero problemi statici; portabilità 4 campioni PASS. Offline nested route test timeout #home; non è un PASS. Ipotesi verificabile: emulazione offline del client non impedisce fetch del worker. Nuovo test ferma il server e prova irraggiungibilità, senza rilassare assert. Parità visiva deve essere eseguita anche se fallisce il test offline, purché build e Chromium siano disponibili.
 
## Ottimizzazione senza redesign
Priorità alta solo sulle due varianti responsive della hero (media queries disgiunte); eliminato preload concorrente palmeras-sol, già lazy nelle immagini. Cache v34 e test sincronizzati. Nessun cambio alle fotografie, dimensioni, layout, Sound, palette o animazioni. Beneficio da misurare, non presunto.

## Misurazione ripetibile
Lighthouse 13.6.0, Chrome runner, Node 22, clean dist locale, richieste esterne consentite; report JSON per ogni run. Home mobile e desktop 3 misure (mediana); mobile singolo Comer, Agenda, Gallery, Listen, Stories, Nogalera. Target 90 performance, 95 accessibility/best practices/SEO, LCP <=2500 ms, CLS <=0.1, TBT <=200 ms come budget interno. Le soglie mancate sono evidenziate, non occultate: serve triage prima del go-live. Mancata misurazione fa fallire il workflow. Lab non equivale a CrUX; INP campo <=200 ms al p75, LCP/CLS al p75, non misurati qui. Nessuna raccolta dati visitatori. Riferimento: https://web.dev/articles/vitals-measurement-getting-started.
 
## SEO
17 URL, canonical coerenti, meta description e title presenti, bozze legali noindex escluse da sitemap. Non creare hreflang fittizi: switch lingua non significa URL editoriali tradotti. robots.txt del sottoprogetto non controlla tutto github.io. Nessun claim di indicizzazione, Search Console non verificata. Nessuna modifica lastmod senza motivazione editoriale. Rieseguire test su entrambi i prefissi.

## Gate residui
Attendere esiti CI sul nuovo SHA; verificare report e diagnosticare regressioni, misurare iterazione dopo cambiamenti. Verifica Safari/iPhone, VoiceOver, licenze e policy, fonti, rapporti ANDALUZ, upgrade da installazione esistente e baseline visiva storica prima del rilascio. Nessun merge/deploy o nuovo costo richiesto.

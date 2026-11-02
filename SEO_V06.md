# TORREMOLINOS — SEO, Sitemap e Sitelink · v0.6

Data: 2 novembre 2026 · Sito: https://manzo8b.github.io/Torremolinos/

## Sitemap e indicizzazione

La sitemap pubblica `/sitemap.xml` elenca **13 URL canonici**: homepage, directory gastronomica, agenda, indice Stories, quattro articoli storici, Listen, hub Legal e tre informative editoriali (Editorial Policy, Event Source Policy, Copyright & Credits).

`/anteprima/` e le bozze giuridiche su privacy, cookie, condizioni d'uso, accessibilità e contatto **non** sono incluse. Le bozze hanno il meta `robots=noindex`.

La sitemap usa indirizzi assoluti e il campo `lastmod` con la data della modifica sostanziale. Non usa `priority` o `changefreq`, che Google dichiara di ignorare:
https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

La pagina `/robots.txt` contiene:
`Sitemap: https://manzo8b.github.io/Torremolinos/sitemap.xml`

## Architettura per possibili sitelink

1. Home → Explore, Comer, Agenda, Stories, Listen e Legal
2. Comer → schede verificabili, fonti, mappa, filtri e ritorno Home
3. Agenda → festival maggiori, mese, categorie, eventi monitorati
4. Stories → articoli storici e articolo musicale
5. Listen → musica, album, legami editoriali e ritorno a Stories
6. Legal → criteri di fonti, diritti, privacy (in bozza)

**I sitelink di Google sono generati automaticamente. Non è possibile selezionare o garantire manualmente quali appaiono.**
Fonte: https://developers.google.com/search/docs/appearance/sitelinks

## SEO on-page

- H1 unico, senza punto finale, titolo chiaro e corrispondente al contenuto
- Meta title e description coerenti con il contenuto effettivo, evitando promesse di disponibilità live
- Link di navigazione espliciti, non solo controlli JS
- `canonical` su pagine pubbliche; `noindex` sulle anteprime
- `Article` per l'editoriale LUNE_X, `CollectionPage` sulle directory
- Non aggiungere recensioni, punteggi o `Offer` JSON-LD inventati
- Non aggiungere `hreflang` finché traduzioni complete non esistono su URL distinti
- Test contrasto, performance, immagini e layout mobile da completare

## Search Console

1. Verificare la proprietà URL prefix `https://manzo8b.github.io/Torremolinos/`
2. Inviare `https://manzo8b.github.io/Torremolinos/sitemap.xml` una volta pubblicata la build v0.6
3. Usare Ispezione URL per homepage, `/agenda/`, `/comer/`, `/listen/`
4. Ricontrollare lo stato dei 13 URL dopo la scoperta di Google senza assumere indicizzazione immediata

## Riferimenti

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/sitelinks
- https://www.w3.org/TR/WCAG22/

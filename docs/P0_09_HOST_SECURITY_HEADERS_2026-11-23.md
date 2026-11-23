# TORREMOLINOS — P0-09 · Header HTTP di sicurezza

**Data:** 23 novembre 2026 · **Stato:** preparato per staging, **non pubblicato**  
**Vincolo:** nessuna modifica al sito HTML/CSS/JS, al footer approvato, alla PWA o al dominio GitHub Pages.

## Contesto accertato

GitHub Pages serve il repository ma non applica un file `_headers` come Cloudflare Pages o Netlify. Non basta aggiungere questo file alla root di `main`: sarebbe fuorviante e rischierebbe di renderlo pubblico come contenuto, **senza** aggiungere protezioni HTTP. Per questo il generatore produce esclusivamente file sotto `artifacts/hosting-staging/`; solo il futuro processo di distribuzione, con provider scelto e collaudato, potrà copiare `_headers` in `dist/`.

Riferimenti della sintassi: [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/), [Netlify Custom Headers](https://docs.netlify.com/manage/routing/headers/), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

## Inventario dipendenze attuali

| Risorsa | Uso effettivo | Policy proposta |
|---|---|---|
| CSS/JS locali e script/style inline | HTML multi-pagina già pubblicato | In CSP report-only `script-src 'self' 'unsafe-inline'` e `style-src 'self' 'unsafe-inline'`. Non dichiarare CSP rigida finché non si eliminano gli inline con hash/nonce |
| Google Fonts | CSS `fonts.googleapis.com`, font `fonts.gstatic.com` | Host espliciti in `style-src`/`font-src` |
| Wikimedia e altri URL immagini HTTPS | Fotografie e alcuni fallback documentali | `img-src ... https:` temporaneo e solo in CSP report-only, da restringere dopo inventario completo |
| LUNE_X (su stesso `github.io`, percorso distinto) | Estratto audio originale | `media-src 'self' https://manzo8b.github.io`. Non copiare l'MP3 senza convalida diritti |
| OpenStreetMap | Iframe su consenso/click nella Home | `frame-src https://www.openstreetmap.org` |
| GitHub, Renfe, Turismo, Google Maps, YouTube, DistroKid | Link in uscita, non risorse da incorporare | Non richiedono l'aggiunta a `connect-src` o `frame-src` per semplice navigazione |

## Regole applicate nel candidato `_headers`

Nel modello per il **futuro** provider:

- **Enforcement prudente:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` (camera/microfono/pagamenti spenti) e CSP **minima applicata**: `frame-ancestors 'none'; object-src 'none'; base-uri 'self'`.
- **Osservazione non bloccante:** `Content-Security-Policy-Report-Only` con direttive sulle risorse (JS, CSS, font, mappe, immagini, audio). Non è la CSP pienamente applicata: è un primo profilo di audit.
- **Service worker:** regola dedicata `Cache-Control: no-cache` per `/service-worker.js` o `/guide/service-worker.js`. Non imporre `immutable` agli asset attuali, non tutti versionati tramite hash.
- **HSTS:** disabilitato per impostazione predefinita. Consentito solo mediante flag espliciti per **dominio HTTPS dedicato verificato e root `/`**, con pilota `max-age=300`. Vietati `includeSubDomains` e `preload` fino a valutazione specifica. HSTS opera a livello di host, non di percorso.
- Nessun `X-Robots-Tag: noindex` globale; le pagine legali ancora in bozza conservano gli attuali meta `noindex` locali.

**Importante sulla CSP in osservazione:** senza un endpoint `report-uri`/`report-to` configurato, le segnalazioni sono visibili durante il collaudo del browser ma non vengono raccolte automaticamente dai visitatori. Non inventiamo un endpoint o un trattamento di dati non approvato.

## Comandi di preparazione

```bash
python3 scripts/generate_security_headers.py --provider cloudflare-pages \
  --base-path / --out artifacts/hosting-staging/cloudflare-root/_headers

python3 scripts/generate_security_headers.py --provider netlify \
  --base-path /guide/ --out artifacts/hosting-staging/netlify-guide/_headers
```

Il generatore verifica percorso, destinazione, provider e l'assenza di HSTS non autorizzato. Il workflow `host-headers.yml` verifica i candidati con unittest, simula le risposte HTTP in loopback e utilizza Chromium desktop/mobile per rilevare regressioni e violazioni CSP in locale.

## Gate indispensabili prima del cutover

1. **P0-01 e P0-10:** stabilizzare la build `dist/` portabile, con esclusione dei file tecnici e baseline visiva ancora da formalizzare nelle PR #13/#14.
2. **Provider:** scegliere Cloudflare Pages, Netlify o altra piattaforma compatibile. Verificare sui veri response headers (`curl -I`, Chromium Network) che `_headers` sia applicato; l'emulazione locale non equivale al test reale.
3. **Browser:** testare Home e pagine interne, sei lingue dove disponibili, audio su click, mappa su click, PWA offline, iPhone/Safari, tablet, desktop; registrare eventuali CSP report-only violations.
4. **CSP forte:** sostituire gradualmente `unsafe-inline` tramite hash/nonce o estrazione degli inline; limitare origini immagini; attivare enforcement solo quando non introduce regressioni.
5. **Legale:** non introdurre raccolta di report dal browser degli utenti senza scegliere endpoint e valutare privacy/retention.
6. **HSTS:** approvare solo su dominio HTTPS proprio, senza impatto su altri siti della stessa origine e senza preload anticipato.

## Stato del rilascio

**P0-09 è una preparazione tecnica, non una migrazione completata**. Nessun nuovo header HTTP è attivo sul sito pubblico di GitHub Pages. Non è stato modificato il design, il footer né la sezione Sound. Nessuna nuova pubblicazione parte dalla PR di staging.

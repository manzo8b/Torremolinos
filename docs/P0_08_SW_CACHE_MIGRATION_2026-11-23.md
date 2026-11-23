# TORREMOLINOS — P0-08 · Portabilità e sicurezza service worker

**Data:** 23 novembre 2026  
**Stato:** modifica tecnica limitata al SW in un ramo separato; nessun cambio dominio né kill switch in produzione.  
**Fonte:** `brief-sistemazione-torremolinos.md`, P0-08; audit precedente PR #13, percorso portabile PR #14.

## Problemi rilevati nel SW pubblicato

1. Il precedente handler `activate` cancellava **tutte** le cache CacheStorage dello stesso dominio salvo la propria. Questo rischiava di cancellare cache legittime di altri progetti su `manzo8b.github.io`.
2. Il precedente handler `fetch` controllava l'origine, ma non il prefisso: poteva intercettare/cachare contenuti di altri progetti sullo stesso dominio richiesti dalla guida.
3. La versione cache era aggiornata manualmente nei sorgenti. La nuova procedura opzionale genera una versione derivata dal contenuto effettivo dei file precache, **solo nella build distributiva**.

## Modifiche tecniche

- `service-worker.js` mantiene il percorso relativo `./`, network-first e la pagina offline esistente.
- `CACHE_PREFIX='torremolinos-'` limita la cancellazione delle cache del worker alla propria famiglia.
- `SCOPE_URL=new URL(self.registration.scope)` limita il caching alle risorse dentro il vero scope, qualunque sia il dominio o sottopercorso di distribuzione.
- Versione sorgente `torremolinos-v28`. Il tool `scripts/version_sw_cache.mjs` calcola un hash SHA-256 della lista precache e dei file e sostituisce **nell'output di build** il nome della cache con `torremolinos-h...`. Il tool non è ancora collegato al workflow Pages corrente; il ramo di preparazione `dist/` è la PR #14.
- `scripts/legacy-sw-kill-switch.template.js` è **un modello inattivo**; non va registrato e non sostituisce il service worker attuale.

## Kill switch — sequenza obbligatoria prima di un cambio provider

1. Verificare la nuova origine: URL e canonical, PWA installabile, cache offline, player, routing, SEO, permessi dei contenuti e QA visuale.
2. Aggiornare **l'HTML servito dal vecchio host** per non registrare più `./service-worker.js`; preferire una pagina informativa/redirect per soli percorsi TORREMOLINOS.
3. Sul vecchio host distribuire il contenuto del template **esattamente al percorso** `/Torremolinos/service-worker.js`, mantenendone l'URL originario per la procedura di aggiornamento dei vecchi client. Verificare l'attivazione del nuovo worker.
4. Il modello verifica che `self.registration.scope` sia esattamente `https://manzo8b.github.io/Torremolinos/`; solo allora elimina cache con prefisso `torremolinos-` e fa `unregister()`. Non elimina cache di LUNE_X, MANZO AI o altri progetti e non cancella service worker altrui.
5. Su browser usato per la verifica: aprire un client precedentemente online, attivare l'aggiornamento, chiudere/ripartire e verificare il passaggio al nuovo sito. Registrare risultati Chrome/Safari, comportamento offline e eventuale loop. Nessun redirect automatico nel template.
6. Non eliminare la vecchia origine né la vecchia pagina di transizione finché non si sono verificati link, appunti e installazioni PWA esistenti.

## Limiti e gate

- Il caso reale di installazione e disinstallazione cross-origin deve essere verificato su un vero ambiente di staging. I test locali non certificano il comportamento di Safari/iPhone fisico.
- La futura release P0-08 finale dipende da P0-01 e dalla scelta del nuovo dominio/provider. Non dichiarare **completata la migrazione** prima del cutover.
- Non è autorizzata nessuna modifica a `manifest.webmanifest` senza revisione visiva dell'interfaccia browser, benché `start_url` e `scope` siano già relativi.
- Non è autorizzata alcuna modifica al contenuto o all'interfaccia Home: il nuovo footer approvato e l'intero design restano identici.

**Risultato atteso di questa PR:** eliminare l'effetto collaterale delle cache su origine condivisa e preparare gli strumenti per una futura migrazione controllata.

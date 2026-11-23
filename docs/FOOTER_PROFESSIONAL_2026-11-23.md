# TORREMOLINOS — Footer professionale, redesign autorizzato

**Data:** 23 novembre 2026  
**Fonte:** screenshot utente del sito pubblicato e richiesta esplicita di sistemazione del footer.  
**Perimetro:** Home soltanto; la navigazione interna, la Hero, Sound, fotografie, funzioni e testi delle altre pagine restano invariati.

## Risultato progettato

- Layout a quattro blocchi: marchio e presentazione; Esplora; Progetto e fonti; Informazioni.
- Palette approvata Apple Clean White: fondo bianco, testo navy `#10244B`, collegamenti blu `#096BCB`, divisori chiari.
- Trattamento editoriale dei contenuti: fonti ufficiali (Turismo Torremolinos, Renfe Cercanías), metodo e attribuzioni, navigazione e link legali distinti.
- Eliminate la vecchia griglia asimmetrica, le ripetizioni, i piccoli link tutti verdi, il testo poco leggibile e il badge `v0.6` non pertinente al prodotto attuale.
- Link di contatto: **GitHub Issues**, unico canale di correzione pubblica già pubblicato; nessuna email o indirizzo inventati.
- Trasparenza: sito editoriale non affiliato al Comune; le pagine privacy/cookie/contatti ancora `noindex` sono esplicitamente indicate come in revisione.
- Footer localizzato in **ES, EN, IT, DE, FR, RU**, senza sovrascrivere la gestione linguistica esistente.
- Layout desktop a quattro blocchi, tablet con griglia semplificata, mobile con link disposti ordinatamente e spazio per la barra mobile.
- Link esterni aperti separatamente con `noopener noreferrer`; Focus visibile, supporto reduced-motion e dimensioni tap mobile >= 44px.
- La PWA precacha `footer-professional-2026.css` e `footer-professional-2026.js` e usa la versione `v27`.

## Criteri di QA

- Tutti i test Node preesistenti e le nuove regressioni del footer.
- Chromium smoke a 360, 390, 768, 1024, 1440, screenshot specifici del footer.
- Switch IT → EN → ES → IT e verifica del rendering senza overflow.
- Ispezione screenshot prima del rilascio; per questo intervento è intenzionale e autorizzata una differenza visiva rispetto alla baseline della Fase 0. Conservare il riferimento storico come PRE-footer e produrre nuovo golden post-merge.
- Verificare il deploy su stesso commit SHA dei test; non attribuire dati societari non verificati.

## Stato di pubblicazione

Intervento di UI richiesto esplicitamente dall'utente. Le PR tecniche #13 (baseline storica) e #14 (portabilità) non vengono unite automaticamente a questo lavoro; il footer parte dall'ultimo `main` pubblico. Se i test falliscono, la versione attuale rimane pubblicata e la modifica resta nel ramo separato.

## Fase successiva

P0-08: audit di service worker e cache, verificando gli scope e il comportamento tra sotto-percorso GitHub e futuro provider. Nessuna disattivazione su `github.io` finché non viene approvato un piano di cutover sicuro.

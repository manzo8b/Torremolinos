# TORREMOLINOS v0.6 — Design system e narrazione

Data: 2 novembre 2026 · Repository `manzo8b/Torremolinos`

## Identità e priorità

**TORREMOLINOS**, sempre per esteso. Una guida indipendente, inclusiva, giovane ma utile anche a visitatori adulti e residenti. Non un portale istituzionale e non un sito esclusivamente nightlife.

**Claim principale:** `TORREMOLINOS · A tu manera`. Il nome non viene abbreviato. Nessun punto finale nei titoli H1–H3.

**Voce:** concreta, entusiasmante, mai inventata. Dare la fonte quando un'affermazione riguarda un luogo, una programmazione, un orario o una disponibilità.

## Palette v0.6

| Token | Hex | Uso |
| --- | --- | --- |
| Sea Paper | `#F5F1E8` | Sfondo avorio caldo |
| Soft Sand | `#E8DDCA` | Sezioni chiare e card |
| Modern Palm | `#4D8A74` | Verde protagonista moderno |
| Deep Teal | `#1C5056` | Titoli, pulsanti, superfici scure |
| Night Ink | `#193A41` | Testi e footer |
| Sunset Coral | `#DF886A` | Accenti secondari ed eventi |
| Soft Gold | `#C9A76C` | Micro-dettagli editoriali |

Implementazione in `v06.css`, caricato dopo gli stili esistenti per mantenere le funzionalità.

## Struttura editoriale

1. **Hero** con fotografia originale e contrasto teal più profondo; ricerca ancora operativa
2. **Explore** — spiagge, quartieri, cultura e persone
3. **Local Lens** — fotografie autentiche dell'archivio TORREMOLINOS
4. **Sound of Torremolinos** — anteprima MP3 `Next Stop: Torremolinos` di LUNE_X, avvio con Play (no autoplay sonoro)
5. **Gastronomia** — Guadalupe Bajondillo, Guadalupe La Nogalera, Cozzy Inn Gastro Bar, ANDALUZ
6. **Stories** — patrimonio, La Nogalera, Pasaje Begoña, San Miguel, LUNE_X
7. **Agenda** — eventi verificati, filtri e lista separata di date da verificare
8. **Legal** — fonti, policy editoriali, bozze normative separate

## Musica e disclosure

`Next Stop: Torremolinos`: anteprima MP3 ospitata nel progetto LUNE_X, raggiungibile da `/listen/` e dalla Hero. Non è un brano di sottofondo forzato: la riproduzione richiede il gesto del visitatore.

`Welcome to the Paradise`: editoriale originale disponibile interamente in ES, EN, IT, DE, FR, RU in `listen/content.js`, con collegamento alla pagina di distribuzione. Nessun brano dell'album viene incorporato se non è stato verificato come disponibile/riutilizzabile.

LUNE_X è un progetto artistico digitale con direzione creativa umana e produzione assistita da intelligenza artificiale; non è definito il musicista ufficiale di Torremolinos.

## Stato delle traduzioni

- Homepage: interfaccia ES/EN/IT/DE/FR/RU, compresa nuova musica e footer
- Agenda e gastronomia: interfacce e schede multilingue esistenti, integrate con nuovi collegamenti
- Listen: **articolo completo nelle 6 lingue**
- Legal: **testi completi nelle 6 lingue**, con status editorialmente esplicito
- Stories storiche: **ancora in spagnolo**, traduzioni da preparare e revisionare. Non inserire `hreflang` per contenuti che non hanno URL localizzati corrispondenti

## Materiali fotografici futuri

Priorità alta per **immagini orizzontali 16:9**: tramonto dal lungomare, dettagli di La Nogalera, architettura caratteristica e insegne di locali con diritti d'uso verificati. I ritratti riconoscibili di performer e partecipanti alle processioni restano fuori dalla pubblicazione automatica.

## Loghi di eventi

MadBear, INFINITY e Daddy: i marchi possono essere citati con il loro nome testuale. L'immagine del logo pubblico **non è automaticamente liberamente riutilizzabile**. Preferire asset forniti dall'organizzatore con licenza/permesso esplicito e disclaimer di non affiliazione.

## Qualità

Controlli automatici: `scripts/validate_v06.py`, `.github/workflows/quality.yml`. Restano da fare test su browser reale e dispostivi mobili, accessibilità WCAG 2.2 e controllo visivo dei contrasti.

## Decisione dell'utente — Hero definitiva · 2 novembre 2026

**Vincolo non modificabile senza approvazione**: Hero principale = immagine **«Cartolina mediterranea di Torremolinos(1).png»** (il collage editoriale con spiaggia, palme e scorci bianchi). L'immagine **«Spiaggia tropicale con palme e mare scintillante(1).png»** è riservata alla Gallery e alle card interne; NON usarla per la Hero.

Percorsi previsti:
- `assets/gallery/gallery-cover-editorial-ai.webp` = collage approvato, Hero desktop e mobile
- `assets/gallery/beach-palms-ai.webp` = seconda immagine, Gallery
- Se usati percorsi foto specifici: `assets/photos/hero-editorial-ai-desktop.webp` e `hero-editorial-ai-mobile.webp` devono derivare esclusivamente dal collage approvato

Il codice `index.html` e `anteprima/index.html` è stato aggiornato in tal senso. I file WebP devono essere realmente presenti nel repository prima di affermare che la nuova Hero è visibile in produzione. Fino ad allora il sito mantiene il vecchio asset come fallback. Visual creati con IA, da segnalare come **immagini illustrative**, non fotografie documentarie.

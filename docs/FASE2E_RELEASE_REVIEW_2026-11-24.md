# TORREMOLINOS — Fase 2E: revisione editoriale e gate release
24/11/2026. PR #19 draft, base main eed4d7c, baseline 99ac0ed. Nessun deploy.

| ID | Evidenza / stato | Residuo |
|---|---|---|
| C-01 | Home 109/109 × 6, Gallery audit; nuovi label Nogalera | Dizionario condiviso multipagina |
| C-02 | Copertura tecnica | Revisione madrelingua RU, DE, FR, EN |
| C-03 | Badge IA condizionale; 7 foto, 2 IA sospese | Controllo diritti e crediti rimanenti |
| C-04 | Design freeze | Duplicazioni solo dopo approvazione |
| C-05 | Mappa senza placeholder | Verifica manuale sharing e focus |
| C-06 | 3 card, 6 fonti 23/11 | Servizi e accessibilità fisica da riconfermare |
| C-07 | README allineato | Aggiornare dopo release |
| C-08 | Footer MANZO AI; Sound LUNE_X | Conferma titolarità |
| C-09 | Scanner storico; issue #1 aperta | INFINITY/ACOGAT HTTP 202 |
| C-10 | Trasparenza scelte editoriali | ANDALUZ e rapporti commerciali da confermare |
| C-11 | 9 Comer con date 02/11 | Operatività non riconfermata |
| C-12 | Fallback noscript 9 schede | Nessuna espansione senza fonti |
| C-13 | Snapshot con scadenza | Pipeline automatica non implementata |
| C-14 | 27 eventi con data, 24 LGBTQ+, 3 cultura | Non equivalgono a 27 eventi futuri |
| C-15 | ICS date intere preesistente | Import Apple/Google/Outlook manuale |
| C-16 | Gallery axe zero v32 | v33 e verifica manuale |
| C-17 | 5 Stories con breadcrumb, date; 2 crediti CC | Revisione completa dei diritti |
| C-18 | Dossier in ES | Traduzioni EN e URL dedicati |
| C-19 | 12 visibili: 6 operator, 2 directory, 4 map search; 4 esclusi | Verifica operativa aperta |
| C-20 | Audio preload none; disclosure LUNE_X | Diritti estratto da documentare |

## Gate
- Tutti i workflow verdi sullo SHA effettivo; Issue #20 aperta fino a controllo manuale.
- Verificare date/attività dalle fonti; non aggiornare timestamp per il solo audit.
- Confermare ANDALUZ, rapporti commerciali, titolarità e recapito privato, diritti audio. Privacy, cookie, condizioni, accessibilità e contatto non approvati: non togliere noindex.
- Revisione madrelingua; differimenti non critici solo espliciti; nessuna pretesa di traduzione integrale.
- PR #18 (dist) separata: audit congiunto prima di release per evitare pubblicazione di documenti interni e test.
- Approvazione proprietario prima del merge. Nessuna certificazione WCAG o legale.

## C19
Date originali e categorie delle fonti su ogni scheda visibile in sei lingue. Le ricerche cartografiche non sono fonti dirette e non producono un link fonte duplicato. Nessuna modifica a foto, nomi, indirizzi, elenco o layout generale. Test statici e 12 campioni browser previsti. Nessuna nuova verifica esterna.

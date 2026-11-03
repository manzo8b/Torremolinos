# Album e movimento — 3 novembre 2026

Requisiti: nessuna immagine in formato verticale nell’interfaccia; niente nuovi scatti nuvolosi; Gallery visiva con poche scritte e sfoglio; numero ornamentale delle sezioni rimosso; palette luminosa differenziata; simbolo del logo come favicon; trasparenza AI nel footer e piccoli indicatori sintetici.

Implementazione: sette foto fornite e due illustrazioni, tutte esportate in orizzontale. Copertina home sostituita con fotografia soleggiata. Gallery a due colonne su desktop, singola colonna mobile, prima foto panoramica. Titoli brevi; crediti completi nel visualizzatore. Frecce e tastiera sinistra/destra, Escape e ripristino focus. Nessun autoplay. Scorrimento nativo con piccoli movimenti di ingresso e transizione pagina progressiva nei browser compatibili, fallback normale negli altri. Rispetto di reduced motion; nessuno scroll obbligato.

Favicon verificata identica al simbolo del logo. Le numerazioni di itinerari e posizione nell’album rimangono perché funzionali, non sono etichette ornamentali delle sezioni.

Verifiche: controllo statico del progetto e sintassi JavaScript; browser desktop e mobile per Gallery e home; apertura, avanzamento, filtro, chiusura, focus e assenza di overflow. Le transizioni tra documenti dipendono dal supporto browser e non sono garantite in ogni motore. Nessuna certificazione di accessibilità o misurazione dei Web Vitals sul campo.

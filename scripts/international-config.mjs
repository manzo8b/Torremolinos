// Route policy: Agenda data still includes untranslated editorial notes.
export const LANGS=['es','en','it','de','fr','ru'];
export const BASE='https://manzo8b.github.io/Torremolinos/';
export const ROUTES=[
 {path:'',index:true,probe:'.hero-sub',lists:['#cards']},
 {path:'comer/',index:true,probe:'.hero-copy p',lists:['#featuredCards','#moreCards']},
 {path:'gallery/',index:true,probe:'[data-t="lead"]',lists:[]},
 {path:'explore/',index:true,probe:'[data-copy="intro"]',lists:['#cards']},
 {path:'explore/la-nogalera/',index:true,probe:'[data-t="intro"]',lists:['#places']},
 {path:'tu-torremolinos/',index:true,probe:'[data-plan-t="lead"]',lists:[]},
 {path:'agenda/',index:false,probe:'[data-t="heroLead"]',lists:[]}
];
export const META={
 '':{
 es:['TORREMOLINOS | Guía local, agenda, restaurantes y LGBTQ+','Descubre Torremolinos: playas, La Nogalera, gastronomía, cultura y agenda. Guarda lugares y crea tu ruta con esta guía independiente.'],
 en:['TORREMOLINOS | City guide, events, dining and LGBTQ+','Discover Torremolinos: beaches, La Nogalera, dining, culture and events. Save places and plan your route with this independent guide.'],
 it:['TORREMOLINOS | Guida alla città, eventi, ristoranti e LGBTQ+','Scopri Torremolinos: spiagge, La Nogalera, gastronomia, cultura e agenda. Salva i luoghi e crea il tuo percorso con questa guida indipendente.'],
 de:['TORREMOLINOS | Stadtführer, Veranstaltungen, Restaurants und LGBTQ+','Entdecke Torremolinos: Strände, La Nogalera, Gastronomie, Kultur und Veranstaltungen. Speichere Orte und plane deine Route.'],
 fr:['TORREMOLINOS | Guide, événements, restaurants et LGBTQ+','Découvrez Torremolinos : plages, La Nogalera, gastronomie, culture et événements. Enregistrez vos lieux et créez votre parcours.'],
 ru:['TORREMOLINOS | Путеводитель, события, рестораны и ЛГБТК+','Откройте Торремолинос: пляжи, Ла-Ногалера, гастрономия, культура и события. Сохраняйте места и создавайте маршрут.']},
 'comer/':{
 es:['Dónde comer en Torremolinos | TORREMOLINOS','Guía independiente de restaurantes, tapas y cocina local en Torremolinos, con fuentes y direcciones.'],
 en:['Where to eat in Torremolinos | TORREMOLINOS','Independent guide to restaurants, tapas and local food in Torremolinos, with sources and addresses.'],
 it:['Dove mangiare a Torremolinos | TORREMOLINOS','Guida indipendente a ristoranti, tapas e cucina locale di Torremolinos, con fonti e indirizzi.'],
 de:['Essen in Torremolinos | TORREMOLINOS','Unabhängiger Restaurantführer für Tapas und lokale Küche in Torremolinos, mit Quellen und Adressen.'],
 fr:['Où manger à Torremolinos | TORREMOLINOS','Guide indépendant des restaurants, tapas et saveurs locales de Torremolinos, avec sources et adresses.'],
 ru:['Где поесть в Торремолиносе | TORREMOLINOS','Независимый гид по ресторанам, тапас и местной кухне Торремолиноса с источниками и адресами.']},
 'gallery/':{
 es:['Álbum fotográfico de Torremolinos | TORREMOLINOS','Fotografías originales del mar, los barrios y la vida local de Torremolinos, con créditos identificados.'],
 en:['Torremolinos photo album | TORREMOLINOS','Original photographs of Torremolinos beaches, neighbourhoods and local life, with identified credits.'],
 it:['Album fotografico di Torremolinos | TORREMOLINOS','Fotografie originali del mare, dei quartieri e della vita locale di Torremolinos, con crediti identificati.'],
 de:['Fotoalbum von Torremolinos | TORREMOLINOS','Originalfotos vom Meer, den Stadtvierteln und dem Alltag in Torremolinos mit ausgewiesenen Bildnachweisen.'],
 fr:['Album photo de Torremolinos | TORREMOLINOS','Photographies originales de la mer, des quartiers et de la vie locale de Torremolinos, avec crédits indiqués.'],
 ru:['Фотоальбом Торремолиноса | TORREMOLINOS','Оригинальные фотографии моря, районов и повседневной жизни Торремолиноса с указанием авторства.']},
 'explore/':{
 es:['Qué ver en Torremolinos | TORREMOLINOS','Descubre lugares, playas, barrios y cultura; consulta fuentes y guarda paradas para tu recorrido.'],
 en:['What to see in Torremolinos | TORREMOLINOS','Explore places, beaches, neighbourhoods and culture; consult sources and save stops for your route.'],
 it:['Cosa vedere a Torremolinos | TORREMOLINOS','Scopri luoghi, spiagge, quartieri e cultura; consulta le fonti e salva le tappe del tuo percorso.'],
 de:['Sehenswürdigkeiten in Torremolinos | TORREMOLINOS','Entdecke Orte, Strände, Viertel und Kultur, prüfe Quellen und speichere Stationen für deine Route.'],
 fr:['Que voir à Torremolinos | TORREMOLINOS','Découvrez lieux, plages, quartiers et culture ; consultez les sources et enregistrez vos étapes.'],
 ru:['Что посмотреть в Торремолиносе | TORREMOLINOS','Откройте места, пляжи, районы и культуру; проверяйте источники и сохраняйте остановки маршрута.']},
 'explore/la-nogalera/':{
 es:['La Nogalera: bares, tapas y cultura | TORREMOLINOS','Explora La Nogalera y el centro de Torremolinos: cafés, tapas, vida nocturna y cultura LGBTQ+, con fuentes identificadas.'],
 en:['La Nogalera: bars, tapas and culture | TORREMOLINOS','Explore La Nogalera and central Torremolinos: cafés, tapas, nightlife and LGBTQ+ culture, with named sources.'],
 it:['La Nogalera: bar, tapas e cultura | TORREMOLINOS','Esplora La Nogalera e il centro di Torremolinos: caffè, tapas, vita notturna e cultura LGBTQ+, con fonti identificate.'],
 de:['La Nogalera: Bars, Tapas und Kultur | TORREMOLINOS','Entdecke La Nogalera und das Zentrum von Torremolinos: Cafés, Tapas, Nachtleben und LGBTQ+-Kultur mit Quellen.'],
 fr:['La Nogalera : bars, tapas et culture | TORREMOLINOS','Explorez La Nogalera et le centre de Torremolinos : cafés, tapas, vie nocturne et culture LGBTQ+, avec sources identifiées.'],
 ru:['Ла-Ногалера: бары, тапас и культура | TORREMOLINOS','Откройте Ла-Ногалеру и центр Торремолиноса: кафе, тапас, ночную жизнь и культуру ЛГБТК+ с источниками.']},
 'tu-torremolinos/':{
 es:['Crea tu ruta en Torremolinos | TORREMOLINOS','Planifica un recorrido personal, elige y ordena paradas de la guía. Sin registro obligatorio.'],
 en:['Plan your Torremolinos route | TORREMOLINOS','Build a personal itinerary, choose and reorder stops from the guide. No mandatory sign-up.'],
 it:['Crea il tuo itinerario a Torremolinos | TORREMOLINOS','Organizza un percorso personale, scegli e ordina le tappe della guida. Nessuna registrazione obbligatoria.'],
 de:['Plane deine Route in Torremolinos | TORREMOLINOS','Erstelle eine persönliche Route und ordne Stationen aus dem Reiseführer. Keine Registrierung erforderlich.'],
 fr:['Créez votre itinéraire à Torremolinos | TORREMOLINOS','Préparez un parcours personnel, choisissez et organisez les étapes du guide. Sans inscription obligatoire.'],
 ru:['Создайте маршрут по Торремолиносу | TORREMOLINOS','Составьте личный маршрут, выберите и упорядочьте остановки путеводителя. Без обязательной регистрации.']},
 'agenda/':{
 es:['Agenda cultural y LGBTQ+ de Torremolinos | TORREMOLINOS','Eventos culturales y LGBTQ+ de Torremolinos, fechas anunciadas y fuentes identificadas.'],
 en:['Torremolinos cultural and LGBTQ+ events | TORREMOLINOS','Torremolinos cultural and LGBTQ+ events, announced dates and identified sources.'],
 it:['Agenda culturale e LGBTQ+ di Torremolinos | TORREMOLINOS','Eventi culturali e LGBTQ+ di Torremolinos, date annunciate e fonti identificate.'],
 de:['Kultur- und LGBTQ+-Veranstaltungen in Torremolinos | TORREMOLINOS','Kultur- und LGBTQ+-Veranstaltungen in Torremolinos mit angekündigten Terminen und Quellen.'],
 fr:['Agenda culturel et LGBTQ+ de Torremolinos | TORREMOLINOS','Événements culturels et LGBTQ+ de Torremolinos, dates annoncées et sources identifiées.'],
 ru:['Культурные и ЛГБТК+ события Торремолиноса | TORREMOLINOS','Культурные и ЛГБТК+ события Торремолиноса, объявленные даты и указанные источники.']}
};
export const NAMES=['Español','English','Italiano','Deutsch','Français','Русский'];
export const OG={es:'es_ES',en:'en_GB',it:'it_IT',de:'de_DE',fr:'fr_FR',ru:'ru_RU'};
export const NOTE={es:'Algunos títulos y notas del calendario conservan el español original de la fuente.',en:'Some event titles and notes retain the source’s original Spanish.',it:'Alcuni titoli e note degli eventi conservano lo spagnolo originale della fonte.',de:'Einige Veranstaltungstitel und Hinweise bleiben im spanischen Original der Quelle.',fr:'Certains titres et notes conservent l’espagnol original de la source.',ru:'Некоторые названия и примечания сохранены на испанском языке оригинала.'};

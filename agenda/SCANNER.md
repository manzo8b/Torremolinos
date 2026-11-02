# TORREMOLINOS — Scanner y agenda completa (v0.5)

**Última comprobación editorial inicial:** 2 de noviembre de 2026.
**Huso de los eventos:** Europe/Madrid.
**Estatus:** código y fuentes en GitHub; la ejecución programada de GitHub Actions aún requiere comprobación.

## Qué se ha creado

- `agenda/index.html`: agenda de eventos para visitantes y residentes, búsqueda, categorías, mes, grandes festivales y eventos pendientes de verificación.
- `agenda/events.json`: fuente editable con 23 fechas contrastadas inicialmente (20 eventos LGBTQ+ y 3 generales) y 5 eventos bajo seguimiento.
- `agenda/app.js`: navegación y filtros por fecha, enlaces originales, calendario de Google con evento de día completo y opciones multilingües ES/EN/IT/DE/FR/RU.
- `scripts/scan_events.py`: scanner **de lectura**, con fuentes permitidas y patrones estrictos para los encabezados de fechas de MadBear e Infinity; lista de títulos en ACOGAT. No requiere tokens ni claves de pago.
- `.github/workflows/event-scanner.yml`: control diario programado a las 06:17 UTC, además de ejecución manual; guarda un informe en un artefacto de Actions por 30 días y abre/actualiza una incidencia editorial si detecta discrepancias o fuentes inaccesibles.

## Fuentes vigiladas

1. **ACOGAT / Torremolinos PLUS**: https://torremolinosplus.com/en/whats-on/
2. **INFINITY Festival**: https://www.infinityfestival.eu/
3. **MADBEAR Beach Torremolinos**: https://madbear.org/madbear-beach-torremolinos

Se pueden añadir nuevas fuentes de organizadores tras comprobar accesibilidad, permisos y estabilidad.

## Regla de oro: el scanner no publica hechos por deducción

1. El scanner recopila **señales de cambio**: diferencias en fechas generales de eventos o títulos nuevos.
2. Las fechas se contrastan con el anuncio oficial actual, excluyendo material antiguo reutilizado.
3. Solo tras la verificación editorial se modifica manualmente `agenda/events.json`, con **fecha y URL de comprobación**.
4. **Daddy Week**, **Daddy Xmas**, la edición de otoño de **INFINITY** y **Bear Fest 2027** siguen en `watchlist` hasta tener confirmación directa suficiente; no se convierte un cartel de otra edición en una fecha vigente.
5. No extrapolar la regularidad de una fiesta semanal sin un anuncio por fecha.
6. No inferir precios, horarios, entradas disponibles ni aforos: un enlace original no constituye disponibilidad verificada.
7. Mantener eventos culturales y LGBTQ+ con igual rigor; indicar restricciones 18+ cuando proceda sin detalles explícitos innecesarios.

## Ejecutar manualmente

Desde la pestaña **Actions** de GitHub, seleccionar **TORREMOLINOS · LGBTQ Events Scanner** → **Run workflow**.
Una ejecución correcta produce `torremolinos-lgbt-events-scan` con:
- `scan-report.md` — informe legible;
- `scan-result.json` — resultados por fuente;
- `digest.txt` — huella para evitar incidencias idénticas repetidas.

Test local sin red:
```bash
python3 scripts/scan_events.py --fixture-dir scripts/fixtures --out reports/fixture-check --strict
```

Monitorización real (necesita conexión a Internet):
```bash
python3 scripts/scan_events.py --out reports/agenda-scan
```

**Limitación técnica:** el script comprueba solamente fechas generales de MadBear e Infinity y títulos de ACOGAT. **No extrae automáticamente todos los detalles ni garantiza descubrir el 100 % de las fiestas de redes sociales.** Toda nueva fuente necesita un adaptador y pruebas; las redes cerradas o publicaciones efímeras requieren verificación manual o un acceso oficial autorizado.

## Flujo editorial y protección de los datos

- Nada de cuentas personales, perfiles de asistentes o seguimiento de orientación sexual.
- Sin información sensible ni acceso a redes sociales privadas.
- No exponer nombres de personas privadas ni publicar imágenes de personas reconocibles sin autorización específica.
- Las fechas de la próxima edición pueden cambiar; si la fuente está caída, conservar la última información con su fecha de verificación.
- Registro de cambios y revisiones disponible mediante commits/issues de GitHub.

## Publicación y control

1. Activar GitHub Pages vía GitHub Actions en **Settings → Pages**, si aún no está activo.
2. Verificar que el workflow aparece en **Actions**.
3. Lanzar manualmente una primera ejecución y revisar `scan-report.md` antes de considerar activo el seguimiento diario.
4. Comprobar `https://manzo8b.github.io/Torremolinos/agenda/` en móvil y escritorio.
5. Mantener un control editorial al menos semanal de eventos monitorizados y de errores informados por el scanner.

**El scanner no modifica `events.json` automáticamente.** La publicación sigue separada de la recolección de datos para evitar fechas inexactas.

# TORREMOLINOS · Primera revisión manual de fuentes LGBTQ+

**Fecha de revisión:** 2 de noviembre de 2026
**Tipo:** cotejo editorial manual de tres fuentes públicas, no resultado de una ejecución confirmada de GitHub Actions.
**Edición de agenda:** `agenda/events.json` (27 eventos con fecha + 5 en observación)

## Fuentes comprobadas

| Fuente | URL | Estado de consulta | Resultado |
|---|---|---|---|
| INFINITY Festival | https://www.infinityfestival.eu/ | Sitio público accesible | Summer Edition **16–21 junio 2027**, KINK **16–20 junio 2027** |
| MADBEAR Beach | https://madbear.org/madbear-beach-torremolinos | Sitio público accesible | Encabezado **MADBEAR BEACH 2027, 6–17 agosto** |
| ACOGAT / Torremolinos PLUS | https://torremolinosplus.com/en/whats-on/ | Sitio público accesible | Agenda de **17 actividades** listadas en la página al momento de la revisión |

## Comparativa inicial

1. **Infinity 2027:** fecha general del festival coincide con el registro `infinity-2027`. Detalles de fiestas individuales deben seguir consultándose en la fuente.
2. **MADBEAR 2027:** el encabezado indica 6–17 de agosto de 2027, coincidiendo con el registro `madbear-beach-2027`. **No reutilizar el cronograma diario de la página**: incluye referencias expresas a la entrega de packs MAD.BEAR BEACH **2025**, por lo que no puede interpretarse como programa diario 2027.
3. **ACOGAT:** el listado principal anuncia 17 actividades, incluyendo NaviDaddy's el **20 diciembre de 2026**, Pride 2027 del **3 al 6 junio**, y la Semana Cultural del **27 mayo al 2 junio**. Coinciden con sus entradas en la base.
4. **Discrepancia identificada — Pipazo Weekend 7 noviembre de 2026:** la agenda general ACOGAT lo indica como **Playa del Bajondillo, 22:00**. La ficha individual citada anteriormente en el proyecto comunicaba otra sede y horario. Se ha corregido el catálogo público eliminando sede y hora concretas hasta aclarar la discrepancia.
5. **Daddy Week 2027, Daddy Xmas, Infinity otoño 2027, Bear Fest 2027 y fiestas semanales:** permanecen en `watchlist`; no se publican fechas definitivas por inferencia.

## Scanner automático

Se ha guardado el workflow `.github/workflows/event-scanner.yml` con:
- **Frecuencia diaria:** 06:17 UTC;
- **Ejecución manual:** `workflow_dispatch`;
- **Inicio por push al cambiar el workflow o los archivos de datos y scripts del scanner**;
- Informe descargable como artefacto de GitHub Actions, y apertura/actualización de issue de revisión si procede.

**Estado de ejecución al redactar:** el commit `3373eeced8b854970e2fa9528cfe682df0bc3bc0` ha activado el evento de actualización del workflow, pero **la ejecución y sus logs aún no se han podido confirmar con la conexión GitHub disponible**. No se afirma que el scanner haya terminado satisfactoriamente.

## GitHub Pages: bloqueo externo a resolver

El navegador muestra **404 — There isn't a GitHub Pages site here** en `/Torremolinos/anteprima/`. Los archivos están presentes en el repositorio. Verificar en **Settings → Pages → Build and deployment → Source = GitHub Actions**, requisito del workflow `pages.yml`. La integración de repositorio disponible permite modificar archivos pero no ofrece la acción administrativa de activar Pages ni despachar manualmente workflows.

## Próximo control humano

- Confirmar que `Actions → TORREMOLINOS · LGBTQ Events Scanner` presenta un run `success`; en caso contrario revisar paso fallido y reporte.
- Confirmar `Actions → Deploy TORREMOLINOS to GitHub Pages` con un run `success` tras habilitar Pages.
- Abrir y controllar `https://manzo8b.github.io/Torremolinos/anteprima/` tras il primo deploy.

**Regla permanente:** lo scanner segnala cambiamenti, ma i dati pubblici non vengono sostituiti automaticamente senza verifica.

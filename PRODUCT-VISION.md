# TORREMOLINOS — Product Vision & Design Principles

**Status:** design direction — November 2026  
**Owner:** Marcelo Javier Fernandez Caballero  
**Product:** independent, multilingual, mobile-first city-guide micro-app  
**Public site:** https://manzo8b.github.io/Torremolinos/

## Non-negotiable product identity

**TORREMOLINOS must be designed and developed as a digital product, not as a tourist brochure, infantile landing page, school demo, generic template or decorative magazine.** Its ambition is product-grade craft, credible local content, distinctive art direction, high utility and a recognisable signature user experience.

Creative decisions must *surpass category clichés*: avoid childish illustrations, rows of repeated soft cards, rainbow gradients, fake glass, excessive icons, needless labels, and rigid "school project" geometry. Creativity should emerge from the real character of Torremolinos — its light, sea, palms, neighbourhoods, LGBTQ+ heritage, food and nightlife — and from original interactions that help visitors act, not from decoration.

## Palette — four UI colours (and photographs)

| Token | Value | Role |
| --- | --- | --- |
| White / canvas | `#FFFFFF` | Primary background, spacious content |
| Black / ink | `#111111` | Main type, structure, contrast |
| Solar orange | `#F58A17` | Primary call to action, contextual emphasis, solar detail |
| Palm green | `#16865A` | Active states, navigation, branded blocks, secondary action |

No additional ornamental UI colours, coloured gradients or pastel backgrounds. Real images retain their natural colours. Colour pairs: black/orange, white/green, black/white. Avoid white text on solar orange; its contrast is insufficient for ordinary body text.

## Typography

DM Sans is the principal sans-serif family (system fallback). Use a disciplined typographic hierarchy: decisive display headings, readable body copy, confident compact navigation, optical spacing and strong contrast. No decorative display serif or tiny all-caps labels.

## Product architecture

- Home = clear orientation + search + immediate paths, not a wall of marketing cards.
- Explore = searchable, filterable, saveable local locations with grounded information.
- Local lens / gallery = strong, real photography, licensing and provenance.
- La Nogalera = culturally aware, inclusive, specific destination guide.
- Comer / Agenda / Stories / Listen = genuinely useful distinct destinations within one system.
- Existing multilingual capability, bookmarks, filters, itinerary, map, music player, editorial links and legal disclosures must survive any restyle.

### Defining interaction to develop next

**"Tu Torremolinos" — a personal discovery flow:** the visitor selects the moment (playa, cultura, comer, noche), receives a grounded, adjustable shortlist by neighbourhood or preference, saves places, and can jump to a map. No fictional live inventory, schedules, prices, ratings or claims. Build progressive enhancement for offline/low-bandwidth visits and no login as the default.

## UX acceptance criteria

1. Mobile-first at 360, 390, 768, 1024 and 1440px with no horizontal overflow.
2. Clearly labelled navigation with accessible focus, sensible keyboard order and touch targets of 44px or more.
3. Accessible contrast: white on palm green, black on solar orange, black on white.
4. Prefer real content and meaningful photography; keep visual complexity deliberate, not generic.
5. Natural, interruptible, low-motion feedback; honour `prefers-reduced-motion`.
6. Fast loading, responsive image formats, minimal JavaScript and good Core Web Vitals.
7. Verified, transparent local information and citations. Clearly identify generated visual material.
8. Product-quality error/empty/loading states; no dead ends or misleading CTAs.
9. Consistent product system across every inner route and mobile navigation.
10. Run browser screenshot comparisons, functional regression checks, a11y and Lighthouse before merging.

## Implementation status

Design phase 1 uses `design-system-2026.css` to consolidate visual styles in a reversible branch and recolours the original logo, preserving brand iconography. It does **not** yet claim full browser QA or a completed product redesign. Iterations should be tested visually, refined and merged only after review.

## Reference and method

HP Italy online store is an information architecture reference for discoverability, categories, navigation and functional clarity — **not** a template to copy. Method: uploaded apple-design and design-taste-frontend skill principles, adapted to this product's real content and four-colour branding.

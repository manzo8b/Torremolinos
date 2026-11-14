# TORREMOLINOS — Design contract

> Product, not brochure. A distinctive local discovery micro-app with a genuinely useful route planner, documentary photography and editorial warmth.

## Hard design constraints

1. **Never use black or charcoal as a page, footer, card, navigation or button background.** Use white as the primary surface, restrained green fields for emphasis and orange for calls to action. Black `#111111` is for text, icons and, where required, a neutral photographic scrim only. Treat this as a product-wide invariant, including legal, articles and subpages.
2. **No final full stop on any principal heading**, in any of the six supported languages, including dynamically translated headings. Ordinary body paragraphs may use normal punctuation. The runtime heading guard is a safety net, not permission to write punctuated headings.
3. **The exact interface palette** is white `#FFFFFF`, ink `#111111`, solar orange `#F58A17` and palm green `#16865A`. Natural image colours and transparent blends of these brand colours are allowed. Never introduce generic pastel blue, pink, violet or grey-paper themes.
4. **The hero photo supplied for this project is the hero**, with desktop and mobile optimized versions in `assets/photos/hero-apple-2026*.webp`. Maintain recognizable palms, blue sea, sunshine and the stone-lined water feature. Photographic overlays may protect text legibility; do not fabricate location claims.
5. **Language should be warm, descriptive and narrative**, closer to a good contemporary travel editorial than an academic syllabus. Maintain meaningful places and real practical content. Translate additions into ES, EN, IT, DE, FR, RU without dropping functionality.
6. **Apple-inspired means craft, not copying Apple styling.** Consistent frames, restrained depth, fluid immediate tactile feedback, native type rhythm, meaningful hierarchy and predictable actions. Do not add decorative blurs, excessive shadows, empty boxes or fake dashboard elements.
7. **Symmetry and spacing are deliberate.** Same left/right outer margins, consistent card and button geometry, aligned grids and equal-height repeated cards when useful. Distinct editorial sections may be asymmetrical inside the shared frame.
8. **Readable contrast is not optional.** White on palm green is AA compliant for text; ink on sun orange is AA compliant; white on orange fails and must not be used for normal-sized text. Visible keyboard focus and controls >= 44px where touch-driven.
9. **Product behavior must survive every visual iteration.** Search, favourites, places, route personalization, reordering, shareable route URL, Google Maps, music, language switcher, editorial/agenda/comer/gallery links, PWA and reduced motion remain functional.
10. **Provenance is part of the design.** Use available and appropriately credited authentic photographs, not invented reviews, real-time hours, ratings, venue availability or travel times. Images representing atmosphere must not be labeled as exact named venues.

## Hierarchy

- **White**: main canvas, all footers and informational surfaces.
- **Ink**: all long-form copy, headings and text on orange.
- **Palm green**: meaningful primary controls, links and section detail.
- **Solar orange**: select one visible primary action at a time; use ink-coloured labels.
- **Media**: use photography for high-impact moments and cards; never a blank dark substitute.

## Review gates

- Source checks (`tests/product-contract.test.mjs` and `tests/craft-contract.test.mjs`)
- Chromium smoke screenshots at widths 360, 390, 768, 1024, 1440
- Runtime assertions for all main headings, no horizontal overflow, accessible primary actions, image decoding, light footers on home/legal/stories and preserved planner interactions
- Review the actual screenshots (not only code): typography, text/photo contrast, aligned sections, repeated cards, art direction and mobile navigation
- Confirm GitHub Actions before merging; after merge verify the deployed GitHub Pages URL

## Skills informing this contract

`SKILL apple-design(2).md`: response, spatial consistency, native typography, interaction feedback, reduced motion, focus, flexibility and responsibility.

`SKILL design-taste-frontend(2).md`: photo-first art direction, anti-template composition, honest real content, measured frame, typography hierarchy, browser screenshot critique and test/fix iterations.

Where the skills differ (e.g. frosted surfaces), prioritize the user's approved visual direction, legibility and functionality. Functional mobile navigation may have a subtle material; content cards should be opaque.

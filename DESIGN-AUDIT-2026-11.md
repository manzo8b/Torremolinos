# TORREMOLINOS — Craft review

Date: 14 November 2026  
Working branch: `design/craft-light-premium-2026-11-14`

## Product-level design commitments

- **Absolute rule: no black background surfaces** in the site chrome, home, media blocks, itinerary builder or footers; black is reserved for dark text and small photographic contrast scrims.
- Brand interface palette is kept at white `#FFFFFF`, near-black `#111111`, palm green `#16865A` and orange `#F58A17`. Alpha versions are allowed for subtle fields.
- All HTML headings (h1–h6) are punctuation-free. The existing language-change runtime also strips accidental terminal periods from dynamically translated headings.
- Preserve six language choices and all existing catalogue search, category filtering, favourites, planner reordering and sharing, music playback and map opt-in.
- Original user-supplied hero remains unchanged, with an accessible contrast scrim limited to the image, never a full-page dark ground.

## Design improvements made

1. **Footer:** white in all seven core entrypoints, with a restrained green upper rule, dark editorial text, green links and the original multicolour wordmark retained. Legal transparency and credits remain visible.
2. **Typography:** optical display tracking, stronger body-text contrast and line height, sentence-case labels where possible, consistent heading rhythm. The global font remains DM Sans with native-system fallbacks.
3. **Symmetry:** shared outer margins, consistent three-column desktop and two-column tablet place grid, distinct one-column phone layout, even card gaps and balanced paired route-builder columns.
4. **Cards:** old monochrome category-header strips replaced by responsive photographic treatments using assets already in the repository. The images are illustrative editorial visuals; they are not claims of a live view or a precise street-location photo. Existing actions continue to work.
5. **Interactive controls:** 44-pixel minimum controls, coherent active states, focus rings, readable text on solar-orange buttons, full white treatment of secondary links.
6. **Sections:** keep narrative photography, editorial layouts and functional route builder; remove large dark blocks from the music feature and other sections. Photo darkening is still permitted strictly for text legibility.
7. **Motion:** gentle, interruptible hover/tap feedback; reduced-motion and increased-contrast preferences are supported.

## Contrast review (WCAG relative luminance)

| Combination | Contrast | Baseline |
| --- | ---: | --- |
| Near-black text on white | 18.88:1 | AAA |
| White on palm green | 4.57:1 | AA normal text |
| Palm green on white | 4.57:1 | AA normal text |
| Near-black on solar orange | 7.67:1 | AAA |
| White on solar orange | 2.46:1 | **Avoid for UI text** |

## Verification status

- Source-level checks completed for unique IDs, JavaScript parsing, header rules, CSS brace balancing, stylesheet precedence, seven page links, presence of image assets, and UI colour contrast.
- `tests/product-contract.test.mjs` contains design regression tests and is wired to GitHub Actions for review.
- Browser-level pixel audits at 1440/768/390 and real-device gestures remain distinct from static checks. Do not claim the skill-provided `inspect.mjs` ran: only the uploaded Markdown skills were available, not their bundled scripts.
- `craft-refinement.css` is additive and loaded after `apple-premium.css` on all seven entrypoints, for straightforward rollback.

## Next verification gate

Inspect the full page in Chromium on desktop, tablet and phone; test dynamic card creation, live search, itinerary reorder/remove, all footer links, French/German/Russian long headings, the audio player, and full keyboard navigation. Fix any layout overflow before representing the release as visually final.

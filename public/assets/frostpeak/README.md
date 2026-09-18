# FrostPeak proof assets — Tuni'AR, 2024

Nothing here is pending. Every file is supplied and rendering on `/frostpeak/`.

## Where these come from

All twelve images are crops of the published Behance board for the project:

<https://www.behance.net/gallery/204251513/Portfolio> — "01 · Project FrostPeak"

That board is one 1921 × 20345 JPEG. Same rule as `../tuniar/`: it pairs each mockup with
a long paragraph, the page wants the mockups and not the paragraphs, so every file below is
the device side of a pair, trimmed clear of the text column. A crop is the only edit — no
redrawing, recolouring or compositing.

JPEG rather than PNG because the source board is JPEG. `npm run optimise` only touches
PNGs, so it correctly skips this folder.

| File name | Used on | What it shows |
|---|---|---|
| `app-screens.jpg` | /frostpeak/ 01 | The whole app as an angled screen collage |
| `splash.jpg` | /frostpeak/ 01 | Opening screen with the logo |
| `wire-entry.jpg` | /frostpeak/ 03 | Wireframes: two intro screens, login, home |
| `wire-browse.jpg` | /frostpeak/ 03 | Wireframes: collection filters, menu, categories |
| `wire-product.jpg` | /frostpeak/ 03 | Wireframes: product page and account |
| `ui-onboarding-light.jpg` | /frostpeak/ 04 | Final UI: opening screen, light ground |
| `ui-onboarding-dark.jpg` | /frostpeak/ 04 | Final UI: the same slide, dark ground |
| `ui-home.jpg` | /frostpeak/ 04 | Final UI: home, sale banner and collection |
| `ui-skis.jpg` | /frostpeak/ 04 | Final UI: the ski list |
| `ui-categories.jpg` | /frostpeak/ 04 | Final UI: the four categories |
| `ui-product.jpg` | /frostpeak/ 04 | Final UI: one product page |
| `ui-history.jpg` | /frostpeak/ 05 | Final UI: the history page |

## If these are ever regenerated

Coordinates came from scaled probes of the board, not from guesses, and four crops are
deliberately tuned rather than mechanical:

- Pairs share an aspect ratio on purpose. `.ba--pair` top-aligns its columns, so mismatched
  ratios leave a ragged bottom edge. `ui-onboarding-light` is cut narrower than its content
  needs (560px, not 620) to sit against `ui-onboarding-dark`.
- `ui-home` starts at x=1035 and `ui-skis` at x=1133. The paragraph column overlaps the
  tilted phones horizontally, and anything wider drags stray letters into frame.
- `ui-history` starts at x=1195, which clips about 80px off the phone's bottom-left corner.
  That was the lesser evil: the words "…ed with" sit at the same x as the device edge, just
  higher up, so no vertical cut separates them cleanly. The result reads as an intentional
  bleed off the left edge.

## What is not here

FrostPeak has no personas and no colour-palette board — unlike Wash and Go, the Behance
board simply does not contain them. The page does not invent them; it goes straight from
the brief to the wireframes.

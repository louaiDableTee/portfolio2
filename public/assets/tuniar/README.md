# Tuni'AR proof assets — Wash and Go, 2024

Unlike `public/assets/worku/`, nothing here is pending. Every file is supplied and
rendering on `/wash-and-go/`. The second app from the same internship has its own folder,
`../frostpeak/`.

## Where these come from

All seventeen images are crops of the published Behance board for the project:

<https://www.behance.net/gallery/204251513/Portfolio> — "02 · Project Wash and Go"

The board is one 1921 × 32966 JPEG that pairs each mockup with a long paragraph. The page
wants the mockups and not the paragraphs, so every file below is the device side of a pair,
trimmed clear of the text column. Nothing is redrawn, recoloured or composited — a crop is
the only edit.

They are JPEG rather than PNG on purpose: the source board is JPEG, so re-encoding to PNG
would preserve the existing artefacts at several times the size. This also means
`npm run optimise` skips them, which is correct — it only palette-compresses PNGs.

| File name | Used on | What it shows |
|---|---|---|
| `app-screens.jpg` | /wash-and-go/ 01 | The whole app as an angled screen collage |
| `splash.jpg` | /wash-and-go/ 01 | Launch screen with the logo |
| `persona-photographer.jpg` | /wash-and-go/ 03 | Persona: Semah, 32, photographer, Tunis |
| `persona-manager.jpg` | /wash-and-go/ 03 | Persona: Sara, 26, marketing manager, Bizerte |
| `brand.jpg` | /wash-and-go/ 04 | Logo and the three-colour palette |
| `wire-home.jpg` | /wash-and-go/ 05 | Wireframes: home, services, saved providers |
| `wire-onboarding.jpg` | /wash-and-go/ 05 | Wireframes: the three onboarding slides |
| `wire-account.jpg` | /wash-and-go/ 05 | Wireframes: sign up, profile, sign in |
| `wire-location.jpg` | /wash-and-go/ 05 | Wireframes: location and notification permissions |
| `wire-provider.jpg` | /wash-and-go/ 05 | Wireframes: provider page, chat, vehicle picker |
| `ui-map-entry.jpg` | /wash-and-go/ 06 | Final UI: onboarding slides |
| `ui-account.jpg` | /wash-and-go/ 06 | Final UI: account creation |
| `ui-onboarding.jpg` | /wash-and-go/ 06 | Final UI: complete profile, location permission |
| `ui-booking.jpg` | /wash-and-go/ 06 | Final UI: home and saved providers |
| `ui-provider.jpg` | /wash-and-go/ 06 | Final UI: provider page, about / services / reviews |
| `ui-services.jpg` | /wash-and-go/ 06 | Final UI: chat and service picker |
| `ui-tracking.jpg` | /wash-and-go/ 07 | Final UI: live tracking and confirmation |

## If these are ever regenerated

Two crops are deliberately tuned rather than mechanical:

- `ui-account.jpg` is cut taller than its content needs so its aspect ratio matches
  `ui-map-entry.jpg`. They sit side by side in a `.ba--pair`, which top-aligns its columns,
  and mismatched ratios left a visible ragged edge.
- `ui-onboarding.jpg` is 915px wide, not 950. The paragraph column on the board starts at
  x≈937, and anything wider drags a sliver of stray letters into the frame.

## What is not here

The 2023 TANIT WEB internship. It is left out on purpose, and `/ux-ui/` says so in its
closing section — early-career work that no longer meets the standard the rest of the
portfolio is held to. That statement lives on the hub rather than on each case page, so it
is made once. If the work is ever added back, it needs its own folder and its own case.

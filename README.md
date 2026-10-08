# Mohamed Louai Bouraoui — portfolio

> Chargé e-commerce junior : catalogue, fiches produits & SEO e-commerce.

A static, bilingual e-commerce portfolio. French is the main language (`/`), English lives
under `/en/`. The heart of the site is the Espace Deals case study, a complete WooCommerce
demo store. Worku is a short "Expérience" block, and the two Tuni'AR app cases stay online as
complementary design work.

**Before merging to `main`:** every box in `CHECKLIST_AVANT_PUBLICATION.md` must be ticked.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes dist/
npm run preview    # serves dist/
npm run check      # build, then verify links, headings, alt text, meta and JSON-LD
```

`npm run check` is the guard rail. It fails on a broken internal link, a missing image that
is not flagged as pending, a page with zero or several `<h1>`, an image without alt text, a
heading level that skips, a missing title, description or canonical, and invalid JSON-LD.

## Deploy to Vercel

The repo is a plain static Vite build, so no adapter is needed.

1. Push to GitHub and import the repository at vercel.com.
2. Vercel detects Vite. Confirm the build command is `npm run build` and the output
   directory is `dist`.
3. **Set the `SITE_URL` environment variable** to the final domain, for example
   `https://louaibouraoui.com`. Canonical tags, Open Graph URLs and `sitemap.xml` are all
   generated from it. Without it the build falls back to a placeholder domain, which is
   wrong in production.
4. Redeploy after setting the variable, then submit `/sitemap.xml` in Search Console.

`vercel.json` already sets clean URLs, trailing slashes, long cache headers for images and
video, and two security headers.

## How the site is put together

| Path | What it is |
|---|---|
| `templates/<page>.html` | Page structure with `{{key}}` slots |
| `content/fr.json` `content/en.json` | Every word on the site, per language |
| `index` → `/` | Home: headline, Espace Deals teaser, skills, Worku experience, contact |
| `espace-deals` → `/espace-deals/` | The main case study, nine sections |
| `about` → `/about/` | Career, education, skills, Worku details |
| `wash-and-go` `frostpeak` | The two Tuni'AR app design cases |
| `public/espacedeals/` | The 12 Espace Deals screenshots (placeholders until replaced) |
| `partials/` | `head.html`, `nav.html`, `footer.html`, injected at build time |
| `main.ts` | Device mockups, proof slots, lazy video, lightbox, mobile nav |
| `styles.css` | Single hand-written stylesheet, no framework |
| `scripts/i18n.mjs` | Page list, locales, rendering of every page in every language |
| `vite.config.ts` | Multi-page inputs, partial includes, sitemap and robots generation |

Adding a page means creating `templates/slug.html`, adding its strings to both content files
and adding `'slug'` to `PAGES` in `scripts/i18n.mjs`. It is then in the build, the sitemap
and the checker automatically. The retired pages (`/worku/`, `/seo/`, `/ux-ui/`,
`/search-console/`, `/linkedin/`, `/analytics/`) and the old `/fr/` URLs are 301-redirected in
`vercel.json`.

## Espace Deals screenshots

`public/espacedeals/` holds 12 WebP files with fixed names (`01-accueil.webp` …
`12-catalogue-meta.webp`). 01 to 09 and 11 are real screenshots. 10 and 12 are still
"Capture à venir" placeholders and are not shown on any page until the store is online. Drop a real screenshot in under the same name and it replaces the
placeholder, no code change. The pages declare 1600×1000; if a real capture has another
shape, update its `width`/`height` in `templates/espace-deals.html` to avoid layout shift.
`npm run placeholders` recreates any missing placeholder and never overwrites a real file.

## Proof slots

Nothing on this site is ever a simulated screenshot. Evidence is declared like this:

```html
<proof-shot
  src="/images/gsc-sitemaps-success.png" width="1413" height="767"
  chrome="search.google.com/search-console"
  alt="..."
  caption="Google Search Console, Sitemaps. Status Success, 14 pages, 14 June 2026."></proof-shot>
```

Add the `pending` attribute while the file does not exist. The slot then renders a visible
`[TODO: proof needed]` box naming the file it is waiting for. Drop the real file in at that
exact path, remove `pending`, and the screenshot appears with its caption and lightbox.

`public/assets/worku/README.md` lists every file still needed, with the exact names.
`public/assets/tuniar/README.md` covers the Tuni'AR set, which is already complete and
documents where each crop came from.

## Honesty rules baked into the site

These are load-bearing. Do not let a future edit quietly break them.

- Espace Deals is a **demo store**, said once in the case study intro: complete store built to
  show the method, realistic products and prices, orders not processed, product images are
  free-licence photos (Unsplash, Pexels).
- Actions and method only. **No sales, traffic or revenue figures** for Espace Deals.
- Anything not confirmed is written `[À COMPLÉTER : …]`, never guessed.
- AI tools named: Claude Code, Claude Design, Cowork, always "vérifiés et adaptés par moi".
- Never claimed: ad campaigns (Meta, Google, TikTok), marketplace accounts, ERP, logistics,
  affiliation, community management, photo or video shooting.
- Worku: no claim that traffic or rankings increased. The Googlebot block was found in a
  **manual test**.

## Quality

The previous nine-page version scored 100 for performance, accessibility, best practices and SEO in
Lighthouse, measured against the production build on 10 September 2026.

Inter is self-hosted from `public/fonts/` as a single 48KB variable woff2, so first paint
never waits on a third-party stylesheet.

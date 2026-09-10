# Mohamed Louai Bouraoui — portfolio

> I improve how a product is found, understood, and measured.

A nine-page, static, visual-first portfolio. One flagship case study (Worku) shown in depth,
supported by two earlier design internships and the full career path.

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
| `index.html` | Homepage. Teaser sections only, each linking to a detail page |
| `worku/` | The flagship case study and hub |
| `seo/` `ux-ui/` `search-console/` `linkedin/` `analytics/` | One skill each |
| `about/` `earlier-work/` | Career, education, earlier design internships |
| `partials/` | `head.html`, `nav.html`, `footer.html`, injected at build time |
| `main.ts` | Device mockups, proof slots, lazy video, lightbox, mobile nav |
| `styles.css` | Single hand-written stylesheet, no framework |
| `vite.config.ts` | Multi-page inputs, partial includes, sitemap and robots generation |

Adding a page means creating `slug/index.html` and adding `'slug'` to `PAGES` in
`vite.config.ts`. It is then in the build, the sitemap and the checker automatically.

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

`public/assets/worku/README.md` and `public/assets/earlier/README.md` list every file still
needed, with the exact names.

## Honesty rules baked into the site

These are load-bearing. Do not let a future edit quietly break them.

- No claim that Worku's traffic or rankings increased. The changes shipped in April and the
  window was too short.
- The Googlebot 403 was a **manual test**. It showed a risk, never a proven permanent block.
- Average position 7.1 came from 673 impressions, mostly branded. It is shown as a starting
  baseline, never as a win.
- The LinkedIn growth from about 120 to 537 followers has several causes, not just posts.
- **No GA4 dashboard and no GA4 numbers.** GA4 was basic checks only. `/analytics/` says
  this in the first block on the page and offers a measurement plan instead.

Every page that carries a number also carries the limits of that number.

## Quality

All nine pages score 100 for performance, accessibility, best practices and SEO in
Lighthouse, measured against the production build on 10 September 2026.

Inter is self-hosted from `public/fonts/` as a single 48KB variable woff2, so first paint
never waits on a third-party stylesheet.

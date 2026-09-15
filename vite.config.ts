import { defineConfig, type Plugin } from 'vite';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error - plain ESM module, no types needed for a build script
import { gscTokens, gscSummary } from './scripts/gsc-data.mjs';
// @ts-expect-error - plain ESM module, no types needed for a build script
import * as i18n from './scripts/i18n.mjs';

const root = dirname(fileURLToPath(import.meta.url));

const LOCALES: string[] = i18n.LOCALES;
const DEFAULT_LOCALE: string = i18n.DEFAULT_LOCALE;

/**
 * Write every page, in every language, to its real path before Vite looks at
 * the tree. These files are build output, not sources: they are gitignored and
 * regenerated from templates/ + content/ on every build and every dev start.
 */
function generatePages() {
  i18n.clearCache();
  const written: string[] = [];
  for (const locale of LOCALES) {
    for (const page of i18n.PAGES) {
      const file = resolve(root, i18n.pageFile(page, locale));
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, i18n.renderPage(page, locale));
      written.push(i18n.pagePath(page, locale));
    }
  }
  return written;
}

/**
 * Canonical origin for canonical tags, Open Graph URLs and sitemap.xml.
 *
 * Defaults to the live Vercel domain. When you buy a custom domain, set
 * SITE_URL in the Vercel dashboard (Settings, Environment Variables) rather
 * than editing this line, and redeploy.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://portfolio2-med-louai-bouraoui.vercel.app').replace(
  /\/$/,
  '',
);

/** Every real URL on the site. Add a page to scripts/i18n.mjs, not here. */
export const PAGES: readonly string[] = i18n.PAGES;

generatePages();

const input = Object.fromEntries(
  LOCALES.flatMap((locale) =>
    PAGES.map((p) => [
      locale === DEFAULT_LOCALE ? p : `${locale}-${p}`,
      resolve(root, i18n.pageFile(p, locale)),
    ]),
  ),
);

/**
 * Build-time partial includes so nav/footer live in one file.
 * Usage in HTML:  <!--@include partials/nav.html-->
 * Runs in dev and in build, for every HTML entry point.
 */
function partials(): Plugin {
  const read = (rel: string) => {
    const file = resolve(root, rel);
    if (!existsSync(file)) throw new Error(`Partial not found: ${rel}`);
    return readFileSync(file, 'utf8');
  };

  return {
    name: 'html-partials',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        // Which page is this? "/worku/index.html" -> "/worku/"
        const rel = ctx.path.replace(/^\/+/, '').replace(/index\.html$/, '');
        const current = `/${rel}`;

        let out = html;
        // Expand includes (one level of nesting is enough here).
        for (let i = 0; i < 3; i++) {
          const next = out.replace(/<!--@include\s+([\w./-]+)\s*-->/g, (_m, p: string) => read(p));
          if (next === out) break;
          out = next;
        }

        // Mark the active nav link statically, no client-side flash. Anchors that
        // already declare aria-current are left alone: the language switch sets
        // its own, and two aria-current attributes on one tag is invalid HTML.
        out = out.replace(
          new RegExp(`<a\\b(?![^>]*\\saria-current=)([^>]*\\shref="${current.replace(/[/-]/g, '\\$&')}")`, 'g'),
          '<a$1 aria-current="page"',
        );

        // One place defines the domain.
        out = out.split('%SITE_URL%').join(SITE_URL);
        out = out.split('%PAGE_URL%').join(current === '/' ? `${SITE_URL}/` : `${SITE_URL}${current}`);

        // Which language is this page? The path is the only source of truth.
        const locale = current.startsWith('/fr/') || current === '/fr/' ? 'fr' : 'en';
        const aboutPath = locale === 'fr' ? '/fr/about/' : '/about/';

        // The CV button self-heals. While the PDF is absent the link points at the
        // About page and relabels itself, so the site never ships a dead download.
        // French pages get the French CV; if that file is ever missing they fall
        // back to the English one rather than to no download at all.
        const cvCandidates =
          locale === 'fr'
            ? ['/cv/Mohamed-Louai-Bouraoui-CV-FR.pdf', '/cv/Mohamed-Louai-Bouraoui-CV.pdf']
            : ['/cv/Mohamed-Louai-Bouraoui-CV.pdf'];
        const cvPath = cvCandidates.find((p) => existsSync(resolve(root, 'public', p.slice(1)))) ?? '';
        const hasCv = cvPath !== '';
        const cvLabel = {
          en: { short: 'Download CV', long: 'Download CV (PDF)', none: 'CV on request' },
          fr: { short: 'Télécharger le CV', long: 'Télécharger le CV (PDF)', none: 'CV sur demande' },
        }[locale];
        out = out.split('%CV_HREF%').join(hasCv ? cvPath : aboutPath);
        out = out.split('%CV_DOWNLOAD%').join(hasCv ? 'download' : '');
        out = out.split('%CV_LABEL%').join(hasCv ? cvLabel.short : cvLabel.none);
        out = out.split('%CV_LABEL_LONG%').join(hasCv ? cvLabel.long : cvLabel.none);

        // Search Console figures, computed from the CSV export at build time.
        // Only /search-console/ uses these, and parsing is cheap, so they are
        // substituted unconditionally rather than gated on the path.
        if (out.includes('%GSC_')) {
          for (const [token, value] of Object.entries(gscTokens(locale) as Record<string, string>)) {
            out = out.split(token).join(value);
          }
          // A token that survives is a typo, and would otherwise ship as
          // literal "%GSC_FOO%" text on the page.
          const leftover = out.match(/%GSC_[A-Z0-9_]+%/g);
          if (leftover) {
            throw new Error(`Unknown GSC token(s) in ${ctx.path}: ${[...new Set(leftover)].join(', ')}`);
          }
        }

        return out;
      },
    },
  };
}

/** Emits robots.txt and sitemap.xml from the same page list the build uses. */
function seoFiles(): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = LOCALES.flatMap((locale) =>
        PAGES.map((p) => ({ page: p, locale, loc: i18n.pagePath(p, locale) })),
      );

      // Each entry carries the full alternate set, so the reciprocity Google
      // checks for is declared in the sitemap as well as in the <head>.
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
        `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
        urls
          .map(({ page, loc }) => {
            const alt = [
              ...LOCALES.map(
                (l) =>
                  `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${i18n.pagePath(page, l)}" />`,
              ),
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${i18n.pagePath(page, DEFAULT_LOCALE)}" />`,
            ].join('\n');
            const priority = page === 'index' ? '1.0' : page === 'worku' ? '0.9' : '0.8';
            return (
              `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
              `${alt}\n    <priority>${priority}</priority>\n  </url>`
            );
          })
          .join('\n') +
        `\n</urlset>\n`;

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });

      // Printed into the Vercel build log so a deployment can be diagnosed from
      // the log alone: which domain got baked in, and how many pages were built.
      console.log(`\n[portfolio] SITE_URL = ${SITE_URL}`);
      for (const locale of LOCALES) {
        const list = urls.filter((u) => u.locale === locale).map((u) => u.loc);
        console.log(`[portfolio] ${locale}: ${list.length} pages — ${list.join(' ')}`);
      }
      console.log(gscSummary());
      if (!process.env.SITE_URL) {
        console.log('[portfolio] (SITE_URL env var not set, using the built-in default above)');
      }
      console.log('');
    },
  };
}

/** In dev, editing a template or a string table regenerates every page. */
function regenerate(): Plugin {
  return {
    name: 'i18n-regenerate',
    apply: 'serve',
    configureServer(server) {
      const watched = [resolve(root, 'templates'), resolve(root, 'content'), resolve(root, 'partials')];
      server.watcher.add(watched);
      server.watcher.on('change', (file) => {
        if (!watched.some((w) => file.startsWith(w))) return;
        try {
          generatePages();
          server.ws.send({ type: 'full-reload' });
        } catch (err) {
          server.config.logger.error(`[i18n] ${(err as Error).message}`);
        }
      });
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [regenerate(), partials(), seoFiles()],
  build: {
    rollupOptions: { input },
    assetsInlineLimit: 0,
  },
});

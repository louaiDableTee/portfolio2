import { defineConfig, type Plugin } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

/**
 * TODO(Louai): replace with your real domain once the Vercel project is named,
 * or set SITE_URL in the Vercel dashboard. Used for canonicals, OG and sitemap.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://louaibouraoui.vercel.app').replace(/\/$/, '');

/** Every real URL on the site. Add a page here and in PAGES below. */
export const PAGES = [
  'index',
  'worku',
  'seo',
  'ux-ui',
  'search-console',
  'linkedin',
  'analytics',
  'about',
  'earlier-work',
] as const;

const input = Object.fromEntries(
  PAGES.map((p) => [p, p === 'index' ? resolve(root, 'index.html') : resolve(root, p, 'index.html')]),
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

        // Mark the active nav link statically, no client-side flash.
        out = out.replace(
          new RegExp(`(<a\\b[^>]*\\shref="${current.replace(/[/-]/g, '\\$&')}")`, 'g'),
          '$1 aria-current="page"',
        );

        // One place defines the domain.
        out = out.split('%SITE_URL%').join(SITE_URL);
        out = out.split('%PAGE_URL%').join(current === '/' ? `${SITE_URL}/` : `${SITE_URL}${current}`);

        // The CV button self-heals. While the PDF is absent the link points at /about/
        // and relabels itself, so the site never ships a dead download.
        const cvPath = '/cv/Mohamed-Louai-Bouraoui-CV.pdf';
        const hasCv = existsSync(resolve(root, 'public', cvPath.slice(1)));
        out = out.split('%CV_HREF%').join(hasCv ? cvPath : '/about/');
        out = out.split('%CV_DOWNLOAD%').join(hasCv ? 'download' : '');
        out = out.split('%CV_LABEL%').join(hasCv ? 'Download CV' : 'CV on request');
        out = out.split('%CV_LABEL_LONG%').join(hasCv ? 'Download CV (PDF)' : 'CV on request');

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
      const urls = PAGES.map((p) => (p === 'index' ? '/' : `/${p}/`));
      const today = new Date().toISOString().slice(0, 10);

      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${today}</lastmod>\n` +
              `    <priority>${u === '/' ? '1.0' : u === '/worku/' ? '0.9' : '0.8'}</priority>\n  </url>`,
          )
          .join('\n') +
        `\n</urlset>\n`;

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [partials(), seoFiles()],
  build: {
    rollupOptions: { input },
    assetsInlineLimit: 0,
  },
});

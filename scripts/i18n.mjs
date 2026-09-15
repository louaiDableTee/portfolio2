/**
 * One template, two content sources.
 *
 * templates/<page>.html holds the structure with {{key}} slots. content/<loc>.json
 * holds the words. Every page is rendered once per locale, to a real URL:
 *
 *   en -> /worku/          fr -> /fr/worku/
 *
 * Nothing about the language is decided in the browser, so both versions are
 * plain static HTML that Google can crawl and index separately.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const LOCALES = ['en', 'fr'];
export const DEFAULT_LOCALE = 'en';

export const PAGES = [
  'index',
  'worku',
  'seo',
  'ux-ui',
  'search-console',
  'linkedin',
  'about',
  'earlier-work',
];

/** Locale-aware site path for a page: 'worku' + 'fr' -> '/fr/worku/'. */
export function pagePath(page, locale) {
  const base = page === 'index' ? '/' : `/${page}/`;
  return locale === DEFAULT_LOCALE ? base : `/${locale}${base}`;
}

/** Where the generated file lands inside the project root. */
export function pageFile(page, locale) {
  const dir = page === 'index' ? '' : `${page}/`;
  return locale === DEFAULT_LOCALE ? `${dir}index.html` : `${locale}/${dir}index.html`;
}

const cache = new Map();
function load(rel) {
  if (!cache.has(rel)) cache.set(rel, readFileSync(resolve(root, rel), 'utf8'));
  return cache.get(rel);
}
export function clearCache() {
  cache.clear();
}

export function strings(locale) {
  return JSON.parse(load(`content/${locale}.json`));
}

/** Expand <!--@include partials/x.html--> the same way the old build did. */
function expandIncludes(html) {
  let out = html;
  for (let i = 0; i < 3; i++) {
    const next = out.replace(/<!--@include\s+([\w./-]+)\s*-->/g, (_m, p) => {
      if (!existsSync(resolve(root, p))) throw new Error(`Partial not found: ${p}`);
      return load(p);
    });
    if (next === out) break;
    out = next;
  }
  return out;
}

/**
 * Fill {{key}} slots. Page keys come from the page's own table, {{common.key}}
 * from the shared one, so a partial and a page can never collide.
 */
export function substitute(html, page, locale) {
  const all = strings(locale);
  const table = all[page] ?? {};
  const common = all.common ?? {};
  const missing = [];

  const out = html.replace(/\{\{([a-z0-9._-]+)\}\}/gi, (_m, key) => {
    const value = key.startsWith('common.') ? common[key.slice(7)] : table[key];
    if (value === undefined) {
      missing.push(key);
      return '';
    }
    return value;
  });

  if (missing.length) {
    throw new Error(
      `Missing ${locale} string(s) for ${page}: ${[...new Set(missing)].slice(0, 8).join(', ')}`,
    );
  }
  return out;
}

/** Point every internal page link at the same language. Assets stay put. */
function localiseLinks(html, locale) {
  if (locale === DEFAULT_LOCALE) return html;
  const routes = new Map(PAGES.map((p) => [pagePath(p, DEFAULT_LOCALE), pagePath(p, locale)]));
  return html.replace(/href="(\/[^"#]*)(#[^"]*)?"/g, (whole, path, hash = '') =>
    routes.has(path) ? `href="${routes.get(path)}${hash}"` : whole,
  );
}

/** FR / EN, always landing on the same page in the other language. */
function langSwitch(page, locale) {
  const label = { en: 'EN', fr: 'FR' };
  const title = {
    en: { en: 'English', fr: 'Français' },
    fr: { en: 'Anglais', fr: 'Français' },
  };
  const items = LOCALES.map((loc) => {
    const active = loc === locale;
    const attrs = [
      `href="${pagePath(page, loc)}"`,
      `hreflang="${loc}"`,
      `lang="${loc}"`,
      active ? 'aria-current="true"' : '',
      `title="${title[locale][loc]}"`,
    ]
      .filter(Boolean)
      .join(' ');
    return `<a ${attrs}>${label[loc]}</a>`;
  }).join('');

  const aria = locale === 'fr' ? 'Langue' : 'Language';
  return `<div class="lang-switch" role="group" aria-label="${aria}">${items}</div>`;
}

/** Reciprocal alternates: every version points at every version, itself included. */
function alternates(page) {
  const links = LOCALES.map(
    (loc) => `<link rel="alternate" hreflang="${loc}" href="%SITE_URL%${pagePath(page, loc)}" />`,
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="%SITE_URL%${pagePath(page, DEFAULT_LOCALE)}" />`,
  );
  return links.join('\n');
}

/**
 * Full render. `substitute` alone is verified to be lossless against the
 * original hand-written English, so everything language-specific happens here.
 */
export function renderPage(page, locale) {
  let html = substitute(expandIncludes(load(`templates/${page}.html`)), page, locale);

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${locale}"`);
  html = localiseLinks(html, locale);
  html = html.replace('%LANG_SWITCH%', langSwitch(page, locale));
  html = html.replace('</head>', `${alternates(page)}\n</head>`);
  html = html.split('%OG_LOCALE%').join(locale === 'fr' ? 'fr_TN' : 'en');

  return html;
}

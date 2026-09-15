/**
 * Proves the bilingual build is sound, from the built HTML alone:
 *   - every English string has a French counterpart and vice versa
 *   - <html lang> matches the URL
 *   - canonical is the page's own URL
 *   - hreflang en / fr / x-default are present and reciprocal
 *   - the FR / EN switch lands on the equivalent page, one aria-current
 *   - French <title>, description and og: tags are not English copies
 *   - no unfilled {{key}} or %TOKEN% survives into a page
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PAGES, LOCALES, DEFAULT_LOCALE, pagePath } from './i18n.mjs';

const problems = [];
const fail = (msg) => problems.push(msg);

const en = JSON.parse(readFileSync('content/en.json', 'utf8'));
const fr = JSON.parse(readFileSync('content/fr.json', 'utf8'));
for (const ns of new Set([...Object.keys(en), ...Object.keys(fr)])) {
  const a = Object.keys(en[ns] ?? {});
  const b = Object.keys(fr[ns] ?? {});
  for (const k of a) if (!b.includes(k)) fail(`MISSING FR  ${ns}/${k}`);
  for (const k of b) if (!a.includes(k)) fail(`ORPHAN FR   ${ns}/${k}`);
}

const file = (page, locale) => resolve('dist', pagePath(page, locale).slice(1), 'index.html');
const read = (page, locale) => readFileSync(file(page, locale), 'utf8');
const attr = (html, re) => (html.match(re) ?? [])[1];

const site = attr(read('index', DEFAULT_LOCALE), /rel="canonical" href="([^"]+?)\/"/);

for (const page of PAGES) {
  const meta = {};
  for (const locale of LOCALES) {
    const where = pagePath(page, locale);
    if (!existsSync(file(page, locale))) {
      fail(`NO PAGE     ${where}`);
      continue;
    }
    const html = read(page, locale);

    if (attr(html, /<html lang="([^"]+)"/) !== locale) fail(`LANG        ${where}`);

    const canonical = attr(html, /rel="canonical" href="([^"]+)"/);
    if (canonical !== `${site}${where}`) fail(`CANONICAL   ${where} -> ${canonical}`);

    const alternates = Object.fromEntries(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );
    for (const l of LOCALES) {
      if (alternates[l] !== `${site}${pagePath(page, l)}`) fail(`HREFLANG ${l}  ${where} -> ${alternates[l]}`);
    }
    if (alternates['x-default'] !== `${site}${pagePath(page, DEFAULT_LOCALE)}`) {
      fail(`X-DEFAULT   ${where} -> ${alternates['x-default']}`);
    }

    const sw = attr(html, /<div class="lang-switch"[^>]*>([\s\S]*?)<\/div>/) ?? '';
    const links = [...sw.matchAll(/<a ([^>]*)>/g)].map((m) => m[1]);
    for (const l of LOCALES) {
      const a = links.find((x) => x.includes(`hreflang="${l}"`));
      if (!a || !a.includes(`href="${pagePath(page, l)}"`)) fail(`SWITCH ${l}   ${where}`);
    }
    const current = links.filter((x) => /aria-current=/.test(x));
    if (current.length !== 1 || !current[0].includes(`hreflang="${locale}"`)) fail(`SWITCH CURRENT  ${where}`);
    if ([...html.matchAll(/<a\b[^>]*aria-current="[^"]*"[^>]*aria-current=/g)].length) fail(`DUP ARIA-CURRENT  ${where}`);

    const leftover = html.match(/\{\{[a-z0-9._-]+\}\}|%[A-Z][A-Z0-9_]+%/);
    if (leftover) fail(`LEFTOVER    ${where}  ${leftover[0]}`);

    meta[locale] = {
      title: attr(html, /<title>([\s\S]*?)<\/title>/),
      description: attr(html, /name="description" content="([^"]*)"/),
      ogTitle: attr(html, /property="og:title" content="([^"]*)"/),
      ogDescription: attr(html, /property="og:description" content="([^"]*)"/),
    };
  }
  if (meta.en && meta.fr) {
    for (const k of Object.keys(meta.en)) {
      if (!meta.fr[k] || meta.fr[k] === meta.en[k]) fail(`UNTRANSLATED ${k}  ${pagePath(page, 'fr')}`);
    }
  }
}

const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
for (const page of PAGES) {
  for (const locale of LOCALES) {
    if (!sitemap.includes(`<loc>${site}${pagePath(page, locale)}</loc>`)) {
      fail(`SITEMAP     ${pagePath(page, locale)}`);
    }
  }
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} i18n problem(s).`);
  process.exit(1);
}
console.log(`i18n ok: ${PAGES.length} pages × ${LOCALES.length} languages, hreflang reciprocal, switch page-to-page.`);

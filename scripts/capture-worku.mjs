/**
 * Capture the live worku.tn in two viewports.
 *
 *   npm run capture
 *   npm run capture -- --base https://worku.tn --only recrutement,tarifs
 *
 * Produces, per page and viewport, a fold shot (what a visitor sees before
 * scrolling) and a full-page shot (for the zoom link, never rendered inline).
 * Files land in public/assets/worku/live/ as {page}-{viewport}-{fold|full}.png.
 *
 * Two rules this script enforces:
 *   1. Nothing is written for a URL that does not return 200. A page that
 *      404s is reported and skipped, never silently captured as an error page.
 *   2. Every shot waits for the network to settle AND for document.fonts.ready,
 *      so no capture shows a half-rendered or fallback-font headline.
 *
 * Captures are taken at a high device scale factor for sharpness, then
 * resized down to delivery resolution and palette-compressed, because these
 * ship inside a portfolio page whose whole point is that it loads fast.
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, readdir, stat, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve('public/assets/worku/live');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = flag('base', 'https://www.worku.tn').replace(/\/$/, '');

/** How long to let scripted hero demos run before shooting. */
const DWELL_MS = Number(flag('dwell', '6000'));

/** slug is the file-name stem; path is what we append to BASE. */
const PAGES = [
  { slug: 'homepage', path: '/' },
  { slug: 'recrutement', path: '/recrutement' },
  { slug: 'prospection-commerciale', path: '/prospection-commerciale' },
  { slug: 'recherche-profils', path: '/recherche-profils' },
  { slug: 'enrichissement-contacts', path: '/enrichissement-contacts' },
  { slug: 'tarifs', path: '/tarifs' },
];

/**
 * Tight crops cut from the fold shot, in CSS pixels of that viewport.
 * A crop exists because some claim on the portfolio needs exactly that
 * region; a full page shot would bury it. Keyed by `${slug}-${viewport}`.
 */
const CROPS = {
  // Act 4 contrasts the two audience pages. The argument is the wording,
  // so both crops take the same box around the headline, the sentence
  // naming the audience and the buttons, and leave the demo panel out.
  'recrutement-desktop': [
    { name: 'recrutement-desktop-hero', x: 130, y: 240, width: 620, height: 600 },
  ],
  'prospection-commerciale-desktop': [
    { name: 'prospection-commerciale-desktop-hero', x: 130, y: 240, width: 620, height: 600 },
  ],
};

const VIEWPORTS = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    // Delivery width. 1440 CSS px shown at roughly 700px on the page, so
    // 1440 is already ~2x and stays crisp on a retina screen.
    deliver: { fold: 1440, full: 1200 },
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    deliver: { fold: 780, full: 640 },
  },
};

/* Cookie banners and overlays. Matched in order; the first hit wins. */
const DISMISS = [
  'button:has-text("Accepter")',
  'button:has-text("J\'accepte")',
  'button:has-text("Tout accepter")',
  'button:has-text("Accept")',
  'button:has-text("OK")',
  '[id*="cookie" i] button',
  '[class*="cookie" i] button',
  '[aria-label*="fermer" i]',
  '[aria-label*="close" i]',
];

const only = flag('only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

async function dismissOverlays(page) {
  for (const sel of DISMISS) {
    const el = page.locator(sel).first();
    try {
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ timeout: 1500 });
        await page.waitForTimeout(350);
        return sel;
      }
    } catch {
      /* not present, or not clickable; try the next candidate */
    }
  }
  return null;
}

/** Settle the page: network quiet, fonts loaded, lazy images forced in. */
async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  // Scroll the whole page once so anything lazy-loaded has been asked for,
  // then return to the top before the fold shot.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });

  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  // Several hero panels populate themselves through a scripted sequence
  // (a search that types, then fills a result list). Pausing animations here
  // froze those panels mid-cycle and produced empty demo cards, so instead
  // give the sequence time to run and settle on a populated state.
  await page.waitForTimeout(DWELL_MS);
}

/** Resize a raw buffer to delivery width, palette-compress, and write it. */
async function write(file, raw, width) {
  await sharp(raw)
    .resize({ width, withoutEnlargement: true })
    .png({ palette: true, quality: 82, effort: 10 })
    .toFile(file);
  return { before: raw.length, after: (await stat(file)).size };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const targets = only.length ? PAGES.filter((p) => only.includes(p.slug)) : PAGES;
  if (!targets.length) {
    console.error(`No pages matched --only "${only.join(',')}"`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const written = [];
  const skipped = [];

  for (const [name, cfg] of Object.entries(VIEWPORTS)) {
    const { deliver, ...contextOptions } = cfg;
    const context = await browser.newContext({
      ...contextOptions,
      locale: 'fr-FR',
      // A real UA. The site sits behind Cloudflare and a headless default
      // string has been enough to get challenged before.
      userAgent:
        name === 'mobile'
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    });

    for (const { slug, path } of targets) {
      const url = `${BASE}${path}`;
      const page = await context.newPage();

      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const status = res?.status() ?? 0;

        if (status !== 200) {
          skipped.push(`${slug} (${name}) — HTTP ${status} at ${url}`);
          await page.close();
          continue;
        }

        const dismissed = await dismissOverlays(page);
        await settle(page);

        // Shoot once per kind at full device scale, then derive the
        // delivery file and any crops from that same raw buffer, so a crop
        // never loses resolution to an already-downscaled source.
        for (const kind of ['fold', 'full']) {
          await page.evaluate(() => window.scrollTo(0, 0));
          const raw = await page.screenshot({ fullPage: kind === 'full' });

          const file = join(OUT, `${slug}-${name}-${kind}.png`);
          const { before, after } = await write(file, raw, deliver[kind]);
          written.push({ file: `${slug}-${name}-${kind}.png`, before, after });

          if (kind !== 'fold') continue;

          for (const crop of CROPS[`${slug}-${name}`] ?? []) {
            const dsf = cfg.deviceScaleFactor;
            const cropped = await sharp(raw)
              .extract({
                left: Math.round(crop.x * dsf),
                top: Math.round(crop.y * dsf),
                width: Math.round(crop.width * dsf),
                height: Math.round(crop.height * dsf),
              })
              .toBuffer();
            const cf = join(OUT, `${crop.name}.png`);
            const r = await write(cf, cropped, crop.width);
            written.push({ file: `${crop.name}.png`, ...r });
          }
        }

        console.log(
          `  ok  ${slug} · ${name}${dismissed ? `  (dismissed ${dismissed})` : ''}`,
        );
      } catch (err) {
        skipped.push(`${slug} (${name}) — ${err.message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }

    await context.close();
  }

  await browser.close();

  const total = written.reduce((n, w) => n + w.after, 0);
  const raw = written.reduce((n, w) => n + w.before, 0);

  console.log(`\n${written.length} files written to public/assets/worku/live/`);
  for (const w of written) {
    console.log(`   ${w.file.padEnd(42)} ${kb(w.before).padStart(8)} -> ${kb(w.after).padStart(8)}`);
  }
  console.log(`\n   total ${kb(raw)} raw -> ${kb(total)} optimised`);

  if (skipped.length) {
    console.log(`\n${skipped.length} skipped:`);
    for (const s of skipped) console.log(`   ${s}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

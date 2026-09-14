/**
 * Search Console figures, derived at build time.
 *
 * Every number that appears on /search-console/ is computed here from the
 * CSV export in public/assets/worku/gsc/. Nothing is typed into the markup,
 * so a re-export changes the page and a wrong claim cannot survive a build.
 *
 * Two files carry figures that are NOT in the six-month export:
 *   early-read.csv    the read taken at the time, an earlier and shorter window
 *   index-states.csv  the June Page-indexing snapshot
 * They are kept as data rather than prose for the same reason as the rest.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve('public/assets/worku/gsc');

export const PERIOD = '12 Mar &ndash; 11 Sep 2026';
export const PERIOD_PLAIN = '12 March to 11 September 2026';

/* ------------------------------------------------------------------ *
 * CSV parsing (RFC 4180: quoted fields may contain commas and newlines)
 * ------------------------------------------------------------------ */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];

    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
      continue;
    }

    if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v !== '')) rows.push(row);

  const head = rows.shift().map((h) => h.trim().toLowerCase());
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const load = (file) => parseCsv(readFileSync(resolve(DIR, file), 'utf8'));

const num = (v) => Number(String(v).replace(/[%\s]/g, '')) || 0;
const sum = (rows, key) => rows.reduce((n, r) => n + num(r[key]), 0);

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

export const int = (n) => Math.round(n).toLocaleString('en-US');
export const pct = (n, d = 1) => `${n.toFixed(d)}%`;
const rate = (clicks, impressions) => (impressions ? (clicks / impressions) * 100 : 0);
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ *
 * The data
 * ------------------------------------------------------------------ */

const months = load('monthly-trend.csv').sort((a, b) => a.month.localeCompare(b.month));
const queries = load('queries-classified.csv');
const pages = load('pages.csv');
const devices = load('devices.csv');
const countries = load('countries.csv');
const indexStates = load('index-states.csv');

const early = Object.fromEntries(load('early-read.csv').map((r) => [r.metric, num(r.value)]));

/* Period totals. Devices is the cleanest source: every impression is on
   exactly one device, so the split sums to the property total. */
const totalClicks = sum(devices, 'clicks');
const totalImpr = sum(devices, 'impressions');
const totalCtr = rate(totalClicks, totalImpr);

/* Brand vs non-brand */
const brand = queries.filter((q) => q.type === 'brand');
const nonBrand = queries.filter((q) => q.type === 'non-brand');

const split = (rows) => {
  const clicks = sum(rows, 'clicks');
  const impressions = sum(rows, 'impressions');
  return { queries: rows.length, clicks, impressions, ctr: rate(clicks, impressions) };
};

const brandSplit = split(brand);
const nonBrandSplit = split(nonBrand);
const queryImpr = brandSplit.impressions + nonBrandSplit.impressions;
const nonBrandShare = (nonBrandSplit.impressions / queryImpr) * 100;

/* The four audience pages built during the restructure.
   Search Console reports www and non-www as separate rows. These take the
   canonical www host only, which is what the redirects now resolve to;
   the duplicate non-www rows are reported separately below so the
   exclusion is visible rather than silent. */
const AUDIENCE_PATHS = [
  '/recrutement',
  '/recherche-profils',
  '/prospection-commerciale',
  '/enrichissement-contacts',
];

const canonical = (r) => r.page.startsWith('https://www.worku.tn');

const audience = AUDIENCE_PATHS.map((path) => {
  const row = pages.find((r) => r.path === path && canonical(r));
  return {
    path,
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    position: num(row.position),
  };
}).sort((a, b) => b.impressions - a.impressions);

const audienceImpr = audience.reduce((n, p) => n + p.impressions, 0);
const audienceClicks = audience.reduce((n, p) => n + p.clicks, 0);

const audienceDupes = pages.filter((r) => AUDIENCE_PATHS.includes(r.path) && !canonical(r));
const audienceDupeImpr = sum(audienceDupes, 'impressions');

/* The clearest "visible, not chosen" example: most impressions, no clicks. */
const widestZeroClick = nonBrand
  .filter((q) => num(q.clicks) === 0)
  .sort((a, b) => num(b.impressions) - num(a.impressions))[0];

/* The ATS ghost: job-seeker intent still ranking at the top with no clicks.
   Matched on the vocabulary of a job hunt, never on the vocabulary of
   sourcing, which is the audience the product now serves. */
const JOB_SEEKER = /emploi|job|poste|recrutement (?:developpeur|développeur)|chercheurs/i;

/* position < 3 means an average slot genuinely inside the top three, which
   is where a click should follow if the audience were the right one. */
const atsGhost = nonBrand
  .filter((q) => JOB_SEEKER.test(q.query) && num(q.position) < 3 && num(q.clicks) === 0)
  .sort((a, b) => num(a.position) - num(b.position) || num(b.impressions) - num(a.impressions));

const atsImpr = sum(atsGhost, 'impressions');
const atsPosLo = Math.min(...atsGhost.map((q) => num(q.position)));
const atsPosHi = Math.max(...atsGhost.map((q) => num(q.position)));
const atsExample = atsGhost.find((q) => q.query === "offre d'emploi développeur web") ?? atsGhost[0];

/* Trend */
const first = months[0];
const last = months[months.length - 1];
const ipdFirst = num(first.impressions_per_day);
const ipdLast = num(last.impressions_per_day);
const ipdGrowth = ipdLast / ipdFirst;

/* The endpoint-to-endpoint multiple is the easy reading, and the chart
   shows it is not the whole one: an earlier month already reached the
   same level. Compute that rather than let the caption imply a climb. */
const peak = months.reduce((a, b) =>
  num(b.impressions_per_day) > num(a.impressions_per_day) ? b : a,
);
const peakEarlier = peak.month !== last.month;
const peakTied = num(peak.impressions_per_day) === ipdLast;

const monthLabel = (m) =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });

/* Devices and countries, for the one-line reads that use them */
const deviceRows = devices
  .map((d) => ({
    device: d.device,
    clicks: num(d.clicks),
    impressions: num(d.impressions),
    ctr: rate(num(d.clicks), num(d.impressions)),
  }))
  .sort((a, b) => b.impressions - a.impressions);

const tunisia = countries.find((c) => c.country === 'Tunisia');
const tunisiaClickShare = (num(tunisia.clicks) / totalClicks) * 100;
const tunisiaImprShare = (num(tunisia.impressions) / totalImpr) * 100;

/* ------------------------------------------------------------------ *
 * Charts, as inline SVG. No chart library: these are two small shapes,
 * and a dependency would cost more than it saves.
 * ------------------------------------------------------------------ */

/** Impressions per day, by month. Columns, because months are discrete. */
function trendChart() {
  const W = 640;
  const H = 250;
  const padL = 34;
  const padR = 12;
  const padT = 20;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = Math.ceil(Math.max(...months.map((m) => num(m.impressions_per_day))) / 5) * 5;
  const band = plotW / months.length;
  const barW = Math.min(46, band * 0.54);

  const y = (v) => padT + plotH - (v / max) * plotH;

  const ticks = [0, max / 2, max]
    .map(
      (t) =>
        `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="currentColor" stroke-opacity=".12"/>` +
        `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="currentColor" fill-opacity=".55">${t}</text>`,
    )
    .join('');

  const bars = months
    .map((m, i) => {
      const v = num(m.impressions_per_day);
      const cx = padL + band * i + band / 2;
      const h = Math.max(2, plotH - (y(v) - padT));
      const isEdge = i === 0 || i === months.length - 1;
      return (
        `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y(v).toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" ` +
        `fill="#2864ff" fill-opacity="${isEdge ? '1' : '.28'}"/>` +
        `<text x="${cx.toFixed(1)}" y="${(y(v) - 7).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" ` +
        `fill="currentColor" fill-opacity="${isEdge ? '.95' : '.6'}">${v}</text>` +
        `<text x="${cx.toFixed(1)}" y="${H - padB + 18}" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity=".6">${monthLabel(m.month)}</text>`
      );
    })
    .join('');

  const note =
    `<text x="${padL}" y="${H - 8}" font-size="10.5" fill="currentColor" fill-opacity=".5">` +
    `Mar and Sep are part months (${num(first.days)} and ${num(last.days)} days), which is why this is per day, not per month.</text>`;

  return (
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="trendTitle trendDesc" xmlns="http://www.w3.org/2000/svg">` +
    `<title id="trendTitle">Impressions per day, by month</title>` +
    `<desc id="trendDesc">Impressions per day rise from ${ipdFirst} in ${monthLabel(first.month)} to ${ipdLast} in ${monthLabel(last.month)}, peaking at ${Math.max(...months.map((m) => num(m.impressions_per_day)))}. Monthly values: ${months.map((m) => `${monthLabel(m.month)} ${num(m.impressions_per_day)}`).join(', ')}.</desc>` +
    ticks +
    bars +
    note +
    `</svg>`
  );
}

/** Brand vs non-brand, as one stacked bar per measure. */
function splitChart() {
  const W = 640;
  const H = 190;
  const padL = 0;
  const rowH = 34;
  const gap = 28;
  const labelW = 108;
  const barW = W - labelW - 74;

  const measures = [
    { label: 'Queries', b: brandSplit.queries, n: nonBrandSplit.queries },
    { label: 'Impressions', b: brandSplit.impressions, n: nonBrandSplit.impressions },
    { label: 'Clicks', b: brandSplit.clicks, n: nonBrandSplit.clicks },
  ];

  const rows = measures
    .map((m, i) => {
      const y = 26 + i * (rowH + gap);
      const total = m.b + m.n;
      const bw = (m.b / total) * barW;
      const nw = barW - bw;
      const mid = y + rowH / 2 + 4;

      const inBar = (w, v, x, fill) =>
        w > 34
          ? `<text x="${(x + w / 2).toFixed(1)}" y="${mid}" text-anchor="middle" font-size="12" font-weight="700" fill="${fill}">${int(v)}</text>`
          : '';

      return (
        `<text x="${padL}" y="${mid}" font-size="12.5" font-weight="650" fill="currentColor">${m.label}</text>` +
        `<rect x="${labelW}" y="${y}" width="${bw.toFixed(1)}" height="${rowH}" rx="5" fill="#2864ff"/>` +
        `<rect x="${(labelW + bw).toFixed(1)}" y="${y}" width="${nw.toFixed(1)}" height="${rowH}" rx="5" fill="#cfdcf8"/>` +
        inBar(bw, m.b, labelW, '#fff') +
        inBar(nw, m.n, labelW + bw, '#22346a') +
        `<text x="${W - 4}" y="${mid}" text-anchor="end" font-size="11.5" fill="currentColor" fill-opacity=".6">${pct((m.n / total) * 100, 0)} non-brand</text>`
      );
    })
    .join('');

  const legend =
    `<rect x="${labelW}" y="0" width="10" height="10" rx="2.5" fill="#2864ff"/>` +
    `<text x="${labelW + 16}" y="9" font-size="11.5" fill="currentColor" fill-opacity=".7">Brand (${brandSplit.queries} queries)</text>` +
    `<rect x="${labelW + 132}" y="0" width="10" height="10" rx="2.5" fill="#cfdcf8"/>` +
    `<text x="${labelW + 148}" y="9" font-size="11.5" fill="currentColor" fill-opacity=".7">Non-brand (${nonBrandSplit.queries} queries)</text>`;

  return (
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="splitTitle splitDesc" xmlns="http://www.w3.org/2000/svg">` +
    `<title id="splitTitle">Brand versus non-brand queries</title>` +
    `<desc id="splitDesc">${brandSplit.queries} brand queries carry ${int(brandSplit.impressions)} impressions and ${brandSplit.clicks} clicks. ${nonBrandSplit.queries} non-brand queries carry ${int(nonBrandSplit.impressions)} impressions and ${nonBrandSplit.clicks} clicks.</desc>` +
    legend +
    rows +
    `</svg>`
  );
}

/* ------------------------------------------------------------------ *
 * Table and list fragments
 * ------------------------------------------------------------------ */

function audienceTable() {
  const body = audience
    .map(
      (p) =>
        `<tr><th scope="row"><code>${esc(p.path)}</code></th>` +
        `<td data-label="Impressions">${int(p.impressions)}</td>` +
        `<td data-label="Clicks">${p.clicks}</td>` +
        `<td data-label="Avg position">${p.position.toFixed(2)}</td></tr>`,
    )
    .join('\n            ');

  return (
    `<table>\n` +
    `          <caption>The four audience pages built during the restructure. worku.tn, ${PERIOD}.</caption>\n` +
    `          <thead><tr><th scope="col">Page</th><th scope="col">Impressions</th><th scope="col">Clicks</th><th scope="col">Avg position</th></tr></thead>\n` +
    `          <tbody>\n            ${body}\n` +
    `            <tr class="row-total"><th scope="row">Total</th>` +
    `<td data-label="Impressions">${int(audienceImpr)}</td>` +
    `<td data-label="Clicks">${audienceClicks}</td>` +
    `<td data-label="Avg position">&mdash;</td></tr>\n` +
    `          </tbody>\n        </table>`
  );
}

function indexStateList() {
  return indexStates
    .map(
      (s) =>
        `<li><b>${esc(s.state)} &mdash; ${int(num(s.pages))}</b><span>${esc(s.reading)}</span></li>`,
    )
    .join('\n          ');
}

function atsList() {
  return atsGhost
    .slice(0, 6)
    .map(
      (q) =>
        `<li><b lang="fr">${esc(q.query)}</b><span>position ${num(q.position).toFixed(1)} &middot; ${int(num(q.impressions))} impression${num(q.impressions) === 1 ? '' : 's'} &middot; ${num(q.clicks)} clicks</span></li>`,
    )
    .join('\n          ');
}

/* ------------------------------------------------------------------ *
 * Tokens consumed by search-console/index.html
 * ------------------------------------------------------------------ */

export function gscTokens() {
  return {
    '%GSC_PERIOD%': PERIOD,
    '%GSC_PERIOD_PLAIN%': PERIOD_PLAIN,

    /* period totals */
    '%GSC_CLICKS%': int(totalClicks),
    '%GSC_IMPRESSIONS%': int(totalImpr),
    '%GSC_CTR%': pct(totalCtr, 2),
    '%GSC_MONTHS%': String(months.length),

    /* the early read */
    '%GSC_EARLY_POSITION%': early.avg_position.toFixed(1),
    '%GSC_EARLY_IMPRESSIONS%': int(early.impressions),
    '%GSC_EARLY_CLICKS%': int(early.clicks),
    '%GSC_EARLY_CTR%': pct(early.ctr, 1),
    '%GSC_EARLY_MONTHS%': String(early.window_months),
    '%GSC_EARLY_PER_DAY%': (early.impressions / (early.window_months * 30.5)).toFixed(0),

    /* brand vs non-brand */
    '%GSC_BRAND_QUERIES%': int(brandSplit.queries),
    '%GSC_BRAND_IMPRESSIONS%': int(brandSplit.impressions),
    '%GSC_BRAND_CLICKS%': int(brandSplit.clicks),
    '%GSC_BRAND_CTR%': pct(brandSplit.ctr, 1),
    '%GSC_NONBRAND_QUERIES%': int(nonBrandSplit.queries),
    '%GSC_NONBRAND_IMPRESSIONS%': int(nonBrandSplit.impressions),
    '%GSC_NONBRAND_CLICKS%': int(nonBrandSplit.clicks),
    '%GSC_NONBRAND_CTR%': pct(nonBrandSplit.ctr, 1),
    '%GSC_NONBRAND_SHARE%': pct(nonBrandShare, 0),
    '%GSC_QUERY_IMPRESSIONS%': int(queryImpr),
    '%GSC_ANON_IMPRESSIONS%': int(totalImpr - queryImpr),
    '%GSC_SPLIT_CHART%': splitChart(),

    /* index states */
    '%GSC_INDEX_STATES%': indexStateList(),
    '%GSC_404S%': int(num(indexStates.find((s) => s.verdict === 'debris').pages)),

    /* audience pages */
    '%GSC_AUDIENCE_TABLE%': audienceTable(),
    '%GSC_AUDIENCE_IMPRESSIONS%': int(audienceImpr),
    '%GSC_AUDIENCE_CLICKS%': int(audienceClicks),
    '%GSC_AUDIENCE_COUNT%': String(audience.length),
    '%GSC_AUDIENCE_DUPE_IMPRESSIONS%': int(audienceDupeImpr),

    /* trend */
    '%GSC_TREND_CHART%': trendChart(),
    '%GSC_IPD_FIRST%': String(ipdFirst),
    '%GSC_IPD_LAST%': String(ipdLast),
    '%GSC_IPD_GROWTH%': `${ipdGrowth.toFixed(1)}&times;`,
    '%GSC_MONTH_FIRST%': monthLabel(first.month),
    '%GSC_MONTH_LAST%': monthLabel(last.month),
    '%GSC_TREND_CAVEAT%': peakEarlier
      ? `It is not a steady climb: ${monthLabel(peak.month)} already reached ` +
        `${num(peak.impressions_per_day)} a day${peakTied ? ', the same level' : ''}, ` +
        `and the three months after it sat lower. The multiple is an endpoint comparison, not a trend line.`
      : 'The last month is also the highest in the period.',

    /* the clearest zero-click example */
    '%GSC_ZERO_QUERY%': esc(widestZeroClick.query),
    '%GSC_ZERO_IMPRESSIONS%': int(num(widestZeroClick.impressions)),
    '%GSC_ZERO_POSITION%': num(widestZeroClick.position).toFixed(1),

    /* the ATS ghost */
    '%GSC_ATS_LIST%': atsList(),
    '%GSC_ATS_COUNT%': String(atsGhost.length),
    '%GSC_ATS_IMPRESSIONS%': int(atsImpr),
    '%GSC_ATS_POS_RANGE%': `${atsPosLo.toFixed(1)}&ndash;${atsPosHi.toFixed(1)}`,
    '%GSC_ATS_EXAMPLE%': esc(atsExample.query),

    /* device and country reads */
    '%GSC_DESKTOP_CTR%': pct(deviceRows.find((d) => d.device === 'Desktop').ctr, 1),
    '%GSC_MOBILE_CTR%': pct(deviceRows.find((d) => d.device === 'Mobile').ctr, 1),
    '%GSC_TUNISIA_CLICK_SHARE%': pct(tunisiaClickShare, 0),
    '%GSC_TUNISIA_IMPR_SHARE%': pct(tunisiaImprShare, 0),
  };
}

/** Printed in the build log so the numbers can be audited from the log alone. */
export function gscSummary() {
  return [
    `[gsc] ${PERIOD_PLAIN}`,
    `[gsc] totals: ${int(totalClicks)} clicks, ${int(totalImpr)} impressions, ${pct(totalCtr, 2)} CTR`,
    `[gsc] brand: ${brandSplit.queries} queries, ${int(brandSplit.impressions)} impr, ${brandSplit.clicks} clicks, ${pct(brandSplit.ctr, 1)} CTR`,
    `[gsc] non-brand: ${nonBrandSplit.queries} queries, ${int(nonBrandSplit.impressions)} impr, ${nonBrandSplit.clicks} clicks, ${pct(nonBrandSplit.ctr, 1)} CTR`,
    `[gsc] audience pages: ${int(audienceImpr)} impr, ${audienceClicks} clicks (excludes ${int(audienceDupeImpr)} non-www duplicate impressions)`,
    `[gsc] impressions/day: ${ipdFirst} -> ${ipdLast} (${ipdGrowth.toFixed(1)}x)`,
    `[gsc] ATS ghost: ${atsGhost.length} job-seeker queries at position < 3 with 0 clicks, ${int(atsImpr)} impressions`,
  ].join('\n');
}

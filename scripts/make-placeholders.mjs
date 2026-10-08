/**
 * Writes the Espace Deals screenshot placeholders and the Open Graph image.
 *
 *   npm run placeholders
 *
 * Each placeholder is a real WebP at the exact path the pages reference, so a
 * real screenshot dropped in under the same name replaces it with no code
 * change. Existing files are never overwritten: run this again at any time and
 * only the missing ones are recreated.
 *
 * A placeholder says what it is in plain words ("Capture à venir"). It is never
 * made to look like a real screenshot.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'public/espacedeals');
mkdirSync(dir, { recursive: true });

const W = 1600;
const H = 1000;

const SHOTS = [
  ['01-accueil.webp', 'Page d’accueil'],
  ['02-categorie.webp', 'Page catégorie avec filtres'],
  ['03-fiche-produit.webp', 'Fiche produit'],
  ['04-sheet-mots-cles.webp', 'Sheet de mots-clés'],
  ['05-import-csv.webp', 'Import CSV dans WooCommerce'],
  ['06-livraison-paiement.webp', 'Zone de livraison et paiement à la livraison'],
  ['07-rank-math.webp', 'Title et meta d’une fiche (Rank Math)'],
  ['08-rich-results.webp', 'Schéma Product validé'],
  ['09-ga4-debugview.webp', 'Événements e-commerce GA4'],
  ['10-search-console.webp', 'Google Search Console'],
  ['11-commande-test.webp', 'Confirmation de la commande test'],
  ['12-catalogue-meta.webp', 'Produits dans le catalogue Meta'],
];

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Same palette as styles.css: --paper, --blue, --blue-soft, --ink, --muted.
function placeholder(file, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M52 0H0V52" fill="none" stroke="#1e2c46" stroke-opacity=".05" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#fbfbf8"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="34" fill="#eef4ff" fill-opacity=".7"
        stroke="#9db4eb" stroke-width="4" stroke-dasharray="18 14"/>
  <g font-family="Inter, Helvetica, Arial, sans-serif" text-anchor="middle">
    <text x="${W / 2}" y="${H / 2 - 70}" font-size="34" font-weight="800" letter-spacing="6" fill="#2864ff">CAPTURE À VENIR</text>
    <text x="${W / 2}" y="${H / 2 + 20}" font-size="64" font-weight="700" fill="#10131d">${xml(label)}</text>
    <text x="${W / 2}" y="${H / 2 + 100}" font-size="30" fill="#697386">public/espacedeals/${xml(file)}</text>
  </g>
</svg>`;
}

let made = 0;
for (const [file, label] of SHOTS) {
  const out = resolve(dir, file);
  if (existsSync(out)) continue;
  await sharp(Buffer.from(placeholder(file, label))).webp({ quality: 80 }).toFile(out);
  made++;
}
console.log(`[placeholders] ${made} created, ${SHOTS.length - made} already present in public/espacedeals/`);

// Open Graph card: name and headline on the site's own colours. Not a screenshot.
const og = resolve(root, 'public/og-image.png');
if (!existsSync(og)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M52 0H0V52" fill="none" stroke="#1e2c46" stroke-opacity=".05" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#fbfbf8"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="80" y="118" width="40" height="5" fill="#2864ff"/>
  <g font-family="Inter, Helvetica, Arial, sans-serif">
    <text x="136" y="128" font-size="24" font-weight="800" letter-spacing="5" fill="#2864ff">MOHAMED LOUAI BOURAOUI</text>
    <text x="80" y="250" font-size="78" font-weight="700" letter-spacing="-3" fill="#10131d">Chargé e-commerce junior</text>
  </g>
  <g font-family="Georgia, 'Times New Roman', serif" font-style="italic" fill="#2864ff">
    <text x="80" y="345" font-size="62">catalogue, fiches produits</text>
    <text x="80" y="420" font-size="62">&amp; SEO e-commerce.</text>
  </g>
  <text x="80" y="530" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" fill="#697386">Étude de cas : Espace Deals, boutique WooCommerce</text>
</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(og);
  console.log('[placeholders] og-image.png created');
}

/**
 * Case-sensitive asset check.
 *
 * Windows and macOS treat "Photo.JPG" and "photo.jpg" as the same file.
 * Vercel builds and serves on Linux, which does not. A reference whose casing
 * does not match the file on disk works locally and 404s in production.
 *
 * existsSync() cannot catch this on Windows, so this walks the real directory
 * entries and compares byte for byte.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';

const ROOT = 'dist';

// Every real file in dist, as a set of exact "/a/b/c.png" paths.
const real = new Set();
(function walk(dir, prefix = '') {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const url = posix.join(prefix, entry);
    if (statSync(full).isDirectory()) walk(full, url);
    else real.add('/' + url);
  }
})(ROOT);

const lower = new Map();
for (const p of real) lower.set(p.toLowerCase(), p);

const html = [...real].filter((p) => p.endsWith('.html'));
const problems = [];
let skipped = 0;

for (const page of html) {
  const source = readFileSync(join(ROOT, page), 'utf8');

  // Proof slots marked `pending` are deliberately waiting on a file that does
  // not exist yet. They render a visible placeholder, so they are not errors.
  const pendingSrcs = new Set();
  for (const m of source.matchAll(/<(?:proof-shot|proof-video)([\s\S]*?)>/g)) {
    const attrs = m[1];
    if (!/(^|\s)pending(\s|=|$)/.test(attrs)) continue;
    const s = attrs.match(/\ssrc="([^"]+)"/);
    if (s) pendingSrcs.add(s[1]);
  }

  const refs = new Set();
  for (const m of source.matchAll(/\s(?:src|href|image|video|poster)="(\/[^"?#]+\.[a-z0-9]{2,5})"/gi)) {
    refs.add(m[1]);
  }
  for (const s of pendingSrcs) {
    if (refs.delete(s)) skipped++;
  }

  for (const ref of refs) {
    if (real.has(ref)) continue; // exact match, fine
    const actual = lower.get(ref.toLowerCase());
    if (actual) {
      problems.push(`CASE MISMATCH  ${page}\n     references: ${ref}\n     actual file: ${actual}`);
    } else {
      problems.push(`NOT IN BUILD   ${page}  ->  ${ref}`);
    }
  }
}

// Two files that collide when lowercased are fine on Windows but ambiguous the
// moment the repo is checked out on Linux.
const seen = new Map();
for (const p of real) {
  const k = p.toLowerCase();
  if (seen.has(k) && seen.get(k) !== p) problems.push(`CASE COLLISION ${seen.get(k)}  vs  ${p}`);
  seen.set(k, p);
}

console.log(`${real.size} files in ${ROOT}, ${html.length} pages scanned, ${skipped} pending slots skipped.`);
console.log(
  problems.length ? '\n' + problems.join('\n') : 'No case-sensitivity problems. Safe for a Linux build.',
);
process.exit(problems.length ? 1 : 0);

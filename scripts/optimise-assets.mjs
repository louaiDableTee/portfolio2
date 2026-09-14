/**
 * Palette-compress the PNGs under public/assets, in place.
 *
 *   npm run optimise
 *   npm run optimise -- --dry
 *
 * Screenshots of a web UI are mostly flat colour, so an 8-bit palette costs
 * nothing visible and saves roughly two thirds of the bytes. A file that
 * does not get smaller is left exactly as it was, so this is safe to re-run
 * and safe to run on output the capture script already compressed.
 *
 * These files are committed, so the originals stay recoverable from git.
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';

const ROOT = resolve('public/assets');
const DRY = process.argv.includes('--dry');

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (extname(entry.name).toLowerCase() === '.png') out.push(p);
  }
  return out;
}

const files = (await walk(ROOT)).sort();
let before = 0;
let after = 0;
let changed = 0;

for (const file of files) {
  const size = (await stat(file)).size;
  before += size;

  const tmp = `${file}.opt`;
  await sharp(file).png({ palette: true, quality: 82, effort: 10 }).toFile(tmp);
  const next = (await stat(tmp)).size;

  // Only keep the new file if it is actually smaller. Re-encoding an already
  // palette-compressed PNG usually is not, and a rewrite for no gain just
  // churns the repository.
  if (next < size * 0.97 && !DRY) {
    await unlink(file);
    await rename(tmp, file);
    after += next;
    changed++;
    console.log(`   ${file.replace(ROOT, '').padEnd(52)} ${kb(size).padStart(9)} -> ${kb(next).padStart(9)}`);
  } else {
    await unlink(tmp);
    after += size;
  }
}

console.log(
  `\n${changed} of ${files.length} files rewritten${DRY ? ' (dry run, nothing written)' : ''}`,
);
console.log(`total ${kb(before)} -> ${kb(after)}`);

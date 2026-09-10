import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pages = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p);
  }
})('dist');

let bad = 0;
console.log('page'.padEnd(24) + 'title'.padEnd(7) + 'desc'.padEnd(7) + 'json-ld / warnings');
console.log('-'.repeat(72));

for (const f of pages.sort()) {
  const s = readFileSync(f, 'utf8');
  const title = (s.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const desc = (s.match(/name="description" content="([\s\S]*?)"/) || [])[1] || '';
  const blocks = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  let status = 'ok';
  if (!blocks.length) {
    status = 'NONE';
    bad++;
  }
  for (const b of blocks) {
    try {
      const o = JSON.parse(b[1]);
      if (!o['@context'] || !o['@type']) {
        status = 'missing @type';
        bad++;
      }
    } catch {
      status = 'PARSE FAIL';
      bad++;
    }
  }

  const warn =
    (title.length > 62 ? ' title-long' : '') +
    (desc.length > 160 ? ' desc-long' : '') +
    (desc.length < 70 ? ' desc-short' : '');

  const name = f.replace('dist', '').replace(/\\/g, '/');
  console.log(name.padEnd(24) + String(title.length).padEnd(7) + String(desc.length).padEnd(7) + status + warn);
}

console.log('\n' + (bad ? `${bad} structured-data problem(s)` : 'Structured data valid on every page.'));

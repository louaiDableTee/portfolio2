import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
})(dist);

const html = files.filter((f) => f.endsWith('.html'));
const problems = [];

for (const f of html) {
  const page = f.replace(dist, '').replace(/\\/g, '/');
  const src = readFileSync(f, 'utf8');

  // internal links
  for (const m of src.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    const target = href.endsWith('/') ? join(dist, href, 'index.html') : join(dist, href);
    if (!existsSync(target)) problems.push(`BROKEN LINK  ${page}  ->  ${href}`);
  }

  // media referenced by src= on real tags
  for (const m of src.matchAll(/<(?:img|video|source)\b[^>]*\ssrc="(\/[^"]+)"/g)) {
    if (!existsSync(join(dist, m[1]))) problems.push(`MISSING MEDIA ${page}  ->  ${m[1]}`);
  }

  // proof-shot / proof-video / mockups WITHOUT the pending flag must resolve
  for (const m of src.matchAll(/<(proof-shot|proof-video|laptop-mockup|tablet-mockup|phone-mockup)\b([^>]*)>/g)) {
    const [, tag, attrs] = m;
    if (/\bpending\b/.test(attrs)) continue;
    const p = attrs.match(/\s(?:src|image|video)="(\/[^"]+)"/);
    if (p && !existsSync(join(dist, p[1]))) problems.push(`UNFLAGGED MISSING  ${page}  <${tag}> ${p[1]}`);
  }

  // structure checks
  const h1 = [...src.matchAll(/<h1\b/g)].length;
  if (h1 !== 1) problems.push(`H1 COUNT ${h1}  ${page}`);
  if (!/<title>/.test(src)) problems.push(`NO TITLE  ${page}`);
  if (!/name="description"/.test(src)) problems.push(`NO DESCRIPTION  ${page}`);
  if (!/rel="canonical"/.test(src)) problems.push(`NO CANONICAL  ${page}`);

  // images must have alt
  for (const m of src.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\salt=/.test(m[1])) problems.push(`IMG WITHOUT ALT  ${page}  ${m[1].slice(0, 70)}`);
  }
}

// heading order per page
for (const f of html) {
  const page = f.replace(dist, '').replace(/\\/g, '/');
  const levels = [...readFileSync(f, 'utf8').matchAll(/<h([1-6])\b/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) problems.push(`HEADING JUMP h${levels[i - 1]}->h${levels[i]}  ${page}`);
  }
}

console.log(problems.length ? problems.join('\n') : 'All checks passed.');
console.log(`\n${html.length} pages checked.`);

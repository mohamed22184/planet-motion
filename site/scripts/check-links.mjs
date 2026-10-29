// بيفحص كل لينك داخلي في البيلد ويتأكد إن الصفحة موجودة.
// اتكتب بعد ما /contact فضلت مربوطة من كارت وفهرس الشغل وهي مش
// موجودة أصلًا — الديف سيرفر مابيشتكيش والبيلد بينجح عادي.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(DIST);
const pages = new Set(
  files
    .filter((f) => f.endsWith('index.html'))
    .map((f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\/$/, ''))
    .map((p) => (p === '' ? '/' : p)),
);
const assets = new Set(files.map((f) => '/' + relative(DIST, f)));

const broken = new Map();
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1].replace(/\/$/, '') || '/';
    if (pages.has(href) || assets.has(m[1]) || assets.has(href.slice(1))) continue;
    const from = '/' + relative(DIST, f);
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href).add(from);
  }
}

if (broken.size) {
  console.error(`\n✗ ${broken.size} لينك داخلي مكسور:\n`);
  for (const [href, from] of broken) {
    console.error(`  ${href}\n      من: ${[...from].slice(0, 3).join(', ')}`);
  }
  process.exit(1);
}
console.log(`✓ كل اللينكات الداخلية سليمة (${pages.size} صفحة)`);

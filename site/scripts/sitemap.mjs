// بيكتب sitemap.xml وrobots.txt بعد البيلد.
// من غير مكتبة: الصفحات موجودة في dist أصلًا، والمشي عليها أرخص
// من إضافة اعتماد جديد.
//
// الصفحات الداخلية (مرجع اللوجو، معاينة الثيم، التجارب) مستثناة:
// دي أدوات شغل مش صفحات للزوار.
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://planetmotion.studio';
const SKIP = [/^\/logo$/, /^\/theme$/, /^\/experiments(\/|$)/, /^\/og$/, /^\/404$/];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const pages = (await walk(DIST))
  .filter((f) => f.endsWith('index.html'))
  .map((f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\/$/, ''))
  .map((p) => (p === '' ? '/' : p))
  .filter((p) => !SKIP.some((re) => re.test(p)))
  .sort();

const today = new Date().toISOString().slice(0, 10);
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p + '/'}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');

await writeFile(join(DIST, 'sitemap.xml'), xml);
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
);

console.log(`✓ sitemap.xml — ${pages.length} صفحة · robots.txt`);

// Regenerates public/sitemap.xml from the live Shopify catalog. Runs automatically
// before every build (see package.json's "prebuild" script) so product and collection
// pages never fall out of sync with what's actually in the store.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fetchAllProducts, fetchAllCollections } from './shopify-data.mjs';

const BASE_URL = 'https://iradahclothing.com';

const __dirname = dirname(fileURLToPath(import.meta.url));

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const [products, collections] = await Promise.all([fetchAllProducts(), fetchAllCollections()]);

  const urls = [
    urlEntry(`${BASE_URL}/`, today, 'daily', '1.0'),
    urlEntry(`${BASE_URL}/products`, today, 'daily', '0.9'),
    ...collections.map((c) =>
      urlEntry(`${BASE_URL}/collection/${c.handle}`, c.updatedAt?.split('T')[0], 'weekly', '0.8')
    ),
    ...products.map((p) =>
      urlEntry(`${BASE_URL}/product/${p.handle}`, p.updatedAt?.split('T')[0], 'weekly', '0.7')
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  writeFileSync(join(__dirname, '..', 'public', 'sitemap.xml'), xml);
  console.log(
    `Generated sitemap.xml — ${urls.length} URLs (${products.length} products, ${collections.length} collections).`
  );
}

main().catch((error) => {
  console.error('Failed to generate sitemap.xml:', error);
  process.exit(1);
});

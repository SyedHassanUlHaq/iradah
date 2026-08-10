// Snapshots real HTML (title, meta, JSON-LD, visible content) for every known route into
// dist/<route>/index.html, using a headless browser against the just-built dist/ output.
// This is what lets crawlers and link-preview bots that don't execute JavaScript see real
// content instead of the empty <div id="root"> shell. The original bundle <script> tag is
// preserved in every snapshot, so the SPA still boots and hydrates normally after load.
//
// Requires a matching CloudFront rewrite (extensionless URL -> /index.html) to actually be
// served in production — see the deployment notes for the CloudFront Function config.
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { fetchAllProducts, fetchAllCollections } from './shopify-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // server not up yet, keep polling
      }
      if (Date.now() - start > timeoutMs) return reject(new Error('Preview server did not start in time'));
      setTimeout(tick, 300);
    };
    tick();
  });
}

async function main() {
  const [products, collections] = await Promise.all([fetchAllProducts(), fetchAllCollections()]);

  const routes = [
    '/',
    '/products',
    ...collections.map((c) => `/collection/${c.handle}`),
    ...products.map((p) => `/product/${p.handle}`),
  ];

  console.log(`Prerendering ${routes.length} routes...`);

  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT_DIR,
    stdio: 'ignore',
  });

  let browser;
  try {
    await waitForServer(BASE);
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    for (const route of routes) {
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });

        // react-helmet-async appends its per-page tags rather than replacing the static
        // fallback ones baked into index.html, so dedupe head tags before snapshotting —
        // keeping the last occurrence of each (Helmet's, since it renders after mount).
        await page.evaluate(() => {
          const selectors = [
            'meta[name="description"]',
            'meta[property^="og:"]',
            'meta[name^="twitter:"]',
            'link[rel="canonical"]',
          ];
          for (const selector of selectors) {
            const seen = new Map();
            for (const el of Array.from(document.querySelectorAll(selector))) {
              const key = el.getAttribute('name') || el.getAttribute('property') || el.getAttribute('rel');
              if (seen.has(key)) seen.get(key).remove();
              seen.set(key, el);
            }
          }
        });

        const html = await page.content();

        const outDir = route === '/' ? DIST_DIR : join(DIST_DIR, route);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html);
        console.log(`  ok  ${route}`);
      } catch (error) {
        console.error(`  FAIL  ${route}: ${error.message}`);
      }
    }
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }

  console.log('Prerendering complete.');
}

main().catch((error) => {
  console.error('Prerendering failed:', error);
  process.exit(1);
});

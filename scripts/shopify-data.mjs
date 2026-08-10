// Shared Storefront API helpers used by the build scripts (sitemap generation, prerendering).
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'kq1n1f-p4.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_TOKEN = 'c9cd7b93d9c72af52590ee318a667cca';

async function shopifyFetch(query) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    }
  );

  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify API error: ${json.errors.map((e) => e.message).join(', ')}`);
  }
  return json.data;
}

export async function fetchAllProducts() {
  const data = await shopifyFetch(`
    { products(first: 250) { edges { node { handle updatedAt } } } }
  `);
  return data.products.edges.map((e) => e.node);
}

export async function fetchAllCollections() {
  const data = await shopifyFetch(`
    { collections(first: 100) { edges { node { handle updatedAt } } } }
  `);
  return data.collections.edges.map((e) => e.node);
}

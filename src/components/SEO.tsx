import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SITE_NAME = "IRADAH Clothing";
const DEFAULT_DESCRIPTION = "Shop premium collections from Pakistan — curated wardrobes, effortless style, and quality craftsmanship.";
const BASE_URL = "https://iradahclothing.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.webp`;

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Fashion from Pakistan`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdList.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

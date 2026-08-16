import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct, fetchCollectionByHandle } from "@/lib/shopify";
import { SEO } from "@/components/SEO";
import { Loader2 } from "lucide-react";

const collectionInfo: Record<string, { title: string; description: string }> = {
  mens: {
    title: "Men's Collection",
    description: "Refined essentials crafted for the modern man.",
  },
  womens: {
    title: "Women's Collection",
    description: "Elegant pieces designed for effortless style.",
  },
  kids: {
    title: "Kids' Collection",
    description: "Playful comfort for the little ones.",
  },
  hoodies: {
    title: "Hoodies",
    description: "Premium hoodies designed for comfort and style.",
  },
  sweatshirts: {
    title: "Sweatshirts",
    description: "Everyday essentials for the modern wardrobe.",
  },
  trousers: {
    title: "Trousers",
    description: "Refined comfort for every occasion.",
  },
};

const collectionHandleMap: Record<string, string> = {
  mens: "men",
  womens: "women",
  men: "men",
  women: "women",
  kids: "kids",
  unisex: "unisex",
  hoodies: "hoodies",
  sweatshirts: "sweatshirts",
  trousers: "trousers",
};

function splitDescription(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const byBreak = normalized
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  if (byBreak.length > 1) return byBreak;

  const sentences =
    normalized.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ??
    [normalized];

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

function getTeaser(text: string, maxLen = 160): string {
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0]?.trim() || text.trim();
  if (firstSentence.length <= maxLen) return firstSentence;
  return `${firstSentence.slice(0, maxLen - 1).trimEnd()}GǪ`;
}

const Collection = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string | null>(null);
  const [collectionDescription, setCollectionDescription] = useState<string | null>(null);
  const [collectionImage, setCollectionImage] = useState<{ url: string; altText: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const info = category ? collectionInfo[category] : null;
  const resolvedHandle = category ? collectionHandleMap[category.toLowerCase()] ?? category : null;

  useEffect(() => {
    const loadProducts = async () => {
      if (!resolvedHandle) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setNotFound(false);
      try {
        const collection = await fetchCollectionByHandle(resolvedHandle, 100);
        if (!collection) {
          setNotFound(true);
          return;
        }

        setProducts(collection.products.edges);
        setCollectionTitle(collection.title);
        setCollectionDescription(
          collection.description || info?.description || `Browse the ${collection.title} collection.`,
        );
        setCollectionImage(
          collection.image ??
            collection.products.edges[0]?.node.images.edges[0]?.node ??
            null,
        );
      } catch (error) {
        console.error("Failed to load collection:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, info, resolvedHandle]);

  useEffect(() => {
    const img = heroImageRef.current;
    if (!img) return;

    const applyCrop = () => {
      // Mobile keeps more of the image; desktop cuts top/bottom 30%.
      const cut = window.matchMedia("(max-width: 767px)").matches ? 0.15 : 0.3;
      img.style.transform = `translateY(-${cut * 100}%)`;
      img.style.marginBottom = `${-img.offsetHeight * cut * 2}px`;
    };

    const onLoad = () => applyCrop();
    if (img.complete) applyCrop();
    img.addEventListener("load", onLoad);
    window.addEventListener("resize", applyCrop);
    return () => {
      img.removeEventListener("load", onLoad);
      window.removeEventListener("resize", applyCrop);
    };
  }, [collectionImage?.url]);

  const descriptionParagraphs = useMemo(
    () => (collectionDescription ? splitDescription(collectionDescription) : []),
    [collectionDescription],
  );
  const teaser = useMemo(
    () => (collectionDescription ? getTeaser(collectionDescription) : info?.description ?? "Browse this collection."),
    [collectionDescription, info?.description],
  );
  const showStory = descriptionParagraphs.length > 1 || (collectionDescription?.length ?? 0) > 220;
  const title = collectionTitle ?? info?.title ?? "Collection";

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Collection Not Found" noindex />
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Collection not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={teaser}
        canonical={`/collection/${category}`}
        image={collectionImage?.url}
        jsonLd={
          products.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: title,
                description: teaser,
                url: `https://iradahclothing.com/collection/${category}`,
                image: collectionImage?.url,
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: products.map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `https://iradahclothing.com/product/${product.node.handle}`,
                    name: product.node.title,
                  })),
                },
              }
            : undefined
        }
      />
      <Navbar />

      <main className="pt-[110px] md:pt-[132px]">
        <header className="relative overflow-hidden bg-secondary/40">
          {collectionImage ? (
            <div className="relative overflow-hidden">
              <img
                ref={heroImageRef}
                src={collectionImage.url}
                alt={collectionImage.altText || title}
                className="block w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 to-foreground/25" />
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 py-7 sm:py-9 md:py-12 lg:py-14 text-background">
                  <div className="max-w-3xl">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-background/70">
                      Collection
                    </span>
                    <h1 className="font-display mt-2 sm:mt-3 leading-[1.12] break-words text-[clamp(1.75rem,6vw,3.75rem)]">
                      {title}
                    </h1>
                    <p className="mt-3 sm:mt-4 max-w-xl leading-relaxed text-background/75 text-[clamp(0.8125rem,2.4vw,1rem)] line-clamp-3 md:line-clamp-none">
                      {teaser}
                    </p>
                    {!loading && (
                      <p className="mt-4 sm:mt-5 md:mt-6 text-[10px] uppercase tracking-[0.2em] text-background/55">
                        {products.length} {products.length === 1 ? "Piece" : "Pieces"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative container mx-auto px-4 py-14 md:py-20">
              <div className="max-w-3xl">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Collection
                </span>
                <h1 className="font-display text-2xl sm:text-4xl md:text-6xl mt-3 leading-[1.15] break-words">
                  {title}
                </h1>
                <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
                  {teaser}
                </p>
                {!loading && (
                  <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {products.length} {products.length === 1 ? "Piece" : "Pieces"}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.node.id} product={product} index={index} />
              ))}
            </div>
          )}
        </section>

        {showStory && !loading && (
          <section className="border-t border-border bg-secondary/20">
            <div className="container mx-auto px-4 py-14 md:py-20">
              <div className="max-w-2xl">
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  About the collection
                </span>
                <h2 className="font-display text-2xl md:text-4xl mt-2">The story</h2>
                <div className="mt-6 space-y-4">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-sm md:text-[15px] leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Collection;

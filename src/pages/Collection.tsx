import { useEffect, useState } from "react";
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

const Collection = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string | null>(null);
  const [collectionDescription, setCollectionDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
          collection.description || info?.description || `Browse the ${collection.title} collection.`
        );
      } catch (error) {
        console.error("Failed to load collection:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, info]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Collection Not Found" />
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
        title={collectionTitle ?? info?.title ?? "Collection"}
        description={collectionDescription ?? info?.description ?? "Browse this collection."}
        canonical={`/collection/${category}`}
      />
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        <div className="bg-secondary/30 py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Collection</span>
            <h1 className="font-display text-5xl md:text-7xl mt-2">{info.title}</h1>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              {info.description}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {products.length} Products
            </p>
          </div>

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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;

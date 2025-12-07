import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const collectionInfo: Record<string, { title: string; description: string; query: string }> = {
  hoodies: {
    title: "Hoodies",
    description: "Premium hoodies designed for comfort and style.",
    query: "hoodie",
  },
  sweatshirts: {
    title: "Sweatshirts",
    description: "Everyday essentials for the modern wardrobe.",
    query: "sweatshirt",
  },
  trousers: {
    title: "Trousers",
    description: "Refined comfort for every occasion.",
    query: "sweatpants OR trousers OR pants",
  },
};

const Collection = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const info = category ? collectionInfo[category] : null;

  useEffect(() => {
    const loadProducts = async () => {
      if (!info) return;
      
      setLoading(true);
      try {
        const allProducts = await fetchProducts(50);
        const filtered = allProducts.filter(product => 
          product.node.title.toLowerCase().includes(info.query.toLowerCase().split(' OR ')[0])
        );
        setProducts(filtered.length > 0 ? filtered : allProducts.slice(0, 8));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, info]);

  if (!info) {
    return (
      <div className="min-h-screen bg-background">
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

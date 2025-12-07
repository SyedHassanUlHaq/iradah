import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => 
          parseFloat(a.node.priceRange.minVariantPrice.amount) - 
          parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high":
        sorted.sort((a, b) => 
          parseFloat(b.node.priceRange.minVariantPrice.amount) - 
          parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "name":
        sorted.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortBy, products]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        <div className="bg-secondary/30 py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Collection</span>
            <h1 className="font-display text-5xl md:text-7xl mt-2">All Products</h1>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              Explore our complete collection of premium apparel.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 md:top-20 z-40 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {filteredProducts.length} Products
              </p>

              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-0 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
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

export default Products;

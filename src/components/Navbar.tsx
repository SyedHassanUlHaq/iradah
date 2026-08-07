import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";
import { fetchCollections } from "@/lib/shopify";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);
  const [collections, setCollections] = useState<Array<{ handle: string; title: string }>>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setShopDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setShopDropdownOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20);
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setLoadingCollections(false);
      }
    };

    loadCollections();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-display text-2xl md:text-3xl tracking-tight">
                IRADAH
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              
              {/* Shop Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="nav-link flex items-center gap-1">
                  Shop
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {shopDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                    <div className="bg-card border border-border/60 shadow-card min-w-[320px] p-5 animate-fade-in">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Collections</p>
                        {loadingCollections ? (
                          <p className="text-sm text-foreground/70">Loading...</p>
                        ) : (
                          collections.map(collection => (
                            <Link
                              key={collection.handle}
                              to={`/collection/${collection.handle}`}
                              onClick={() => setShopDropdownOpen(false)}
                              className="block py-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
                            >
                              {collection.title}
                            </Link>
                          ))
                        )}
                      </div>
                      <div className="border-t border-border mt-4 pt-3">
                        <Link
                          to="/products"
                          onClick={() => setShopDropdownOpen(false)}
                          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 hover:bg-secondary rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-secondary rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-sm uppercase tracking-wider text-foreground font-medium">Home</Link>
                
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] pt-4 pb-2">Collections</p>
                {loadingCollections ? (
                  <p className="py-2.5 text-sm text-foreground/70 pl-3">Loading...</p>
                ) : (
                  collections.map(collection => (
                    <Link
                      key={collection.handle}
                      to={`/collection/${collection.handle}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 text-sm text-foreground/70 hover:text-foreground transition-colors pl-3 border-l-2 border-border hover:border-foreground"
                    >
                      {collection.title}
                    </Link>
                  ))
                )}

                
                <div className="pt-4 border-t border-border mt-2">
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-sm uppercase tracking-wider text-foreground font-medium flex items-center gap-2">
                    All Products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
};

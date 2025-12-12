import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { trackEvent } from "@/lib/analytics";
import { CartDrawer } from "./CartDrawer";
import logo from "../../assets/iradah.svg";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setCartOpen = useCartStore((state) => state.setOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hoodies", path: "/collection/hoodies" },
    { name: "Sweatshirts", path: "/collection/sweatshirts" },
    { name: "Trousers", path: "/collection/trousers" },
    { name: "All", path: "/products" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] w-full bg-background/95 text-foreground/70 text-xs py-1 border-b border-border/20 text-center">
        Free Shipping in Pakistan for all orders
      </div>
      <nav className="fixed top-3 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center" aria-label="IRADAH home">
              <img src={logo} alt="IRADAH" className="h-12 md:h-20 lg:h-28 object-contain dark:invert" />
              <span className="sr-only">IRADAH</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="nav-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setCartOpen(true); trackEvent('open_cart'); }}
                className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground/70 hover:text-foreground transition-colors py-2 text-sm uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
};

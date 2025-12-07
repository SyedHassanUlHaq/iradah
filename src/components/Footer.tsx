import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-3xl">IRADAH</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed max-w-sm">
              Premium apparel from Pakistan. Where willpower meets style. Curated collections for the modern individual.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/40">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors text-sm">All Products</Link></li>
              <li><Link to="/collection/hoodies" className="text-background/70 hover:text-background transition-colors text-sm">Hoodies</Link></li>
              <li><Link to="/collection/sweatshirts" className="text-background/70 hover:text-background transition-colors text-sm">Sweatshirts</Link></li>
              <li><Link to="/collection/trousers" className="text-background/70 hover:text-background transition-colors text-sm">Trousers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] mb-6 text-background/40">Help</h3>
            <ul className="space-y-3">
              <li><Link to="/shipping" className="text-background/70 hover:text-background transition-colors text-sm">Shipping</Link></li>
              <li><Link to="/returns" className="text-background/70 hover:text-background transition-colors text-sm">Returns</Link></li>
              <li><Link to="/size-guide" className="text-background/70 hover:text-background transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="/contact" className="text-background/70 hover:text-background transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-xs">
            © 2024 Iradah. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-background/40">
            <Link to="/privacy" className="hover:text-background transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-background transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

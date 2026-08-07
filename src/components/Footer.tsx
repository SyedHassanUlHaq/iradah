import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-5 md:px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl">IRADAH</span>
            </Link>
            <p className="text-background/50 text-sm leading-relaxed max-w-xs">
              Premium fashion from Pakistan. Where willpower meets style.
            </p>
            <div className="flex gap-2 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-5 text-background/40">Collections</h3>
            <ul className="space-y-2.5">
              <li><Link to="/collection/iradahclothing-com-collections-pehchaan-summer-collection" className="text-background/60 hover:text-background transition-colors text-sm">Pehchaan Collection</Link></li>
              <li><Link to="/collection/empress" className="text-background/60 hover:text-background transition-colors text-sm">Empress</Link></li>
              <li><Link to="/collection/unisex-bottoms" className="text-background/60 hover:text-background transition-colors text-sm">Unisex Bottoms</Link></li>
              <li><Link to="/products" className="text-background/60 hover:text-background transition-colors text-sm">All Products</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-5 text-background/40">Help</h3>
            <ul className="space-y-2.5">
              <li><Link to="/shipping" className="text-background/60 hover:text-background transition-colors text-sm">Shipping</Link></li>
              <li><Link to="/returns" className="text-background/60 hover:text-background transition-colors text-sm">Returns</Link></li>
              <li><Link to="/size-guide" className="text-background/60 hover:text-background transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="/contact" className="text-background/60 hover:text-background transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/30 text-xs">
            © {new Date().getFullYear()} Iradah. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-background/30">
            <Link to="/privacy" className="hover:text-background/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-background/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

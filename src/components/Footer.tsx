import { Link } from "react-router-dom";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

const collections = [
  {
    label: "Pehchaan Collection",
    to: "/collection/iradahclothing-com-collections-pehchaan-summer-collection",
  },
  { label: "Empress", to: "/collection/empress" },
  { label: "Unisex Bottoms", to: "/collection/unisex-bottoms" },
  { label: "All Products", to: "/products" },
];

const helpLinks = [
  { label: "Shipping", to: "/shipping" },
  { label: "Returns", to: "/returns" },
  { label: "Size Guide", to: "/size-guide" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/iradahclothing/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/iradahclothing/",
    icon: Facebook,
  },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto px-5 md:px-4 py-5 md:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
            <p className="text-[11px] md:text-xs tracking-wide text-background/55">
              Free shipping over <span className="text-background/85">PKR 5,000</span>
            </p>
            <p className="text-[11px] md:text-xs tracking-wide text-background/55 sm:text-center">
              Cash on delivery available
            </p>
            <p className="text-[11px] md:text-xs tracking-wide text-background/55 sm:text-right">
              Easy <span className="text-background/85">7-day</span> returns
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl tracking-wide">IRADAH</span>
            </Link>
            <p className="text-background/50 text-sm leading-relaxed max-w-sm mt-4">
              Premium fashion from Pakistan. Where willpower meets style.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-background/15 flex items-center justify-center text-background/70 hover:text-background hover:border-background/40 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.22em] mb-5 text-background/40">Collections</h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-background/65 hover:text-background transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.22em] mb-5 text-background/40">Help</h3>
            <ul className="space-y-3">
              {helpLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-background/65 hover:text-background transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.22em] mb-5 text-background/40">Connect</h3>
            <p className="text-background/50 text-sm leading-relaxed mb-5">
              Questions about fit, orders, or new drops? We’re on Instagram every day.
            </p>
            <a
              href="https://www.instagram.com/iradahclothing/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-background border-b border-background/30 pb-0.5 hover:border-background transition-colors"
            >
              Message @iradahclothing
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-background/35 text-xs">
            © {new Date().getFullYear()} IRADAH. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-background/35">
            <Link to="/privacy" className="hover:text-background/70 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-background/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

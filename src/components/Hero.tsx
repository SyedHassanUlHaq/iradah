import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-image.webp";

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden bg-background">
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        {/* Mobile: full-bleed image */}
        <div className="absolute inset-0 md:hidden">
          <img
            src={heroImage}
            alt="IRADAH lifestyle collection"
            className="w-full h-[120%] object-cover object-top transition-transform duration-100 will-change-transform"
            style={{ transform: `translateY(-${scrollY * 0.1}px) scale(1.05)` }}
          />
        </div>
        {/* Desktop: split layout — keep in sync with content column width below */}
        <div className="absolute inset-0 hidden md:grid md:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
          <div className="bg-background" />
          <div className="relative overflow-hidden">
            <img
              src={heroImage}
              alt="IRADAH lifestyle collection"
              className="w-full h-[120%] object-cover object-top transition-transform duration-100 will-change-transform"
              style={{ transform: `translateY(-${scrollY * 0.15}px) scale(1.05)` }}
            />
          </div>
        </div>
        {/* Mobile overlay: dark gradient from bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 via-40% to-transparent md:hidden" />
        {/* Desktop: soft edge fade at the split */}
        <div className="absolute inset-0 bg-gradient-to-r from-background from-[38%] via-background/40 via-[42%] to-transparent to-[48%] hidden md:block" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content locked to the left column on desktop (same width as white panel) */}
      <div
        className="relative z-10 w-full md:w-[42%] px-5 md:px-8 lg:px-10 xl:px-12 pb-20 md:pb-0 pt-24 transition-opacity duration-100 will-change-[opacity,transform]"
        style={{
          opacity: Math.max(1 - scrollY / 500, 0),
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      >
        <div className="max-w-xl md:max-w-none">
          {/* Brand Name - Large */}
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <p className="font-display text-[10px] sm:text-xs uppercase tracking-[0.5em] text-muted-foreground mb-2">
              — Introducing
            </p>
            <p className="font-display text-5xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.15em] font-semibold mb-3 md:mb-4 leading-none">
              IRADAH
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-xl sm:text-3xl md:text-3xl lg:text-4xl leading-[1.15] tracking-tight mb-4 md:mb-5 opacity-0 animate-fade-in" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            Your Wardrobe{" "}
            <span className="italic">Deserves Better</span>
          </h1>

          {/* Divider */}
          <div className="w-12 md:w-16 h-px bg-foreground/30 mb-4 md:mb-5 opacity-0 animate-fade-in" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }} />

          {/* Subheading */}
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-xs md:max-w-full mb-6 md:mb-8 opacity-0 animate-fade-in font-light leading-relaxed" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Discover curated collections designed in Pakistan with premium fabrics and effortless style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <Link
              to="/products"
              className="btn-primary flex items-center gap-2 group text-xs md:text-sm px-6 py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4"
            >
              Shop Collection
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/collection/unisex-bottoms" className="btn-outline text-xs md:text-sm px-5 py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4">
              Unisex Bottoms
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-4 md:gap-6 mt-8 md:mt-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.65s', animationFillMode: 'forwards' }}>
            <div>
              <p className="font-display text-xs md:text-sm font-medium">Easy Returns</p>
              <p className="text-[8px] md:text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">7-day policy</p>
            </div>
            <div className="w-px h-6 md:h-7 bg-border" />
            <div>
              <p className="font-display text-xs md:text-sm font-medium">COD</p>
              <p className="text-[8px] md:text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToProducts}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};

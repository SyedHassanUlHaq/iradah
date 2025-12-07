import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

export const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-3 mb-10 opacity-0 animate-fade-in">
            <span className="w-12 h-px bg-foreground/30" />
            <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Premium Apparel from Pakistan</span>
            <span className="w-12 h-px bg-foreground/30" />
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            IRADAH
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 opacity-0 animate-fade-in font-light leading-relaxed" style={{ animationDelay: '0.4s' }}>
            Where <em className="font-display not-italic">willpower</em> meets style. Curated collections for the modern individual.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/products"
              className="btn-primary flex items-center gap-2 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={scrollToProducts}
              className="btn-outline"
            >
              Explore
            </button>
          </div>

          {/* Minimal Stats */}
          <div className="flex items-center justify-center gap-12 mt-24 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <p className="font-display text-2xl">Premium</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Quality</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl">Pakistan</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Origin</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl">Worldwide</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Shipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToProducts}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import unisexImage from "@/assets/unisex-banner.jpg";

const unisex = {
  name: "Explore Collections",
  description: "Discover the latest curated drops from IRADAH.",
  path: "/products",
  image: unisexImage,
};

export const CategoryBanner = () => {
  return (
    <section className="py-14 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em]">Collections</span>
          <h2 className="font-display text-3xl md:text-5xl mt-2">Shop by Style</h2>
        </div>

        {/* Wide Unisex Banner */}
        <Link
          to={unisex.path}
          className="group relative block w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-card opacity-0 animate-fade-in"
          style={{ animationFillMode: 'forwards' }}
        >
          <img
            src={unisex.image}
            alt="Shop Unisex collection"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: 'center 30%' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-background">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-3xl md:text-5xl">{unisex.name}</h3>
                <p className="text-background/60 text-sm md:text-base mt-1">{unisex.description}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-foreground transition-all group-hover:scale-110 group-hover:bg-background">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

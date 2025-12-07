import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Hoodies",
    description: "Comfort meets style",
    path: "/collection/hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
  },
  {
    name: "Sweatshirts",
    description: "Everyday essentials",
    path: "/collection/sweatshirts",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
  },
  {
    name: "Trousers",
    description: "Refined comfort",
    path: "/collection/trousers",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop",
  },
];

export const CategoryBanner = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Categories</span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">Shop by Style</h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.path}
              className="group relative aspect-[4/5] overflow-hidden bg-card opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-3xl">{category.name}</h3>
                    <p className="text-background/70 text-sm mt-1">{category.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground transition-transform group-hover:scale-110">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

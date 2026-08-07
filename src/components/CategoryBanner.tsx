import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import unisexImage from "@/assets/unisex-banner.jpg";

const unisex = {
  name: "Unisex",
  description: "Fashion without boundaries",
  path: "/products",
  image: unisexImage,
};

const productTypes = [
  {
    name: "Hoodies",
    path: "/collection/hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
  },
  {
    name: "Sweatshirts",
    path: "/collection/sweatshirts",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop",
  },
  {
    name: "Trousers",
    path: "/collection/trousers",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop",
  },
];

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
          className="group relative block w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-card mb-3 md:mb-4 opacity-0 animate-fade-in"
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

        {/* Product Type Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          {productTypes.map((type, index) => (
            <Link
              key={type.name}
              to={type.path}
              className="group relative aspect-[2/1] sm:aspect-[3/2] overflow-hidden bg-card opacity-0 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <img
                src={type.image}
                alt={`Shop ${type.name}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-background tracking-wide">{type.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

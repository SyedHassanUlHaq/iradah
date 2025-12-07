import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryBanner } from "@/components/CategoryBanner";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <CategoryBanner />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryBanner } from "@/components/CategoryBanner";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IRADAH",
    url: "https://iradah.pk",
    description: "Premium fashion brand from Pakistan offering hoodies, sweatshirts & trousers for men, women & kids.",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        canonical="/"
        jsonLd={jsonLd}
      />
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

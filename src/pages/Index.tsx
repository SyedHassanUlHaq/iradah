import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { CollectionGrid } from "@/components/CollectionGrid";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoryBanner } from "@/components/CategoryBanner";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "IRADAH",
      url: "https://iradahclothing.com",
      description: "Premium fashion brand from Pakistan offering curated collections like Pehchaan, Empress, and Unisex Bottoms.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "IRADAH",
      url: "https://iradahclothing.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        canonical="/"
        jsonLd={jsonLd}
      />
      <Navbar />
      <Hero />
      <Marquee />
      <CollectionGrid />
      <FeaturedProducts />
      <CategoryBanner />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh] pt-20">
        <div className="text-center">
          <h1 className="font-display text-7xl md:text-9xl">404</h1>
          <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
          <Link to="/" className="btn-primary mt-8 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;

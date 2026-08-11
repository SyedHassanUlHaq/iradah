import { Link, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { policies, type PolicySlug } from "@/content/policies";

const isPolicySlug = (value: string): value is PolicySlug => value in policies;

const Policy = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "");

  if (!isPolicySlug(slug)) {
    return <Navigate to="/" replace />;
  }

  const page = policies[slug];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={page.title} description={page.description} canonical={`/${slug}`} />
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <h1 className="font-display text-4xl md:text-5xl mt-3">{page.title}</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-xl">{page.description}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl space-y-10">
            {page.sections.map((section, index) => (
              <section key={section.heading ?? index}>
                {section.heading && (
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm md:text-[15px] leading-relaxed text-foreground/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Policy;

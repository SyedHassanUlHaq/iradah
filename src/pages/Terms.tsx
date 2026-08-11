import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const sections = [
  {
    title: "Using this site",
    body: "By shopping with IRADAH, you agree to use iradahclothing.com for lawful purposes and to provide accurate order information at checkout.",
  },
  {
    title: "Products & pricing",
    body: "Product availability, pricing, and promotions may change without notice. Listed prices are confirmed at checkout before you complete your order.",
  },
  {
    title: "Orders",
    body: "Placing an order constitutes an offer to purchase. We’ll confirm accepted orders by email. If an item can’t be fulfilled, we’ll let you know and arrange a refund or alternative.",
  },
  {
    title: "Intellectual property",
    body: "All designs, imagery, branding, and site content remain the property of IRADAH. You may not copy or reuse them without permission.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms"
        description="Terms of use for iradahclothing.com — shopping, pricing, orders, and brand assets."
        canonical="/terms"
      />
      <Navbar />
      <main className="pt-16 md:pt-20">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background to-accent/40" />
          <div className="relative container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-4">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-foreground/30">/</span>
                Terms
              </p>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Terms</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                The basics for shopping on iradahclothing.com — use of the site, orders, and our
                brand assets.
              </p>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl md:text-3xl mb-3">Terms of use</h2>
              <p className="text-sm md:text-[15px] text-foreground/75 leading-relaxed max-w-xl mb-8">
                These terms apply when you browse or place an order with IRADAH. Keep them in mind
                before checkout.
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {sections.map(({ title, body }) => (
                  <li key={title} className="py-6">
                    <h3 className="text-sm md:text-base font-medium">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-6">
                  Related
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Looking for delivery details, returns, or how we handle your data? Those live on
                  their own pages.
                </p>
                <div className="mt-10 pt-8 border-t border-border space-y-4">
                  <Link
                    to="/shipping"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Shipping</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/returns"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Returns</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/privacy"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Privacy</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;

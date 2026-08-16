import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const highlights = [
  {
    label: "Free over PKR 5,000",
    detail: "Standard delivery fee may apply below the threshold — shown at checkout.",
  },
  {
    label: "2–5 business days",
    detail: "Typical delivery window after processing, depending on your city.",
  },
  {
    label: "Cash on delivery",
    detail: "COD is available on eligible orders across Pakistan.",
  },
];

const timeline = [
  {
    step: "01",
    title: "Order placed",
    body: "You’ll get an email confirmation as soon as checkout is complete.",
  },
  {
    step: "02",
    title: "Processing",
    body: "Most orders are packed within 1–2 business days before they leave our side.",
  },
  {
    step: "03",
    title: "On the way",
    body: "Delivery usually takes 2–5 business days once shipped, depending on your city.",
  },
];

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shipping"
        description="Free shipping over PKR 5,000, COD available, and delivery timelines for IRADAH orders across Pakistan."
        canonical="/shipping"
      />
      <Navbar />
      <main className="pt-[110px] md:pt-[132px]">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background to-accent/40" />
          <div className="relative container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-4">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-foreground/30">/</span>
                Shipping
              </p>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Shipping</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                We ship across Pakistan. Orders over PKR 5,000 ship free — COD is available on
                eligible checkouts.
              </p>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-14">
              <div>
                <h2 className="font-display text-2xl md:text-3xl mb-3">What to expect</h2>
                <p className="text-sm md:text-[15px] text-foreground/75 leading-relaxed max-w-xl">
                  Delivery fees and timelines are calculated at checkout based on your order total
                  and city.
                </p>
                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {highlights.map(({ label, detail }) => (
                    <li key={label} className="py-5">
                      <p className="text-sm md:text-base font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl md:text-3xl mb-8">Delivery timeline</h2>
                <ol className="space-y-8">
                  {timeline.map(({ step, title, body }) => (
                    <li key={step} className="flex gap-5 md:gap-6">
                      <span className="font-display text-sm text-foreground/40 pt-0.5 tabular-nums">
                        {step}
                      </span>
                      <div>
                        <h3 className="text-sm md:text-base font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-md">
                          {body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-6">
                  Good to know
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm md:text-base font-medium">Free shipping threshold</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Orders over <span className="text-foreground/80">PKR 5,000</span> include free
                      shipping within Pakistan. Below that, a standard fee is calculated at checkout.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm md:text-base font-medium">Cash on delivery</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Pay when your order arrives. COD is available on eligible orders nationwide.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm md:text-base font-medium">Order updates</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Keep an eye on your email for confirmation and shipping updates. Message us if
                      anything looks off.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border space-y-4">
                  <Link
                    to="/returns"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Returns policy</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/contact"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Ask about an order</span>
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

export default Shipping;

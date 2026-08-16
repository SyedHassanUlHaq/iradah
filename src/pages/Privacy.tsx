import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const sections = [
  {
    title: "What we collect",
    body: "We collect only what’s needed to process orders, improve the shopping experience, and send updates you’ve opted into — like your name, contact details, shipping address, and order history.",
  },
  {
    title: "Payments",
    body: "Payment details are handled securely by Shopify. Card and payment information is never stored on this website.",
  },
  {
    title: "How we use it",
    body: "Your information helps us fulfill orders, provide support, prevent fraud, and share new drops or offers when you’ve subscribed.",
  },
  {
    title: "Marketing emails",
    body: "You can unsubscribe from marketing emails at any time using the link in those messages. Transactional emails about your orders will still be sent as needed.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy"
        description="How IRADAH collects, uses, and protects your information when you shop with us."
        canonical="/privacy"
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
                Privacy
              </p>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Privacy</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                A clear look at how IRADAH handles your information when you browse, order, or
                subscribe.
              </p>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl md:text-3xl mb-3">Your information</h2>
              <p className="text-sm md:text-[15px] text-foreground/75 leading-relaxed max-w-xl mb-8">
                We keep data collection minimal and purposeful — enough to run the store, nothing
                more than we need.
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
                  Questions
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Need help with an order or want to update your details? Reach out on social and
                  include your order number when relevant.
                </p>
                <div className="mt-10 pt-8 border-t border-border space-y-4">
                  <Link
                    to="/contact"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Contact us</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/terms"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Terms of use</span>
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

export default Privacy;

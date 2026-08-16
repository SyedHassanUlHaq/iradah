import { Link } from "react-router-dom";
import { Instagram, Facebook, ArrowUpRight, Package, Ruler, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const channels = [
  {
    name: "Instagram",
    handle: "@iradahclothing",
    href: "https://www.instagram.com/iradahclothing/",
    detail: "Best for sizing, orders, and quick replies.",
    icon: Instagram,
  },
  {
    name: "Facebook",
    handle: "IRADAH Clothing",
    href: "https://www.facebook.com/iradahclothing/",
    detail: "Message us for support and updates.",
    icon: Facebook,
  },
];

const topics = [
  {
    title: "Shipping",
    description: "Delivery timelines, free shipping, and COD.",
    to: "/shipping",
    icon: Package,
  },
  {
    title: "Size Guide",
    description: "Charts for tees, trousers, and joggers.",
    to: "/size-guide",
    icon: Ruler,
  },
  {
    title: "Returns",
    description: "How our 7-day returns process works.",
    to: "/returns",
    icon: RefreshCw,
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact"
        description="Get in touch with IRADAH on Instagram or Facebook for orders, sizing, and support."
        canonical="/contact"
      />
      <Navbar />
      <main className="pt-[104px] md:pt-[120px]">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background to-accent/40" />
          <div className="relative container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Contact</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                Questions about fit, orders, or a new drop? Reach out on social — we typically reply
                within one business day.
              </p>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  Message us
                </h2>
                <ul className="divide-y divide-border border-y border-border">
                  {channels.map(({ name, handle, href, detail, icon: Icon }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 md:gap-5 py-5 md:py-6 hover:bg-secondary/40 transition-colors -mx-2 px-2 md:-mx-3 md:px-3"
                      >
                        <span className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-foreground/80 group-hover:border-foreground/40 transition-colors">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-medium text-sm md:text-base">{name}</span>
                            <span className="text-xs text-muted-foreground">{handle}</span>
                          </span>
                          <span className="block text-sm text-muted-foreground mt-1">{detail}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Include your order number when asking about shipping or returns so we can help
                faster.
              </p>
            </div>

            <aside className="lg:col-span-5">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Quick help
              </h2>
              <ul className="space-y-6">
                {topics.map(({ title, description, to, icon: Icon }) => (
                  <li key={to}>
                    <Link to={to} className="group block">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {title}
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                      </span>
                      <span className="block text-sm text-muted-foreground mt-1.5 leading-relaxed pl-[22px]">
                        {description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Response time
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Usually within 1 business day, Sunday–Thursday.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

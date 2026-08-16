import { Link } from "react-router-dom";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const conditions = [
  "Request within 7 days of delivery",
  "Item unused and unwashed",
  "Original tags and packaging included",
  "No signs of wear, damage, or alteration",
];

const steps = [
  {
    step: "01",
    title: "Message us",
    body: "Send a note on Instagram or Facebook with your order number and reason for return.",
  },
  {
    step: "02",
    title: "Get approval",
    body: "We’ll review your request and confirm the next steps, usually within one business day.",
  },
  {
    step: "03",
    title: "Ship it back",
    body: "Pack the item securely with tags attached and follow the return instructions we send you.",
  },
];

const channels = [
  {
    name: "Instagram",
    handle: "@iradahclothing",
    href: "https://www.instagram.com/iradahclothing/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    handle: "IRADAH Clothing",
    href: "https://www.facebook.com/iradahclothing/",
    icon: Facebook,
  },
];

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Returns"
        description="IRADAH’s easy 7-day returns policy — request a return on Instagram or Facebook."
        canonical="/returns"
      />
      <Navbar />
      <main className="pt-[104px] md:pt-[120px]">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background to-accent/40" />
          <div className="relative container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-4">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-foreground/30">/</span>
                Returns
              </p>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Returns</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                Not quite right? You have 7 days from delivery to start a return — unused items with
                original tags only.
              </p>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-14">
              <div>
                <h2 className="font-display text-2xl md:text-3xl mb-3">7-day returns</h2>
                <p className="text-sm md:text-[15px] text-foreground/75 leading-relaxed max-w-xl">
                  If something isn’t right, request a return within 7 days of delivery. We’ll help
                  you sort it out.
                </p>
                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {conditions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 py-4 text-sm md:text-[15px] text-foreground/80"
                    >
                      <span
                        className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-foreground/40"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl md:text-3xl mb-8">How to start a return</h2>
                <ol className="space-y-8">
                  {steps.map(({ step, title, body }) => (
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
                  Start a return
                </h2>
                <ul className="divide-y divide-border border-y border-border">
                  {channels.map(({ name, handle, href, icon: Icon }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 py-5 hover:bg-secondary/40 transition-colors -mx-2 px-2 md:-mx-3 md:px-3"
                      >
                        <span className="w-11 h-11 shrink-0 rounded-full border border-border flex items-center justify-center text-foreground/80 group-hover:border-foreground/40 transition-colors">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-sm">{name}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{handle}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-muted-foreground leading-relaxed mt-6">
                  Include your order number and a quick note on why you’re returning — it helps us
                  reply faster.
                </p>

                <div className="mt-10 pt-8 border-t border-border space-y-4">
                  <Link
                    to="/size-guide"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Need a different size?</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                  <Link
                    to="/contact"
                    className="group flex items-center justify-between text-sm"
                  >
                    <span>Other questions</span>
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

export default Returns;

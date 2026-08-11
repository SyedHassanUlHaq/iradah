import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const sizeCharts = [
  {
    id: "oversized-tees-pehchaan",
    title: "Oversized Drop Shoulder Tee",
    subtitle: "Pehchaan / Summer Collection",
    navLabel: "Pehchaan Tees",
    description:
      "Applies to Lapata, Chashm-e-Bad Door, Musafir, Sabr Shukr Tawakkul, Hasrat, Befikra, Heroes, and Virsa tees.",
    image:
      "https://cdn.shopify.com/s/files/1/0747/6130/6212/files/oversize_drop_shoulder_tshirt.png?v=1783921695",
  },
  {
    id: "oversized-tees-empress",
    title: "Oversized Drop Shoulder Tee",
    subtitle: "Empress Collection",
    navLabel: "Empress Tees",
    description:
      "Applies to Pehchan, Aamaal, Tabeer, Wujood-e-Zan, Ajrak, and Rawaan oversized tees.",
    image:
      "https://cdn.shopify.com/s/files/1/0747/6130/6212/files/oversize_drop_shoulder_tshirt_eaa7769d-535b-4bb9-a244-d948c4bbd715.png?v=1785933570",
  },
  {
    id: "flat-hem-trousers",
    title: "Flat Hem Trouser",
    subtitle: "Bottoms",
    navLabel: "Flat Hem",
    description: "Applies to Essential Flat Hem Trouser and Virsa Heritage Patchwork Trouser.",
    image:
      "https://cdn.shopify.com/s/files/1/0747/6130/6212/files/Flat_Hem_Trouser_Size_Chart_d7e89844-d9da-458b-881b-5223dfe27f96.png?v=1774692164",
  },
  {
    id: "jogger-pant",
    title: "Jogger Pant",
    subtitle: "Bottoms",
    navLabel: "Joggers",
    description: "Applies to Essential Jogger Pant.",
    image:
      "https://cdn.shopify.com/s/files/1/0747/6130/6212/files/Jogger_Size_Chart_50bb37d8-2e94-495d-a123-838c88da792c.png?v=1774693642",
  },
];

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Size Guide"
        description="Find your IRADAH fit with size charts for oversized tees, flat hem trousers, and jogger pants."
        canonical="/size-guide"
      />
      <Navbar />
      <main className="pt-16 md:pt-20">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background to-accent/40" />
          <div className="relative container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">Size Guide</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                Measure once, shop with certainty. Oversized cuts are meant to sit relaxed — size
                down if you want a closer fit.
              </p>
            </div>

            <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <nav aria-label="Size charts" className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {sizeCharts.map((chart, index) => (
                  <span key={chart.id} className="inline-flex items-center gap-5">
                    {index > 0 && (
                      <span className="hidden sm:block w-px h-3 bg-border" aria-hidden />
                    )}
                    <a
                      href={`#${chart.id}`}
                      className="text-xs uppercase tracking-[0.16em] text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {chart.navLabel}
                    </a>
                  </span>
                ))}
              </nav>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {sizeCharts.length} charts
              </p>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 md:py-16 space-y-14 md:space-y-20">
          {sizeCharts.map((chart) => (
            <section key={chart.id} id={chart.id} className="scroll-mt-24 md:scroll-mt-28">
              <div className="max-w-3xl mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {chart.subtitle}
                </span>
                <h2 className="font-display text-2xl md:text-4xl mt-2">{chart.title}</h2>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{chart.description}</p>
              </div>
              <div className="max-w-4xl border border-border bg-secondary/20 p-2 md:p-4">
                <img
                  src={chart.image}
                  alt={`${chart.title} size chart — ${chart.subtitle}`}
                  className="w-full h-auto bg-background"
                  loading="lazy"
                />
              </div>
            </section>
          ))}

          <div className="max-w-2xl border-t border-border pt-10">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Need help choosing?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Message us on Instagram with your usual size and preferred fit — we’ll help you pick
              the right one.
            </p>
            <a
              href="https://www.instagram.com/iradahclothing/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
            >
              Message @iradahclothing
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;

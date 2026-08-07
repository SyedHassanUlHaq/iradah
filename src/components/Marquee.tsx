export const Marquee = () => {
  const items = [
    "Free Shipping on Orders Over PKR 5,000",
    "Premium Quality Fabrics",
    "Made in Pakistan",
    "New Arrivals Weekly",
    "Cash on Delivery Available",
    "Easy 7-Day Returns",
  ];

  return (
    <div className="bg-foreground text-background py-2.5 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <div className="marquee flex items-center">
          {[...items, ...items].map((item, index) => (
            <span key={index} className="mx-8 text-[11px] font-medium uppercase tracking-[0.15em] flex items-center gap-8">
              {item}
              <span className="text-background/30">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

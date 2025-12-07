export const Marquee = () => {
    const items = [
      "Free Shipping on Orders Over PKR 5,000",
      "·",
      "Premium Quality",
      "·",
      "Made in Pakistan",
      "·",
      "New Arrivals Weekly",
      "·",
      "Quality Guaranteed",
      "·",
    ];
  
    return (
      <div className="bg-foreground text-background py-3 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="marquee flex items-center">
            {[...items, ...items].map((item, index) => (
              <span key={index} className="mx-6 text-xs font-medium uppercase tracking-[0.15em]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
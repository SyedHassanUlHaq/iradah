import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct, fetchProducts, fetchProductIdsBySort, formatPrice } from "@/lib/shopify";
import { SEO } from "@/components/SEO";
import { ArrowLeft, ArrowRight, Loader2, SlidersHorizontal, X } from "lucide-react";

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

const isSizeOption = (name: string) => /size/i.test(name);
const isColorOption = (name: string) => /colou?r/i.test(name);

const sortSizes = (values: string[]) =>
  [...values].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.toUpperCase());
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

const getOptionValues = (product: ShopifyProduct, matcher: (name: string) => boolean) => {
  const fromOptions =
    product.node.options.find((option) => matcher(option.name))?.values ?? [];
  if (fromOptions.length) return fromOptions;

  const values = new Set<string>();
  product.node.variants.edges.forEach(({ node: variant }) => {
    variant.selectedOptions.forEach((opt) => {
      if (matcher(opt.name)) values.add(opt.value);
    });
  });
  return [...values];
};

const productHasOptionValue = (
  product: ShopifyProduct,
  matcher: (name: string) => boolean,
  value: string,
) => {
  return product.node.variants.edges.some(({ node: variant }) =>
    variant.selectedOptions.some(
      (opt) => matcher(opt.name) && opt.value.toLowerCase() === value.toLowerCase(),
    ),
  );
};

const productInStock = (product: ShopifyProduct) =>
  product.node.variants.edges.some(({ node }) => node.availableForSale);

const getDiscountPercent = (product: ShopifyProduct) => {
  const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
  const compareAt = parseFloat(
    product.node.compareAtPriceRange?.minVariantPrice.amount ?? "0",
  );
  if (!compareAt || Number.isNaN(compareAt) || compareAt <= price) return 0;
  return ((compareAt - price) / compareAt) * 100;
};

const isOnSale = (product: ShopifyProduct) => getDiscountPercent(product) > 0;

const Products = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [bestSellingIds, setBestSellingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [data, bestSelling] = await Promise.all([
          fetchProducts(100),
          fetchProductIdsBySort(100, "BEST_SELLING"),
        ]);
        setProducts(data);
        setBestSellingIds(bestSelling);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const currencyCode = products[0]?.node.priceRange.minVariantPrice.currencyCode ?? "PKR";

  const filterOptions = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();
    const collections = new Map<string, string>();
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    products.forEach((product) => {
      getOptionValues(product, isSizeOption).forEach((value) => sizes.add(value));
      getOptionValues(product, isColorOption).forEach((value) => colors.add(value));
      product.node.collections?.edges.forEach(({ node }) => {
        collections.set(node.handle, node.title);
      });
      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      if (!Number.isNaN(price)) {
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      }
    });

    return {
      sizes: sortSizes([...sizes]),
      colors: [...colors].sort((a, b) => a.localeCompare(b)),
      collections: [...collections.entries()]
        .map(([handle, title]) => ({ handle, title }))
        .sort((a, b) => a.title.localeCompare(b.title)),
      minPrice: Number.isFinite(minPrice) ? Math.floor(minPrice) : 0,
      maxPrice: Number.isFinite(maxPrice) ? Math.ceil(maxPrice) : 0,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const min = priceMin.trim() === "" ? null : parseFloat(priceMin);
    const max = priceMax.trim() === "" ? null : parseFloat(priceMax);

    let next = products.filter((product) => {
      if (inStockOnly && !productInStock(product)) return false;

      if (selectedSizes.length > 0) {
        const matchesSize = selectedSizes.some((size) =>
          productHasOptionValue(product, isSizeOption, size),
        );
        if (!matchesSize) return false;
      }

      if (selectedColors.length > 0) {
        const matchesColor = selectedColors.some((color) =>
          productHasOptionValue(product, isColorOption, color),
        );
        if (!matchesColor) return false;
      }

      if (selectedCollections.length > 0) {
        const handles = new Set(
          product.node.collections?.edges.map(({ node }) => node.handle) ?? [],
        );
        if (!selectedCollections.some((handle) => handles.has(handle))) return false;
      }

      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      if (min != null && !Number.isNaN(min) && price < min) return false;
      if (max != null && !Number.isNaN(max) && price > max) return false;

      return true;
    });

    switch (sortBy) {
      case "price-low":
        next = [...next].sort(
          (a, b) =>
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount),
        );
        break;
      case "price-high":
        next = [...next].sort(
          (a, b) =>
            parseFloat(b.node.priceRange.minVariantPrice.amount) -
            parseFloat(a.node.priceRange.minVariantPrice.amount),
        );
        break;
      case "name":
        next = [...next].sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "name-za":
        next = [...next].sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
      case "newest":
        next = [...next].sort(
          (a, b) =>
            new Date(b.node.createdAt).getTime() - new Date(a.node.createdAt).getTime(),
        );
        break;
      case "oldest":
        next = [...next].sort(
          (a, b) =>
            new Date(a.node.createdAt).getTime() - new Date(b.node.createdAt).getTime(),
        );
        break;
      case "sale":
        next = [...next].sort((a, b) => {
          const aSale = isOnSale(a) ? 1 : 0;
          const bSale = isOnSale(b) ? 1 : 0;
          if (bSale !== aSale) return bSale - aSale;
          return getDiscountPercent(b) - getDiscountPercent(a);
        });
        break;
      case "best-selling": {
        const rank = new Map(bestSellingIds.map((id, index) => [id, index]));
        next = [...next].sort((a, b) => {
          const aRank = rank.get(a.node.id) ?? Number.MAX_SAFE_INTEGER;
          const bRank = rank.get(b.node.id) ?? Number.MAX_SAFE_INTEGER;
          return aRank - bRank;
        });
        break;
      }
      default:
        break;
    }

    return next;
  }, [
    products,
    sortBy,
    selectedSizes,
    selectedColors,
    selectedCollections,
    inStockOnly,
    priceMin,
    priceMax,
    bestSellingIds,
  ]);

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    selectedCollections.length +
    (inStockOnly ? 1 : 0) +
    (priceMin.trim() !== "" ? 1 : 0) +
    (priceMax.trim() !== "" ? 1 : 0);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCollections([]);
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
  };

  const toggleValue = (
    value: string,
    selected: string[],
    setSelected: (next: string[]) => void,
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const heroSlides = useMemo(() => {
    const seen = new Set<string>();
    return products
      .map((product) => {
        const image = product.node.images.edges[0]?.node;
        if (!image?.url || seen.has(image.url)) return null;
        seen.add(image.url);
        return {
          handle: product.node.handle,
          title: product.node.title,
          image,
        };
      })
      .filter((slide): slide is NonNullable<typeof slide> => Boolean(slide))
      .slice(0, 12);
  }, [products]);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const id = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    if (heroSlides.length === 0) return;
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <SEO
        title="All Products"
        description="Browse the full IRADAH collection — curated fashion for every wardrobe."
        canonical="/products"
        image={heroSlides[0]?.image.url}
        jsonLd={
          products.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: "All Products",
                url: "https://iradahclothing.com/products",
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: products.map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `https://iradahclothing.com/product/${product.node.handle}`,
                    name: product.node.title,
                  })),
                },
              }
            : undefined
        }
      />
      <Navbar />

      <main className="pt-[104px] md:pt-[120px] w-full">
        <header className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2 bg-secondary/40">
          {heroSlides.length > 0 ? (
            <div className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]">
              {heroSlides.map((slide, index) => (
                <Link
                  key={slide.handle}
                  to={`/product/${slide.handle}`}
                  aria-hidden={index !== activeSlide}
                  tabIndex={index === activeSlide ? 0 : -1}
                  className={`absolute inset-0 block transition-opacity duration-500 ease-out ${
                    index === activeSlide ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image.url}
                    alt={slide.image.altText || slide.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/45 to-foreground/15" />
                </Link>
              ))}

              <div className="pointer-events-none absolute inset-0 z-[2] flex items-end">
                <div className="container mx-auto px-4 py-8 sm:py-10 md:py-14 text-background w-full">
                  <div className="max-w-3xl">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-background/70">
                      Collection
                    </span>
                    <h1 className="font-display mt-2 sm:mt-3 leading-[1.12] text-[clamp(1.75rem,6vw,3.75rem)]">
                      All Products
                    </h1>
                    <p className="mt-3 sm:mt-4 max-w-xl leading-relaxed text-background/75 text-[clamp(0.8125rem,2.4vw,1rem)]">
                      Explore our complete collection of premium apparel.
                    </p>
                    {!loading && (
                      <p className="mt-4 sm:mt-5 text-[10px] uppercase tracking-[0.2em] text-background/55">
                        {products.length} {products.length === 1 ? "Piece" : "Pieces"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {heroSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => goToSlide(activeSlide - 1)}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-background/30 bg-background/15 text-background flex items-center justify-center hover:bg-background hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => goToSlide(activeSlide + 1)}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-background/30 bg-background/15 text-background flex items-center justify-center hover:bg-background hover:text-foreground transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1.5 z-10">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.handle}
                        type="button"
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          activeSlide === index
                            ? "w-6 bg-background"
                            : "w-1.5 bg-background/40 hover:bg-background/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="container mx-auto px-4 py-16 md:py-24 text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                Collection
              </span>
              <h1 className="font-display text-5xl md:text-7xl mt-2">All Products</h1>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
                Explore our complete collection of premium apparel.
              </p>
            </div>
          )}
        </header>

        <div className="sticky top-[104px] md:top-[120px] z-40 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {filteredProducts.length} Products
              </p>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Sort
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-0 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="best-selling">Best selling</option>
                    <option value="featured">Featured</option>
                    <option value="sale">On sale first</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A–Z</option>
                    <option value="name-za">Name: Z–A</option>
                  </select>
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="pt-5 mt-4 border-t border-border space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Refine
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                  {filterOptions.sizes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-3">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.sizes.map((size) => {
                          const active = selectedSizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                toggleValue(size, selectedSizes, setSelectedSizes)
                              }
                              className={`px-3 py-1.5 border text-xs transition-colors ${
                                active
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {filterOptions.colors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-3">Color</p>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.colors.map((color) => {
                          const active = selectedColors.includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                toggleValue(color, selectedColors, setSelectedColors)
                              }
                              className={`px-3 py-1.5 border text-xs transition-colors ${
                                active
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {filterOptions.collections.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-3">
                        Collection
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.collections.map(({ handle, title }) => {
                          const active = selectedCollections.includes(handle);
                          return (
                            <button
                              key={handle}
                              type="button"
                              onClick={() =>
                                toggleValue(
                                  handle,
                                  selectedCollections,
                                  setSelectedCollections,
                                )
                              }
                              className={`px-3 py-1.5 border text-xs transition-colors ${
                                active
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-3">
                        Availability
                      </p>
                      <button
                        type="button"
                        onClick={() => setInStockOnly((value) => !value)}
                        className={`px-3 py-1.5 border text-xs transition-colors ${
                          inStockOnly
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        In stock only
                      </button>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-3">
                        Price ({currencyCode})
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder={`${filterOptions.minPrice}`}
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                          aria-label="Minimum price"
                        />
                        <span className="text-muted-foreground text-xs">to</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder={`${filterOptions.maxPrice}`}
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                          aria-label="Maximum price"
                        />
                      </div>
                      {filterOptions.maxPrice > 0 && (
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Range {formatPrice(String(filterOptions.minPrice), currencyCode)} –{" "}
                          {formatPrice(String(filterOptions.maxPrice), currencyCode)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedSizes.map((size) => (
                      <button
                        key={`size-${size}`}
                        type="button"
                        onClick={() =>
                          toggleValue(size, selectedSizes, setSelectedSizes)
                        }
                        className="inline-flex items-center gap-1.5 text-xs border border-border px-2.5 py-1 hover:border-foreground transition-colors"
                      >
                        Size: {size}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                    {selectedColors.map((color) => (
                      <button
                        key={`color-${color}`}
                        type="button"
                        onClick={() =>
                          toggleValue(color, selectedColors, setSelectedColors)
                        }
                        className="inline-flex items-center gap-1.5 text-xs border border-border px-2.5 py-1 hover:border-foreground transition-colors"
                      >
                        Color: {color}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                    {selectedCollections.map((handle) => {
                      const title =
                        filterOptions.collections.find((c) => c.handle === handle)
                          ?.title ?? handle;
                      return (
                        <button
                          key={`collection-${handle}`}
                          type="button"
                          onClick={() =>
                            toggleValue(
                              handle,
                              selectedCollections,
                              setSelectedCollections,
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs border border-border px-2.5 py-1 hover:border-foreground transition-colors"
                        >
                          {title}
                          <X className="w-3 h-3" />
                        </button>
                      );
                    })}
                    {inStockOnly && (
                      <button
                        type="button"
                        onClick={() => setInStockOnly(false)}
                        className="inline-flex items-center gap-1.5 text-xs border border-border px-2.5 py-1 hover:border-foreground transition-colors"
                      >
                        In stock
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {(priceMin || priceMax) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPriceMin("");
                          setPriceMax("");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs border border-border px-2.5 py-1 hover:border-foreground transition-colors"
                      >
                        Price
                        {priceMin ? ` ${priceMin}` : ""}
                        {priceMax ? `–${priceMax}` : priceMin ? "+" : ""}
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
              <p className="text-muted-foreground">No products match these filters</p>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.node.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;

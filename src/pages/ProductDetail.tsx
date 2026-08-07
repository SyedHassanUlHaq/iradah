import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopifyProduct, fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { SEO } from "@/components/SEO";
import { Loader2, Minus, Plus, ChevronLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const formatDescription = (text: string) => {
  if (!text) return { sections: [], images: [] };
  
  // Extract images first (img tags)
  const images: string[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(text)) !== null) {
    images.push(imgMatch[1]);
  }
  
  // Remove img tags from text
  let cleanText = text.replace(/<img[^>]+>/gi, '');
  
  // List of known section headers to look for
  const sectionHeaders = [
    'Fabric', 'Fit', 'Neckline', 'Front', 'Back', 'Colors Available', 'Care', 
    'Note', 'Delivery', 'Description', 'Material', 'Size', 'Weight', 'Specifications'
  ];
  
  // Create a regex pattern that matches any of the section headers followed by a colon
  const pattern = new RegExp(`(${sectionHeaders.join('|')}):\\s*`, 'gi');
  
  // Split the text by section headers
  const parts = cleanText.split(pattern);
  
  const sections: Array<{ label?: string; content: string[] }> = [];
  
  // Process parts: they alternate between headers and content
  if (parts[0] && !sectionHeaders.some(h => h.toLowerCase() === parts[0].toLowerCase())) {
    // First part is intro text without a header
    const introLines = parts[0]
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    if (introLines.length > 0) {
      sections.push({ content: introLines });
    }
  }
  
  for (let i = sectionHeaders.some(h => h.toLowerCase() === (parts[0] || '').toLowerCase()) ? 0 : 1; i < parts.length; i += 2) {
    const header = parts[i];
    const content = parts[i + 1];
    
    if (header && content) {
      const lines = content
        .trim()
        .split(/[\n–-]/) // Split by newlines and dashes
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
      
      if (lines.length > 0) {
        sections.push({
          label: header.trim(),
          content: lines
        });
      }
    }
  }
  
  return {
    sections: sections.length > 0 ? sections : [{ content: [cleanText] }],
    images
  };
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      setLoading(true);
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        if (data?.variants.edges.length) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant.id);
          
          const options: Record<string, string> = {};
          firstVariant.selectedOptions.forEach(opt => {
            options[opt.name] = opt.value;
          });
          setSelectedOptions(options);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = product?.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(
        opt => newOptions[opt.name] === opt.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node.id);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });

    toast.success("Added to bag", {
      description: `${product.title} × ${quantity}`,
      position: "top-center",
    });
    
    setCartOpen(true);
  };

  const currentVariant = product?.variants.edges.find(v => v.node.id === selectedVariant)?.node;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/products" className="btn-primary mt-6">
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.title}
        description={product.description || `Shop ${product.title} from IRADAH.`}
        canonical={`/product/${product.handle}`}
        type="product"
        image={product.images.edges[0]?.node.url}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: product.images.edges[0]?.node.url,
          offers: {
            "@type": "Offer",
            price: product.priceRange.minVariantPrice.amount,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            availability: currentVariant?.availableForSale
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }}
      />
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Back</span>
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-3">
              <div className="aspect-[3/4] bg-secondary/30 overflow-hidden">
                {product.images.edges[selectedImage] ? (
                  <img
                    src={product.images.edges[selectedImage].node.url}
                    alt={product.images.edges[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              
              {product.images.edges.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.edges.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-20 flex-shrink-0 overflow-hidden border transition-colors ${
                        selectedImage === index ? 'border-foreground' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Iradah</span>
                <h1 className="font-display text-3xl md:text-4xl mt-1">{product.title}</h1>
                <p className="text-xl mt-3">
                  {currentVariant && formatPrice(currentVariant.price.amount, currentVariant.price.currencyCode)}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-5">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <label className="text-xs font-medium uppercase tracking-wider mb-3 block">
                      {option.name}: {selectedOptions[option.name]}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-5 py-2.5 border text-sm transition-colors ${
                            selectedOptions[option.name] === value
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border hover:border-foreground'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant?.availableForSale}
                className="w-full btn-primary h-14 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Secure</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Returns</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t border-border">
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-4">Description</h3>
                  {(() => {
                    const { sections, images } = formatDescription(product.description);
                    return (
                      <>
                        <div className="text-muted-foreground text-sm space-y-3">
                          {sections.map((section, idx) => (
                            <div key={idx}>
                              {section.label && (
                                <p className="font-medium text-foreground/80 mb-1.5">{section.label}:</p>
                              )}
                              <div className={section.label ? "ml-2 space-y-1" : "space-y-1"}>
                                {section.content.map((line, lineIdx) => (
                                  <p key={lineIdx} className="leading-relaxed">
                                    {section.label && lineIdx > 0 ? "• " : ""}{line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {images.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {images.map((imageSrc, idx) => (
                              <img
                                key={idx}
                                src={imageSrc}
                                alt="Product size chart"
                                className="w-full max-w-md border border-border rounded"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { node } = product;
  const firstImage = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const firstVariant = node.variants.edges[0]?.node;
  const isSoldOut = node.variants.edges.every((edge) => !edge.node.availableForSale);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success("Added to bag", {
      description: node.title,
      position: "top-center",
    });
    
    setCartOpen(true);
  };

  return (
    <div 
      className="product-card group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${node.handle}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20">
          {firstImage ? (
            <>
              <img
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className={`product-image w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isHovered && secondImage ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
              />
              {secondImage && (
                <img
                  src={secondImage.url}
                  alt={secondImage.altText || `${node.title} alternate`}
                  className={`product-image w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Action Buttons - always visible on mobile, hover on desktop */}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex gap-2 md:translate-y-full md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-foreground/95 backdrop-blur-sm text-background py-2.5 md:py-3 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-wider hover:bg-foreground transition-colors"
            >
              <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
              Add to Bag
            </button>
          </div>

          {/* Badge */}
          {isSoldOut && (
            <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
              Sold Out
            </div>
          )}
        </div>
        
        <div className="p-2.5 md:p-4">
          <h3 className="text-xs md:text-sm font-medium line-clamp-1 group-hover:underline underline-offset-4 decoration-foreground/30">
            {node.title}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm mt-0.5 md:mt-1">
            {formatPrice(
              node.priceRange.minVariantPrice.amount,
              node.priceRange.minVariantPrice.currencyCode
            )}
          </p>
          {node.description && (
            <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2">
              {node.description.split('\n')[0] || node.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

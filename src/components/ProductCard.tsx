import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { node } = product;
  const firstImage = node.images.edges[0]?.node;
  const firstVariant = node.variants.edges[0]?.node;

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

    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
    
    setCartOpen(true);
  };

  return (
    <div 
      className="product-card group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Link to={`/product/${node.handle}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="product-image w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-foreground text-background py-3 px-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>

          {/* Badge */}
          {!firstVariant?.availableForSale && (
            <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
              Sold Out
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium line-clamp-1 group-hover:underline underline-offset-4">
            {node.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {formatPrice(
              node.priceRange.minVariantPrice.amount,
              node.priceRange.minVariantPrice.currencyCode
            )}
          </p>
        </div>
      </Link>
    </div>
  );
};

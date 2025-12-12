import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingBag, Eye } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
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
    trackEvent('add_to_cart', { productId: node.id, title: node.title, price: firstVariant?.price?.amount });
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
              className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              Add To Cart
            </button>
            <div className="mt-2 flex gap-2">
              <Dialog>
                  <DialogTrigger asChild>
                  <button onClick={() => trackEvent('quick_view', { productId: node.id })} className="w-full bg-background/90 border border-border py-2 px-3 rounded-md text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Quick View
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>{node.title}</DialogTitle>
                  <div>
                    <img src={firstImage.url} alt={firstImage.altText || node.title} className="w-full h-auto object-contain" />
                    <DialogDescription>
                      {node.description}
                    </DialogDescription>
                    <div className="mt-4">
                      <button
                        onClick={(e) => { e.preventDefault(); handleAddToCart(e as any); }}
                        className="btn-primary w-full py-3"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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

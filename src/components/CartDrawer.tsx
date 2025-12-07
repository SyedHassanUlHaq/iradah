import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export const CartDrawer = () => {
  const { 
    items, 
    isLoading, 
    isOpen,
    updateQuantity, 
    removeItem, 
    createCheckout,
    getTotalPrice,
    setOpen 
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const currencyCode = items[0]?.price.currencyCode || 'PKR';

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-border">
        <SheetHeader className="flex-shrink-0 border-b border-border pb-4">
          <SheetTitle className="font-display text-xl">Shopping Bag</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Your bag is empty</p>
                <p className="text-muted-foreground text-sm mt-1">Add items to get started</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 pb-4 border-b border-border">
                    <div className="w-20 h-24 bg-secondary overflow-hidden flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{item.product.node.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.selectedOptions.map(option => option.value).join(' / ')}
                      </p>
                      <p className="text-sm font-medium mt-2">
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-display">
                    {formatPrice(totalPrice.toString(), currencyCode)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping calculated at checkout
                </p>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary h-12 rounded-none" 
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

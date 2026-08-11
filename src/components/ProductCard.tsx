import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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
  const isSoldOut = node.variants.edges.every((edge) => !edge.node.availableForSale);

  const [isHovered, setIsHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const selectedVariant = useMemo(() => {
    if (!node.options.length) return node.variants.edges[0]?.node ?? null;
    if (node.options.some((option) => !selectedOptions[option.name])) return null;

    return (
      node.variants.edges.find(({ node: variant }) =>
        variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
      )?.node ?? null
    );
  }, [node, selectedOptions]);

  const isOptionValueAvailable = (optionName: string, value: string) => {
    return node.variants.edges.some(({ node: variant }) => {
      const matchesValue = variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === value,
      );
      if (!matchesValue) return false;

      const matchesOtherSelections = variant.selectedOptions.every((opt) => {
        if (opt.name === optionName) return true;
        if (!selectedOptions[opt.name]) return true;
        return selectedOptions[opt.name] === opt.value;
      });

      return matchesOtherSelections && variant.availableForSale;
    });
  };

  const openPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    setSelectedOptions({});
    setPickerOpen(true);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!selectedVariant?.availableForSale) return;

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Added to bag", {
      description: node.title,
      position: "top-center",
    });

    setPickerOpen(false);
    setCartOpen(true);
  };

  const allOptionsSelected =
    node.options.length === 0 || node.options.every((option) => selectedOptions[option.name]);

  return (
    <>
      <div
        className="product-card group opacity-0 animate-fade-in"
        style={{ animationDelay: `${index * 0.06}s`, animationFillMode: "forwards" }}
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
                  className={`product-image w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500 ${
                    isHovered && secondImage ? "opacity-0" : "opacity-100"
                  }`}
                  loading="lazy"
                />
                {secondImage && (
                  <img
                    src={secondImage.url}
                    alt={secondImage.altText || `${node.title} alternate`}
                    className={`product-image w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex gap-2 md:translate-y-full md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={openPicker}
                disabled={isSoldOut}
                className="flex-1 bg-foreground/95 backdrop-blur-sm text-background py-2.5 md:py-3 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-wider hover:bg-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {isSoldOut ? "Sold Out" : "Add to Bag"}
              </button>
            </div>

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
                node.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
            {node.description && (
              <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2">
                {node.description.split("\n")[0] || node.description}
              </p>
            )}
          </div>
        </Link>
      </div>

      <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-5 pb-8 pt-6">
          <SheetHeader className="text-left pr-8">
            <SheetTitle className="font-display text-xl">{node.title}</SheetTitle>
            <SheetDescription>
              {formatPrice(
                selectedVariant?.price.amount ?? node.priceRange.minVariantPrice.amount,
                selectedVariant?.price.currencyCode ??
                  node.priceRange.minVariantPrice.currencyCode,
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            {node.options.map((option) => (
              <div key={option.name}>
                <p className="text-xs font-medium uppercase tracking-wider mb-3">
                  {option.name}
                  {selectedOptions[option.name] ? `: ${selectedOptions[option.name]}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const available = isOptionValueAvailable(option.name, value);
                    const selected = selectedOptions[option.name] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleOptionChange(option.name, value)}
                        title={available ? undefined : `${value} — Sold out`}
                        className={`px-4 py-2 border text-sm transition-colors ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        } ${
                          !available
                            ? "opacity-45 line-through decoration-1"
                            : ""
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!allOptionsSelected || !selectedVariant?.availableForSale}
              className="w-full btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!allOptionsSelected
                ? "Select options"
                : selectedVariant?.availableForSale
                  ? "Add to Bag"
                  : "Sold Out"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchCollections } from "@/lib/shopify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const CollectionGrid = () => {
  const [collections, setCollections] = useState<
    Array<{ handle: string; title: string; image?: { url: string; altText: string | null } }>
  >([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20);
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setLoadingCollections(false);
      }
    };

    loadCollections();
  }, []);

  return (
    <section className="pt-14 md:pt-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-14">
          <div>
            <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Collections
            </span>
            <h2 className="font-display text-3xl md:text-5xl mt-2">Shop the Edit</h2>
          </div>
        </div>

        {loadingCollections ? (
          <div className="flex items-center justify-center min-h-[240px]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No collections available</div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: collections.length > 1 }}
            className="relative w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {collections.map((collection) => (
                <CarouselItem
                  key={collection.handle}
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <Link
                    to={`/collection/${collection.handle}`}
                    className="group relative block aspect-[3/2] overflow-hidden bg-card"
                  >
                    {collection.image ? (
                      <img
                        src={collection.image.url}
                        alt={collection.image.altText || `Shop ${collection.title}`}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <h3 className="font-display text-3xl md:text-5xl text-background tracking-wide text-center leading-tight">
                        {collection.title}
                      </h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {collections.length > 1 && (
              <>
                <CarouselPrevious className="left-2 md:left-3 border-background/40 bg-background/80 text-foreground hover:bg-background disabled:opacity-0" />
                <CarouselNext className="right-2 md:right-3 border-background/40 bg-background/80 text-foreground hover:bg-background disabled:opacity-0" />
              </>
            )}
          </Carousel>
        )}
      </div>
    </section>
  );
};

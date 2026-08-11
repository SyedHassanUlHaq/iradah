import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCollections } from "@/lib/shopify";

export const CollectionGrid = () => {
  const [collections, setCollections] = useState<Array<{ handle: string; title: string; image?: { url: string; altText: string | null } }>>([]);
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          {loadingCollections ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading collections...</div>
          ) : (
            collections.map((collection, index) => (
              <Link
                key={collection.handle}
                to={`/collection/${collection.handle}`}
                className="group relative aspect-[2/1] sm:aspect-[3/2] overflow-hidden bg-card opacity-0 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-background tracking-wide">{collection.title}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

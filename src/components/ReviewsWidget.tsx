import { useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { fetchProductReviews, JudgemeProductReviews } from "@/lib/judgeme";

interface ReviewsWidgetProps {
  externalId: string;
}

const StarRating = ({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < Math.round(rating) ? "fill-foreground text-foreground" : "text-border"}`}
      />
    ))}
  </div>
);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export const ReviewsWidget = ({ externalId }: ReviewsWidgetProps) => {
  const [data, setData] = useState<JudgemeProductReviews | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    fetchProductReviews(externalId).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [externalId]);

  if (!data || data.reviewCount === 0) return null;

  return (
    <div className="pt-6 border-t border-border">
      <h3 className="text-xs font-medium uppercase tracking-wider mb-4">Customer Reviews</h3>

      <div className="flex items-center gap-3 mb-6">
        <StarRating rating={data.averageRating} size="w-5 h-5" />
        <span className="text-sm text-muted-foreground">
          {data.averageRating.toFixed(1)} · {data.reviewCount} review{data.reviewCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-6">
        {data.reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <StarRating rating={review.rating} />
              {review.date && (
                <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
              )}
            </div>
            {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">{review.body}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{review.author}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-foreground/60">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Buyer
                </span>
              )}
            </div>
            {review.pictures.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.pictures.map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    alt=""
                    className="w-16 h-16 object-cover border border-border rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

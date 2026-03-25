import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function StarRating({ rating, totalReviews, size = "sm", showCount = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSizes[size]} fill-secondary text-secondary drop-shadow-sm`} />
        ))}
        {hasHalfStar && <StarHalf className={`${starSizes[size]} fill-secondary text-secondary drop-shadow-sm`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSizes[size]} text-muted-foreground/30`} />
        ))}
      </div>
      
      {showCount && (
        <span className={`text-muted-foreground font-medium ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          <span className="text-foreground">{rating.toFixed(1)}</span>
          {totalReviews !== undefined && ` (${totalReviews})`}
        </span>
      )}
    </div>
  );
}

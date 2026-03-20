import React from "react";
import StrawberryIcon from "./StrawberryIcon";

interface StrawberryRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

const StrawberryRating: React.FC<StrawberryRatingProps> = ({ rating, max = 5, size = 36 }) => {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className="animate-pop"
          style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
        >
          <StrawberryIcon
            filled={i < rating}
            size={size}
            className="transition-transform duration-200 hover:scale-110 active:scale-95 cursor-default"
          />
        </div>
      ))}
    </div>
  );
};

export default StrawberryRating;

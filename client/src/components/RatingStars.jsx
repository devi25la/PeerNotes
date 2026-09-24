import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showScore = false,
  reviewCount = null
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const currentVal = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(maxRating)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = currentVal >= starValue;
          const isPartiallyFilled = !isFilled && currentVal > i && currentVal < starValue;

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 focus:outline-hidden`}
              title={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : `${rating} out of ${maxRating}`}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                    : isPartiallyFilled
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-slate-700 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {reviewCount !== null && (
        <span className="text-xs text-slate-500 font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

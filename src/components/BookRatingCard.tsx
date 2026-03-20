import React from "react";
import StrawberryRating from "./StrawberryRating";

interface CriteriaRating {
  label: string;
  rating: number;
  comment: string;
}

interface BookRatingCardProps {
  title: string;
  author: string;
  coverUrl: string;
  overallRating: number;
  criteria: CriteriaRating[];
  summary: string;
}

const BookRatingCard: React.FC<BookRatingCardProps> = ({
  title,
  author,
  coverUrl,
  overallRating,
  criteria,
  summary,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up" style={{ opacity: 0 }}>
      {/* Header card */}
      <div className="bg-card rounded-3xl p-6 shadow-[0_4px_24px_hsl(345_70%_65%/0.12)] border border-border">
        <div className="flex gap-5 items-start mb-6">
          <img
            src={coverUrl}
            alt={`Capa de ${title}`}
            className="w-24 h-36 rounded-2xl object-cover shadow-[0_2px_12px_hsl(345_70%_65%/0.15)]"
          />
          <div className="flex-1 pt-1">
            <h1 className="text-xl font-bold text-foreground leading-tight" style={{ textWrap: "balance" }}>
              {title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{author}</p>
            <div className="mt-4">
              <StrawberryRating rating={overallRating} size={32} />
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                {overallRating} de 5 morangos 🍓
              </p>
            </div>
          </div>
        </div>

        {/* Criteria */}
        <div className="space-y-4 mt-2">
          {criteria.map((c, i) => (
            <div
              key={c.label}
              className="bg-secondary/60 rounded-2xl p-4 animate-fade-up"
              style={{ opacity: 0, animationDelay: `${300 + i * 120}ms` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-foreground">{c.label}</span>
                <StrawberryRating rating={c.rating} size={20} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.comment}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="mt-6 bg-primary/8 rounded-2xl p-4 border border-primary/15 animate-fade-up"
          style={{ opacity: 0, animationDelay: "900ms" }}
        >
          <p className="text-sm font-semibold text-foreground mb-1.5">✨ Impressão geral</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default BookRatingCard;

import { calculateOverallScore, getRatingLabel, getRatingTone } from "@/lib/ratings";
import type { RatingBreakdown } from "@/lib/types";

type RatingBadgeProps = {
  rating: RatingBreakdown;
  compact?: boolean;
};

export function RatingBadge({ rating, compact = false }: RatingBadgeProps) {
  const score = calculateOverallScore(rating);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${getRatingTone(
        score,
      )}`}
    >
      <span>{score}/100</span>
      {!compact && <span>{getRatingLabel(score)}</span>}
    </div>
  );
}

import {
  getConfidenceLabel,
  getConfidenceTone,
  getRatingLabel,
  getRatingTone,
} from "@/lib/ratings";
import type { YanapayRating } from "@/lib/types";

type RatingBadgeProps = {
  rating: YanapayRating;
  compact?: boolean;
  showConfidence?: boolean;
};

export function RatingBadge({
  rating,
  compact = false,
  showConfidence = false,
}: RatingBadgeProps) {
  const score = rating.overallScore;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${getRatingTone(
          score,
        )}`}
      >
        <span>Yanapay {score}/100</span>
        {!compact && <span>{getRatingLabel(score)}</span>}
      </div>
      {showConfidence && (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getConfidenceTone(
            rating.confidence,
          )}`}
        >
          {getConfidenceLabel(rating.confidence)}
        </span>
      )}
    </div>
  );
}

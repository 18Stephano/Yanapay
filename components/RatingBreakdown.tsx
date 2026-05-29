import { RATING_DIMENSIONS, ratingDescriptions, ratingLabels } from "@/lib/ratings";
import type { YanapayRating } from "@/lib/types";

type RatingBreakdownProps = {
  rating: YanapayRating;
  detailed?: boolean;
};

export function RatingBreakdown({ rating, detailed = false }: RatingBreakdownProps) {
  return (
    <div className="space-y-4">
      {RATING_DIMENSIONS.map((dimension) => {
        const dim = rating.dimensions[dimension];
        const percent = Math.round((dim.score / dim.maxScore) * 100);

        return (
          <div key={dimension}>
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {ratingLabels[dimension]}
                </p>
                <p className="text-xs text-slate-500">
                  {detailed ? dim.summary : ratingDescriptions[dimension]}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-slate-950">
                {dim.score}/{dim.maxScore}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

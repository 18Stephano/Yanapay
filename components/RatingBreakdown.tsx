import { ratingDescriptions, ratingLabels } from "@/lib/ratings";
import type { RatingBreakdown, RatingDimension } from "@/lib/types";

const dimensions: RatingDimension[] = [
  "transparency",
  "financialHealth",
  "accountability",
  "impactEvidence",
  "communityTrust",
];

type RatingBreakdownProps = {
  rating: RatingBreakdown;
};

export function RatingBreakdown({ rating }: RatingBreakdownProps) {
  return (
    <div className="space-y-4">
      {dimensions.map((dimension) => (
        <div key={dimension}>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {ratingLabels[dimension]}
              </p>
              <p className="text-xs text-slate-500">{ratingDescriptions[dimension]}</p>
            </div>
            <span className="text-sm font-bold text-slate-950">{rating[dimension]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${rating[dimension]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

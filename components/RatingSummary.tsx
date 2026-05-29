import Link from "next/link";
import { RatingBadge } from "@/components/RatingBadge";
import type { Charity } from "@/lib/types";

type RatingSummaryProps = {
  charity: Charity;
  showDetailsLink?: boolean;
};

export function RatingSummary({ charity, showDetailsLink = true }: RatingSummaryProps) {
  return (
    <div className="space-y-3">
      <RatingBadge rating={charity.rating} showConfidence />
      <p className="text-sm leading-6 text-slate-600">{charity.rating.summary}</p>
      {showDetailsLink && (
        <Link
          href={`/charities/${charity.slug}/rating`}
          className="inline-flex text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
        >
          Cómo calculamos esta puntuación →
        </Link>
      )}
    </div>
  );
}

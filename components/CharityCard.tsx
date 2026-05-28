import Link from "next/link";
import { RatingBadge } from "@/components/RatingBadge";
import type { Charity } from "@/lib/types";

type CharityCardProps = {
  charity: Charity;
};

export function CharityCard({ charity }: CharityCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">{charity.region}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {charity.name}
          </h3>
        </div>
        <RatingBadge rating={charity.rating} compact />
      </div>
      <p className="text-sm leading-6 text-slate-600">{charity.tagline}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {charity.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {category}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <Link
          href={`/charities/${charity.slug}`}
          className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}

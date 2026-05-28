import Link from "next/link";
import type { EntrepreneurshipProject } from "@/lib/types";

type ProjectCardProps = {
  project: EntrepreneurshipProject;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusLabel(status: EntrepreneurshipProject["status"]) {
  if (status === "funded") return "Funded";
  if (status === "coming_soon") return "Coming soon";
  return "Active";
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = Math.min(
    100,
    Math.round((project.raisedAmount / project.goalAmount) * 100),
  );

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-700">{project.region}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {project.title}
          </h3>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {getStatusLabel(project.status)}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-600">{project.tagline}</p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
          <span>
            {formatCurrency(project.raisedAmount, project.currency)} raised
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Goal {formatCurrency(project.goalAmount, project.currency)}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.categories.map((category) => (
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
          href={`/entrepreneurship/${project.slug}`}
          className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          View project
        </Link>
      </div>
    </article>
  );
}

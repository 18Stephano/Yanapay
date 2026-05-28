import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import type { ProjectMilestone } from "@/lib/types";

type ProjectProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function milestoneTone(status: ProjectMilestone["status"]) {
  if (status === "completed") return "bg-emerald-50 text-emerald-800";
  if (status === "in_progress") return "bg-amber-50 text-amber-800";
  return "bg-slate-50 text-slate-600";
}

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectProfilePageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found | Yanapay",
    };
  }

  return {
    title: `${project.title} | Yanapay`,
    description: project.tagline,
  };
}

export default async function ProjectProfilePage({ params }: ProjectProfilePageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const progress = Math.min(
    100,
    Math.round((project.raisedAmount / project.goalAmount) * 100),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/entrepreneurship" className="text-sm font-bold text-amber-700">
        Back to projects
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-amber-700">{project.location}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 text-xl leading-8 text-slate-600">{project.tagline}</p>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Project story</h2>
            <p className="mt-3 leading-8 text-slate-600">{project.story}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Founder</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{project.founder}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Team</p>
              <p className="mt-1 text-lg font-bold leading-7 text-slate-950">
                {project.team}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Milestones</h2>
            <ul className="mt-4 space-y-3">
              {project.milestones.map((milestone) => (
                <li
                  key={milestone.title}
                  className={`rounded-2xl p-4 text-sm font-medium ${milestoneTone(
                    milestone.status,
                  )}`}
                >
                  {milestone.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Funding progress</h2>
            <p className="mt-4 text-3xl font-black text-slate-950">
              {formatCurrency(project.raisedAmount, project.currency)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              raised of {formatCurrency(project.goalAmount, project.currency)} goal
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-amber-700">{progress}% funded</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Support this project</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Payments are not enabled yet. This link is a placeholder for a future
              contribution flow.
            </p>
            <a
              href={project.supportUrl}
              className="mt-5 inline-flex w-full justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              Visit support link
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

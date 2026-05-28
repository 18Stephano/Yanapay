import { ProjectDirectory } from "@/components/ProjectDirectory";
import { getProjectPageData } from "@/lib/projects";

export const metadata = {
  title: "Entrepreneurship Projects | Yanapay",
  description: "Discover and support Peruvian entrepreneurship projects.",
};

export default async function EntrepreneurshipPage() {
  const { projects, categories } = await getProjectPageData();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-amber-700">Entrepreneurship projects</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Back Peruvian founders building local impact.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Explore early-stage ventures with transparent funding goals and milestones.
          Payments and full crowdfunding flows can be added in a later release.
        </p>
      </div>
      <ProjectDirectory projects={projects} categories={categories} />
    </div>
  );
}

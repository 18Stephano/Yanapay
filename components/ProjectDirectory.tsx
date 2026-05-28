"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { EntrepreneurshipProject } from "@/lib/types";

type ProjectDirectoryProps = {
  projects: EntrepreneurshipProject[];
  categories: string[];
};

export function ProjectDirectory({ projects, categories }: ProjectDirectoryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "All" || project.categories.includes(category);
      const searchableText = [
        project.title,
        project.tagline,
        project.story,
        project.founder,
        project.region,
        project.location,
        ...project.categories,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [projects, category, query]);

  return (
    <section>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <label className="block">
            <span className="sr-only">Search projects</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by project, founder, region, or category"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            >
              <option>All</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">No projects found</h2>
          <p className="mt-2 text-slate-600">
            Try a different search term or choose another category.
          </p>
        </div>
      )}
    </section>
  );
}

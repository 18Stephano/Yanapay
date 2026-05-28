import { projects as seedProjects } from "@/data/projects";
import { createSupabaseClient } from "@/lib/supabase";
import type { EntrepreneurshipProject, ProjectMilestone } from "@/lib/types";

type ProjectRow = {
  slug: string;
  title: string;
  tagline: string;
  story: string;
  founder: string;
  team: string;
  region: string;
  location: string;
  categories: string[];
  goal_amount: number;
  raised_amount: number;
  currency: string;
  status: EntrepreneurshipProject["status"];
  milestones: ProjectMilestone[];
  support_url: string;
};

function mapRowToProject(row: ProjectRow): EntrepreneurshipProject {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    story: row.story,
    founder: row.founder,
    team: row.team,
    region: row.region,
    location: row.location,
    categories: row.categories,
    goalAmount: row.goal_amount,
    raisedAmount: row.raised_amount,
    currency: row.currency,
    status: row.status,
    milestones: row.milestones,
    supportUrl: row.support_url,
  };
}

export async function getProjects(): Promise<EntrepreneurshipProject[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return seedProjects;
  }

  const { data, error } = await supabase
    .from("entrepreneurship_projects")
    .select(
      "slug, title, tagline, story, founder, team, region, location, categories, goal_amount, raised_amount, currency, status, milestones, support_url",
    )
    .eq("published", true)
    .order("title");

  if (error || !data?.length) {
    return seedProjects;
  }

  return data.map((row) => mapRowToProject(row as ProjectRow));
}

export async function getProjectBySlug(
  slug: string,
): Promise<EntrepreneurshipProject | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectCategories(
  projects: EntrepreneurshipProject[],
): Promise<string[]> {
  return Array.from(new Set(projects.flatMap((project) => project.categories))).sort();
}

export async function getProjectPageData() {
  const projects = await getProjects();
  const categories = await getProjectCategories(projects);

  return { projects, categories };
}

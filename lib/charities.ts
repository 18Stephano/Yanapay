import { charities as seedCharities } from "@/data/charities";
import { getRatingForCharity } from "@/lib/charity-ratings";
import { createSupabaseClient } from "@/lib/supabase";
import type { Charity } from "@/lib/types";

type CharityRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  location: string;
  region: string;
  categories: string[];
  founded: number;
  website: string;
  support_url: string;
  contact_email: string;
  verified: boolean;
  highlights: string[];
  evidence: string[];
};

async function mapRowToCharity(row: CharityRow): Promise<Charity> {
  const rating = await getRatingForCharity(row.id, row.slug);

  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    mission: row.mission,
    location: row.location,
    region: row.region,
    categories: row.categories,
    founded: row.founded,
    website: row.website,
    supportUrl: row.support_url,
    contactEmail: row.contact_email,
    verified: row.verified,
    rating,
    highlights: row.highlights,
    evidence: row.evidence,
  };
}

export async function getCharities(): Promise<Charity[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return seedCharities;
  }

  const { data, error } = await supabase
    .from("charities")
    .select(
      "id, slug, name, tagline, mission, location, region, categories, founded, website, support_url, contact_email, verified, highlights, evidence",
    )
    .eq("published", true)
    .order("name");

  if (error || !data?.length) {
    return seedCharities;
  }

  return Promise.all(data.map((row) => mapRowToCharity(row as CharityRow)));
}

export async function getCharityBySlug(slug: string): Promise<Charity | undefined> {
  const charities = await getCharities();
  return charities.find((charity) => charity.slug === slug);
}

export async function getCategories(charities: Charity[]): Promise<string[]> {
  return Array.from(new Set(charities.flatMap((charity) => charity.categories))).sort();
}

export async function getCharityPageData() {
  const charities = await getCharities();
  const categories = await getCategories(charities);

  return { charities, categories };
}
